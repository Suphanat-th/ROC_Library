import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnniversaryRewards from "../components/AnniversaryRewards";

function BackLink() {
  return (
    <Link href="/5thAnvs" className="btn btn-sm w-fit gap-2">
      <ArrowLeft aria-hidden className="h-4 w-4" />
      กลับหน้าหลัก 5th Anniversary
    </Link>
  );
}

/** The Rewards page: the whole reward exchange, with a way back to the main page above and below. */
export default function FifthAnniversaryRewardsPage() {
  return (
    <main className="anvs mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      <BackLink />
      <AnniversaryRewards index="" />
      <BackLink />
    </main>
  );
}
