"use client";

import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { LoaderCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ManualSyncButton({ initialSyncAt }: { initialSyncAt: string }) {
  const [lastSyncAt, setLastSyncAt] = useState(initialSyncAt);
  const [isSyncing, setIsSyncing] = useState(false);
  const [, startTransition] = useTransition();

  const finishSync = useEffectEvent(() => {
    startTransition(() => {
      setLastSyncAt(new Date().toISOString());
      setIsSyncing(false);
    });
  });

  useEffect(() => {
    if (!isSyncing) {
      return;
    }

    const timeout = window.setTimeout(() => {
      finishSync();
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [isSyncing]);

  return (
    <div className="flex items-center gap-2">
      <p className="hidden text-xs text-muted-foreground xl:block">
        Updated {formatDistanceToNow(new Date(lastSyncAt), { addSuffix: true })}
      </p>
      <Button disabled={isSyncing} onClick={() => setIsSyncing(true)} size="sm">
        {isSyncing ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Refreshing
          </>
        ) : (
          <>
            <RefreshCw className="size-4" />
            Refresh accounts
          </>
        )}
      </Button>
    </div>
  );
}
