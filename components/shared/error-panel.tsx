import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorPanelProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ErrorPanel({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: ErrorPanelProps) {
  return (
    <div
      className={cn(
        "rounded-[26px] border border-danger/30 bg-danger/10 p-4 text-foreground sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl bg-danger/14 p-2 text-danger">
          <AlertTriangle className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
          {actionLabel ? (
            <Button className="mt-4" variant="danger" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
