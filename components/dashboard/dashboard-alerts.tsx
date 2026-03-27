import { AlertTriangle, ArrowUpRight, WalletCards } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { BudgetSummary, InstitutionSummary, SubscriptionSummary } from "@/lib/types/finance";

function getRenewingSoonCount(subscriptions: SubscriptionSummary[]) {
  return subscriptions.filter((subscription) => {
    const date = new Date(subscription.nextChargeDate);
    return date.getDate() <= 18;
  }).length;
}

export function DashboardAlerts({
  budgets,
  institutions,
  subscriptions,
}: {
  budgets: BudgetSummary[];
  institutions: InstitutionSummary[];
  subscriptions: SubscriptionSummary[];
}) {
  const accountsNeedingAttention = institutions.filter(
    (institution) => institution.status !== "healthy",
  ).length;
  const budgetsNeedingAttention = budgets.filter(
    (budget) => budget.state === "warning" || budget.state === "over",
  ).length;
  const renewingSoon = getRenewingSoonCount(subscriptions);

  return (
    <section className="grid gap-3 lg:grid-cols-3">
      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <WalletCards className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Accounts need attention</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {accountsNeedingAttention === 0
                ? "All linked institutions are connected."
                : `${accountsNeedingAttention} linked account ${
                    accountsNeedingAttention === 1 ? "needs" : "need"
                  } action.`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Budgets to watch</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {budgetsNeedingAttention === 0
                ? "Every category is on track."
                : `${budgetsNeedingAttention} budget ${
                    budgetsNeedingAttention === 1 ? "is" : "are"
                  } close to the limit or over.`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ArrowUpRight className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Upcoming renewals</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {renewingSoon === 0
                ? "No subscription renewals are due soon."
                : `${renewingSoon} recurring charge ${
                    renewingSoon === 1 ? "is" : "are"
                  } due in the next cycle.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
