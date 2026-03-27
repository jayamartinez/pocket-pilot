"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { CompactSubscriptionRow } from "@/components/dashboard/compact-subscription-row";
import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { SubscriptionSummary } from "@/lib/types/finance";

export function RecurringHighlights({
  subscriptions,
}: {
  subscriptions: SubscriptionSummary[];
}) {
  const [showAll, setShowAll] = useState(false);
  const sortedSubscriptions = useMemo(
    () =>
      [...subscriptions].sort((left, right) =>
        left.nextChargeDate.localeCompare(right.nextChargeDate),
      ),
    [subscriptions],
  );
  const visibleSubscriptions = showAll
    ? sortedSubscriptions
    : sortedSubscriptions.slice(0, 3);
  const monthlyTotal = subscriptions.reduce(
    (total, subscription) => total + subscription.averageAmount,
    0,
  );

  return (
    <Card className="border-border/80">
      <CardContent className="p-4 sm:p-5">
        <DashboardSectionHeader
          action={
            <Link
              className="text-sm font-medium text-primary transition hover:text-primary/80"
              href="/subscriptions"
            >
              View all
            </Link>
          }
          description={`Estimated monthly total ${formatCurrency(monthlyTotal)}.`}
          title="Upcoming subscriptions"
        />

        <div className="mt-4 space-y-2.5">
          {visibleSubscriptions.map((subscription) => (
            <CompactSubscriptionRow
              key={subscription.id}
              subscription={subscription}
            />
          ))}
        </div>

        {subscriptions.length > 3 ? (
          <Button
            className="mt-4"
            onClick={() => setShowAll((current) => !current)}
            size="sm"
            variant="ghost"
          >
            {showAll ? "Show fewer" : `Show ${subscriptions.length - 3} more`}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
