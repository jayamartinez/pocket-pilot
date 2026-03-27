import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardSectionHeaderProps {
  title: string;
  description?: string;
  controls?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function DashboardSectionHeader({
  title,
  description,
  controls,
  action,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {controls}
        {action}
      </div>
    </div>
  );
}
