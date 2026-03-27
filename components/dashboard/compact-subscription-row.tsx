import { CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { SubscriptionSummary } from "@/lib/types/finance";

function getMerchantInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function CompactSubscriptionRow({
  subscription,
}: {
  subscription: SubscriptionSummary;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-subtle/55 px-3 py-2.5 transition-colors hover:border-border hover:bg-surface-subtle/75">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted/80 text-[11px] font-semibold text-muted-foreground">
          {getMerchantInitials(subscription.merchantName)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-5 text-foreground">
            {subscription.merchantName}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <CalendarClock className="size-3.5" />
            <span>Due {formatDate(subscription.nextChargeDate)}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-foreground">
          {formatCurrency(subscription.averageAmount)}
        </p>
        <Badge className="mt-1" variant={subscription.confidence >= 0.9 ? "success" : "outline"}>
          {subscription.confidence >= 0.9 ? "High match" : "Review"}
        </Badge>
      </div>
    </div>
  );
}
