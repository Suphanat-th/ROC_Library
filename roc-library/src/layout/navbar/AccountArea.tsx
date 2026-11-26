"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, User } from "lucide-react";
import { signOutMember } from "@/utils/memberAuth";
import { useMember } from "@/utils/useMember";

/**
 * The username and a sign-out button where a Member is signed in, or a sign-in link where nobody is. Shown twice:
 * in full in the Sidebar's head, and compact (icon-only sign-out) in the Navbar.
 */
export default function AccountArea({ compact = false }: { compact?: boolean }) {
  const { ready, signedIn, name } = useMember();
  const pathname = usePathname();

  if (!ready) return null;

  // Not signed in: a plain link to the sign-in page (no request is made to show it). It is left out on the
  // /member pages themselves, and elsewhere it brings the visitor back to the page they were on.
  if (!signedIn) {
    if (pathname.startsWith("/member")) return null;
    const href = pathname === "/" ? "/member/login" : `/member/login?next=${encodeURIComponent(pathname)}`;
    return (
      <Link
        href={href}
        className={compact ? "btn btn-ghost btn-sm gap-1.5" : "btn btn-primary btn-sm gap-1.5"}
        aria-label="เข้าสู่ระบบ"
        onClick={() => {
          // From the Sidebar's head, the menu must close as the page changes.
          const flip = document.getElementById("sidebar-flip") as HTMLInputElement | null;
          if (flip) flip.checked = false;
        }}
      >
        <LogIn aria-hidden="true" className="h-4 w-4" />
        <span className={compact ? "hidden sm:inline" : undefined}>เข้าสู่ระบบ</span>
      </Link>
    );
  }

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
