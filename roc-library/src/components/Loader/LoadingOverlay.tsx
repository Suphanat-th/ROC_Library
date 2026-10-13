'use client';

import { useLoading } from '@/context/LoadingContext';
import Loader from './Loader';

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-content/30 backdrop-blur-sm z-50">
      <div className="bg-base-100/90 backdrop-blur-md shadow-xl border border-primary/30 rounded-box p-8">
        <Loader size="lg" message="กำลังโหลด..." />
      </div>
    </div>
  );
}
