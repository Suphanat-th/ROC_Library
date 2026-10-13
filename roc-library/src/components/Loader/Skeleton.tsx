interface PageSkeletonProps {
  /** Number of placeholder cards in the grid. */
  cards?: number;
}

/** Placeholder for a Tool page while its route or data is loading. */
export default function PageSkeleton({ cards = 6 }: PageSkeletonProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">กำลังโหลด...</span>
      <div className="skeleton h-8 w-56 mb-3" />
      <div className="skeleton h-4 w-80 max-w-full mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="rounded-box border border-base-300 bg-base-100 p-4 space-y-3">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
