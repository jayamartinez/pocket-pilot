import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { TrendDirection } from "@/lib/types/finance";

interface SupportingStatCardProps {
  label: string;
  amount: number;
  detail: string;
  trend: TrendDirection;
  icon: LucideIcon;
}

export function SupportingStatCard({
  label,
  amount,
  detail,
  trend,
  icon: Icon,
}: SupportingStatCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="border-border/70">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {formatCurrency(amount)}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground transition-colors hover:bg-muted">
            <Icon className="size-4" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <TrendIcon className="size-4 text-primary" />
          <span>{detail}</span>
        </div>
      </CardContent>
    </Card>
  );
}
