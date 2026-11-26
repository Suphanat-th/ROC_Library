import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The browser's side of Member sign-in. It talks to Supabase Auth directly, so signing in and keeping the
 * session alive never go through the Worker. The URL and the anon key are public by design
 * (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY, set as Build variables); what protects the
 * data is that the tables have no public policy.
 */

/** Set while this browser has a Member session, so a page can tell "never signed in" from "session expired". */
const SEEN_KEY = "roc-member-seen";

let client: SupabaseClient | null = null;

export const memberAuthConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** The shared Supabase client for this browser tab, or null when the site is not configured. */
export function memberClient(): SupabaseClient | null {
  if (typeof window === "undefined" || !memberAuthConfigured()) return null;
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // The Invite and reset links carry the tokens in the address; the implicit flow works even when
        // the link is opened in a different browser from the one that asked for it.
        detectSessionInUrl: true,
        flowType: "implicit",
        storageKey: "roc-member-session",
      },
    });
  }
  return client;
}

/** Fired in this tab when a Member signs in, so the Navbar (which stays mounted across pages) can pick it up. */
export const MEMBER_SIGNED_IN_EVENT = "roc-member-signed-in";

export function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage can be blocked; the page still works, it just cannot say "expired".
  }
  window.dispatchEvent(new Event(MEMBER_SIGNED_IN_EVENT));
}

export function clearSeen() {
  try {
    localStorage.removeItem(SEEN_KEY);
  } catch {
    // Nothing to clear.
  }
}

export function hasBeenSignedIn() {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Where a Member can see their name in the Navbar: the username saved in their profile. */
export const usernameOf = (user: { user_metadata?: Record<string, unknown> } | null | undefined) => {
  const name = user?.user_metadata?.username;
  return typeof name === "string" ? name : null;
};

/**
 * A Member's session renews itself while they keep using the site, but never lasts longer than this from the
 * sign-in. Supabase's own Time-box (Pro plan) is the same rule enforced on its side; this one works on any plan.
 */
export const MEMBER_SESSION_MAX_DAYS = 30;

/** Whether the sign-in behind this session is older than the cap. A renewal does not move the sign-in time. */
export function sessionTooOld(user: { last_sign_in_at?: string } | null | undefined) {
  const signedInAt = Date.parse(user?.last_sign_in_at ?? "");
  return Number.isFinite(signedInAt) && Date.now() - signedInAt > MEMBER_SESSION_MAX_DAYS * 24 * 60 * 60 * 1000;
}

export type MemberCheck = "signed-in" | "expired" | "never";

/**
 * Says whether this browser has a Member who may use Patch Convert. A stored session is checked with Supabase
 * (which also renews it); "expired" means there was a Member here before but the session cannot be renewed.
 */
export async function checkMember(): Promise<MemberCheck> {
  const supabase = memberClient();
  if (!supabase) return "never";
  const { data } = await supabase.auth.getSession();
  if (!data.session) return hasBeenSignedIn() ? "expired" : "never";
  if (sessionTooOld(data.session.user)) {
    await supabase.auth.signOut({ scope: "local" });
    return "expired";
  }

  const { error } = await supabase.auth.getUser();
  if (error) {
    // A refused token (suspended, removed, revoked) is an expired session; a network slip is trusted.
    const status = (error as { status?: number }).status;
    if (status === 401 || status === 403 || status === 404) {
      await supabase.auth.signOut({ scope: "local" });
      return "expired";
    }
  }
  markSeen();
  return "signed-in";
}

/** Signs out of this browser only. */
export async function signOutMember() {
  clearSeen();
  await memberClient()?.auth.signOut({ scope: "local" });
}
