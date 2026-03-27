import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { DashboardMetric } from "@/lib/types/finance";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  const isPositive = metric.trend === "up";

  return (
    <Card>
      <CardHeader className="border-b-0 px-4 pb-2 pt-4 sm:px-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {formatCurrency(metric.amount)}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {metric.changeLabel}
            </p>
          </div>
          <div
            className={`rounded-lg p-2 ${
              isPositive ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="size-5" />
            ) : (
              <ArrowDownRight className="size-5" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
