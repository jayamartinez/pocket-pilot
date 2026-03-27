import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

interface MoneyLeftHeroProps {
  amount: number;
  detail: string;
  monthLabel: string;
  transactionCount: number;
}

export function MoneyLeftHero({
  amount,
  detail,
  monthLabel,
  transactionCount,
}: MoneyLeftHeroProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_34%),var(--card)]">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
              Money left
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {formatCurrency(amount)}
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Available for the rest of {monthLabel.toLowerCase()}.
            </p>
          </div>
          <Badge className="shrink-0" variant="success">
            On pace
          </Badge>
        </div>

        <div className="mt-6 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2">
          <div className="rounded-lg bg-background/55 px-3.5 py-3 backdrop-blur-sm transition-colors hover:bg-background/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Monthly trend
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
              <ArrowUpRight className="size-4 text-primary" />
              <span>{detail}</span>
            </div>
          </div>
          <div className="rounded-lg bg-background/55 px-3.5 py-3 backdrop-blur-sm transition-colors hover:bg-background/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Recent activity
            </p>
            <p className="mt-2 text-sm text-foreground">
              {transactionCount} recent transactions imported
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
