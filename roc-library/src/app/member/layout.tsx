import type { Metadata } from "next";

// The Members' pages are in no menu and kept out of search engines.
export const metadata: Metadata = {
  title: "Member",
  robots: { index: false, follow: false, nocache: true },
};

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-start justify-center px-4 py-10">
      <div className="card w-full border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">{children}</div>
      </div>
    </main>
  );
}
