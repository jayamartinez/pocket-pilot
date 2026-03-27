import { CompactSummaryCard } from "@/components/shared/compact-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  formatMonthDayLabel,
  formatRelativeRenewal,
  getRenewalBadgeVariant,
  SubscriptionRow,
} from "@/components/subscriptions/subscription-row";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { SubscriptionSummary } from "@/lib/types/finance";

export function SubscriptionList({
  subscriptions,
}: {
  subscriptions: SubscriptionSummary[];
}) {
  if (subscriptions.length === 0) {
    return (
      <EmptyState
        description="Recurring charges will appear here once PocketPilot identifies subscription activity."
        title="No subscriptions yet"
      />
    );
  }

  const sortedSubscriptions = [...subscriptions].sort((left, right) =>
    left.nextChargeDate.localeCompare(right.nextChargeDate),
  );
  const monthlyTotal = subscriptions.reduce(
    (total, subscription) => total + subscription.averageAmount,
    0,
  );
  const nextCharge = sortedSubscriptions[0];

  return (
    <div className="space-y-4">
      <section className="scrollbar-subtle overflow-x-auto px-1 pb-1 sm:px-0 sm:overflow-visible sm:pb-0">
        <div className="flex gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          <CompactSummaryCard
            className="min-w-[220px] sm:min-w-0"
            label="Monthly total"
            value={formatCurrency(monthlyTotal)}
          />
          <CompactSummaryCard
            className="min-w-[220px] sm:min-w-0"
            label="Active subscriptions"
            value={subscriptions.length}
          />
          <CompactSummaryCard
            className="min-w-[220px] sm:min-w-0"
            label="Next renewal"
            value={nextCharge ? formatMonthDayLabel(nextCharge.nextChargeDate) : "None"}
          />
        </div>
      </section>

      <Card className="overflow-hidden border-border/80">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <CardTitle>Recurring payments</CardTitle>
            <p className="text-sm text-muted-foreground">Sorted by next renewal</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="lg:hidden divide-y divide-border/60">
            {sortedSubscriptions.map((subscription) => (
              <SubscriptionRow key={subscription.id} subscription={subscription} />
            ))}
          </div>
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Monthly</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Last charge</TableHead>
                  <TableHead>Next charge</TableHead>
                  <TableHead className="text-right">Renewal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubscriptions.map((subscription) => {
                  const renewalLabel = formatRelativeRenewal(subscription.nextChargeDate);
                  const initials = subscription.merchantName
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <TableRow key={subscription.id}>
                      <TableCell className="min-w-[320px] py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-sm font-semibold text-foreground">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {subscription.merchantName}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {renewalLabel === "past due"
                                ? "Renewal missed"
                                : `Renews ${renewalLabel}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right text-sm font-semibold text-foreground">
                        {formatCurrency(subscription.averageAmount)}
                      </TableCell>
                      <TableCell className="py-4 text-sm capitalize text-foreground">
                        {subscription.frequency}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground">
                        {formatMonthDayLabel(subscription.lastChargeDate)}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-foreground">
                        {formatMonthDayLabel(subscription.nextChargeDate)}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Badge variant={getRenewalBadgeVariant(subscription.nextChargeDate)}>
                          {renewalLabel}
                        </Badge>
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
