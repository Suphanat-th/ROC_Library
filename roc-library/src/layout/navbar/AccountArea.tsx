"use client";

import { LogOut, User } from "lucide-react";
import { signOutMember } from "@/utils/memberAuth";
import { useMember } from "@/utils/useMember";

/**
 * The username and a sign-out button, only where a Member is signed in. Shown twice: in full in the
 * Sidebar's head, and compact (icon-only sign-out) in the Navbar.
 */
export default function AccountArea({ compact = false }: { compact?: boolean }) {
  const { signedIn, name } = useMember();

  if (!signedIn) return null;

  const signOut = async () => {
    await signOutMember();
    window.location.assign("/");
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="hidden max-w-40 items-center gap-1 text-sm text-base-content/80 sm:flex">
          <User aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="truncate">{name ?? "Member"}</span>
        </span>
        <button
          type="button"
          onClick={signOut}
          aria-label="ออกจากระบบ"
          title="ออกจากระบบ"
          className="btn btn-ghost btn-sm btn-circle"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-field border border-primary/30 bg-base-100/60 py-0.5 pr-0.5 pl-3">
      <span className="flex max-w-40 items-center gap-1.5 text-sm text-base-content/85">
        <User aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate">{name ?? "Member"}</span>
      </span>
      <button
        type="button"
        onClick={signOut}
        className="btn btn-ghost btn-sm gap-1.5 text-base-content/70 hover:text-error"
      >
        <LogOut aria-hidden="true" className="h-4 w-4" />
        ออกจากระบบ
      </button>
    </div>
  );
}
