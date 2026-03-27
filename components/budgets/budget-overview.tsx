import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import type { BudgetSummary } from "@/lib/types/finance";

export function BudgetOverview({ budgets }: { budgets: BudgetSummary[] }) {
  const onTrackCount = budgets.filter((budget) => budget.state === "on_track").length;
  const warningCount = budgets.filter((budget) => budget.state === "warning").length;
  const overCount = budgets.filter((budget) => budget.state === "over").length;
  const totalRemaining = budgets.reduce(
    (total, budget) => total + Math.max(budget.remainingAmount, 0),
    0,
  );

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              On track
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{onTrackCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Close to limit
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{warningCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Over budget
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{overCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Remaining
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {formatCurrency(totalRemaining)}
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {budgets.map((budget) => {
          const progress = (budget.spentAmount / budget.limitAmount) * 100;
          const isOver = budget.state === "over";
          const isWarning = budget.state === "warning";

          return (
            <Card key={budget.id}>
              <CardContent className="space-y-4 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {budget.categoryPrimary}
                      </h3>
                      <Badge
                        variant={isOver ? "danger" : isWarning ? "warning" : "success"}
                      >
                        {isOver ? "Over budget" : isWarning ? "Close to limit" : "On track"}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                      {formatCurrency(budget.spentAmount)} of {formatCurrency(budget.limitAmount)}{" "}
                      spent this month.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-surface-subtle/60 px-3 py-2 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {isOver ? (
                        <AlertTriangle className="size-4 text-danger" />
                      ) : (
                        <CheckCircle2 className="size-4 text-success" />
                      )}
                      <span className={isOver ? "text-danger" : "text-success"}>
                        {isOver
                          ? `${formatCurrency(Math.abs(budget.remainingAmount))} over`
                          : `${formatCurrency(budget.remainingAmount)} left`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress
                    indicatorClassName={
                      isOver ? "bg-danger" : isWarning ? "bg-amber-500" : "bg-success"
                    }
                    value={progress}
                  />
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="text-muted-foreground">
                      {isOver
                        ? "You have already passed this budget."
                        : isWarning
                          ? "Spending is close to the limit."
                          : "Spending is on pace for the month."}
                    </p>
                    <p className="font-medium text-foreground">{Math.round(progress)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
