import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CompactSummaryCardProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  className?: string;
  valueClassName?: string;
}

export function CompactSummaryCard({
  label,
  value,
  detail,
  className,
  valueClassName,
}: CompactSummaryCardProps) {
  return (
    <Card className={cn("border-border/80", className)}>
      <CardContent className={cn("p-3.5", detail ? "space-y-2" : "space-y-1")}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <div className={cn("text-2xl font-semibold text-foreground", valueClassName)}>
          {value}
        </div>
        {detail ? <p className="text-sm text-muted-foreground">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
