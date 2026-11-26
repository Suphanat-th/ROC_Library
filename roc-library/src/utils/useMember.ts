"use client";

import { useEffect, useState } from "react";
import { hasBeenSignedIn, MEMBER_SIGNED_IN_EVENT, memberClient, usernameOf } from "@/utils/memberAuth";

/**
 * Whether a Member is signed in on this device, and their username. Used by the Navbar and the Sidebar,
 * which stay mounted while the page changes, so it also listens for a sign-in that happens on this page.
 * The Supabase code is loaded only on a browser that has signed in before, so other visitors never fetch it.
 */
export function useMember() {
  const [member, setMember] = useState<{ signedIn: boolean; name: string | null }>({ signedIn: false, name: null });

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const connect = () => {
      if (unsubscribe || !hasBeenSignedIn()) return;
      const supabase = memberClient();
      if (!supabase) return;

      const apply = (user: Parameters<typeof usernameOf>[0] | undefined) =>
        setMember({ signedIn: Boolean(user), name: usernameOf(user) });
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
