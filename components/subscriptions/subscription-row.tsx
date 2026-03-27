import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { SubscriptionSummary } from "@/lib/types/finance";

function parseDateValue(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatMonthDayLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parseDateValue(date));
}

export function formatRelativeRenewal(date: string) {
  const target = parseDateValue(date);
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInDays = Math.round(
    (target.getTime() - current.getTime()) / millisecondsPerDay,
  );

  if (differenceInDays < 0) {
    return "past due";
  }

  if (differenceInDays === 0) {
    return "today";
  }

  if (differenceInDays === 1) {
    return "tomorrow";
  }

  return `in ${differenceInDays} days`;
}

export function getRenewalBadgeVariant(date: string) {
  const target = parseDateValue(date);
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInDays = Math.round(
    (target.getTime() - current.getTime()) / millisecondsPerDay,
  );

  if (differenceInDays < 0) {
    return "danger" as const;
  }

  if (differenceInDays <= 7) {
    return "warning" as const;
  }

  return "outline" as const;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function SubscriptionRow({
  subscription,
}: {
  subscription: SubscriptionSummary;
}) {
  const renewalLabel = formatRelativeRenewal(subscription.nextChargeDate);

  return (
    <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.6fr)_120px_110px_110px_110px_120px] lg:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-sm font-semibold text-foreground">
          {getInitials(subscription.merchantName)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {subscription.merchantName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge className="lg:hidden" variant="outline">
              {subscription.frequency}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {renewalLabel === "past due" ? "Renewal missed" : `Renews ${renewalLabel}`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-surface-subtle/45 p-3 sm:grid-cols-4 lg:contents">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            Monthly
          </p>
          <p className="text-sm font-semibold text-foreground">
            {formatCurrency(subscription.averageAmount)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            Frequency
          </p>
          <p className="text-sm capitalize text-foreground">{subscription.frequency}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            Last charge
          </p>
          <p className="text-sm text-foreground">
            {formatMonthDayLabel(subscription.lastChargeDate)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            Next charge
          </p>
          <p className="text-sm font-medium text-foreground">
            {formatMonthDayLabel(subscription.nextChargeDate)}
          </p>
        </div>
      </div>

      <div className="lg:justify-self-end">
        <Badge variant={getRenewalBadgeVariant(subscription.nextChargeDate)}>
          {renewalLabel}
        </Badge>
      </div>
    </div>
  );
}
