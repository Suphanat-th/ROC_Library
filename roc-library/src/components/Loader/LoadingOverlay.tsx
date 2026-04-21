'use client';

import { useLoading } from '@/context/LoadingContext';
import Loader from './Loader';

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-blue-600/30 backdrop-blur-md shadow-xl shadow-blue-600/30 border border-blue-400/40 rounded-2xl p-8">
        <Loader size="lg" message="กำลังโหลด..." />
      </div>
    </div>
  );
}
