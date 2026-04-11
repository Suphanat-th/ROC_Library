"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/assets/images/web/Logo.png";

export default function NavBarPage() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-8 py-4 bg-blue-600 text-white h-17.5 shadow-lg shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Sidebar Toggle Button */}
        <label
          htmlFor="is-drawer-open"
          className="btn btn-ghost btn-circle text-white hover:bg-blue-700 cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>

        {/* Logo and Branding */}
        <Link
          href="/"
          className="flex items-center space-x-1 sm:space-x-2 cursor-pointer text-xs sm:text-xl hover:text-blue-100 transition-colors"
        >
          <Image
            src={logo}
            alt="ROC Library Logo"
            width={50}
            height={50}
            className="object-contain drop-shadow-2xl"
            priority
          />
          <span className="hidden sm:inline">Bozm</span>
        </Link>
      </div>

      <div className="flex space-x-3 sm:space-x-6 font-semibold text-xs sm:text-xl">
        <Link href="/" className="hover:text-blue-100 transition-colors">ROC Library</Link>
      </div>
    </nav>
  );
}
