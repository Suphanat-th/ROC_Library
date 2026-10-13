'use client';

import { useLoading } from '@/context/LoadingContext';
import PageSkeleton from './Skeleton';

/** Content area of the Shell: swaps the old Tool for a skeleton while the next route loads. */
export default function NavigationContent({ children }: { children: React.ReactNode }) {
  const { pendingHref } = useLoading();

  if (!pendingHref) return <>{children}</>;

  return (
    <div className="relative">
      <div className="sticky top-16 z-10 flex justify-center pt-4 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-base-100 border border-primary/30 shadow-md px-4 py-2 text-sm text-primary">
          <span className="loading loading-spinner loading-sm" aria-hidden="true" />
          กำลังโหลด...
        </div>
      </div>
      <PageSkeleton />
      {/* Keep the old Tool mounted but hidden so its state survives if navigation fails. */}
      <div hidden>{children}</div>
    </div>
  );
}
