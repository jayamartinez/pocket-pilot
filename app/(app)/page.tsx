import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { CompactSubscriptionRow } from "@/components/dashboard/compact-subscription-row";
import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { ManualSyncButton } from "@/components/dashboard/manual-sync-button";
import { RecentTransactionsTable } from "@/components/dashboard/recent-transactions-table";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  appSummary,
  budgetSummaries,
  connectedAccounts,
  dashboardMetrics,
  subscriptionSummaries,
  transactions,
} from "@/lib/mock-data";

const cashFlowData = [
  { label: "Day 1", income: 70, spending: 55 },
  { label: "Day 5", income: 210, spending: 130 },
  { label: "Day 9", income: 175, spending: 128 },
  { label: "Oct 12", income: 240, spending: 250 },
  { label: "Oct 15", income: 245, spending: 182 },
  { label: "Oct 18", income: 302, spending: 228 },
  { label: "Oct 24", income: 350, spending: 278 },
  { label: "Oct 27", income: 308, spending: 220 },
  { label: "Oct 28", income: 366, spending: 276 },
  { label: "Oct 30", income: 452, spending: 334 },
];

export default function DashboardPage() {
  const [spentMetric, incomeMetric, moneyLeftMetric] = dashboardMetrics;

  const totalBalance = connectedAccounts.reduce(
    (sum, account) => sum + account.currentBalance,
    0,
  );

  const savingsRate =
    incomeMetric.amount === 0 ? 0 : (moneyLeftMetric.amount / incomeMetric.amount) * 100;

  const metricCards = [
    {
      label: "Balance",
      value: formatCurrency(totalBalance),
      delta: "4.2%",
      positive: true,
      bars: [28, 46, 40, 62, 55, 74, 68, 83],
    },
    {
      label: "Income",
      value: formatCurrency(incomeMetric.amount),
      delta: "5.1%",
      positive: true,
      bars: [24, 41, 33, 57, 38, 64, 59, 72],
    },
    {
      label: "Spending",
      value: formatCurrency(spentMetric.amount),
      delta: "2.3%",
      positive: false,
      bars: [72, 61, 66, 48, 56, 39, 44, 28],
    },
    {
      label: "Savings rate",
      value: formatPercent(savingsRate),
      delta: "1.8%",
      positive: true,
      bars: [19, 26, 22, 37, 30, 48, 41, 53],
    },
  ];

  const budgets = budgetSummaries.map((budget) => ({
    ...budget,
    progress: Math.min((budget.spentAmount / budget.limitAmount) * 100, 100),
  }));
  const visibleBudgets = budgets.slice(0, 4);
  const totalBudgetLimit = visibleBudgets.reduce((sum, budget) => sum + budget.limitAmount, 0);
  const totalBudgetSpent = visibleBudgets.reduce((sum, budget) => sum + budget.spentAmount, 0);

  const upcomingSubscriptions = [...subscriptionSummaries].sort((left, right) =>
    left.nextChargeDate.localeCompare(right.nextChargeDate),
  );

  const sparklinePath = (bars: number[]) =>
    bars
      .map((value, index) => {
        const x = (index / (bars.length - 1)) * 100;
        const y = 100 - value;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  const budgetToneClass = (state: string) => {
    if (state === "over") return "bg-danger";
    if (state === "warning") return "bg-amber-400";
    return "bg-success";
  };

  const budgetStatus = (state: string) => {
    if (state === "over") return "Over";
    if (state === "warning") return "Watch";
    return "On track";
  };

  const monthlyRecurringTotal = upcomingSubscriptions.reduce(
    (sum, subscription) => sum + subscription.averageAmount,
    0,
  );

  return (
    <div className="space-y-4 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:space-y-2 lg:overflow-hidden">
      <PageHeader
        actions={<ManualSyncButton initialSyncAt={appSummary.lastSyncAt} />}
        className="pb-2 lg:pb-1"
        title="Dashboard"
      />

      <section className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
        <div className="flex gap-3 lg:grid lg:grid-cols-4 lg:gap-2.5">
          {metricCards.map((metric) => (
            <Card
              key={metric.label}
              className="min-w-[220px] overflow-hidden border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_40%),var(--card)] lg:min-w-0"
            >
              <CardContent className="p-3.5 lg:p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-[1.55rem] font-semibold tracking-tight text-foreground lg:text-[1.4rem]">
                      {metric.value}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${metric.positive ? "text-success" : "text-danger"
                      }`}
                  >
                    {metric.positive ? (
                      <ArrowUpRight className="size-4" />
                    ) : (
                      <ArrowDownRight className="size-4" />
                    )}
                    <span>{metric.delta}</span>
                  </div>
                </div>

                <div className="mt-2.5 h-10 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent),rgba(255,255,255,0.01)] px-1 pt-1.5 lg:h-9">
                  <svg
                    className="h-full w-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <defs>
                      <linearGradient id={`spark-${metric.label}`} x1="0" x2="0" y1="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={metric.positive ? "var(--chart-3)" : "var(--chart-5)"}
                          stopOpacity="0.35"
                        />
                        <stop
                          offset="100%"
                          stopColor={metric.positive ? "var(--chart-3)" : "var(--chart-5)"}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d={`${sparklinePath(metric.bars)} L 100 100 L 0 100 Z`}
                      fill={`url(#spark-${metric.label})`}
                    />
                    <path
                      d={sparklinePath(metric.bars)}
                      fill="none"
                      stroke={metric.positive ? "var(--chart-3)" : "var(--chart-5)"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.42fr)_320px] lg:gap-2.5">
        <CashFlowChart
          className="order-1 lg:col-start-1 lg:h-[272px] lg:min-h-0 lg:max-h-[272px] lg:overflow-hidden"
          data={cashFlowData}
        />

        <div className="order-3 lg:order-2 lg:col-start-2 lg:h-[272px] lg:min-h-0 lg:overflow-hidden">
          <RecentTransactionsTable transactions={transactions.slice(0, 3)} />
        </div>

        <Card className="order-4 border-border/80 lg:order-3 lg:col-start-1 lg:h-full">
          <CardContent className="flex h-full flex-col p-4 lg:p-3.5">
            <DashboardSectionHeader title="Budget progress" />
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(totalBudgetSpent)} of {formatCurrency(totalBudgetLimit)} used across{" "}
              {visibleBudgets.length} categories
            </p>

            <div className="mt-3 flex-1 lg:mt-2.5">
              <div className="flex h-full flex-col justify-between">
                {visibleBudgets.map((budget) => (
                  <div key={budget.id} className="flex flex-1 flex-col justify-center">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate text-md font-medium text-foreground">
                            {budget.categoryPrimary}
                          </p>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${budget.state === "over"
                              ? "bg-danger/14 text-danger"
                              : budget.state === "warning"
                                ? "bg-amber-400/12 text-amber-400"
                                : "bg-success/14 text-success"
                              }`}
                          >
                            {budgetStatus(budget.state)}
                          </span>
                        </div>

                        <p className="shrink-0 text-[11px] text-muted-foreground">
                          {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.limitAmount)}
                        </p>
                      </div>

                      <Progress
                        className="h-1.5 bg-muted/80"
                        indicatorClassName={budgetToneClass(budget.state)}
                        value={budget.progress}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="order-5 border-border/80 lg:order-4 lg:col-start-2 lg:self-start">
          <CardContent className="flex flex-col p-4 lg:p-3.5">
            <DashboardSectionHeader title="Subscriptions" />
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrency(monthlyRecurringTotal)} monthly recurring
            </p>

            <div className="mt-3 space-y-2 lg:mt-2.5">
              {upcomingSubscriptions.slice(0, 3).map((subscription) => (
                <CompactSubscriptionRow key={subscription.id} subscription={subscription} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
