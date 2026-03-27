"use client";

import { CreditCard, MapPin, Receipt, Repeat } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatMonthDay } from "@/lib/format";
import type { TransactionRecord } from "@/lib/types/finance";

function buildMapPattern() {
  return {
    backgroundColor: "#e8ebef",
    backgroundImage:
      "linear-gradient(90deg, rgba(255,255,255,0.88) 0 12%, transparent 12% 18%, rgba(255,255,255,0.88) 18% 30%, transparent 30% 36%, rgba(255,255,255,0.88) 36% 44%, transparent 44% 52%, rgba(255,255,255,0.88) 52% 64%, transparent 64% 70%, rgba(255,255,255,0.88) 70% 82%, transparent 82%), linear-gradient(rgba(255,255,255,0.9) 0 14%, transparent 14% 22%, rgba(255,255,255,0.9) 22% 36%, transparent 36% 44%, rgba(255,255,255,0.9) 44% 58%, transparent 58% 66%, rgba(255,255,255,0.9) 66% 80%, transparent 80%)",
  };
}

export function TransactionDetailsContent({
  className,
  transaction,
}: {
  className?: string;
  transaction: TransactionRecord;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      <div>
        <h3 className="text-[1.6rem] font-semibold text-foreground">{transaction.displayName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{transaction.merchantName}</p>
      </div>

      <div
        className="relative h-34 overflow-hidden rounded-2xl border border-border/70"
        style={buildMapPattern()}
      >
        <div className="absolute left-[68%] top-[42%] flex size-8 items-center justify-center rounded-full bg-card text-foreground shadow-[0_8px_18px_rgb(0_0_0_/_0.18)]">
          <MapPin className="size-4" />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-dashed border-border bg-surface-subtle/45 p-4">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Receipt</span>
        </div>
        <button
          className="rounded-xl border border-border/80 bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/60"
          type="button"
        >
          Upload receipt
        </button>
        <p className="text-sm text-muted-foreground">
          Drag-and-drop support can plug into this area later.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-surface-subtle/45 px-4 py-3">
          <div className="flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Recurring transaction</p>
              <p className="text-xs text-muted-foreground">
                {transaction.isRecurring ? "Repeats monthly" : "Not recurring"}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "h-6 w-11 rounded-full p-1 transition",
              transaction.isRecurring ? "bg-primary" : "bg-muted",
            )}
          >
            <div
              className={cn(
                "size-4 rounded-full bg-white transition",
                transaction.isRecurring && "translate-x-5",
              )}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Amount
            </p>
            <p
              className={cn(
                "mt-2 text-2xl font-semibold",
                transaction.direction === "credit" ? "text-success" : "text-foreground",
              )}
            >
              {transaction.direction === "credit" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Category
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {transaction.categoryDetailed}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Account
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <CreditCard className="size-4 text-muted-foreground" />
                <span>{transaction.accountName}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Date
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {formatMonthDay(transaction.date)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant={
                    transaction.pending
                      ? "warning"
                      : transaction.direction === "credit"
                        ? "success"
                        : "outline"
                  }
                >
                  {transaction.pending
                    ? "Pending"
                    : transaction.direction === "credit"
                      ? "Income"
                      : "Posted"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
