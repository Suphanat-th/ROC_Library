"use client";

import Link from "next/link";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "../../../public/assets/images/web/Logo.png";

export default function NavBarPage() {
  const { startNavigation } = useLoading();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-3 sm:px-6 h-16 bg-base-100/90 backdrop-blur border-b border-primary/25 text-base-content shrink-0">
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Sidebar Toggle Button */}
        <label
          htmlFor="is-drawer-open"
          className="btn btn-ghost btn-circle cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>

        {/* Logo and Branding */}
        <Link
          href="/"
          onClick={(e) => startNavigation("/", e)}
          className="flex items-center gap-2 rounded-field px-1 hover:text-primary transition-colors"
        >
          <Image
            src={logo}
            alt="ROC Library Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span className="font-semibold text-sm sm:text-lg">
            ROC <span className="text-primary">Library</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <span className="hidden sm:inline text-sm text-base-content/60">by Bozm</span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
