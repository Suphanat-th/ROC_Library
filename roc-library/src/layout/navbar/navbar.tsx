import Link from "next/link";

export default function NavBarPage() {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-700 text-white z-50 h-[70px]">
      <Link
        href="/"
        className="flex items-center space-x-2 cursor-pointer text-xs sm:text-xl"
      >
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white mr-3 text-3xl">
          Cr
        </div>
        Bozm
      </Link>
      <div className="flex space-x-6 font-semibold text-xs sm:text-xl">
        <Link href="/">ROC Library</Link>
      </div>
    </nav>
  );
}
