import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import type { SubscriptionSummary } from "@/lib/types/finance";

export function SubscriptionList({
  subscriptions,
}: {
  subscriptions: SubscriptionSummary[];
}) {
  const sortedSubscriptions = [...subscriptions].sort((left, right) =>
    left.nextChargeDate.localeCompare(right.nextChargeDate),
  );
  const monthlyTotal = subscriptions.reduce(
    (total, subscription) => total + subscription.averageAmount,
    0,
  );
  const nextCharge = sortedSubscriptions[0];
  const highConfidenceCount = subscriptions.filter(
    (subscription) => subscription.confidence >= 0.9,
  ).length;

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardContent className="p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Monthly total
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {formatCurrency(monthlyTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Next renewal
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              {nextCharge
                ? `${nextCharge.merchantName} on ${formatDate(nextCharge.nextChargeDate)}`
                : "None"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Strong matches
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {highConfidenceCount}
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {sortedSubscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="space-y-4 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {subscription.merchantName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Next charge {formatDate(subscription.nextChargeDate)}
                  </p>
                </div>
                <Badge variant={subscription.confidence >= 0.9 ? "success" : "warning"}>
                  {subscription.confidence >= 0.9 ? "High confidence" : "Review"}
                </Badge>
              </div>

              <div className="grid gap-3 rounded-2xl border border-border/70 bg-surface-subtle/55 p-3.5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Average charge
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {formatCurrency(subscription.averageAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Frequency
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground capitalize">
                    {subscription.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Last charge
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {formatDate(subscription.lastChargeDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Confidence
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {(subscription.confidence * 100).toFixed(0)}% match
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
