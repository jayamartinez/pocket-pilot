import type { ReactNode } from "react";

import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[26px] border border-dashed border-border bg-card/90 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-5 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
