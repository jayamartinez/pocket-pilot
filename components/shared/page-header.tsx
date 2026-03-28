import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex max-w-full shrink-0 items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
