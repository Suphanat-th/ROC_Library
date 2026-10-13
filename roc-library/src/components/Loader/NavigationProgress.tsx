'use client';

import { useLoading } from '@/context/LoadingContext';

export default function NavigationProgress() {
  const { pendingHref } = useLoading();

  if (!pendingHref) return null;

  return (
    <div
      role="progressbar"
      aria-label="กำลังเปลี่ยนหน้า"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
    >
      <div className="nav-progress h-full w-full bg-primary shadow-[0_0_8px] shadow-primary/60" />
    </div>
  );
}
