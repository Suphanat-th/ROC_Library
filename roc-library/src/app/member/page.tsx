"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkMember } from "@/utils/memberAuth";

/** /member by itself has nothing to show: a signed-in Member goes home, anyone else to the sign-in page. */
export default function MemberIndexPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    checkMember().then((state) => {
      if (!cancelled) router.replace(state === "signed-in" ? "/" : "/member/login");
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <div className="flex justify-center py-6" aria-busy="true"><span className="loading loading-spinner" /></div>;
}
