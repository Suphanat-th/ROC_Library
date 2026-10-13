'use client';

import { isServerInMaintenance } from '@/config/maintenanceWindow';

export default function StatusServerPage() {
  const serverOn = !isServerInMaintenance();

  return (
    <span
      role="status"
      className={`badge badge-lg gap-2 font-semibold ${
        serverOn ? "badge-success" : "badge-error"
      }`}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-current opacity-80"
      />
      {serverOn ? "Server On" : "Server Off"}
    </span>
  );
}
