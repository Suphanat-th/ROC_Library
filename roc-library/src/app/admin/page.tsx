import type { Metadata } from "next";
import MemberAdmin from "./MemberAdmin";

// Not in any menu, and kept out of search engines. The admin password is what really protects it.
export const metadata: Metadata = {
  title: "แอดมิน Member",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <MemberAdmin />;
}
