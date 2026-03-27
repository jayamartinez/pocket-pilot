"use client";

import { ErrorPanel } from "@/components/shared/error-panel";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-8">
      <ErrorPanel
        actionLabel="Try again"
        description="PocketPilot hit an unexpected issue while rendering this workspace. The layout is ready for route-level error boundaries and sync exceptions."
        onAction={reset}
        title="Unable to load this section"
      />
    </div>
  );
}
