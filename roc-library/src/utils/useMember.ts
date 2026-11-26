"use client";

import { useEffect, useState } from "react";
import { hasBeenSignedIn, MEMBER_SIGNED_IN_EVENT, memberClient, sessionTooOld, usernameOf } from "@/utils/memberAuth";

/**
 * Whether a Member is signed in on this device, and their username. Used by the Navbar and the Sidebar,
 * which stay mounted while the page changes, so it also listens for a sign-in that happens on this page.
 * The Supabase code is loaded only on a browser that has signed in before, so other visitors never fetch it.
 */
export function useMember() {
  // `ready` is false until this browser has been looked at, so the Account area does not flash a sign-in
  // button for a Member whose stored session is still being read.
  const [member, setMember] = useState<{ ready: boolean; signedIn: boolean; name: string | null }>({
    ready: false,
    signedIn: false,
    name: null,
  });

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const connect = () => {
      if (unsubscribe) return;
      if (!hasBeenSignedIn()) {
        setMember({ ready: true, signedIn: false, name: null });
        return;
      }
      const supabase = memberClient();
      if (!supabase) {
        setMember({ ready: true, signedIn: false, name: null });
        return;
      }

      const apply = (user: (Parameters<typeof usernameOf>[0] & Parameters<typeof sessionTooOld>[0]) | undefined) => {
        // A sign-in past the session cap no longer counts; the stored session is dropped (the "seen" mark stays,
        // so Patch Convert can say "expired" instead of "never signed in").
        if (user && sessionTooOld(user)) {
          supabase.auth.signOut({ scope: "local" });
          setMember({ ready: true, signedIn: false, name: null });
          return;
        }
        setMember({ ready: true, signedIn: Boolean(user), name: usernameOf(user) });
      };
      supabase.auth.getSession().then(({ data }) => apply(data.session?.user));
      const { data } = supabase.auth.onAuthStateChange((_event, session) => apply(session?.user));
      unsubscribe = () => data.subscription.unsubscribe();
    };

    connect();
    window.addEventListener(MEMBER_SIGNED_IN_EVENT, connect);
    return () => {
      window.removeEventListener(MEMBER_SIGNED_IN_EVENT, connect);
      unsubscribe?.();
    };
  }, []);

  return member;
}
