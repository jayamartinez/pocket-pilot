import { BudgetRow, getBudgetStatusCopy } from "@/components/budgets/budget-row";
import { CompactSummaryCard } from "@/components/shared/compact-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { BudgetSummary } from "@/lib/types/finance";

export function BudgetOverview({ budgets }: { budgets: BudgetSummary[] }) {
  if (budgets.length === 0) {
    return (
      <EmptyState
        action={<Button>Create/Edit budgets</Button>}
        description="Create your first category target to keep monthly spending organized and visible."
        title="No budgets yet"
      />
    );
  }

  const totalBudgeted = budgets.reduce((total, budget) => total + budget.limitAmount, 0);
  const totalSpent = budgets.reduce((total, budget) => total + budget.spentAmount, 0);
  const totalRemaining = budgets.reduce((total, budget) => total + budget.remainingAmount, 0);
  const attentionCount = budgets.filter((budget) => budget.state !== "on_track").length;

  return (
    <div className="space-y-4">
      <section className="scrollbar-subtle overflow-x-auto px-1 pb-1 sm:px-0 sm:overflow-visible sm:pb-0">
        <div className="flex gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4">
          <CompactSummaryCard
            className="min-w-[220px] sm:min-w-0"
            label="Total budgeted"
            value={formatCurrency(totalBudgeted)}
          />
          <CompactSummaryCard
            className="min-w-[220px] sm:min-w-0"
            label="Spent so far"
            value={formatCurrency(totalSpent)}
          />
          <CompactSummaryCard
            className="min-w-[220px] sm:min-w-0"
            label={totalRemaining < 0 ? "Over plan" : "Remaining"}
            value={formatCurrency(Math.abs(totalRemaining))}
            valueClassName={totalRemaining < 0 ? "text-danger" : undefined}
          />
          <CompactSummaryCard
            className="min-w-[220px] sm:min-w-0"
            label="Needs attention"
            value={attentionCount}
          />
        </div>
      </section>

      <Card className="overflow-hidden border-border/80">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <CardTitle>Monthly budgets</CardTitle>
            <p className="text-sm text-muted-foreground">
              {budgets.length} categories for March 2026
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="lg:hidden divide-y divide-border/60">
            {budgets.map((budget) => (
              <BudgetRow budget={budget} key={budget.id} />
            ))}
          </div>
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => {
                  const status = getBudgetStatusCopy(budget.state);
                  const progress = (budget.spentAmount / budget.limitAmount) * 100;
                  const remainingLabel =
                    budget.remainingAmount < 0
                      ? `${formatCurrency(Math.abs(budget.remainingAmount))} over`
                      : `${formatCurrency(budget.remainingAmount)} left`;
                  const StatusIcon = status.icon;

                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="min-w-[280px] py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {budget.categoryPrimary}
                          </p>
                          <p className="text-sm text-muted-foreground">{status.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right text-sm font-semibold text-foreground">
                        {formatCurrency(budget.spentAmount)}
                      </TableCell>
                      <TableCell className="py-4 text-right text-sm font-semibold text-foreground">
                        {formatCurrency(budget.limitAmount)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <StatusIcon
                            className={`size-3.5 ${
                              budget.state === "over" ? "text-danger" : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={
                              budget.state === "over" ? "text-danger" : "text-foreground"
                            }
                          >
                            {remainingLabel}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[180px] py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                            <span>{formatCurrency(budget.spentAmount)}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress
                            className="h-2"
                            indicatorClassName={status.progressClassName}
                            value={progress}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
