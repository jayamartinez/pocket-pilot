import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { BudgetSummary } from "@/lib/types/finance";

export function getBudgetStatusCopy(state: BudgetSummary["state"]) {
  switch (state) {
    case "over":
      return {
        label: "Over budget",
        description: "Spending has exceeded the target.",
        variant: "danger" as const,
        progressClassName: "bg-danger",
        icon: AlertTriangle,
      };
    case "warning":
      return {
        label: "Close to limit",
        description: "This category is nearing its monthly cap.",
        variant: "warning" as const,
        progressClassName: "bg-amber-500",
        icon: AlertTriangle,
      };
    default:
      return {
        label: "On track",
        description: "Spending is pacing within the target.",
        variant: "success" as const,
        progressClassName: "bg-success",
        icon: CheckCircle2,
      };
  }
}

export function BudgetRow({ budget }: { budget: BudgetSummary }) {
  const progress = (budget.spentAmount / budget.limitAmount) * 100;
  const status = getBudgetStatusCopy(budget.state);
  const StatusIcon = status.icon;
  const remainingLabel =
    budget.remainingAmount < 0
      ? `${formatCurrency(Math.abs(budget.remainingAmount))} over`
      : `${formatCurrency(budget.remainingAmount)} left`;

  return (
    <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(240px,1.8fr)_120px_120px_160px_140px] lg:items-center">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {budget.categoryPrimary}
          </p>
          <Badge className="lg:hidden" variant={status.variant}>
            {status.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{status.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border/70 bg-surface-subtle/45 p-3 lg:contents">
        <div className="space-y-1 lg:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            Spent
          </p>
          <p className="text-sm font-semibold text-foreground">
            {formatCurrency(budget.spentAmount)}
          </p>
        </div>
        <div className="space-y-1 lg:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            Budget
          </p>
          <p className="text-sm font-semibold text-foreground">
            {formatCurrency(budget.limitAmount)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            Remaining
          </p>
          <div className="flex items-center gap-2">
            <StatusIcon
              className={`size-3.5 ${budget.state === "over" ? "text-danger" : "text-muted-foreground"}`}
            />
            <p
              className={`text-sm font-semibold ${
                budget.state === "over" ? "text-danger" : "text-foreground"
              }`}
            >
              {remainingLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
          <span>{formatCurrency(budget.spentAmount)}</span>
          <span>{formatPercent(progress)}</span>
        </div>
        <Progress
          className="h-2"
          indicatorClassName={status.progressClassName}
          value={progress}
        />
      </div>

      <div className="hidden lg:flex lg:justify-end">
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
    </div>
  );
}
