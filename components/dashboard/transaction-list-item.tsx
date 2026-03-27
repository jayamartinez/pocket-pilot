import { formatCurrency, formatMonthDay } from "@/lib/format";
import type { TransactionRecord } from "@/lib/types/finance";
import { cn } from "@/lib/utils";

function getMerchantInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function TransactionListItem({
  transaction,
}: {
  transaction: TransactionRecord;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-subtle/45 px-3 py-2.5 transition-colors hover:border-border hover:bg-surface-subtle/70">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-semibold text-muted-foreground">
          {getMerchantInitials(transaction.displayName)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-5 text-foreground">
            {transaction.displayName}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="truncate">{transaction.categoryDetailed}</span>
            <span className="size-1 rounded-full bg-border/80" />
            <span className="shrink-0">{formatMonthDay(transaction.date)}</span>
          </div>
        </div>
      </div>

      <p
        className={cn(
          "shrink-0 text-sm font-semibold",
          transaction.direction === "credit" ? "text-success" : "text-foreground",
        )}
      >
        {transaction.direction === "credit" ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}
