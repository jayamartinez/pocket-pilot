"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterCombobox } from "@/components/transactions/filter-combobox";
import { TransactionDetailsContent } from "@/components/transactions/transaction-details-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency, formatMonthDay } from "@/lib/format";
import type { TransactionRecord } from "@/lib/types/finance";

function getMerchantInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatGroupLabel(transactionDate: string, newestDate: string) {
  const newest = new Date(newestDate);
  const current = new Date(transactionDate);
  const differenceInDays = Math.round(
    (newest.getTime() - current.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays <= 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "Yesterday";
  }

  return formatMonthDay(transactionDate);
}

type QuickFilter = "all" | "recurring" | "pending" | "income";

export function TransactionsExplorer({
  transactions,
}: {
  transactions: TransactionRecord[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [account, setAccount] = useState("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(transactions[0]?.id ?? null);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const categories = Array.from(new Set(transactions.map((item) => item.categoryPrimary)));
  const accounts = Array.from(new Set(transactions.map((item) => item.accountName)));
  const newestDate = transactions.reduce(
    (latest, current) => (current.date > latest ? current.date : latest),
    transactions[0]?.date ?? "",
  );

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const normalizedQuery = deferredQuery.trim().toLowerCase();
        const queryMatches =
          normalizedQuery.length === 0 ||
          transaction.displayName.toLowerCase().includes(normalizedQuery) ||
          transaction.merchantName.toLowerCase().includes(normalizedQuery) ||
          transaction.categoryDetailed.toLowerCase().includes(normalizedQuery);

        const categoryMatches = category === "all" || transaction.categoryPrimary === category;
        const accountMatches = account === "all" || transaction.accountName === account;
        const quickFilterMatches =
          quickFilter === "all" ||
          (quickFilter === "recurring" && transaction.isRecurring) ||
          (quickFilter === "pending" && transaction.pending) ||
          (quickFilter === "income" && transaction.direction === "credit");

        return queryMatches && categoryMatches && accountMatches && quickFilterMatches;
      }),
    [account, category, deferredQuery, quickFilter, transactions],
  );

  useEffect(() => {
    if (filteredTransactions.length === 0) {
      setSelectedId(null);
      setIsMobileDetailsOpen(false);
      return;
    }

    if (!filteredTransactions.some((transaction) => transaction.id === selectedId)) {
      setSelectedId(filteredTransactions[0]?.id ?? null);
    }
  }, [filteredTransactions, selectedId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleBreakpointChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setIsMobileDetailsOpen(false);
      }
    };

    handleBreakpointChange(mediaQuery);
    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  const selectedTransaction =
    filteredTransactions.find((transaction) => transaction.id === selectedId) ?? null;

  const groupedTransactions = filteredTransactions.reduce<Record<string, TransactionRecord[]>>(
    (groups, transaction) => {
      const label = formatGroupLabel(transaction.date, newestDate);
      groups[label] ??= [];
      groups[label].push(transaction);
      return groups;
    },
    {},
  );

  const activeFilters = [
    category !== "all" ? category : null,
    account !== "all" ? account : null,
    quickFilter !== "all" ? quickFilter : null,
    deferredQuery.trim().length > 0 ? `"${deferredQuery.trim()}"` : null,
  ].filter(Boolean) as string[];

  const handleTransactionSelect = (transactionId: string) => {
    setSelectedId(transactionId);

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileDetailsOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/80">
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_220px_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search transactions..."
                value={query}
              />
            </div>
            <div className="rounded-xl border border-input bg-muted/70 px-3 py-2 text-sm text-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-muted-foreground" />
                <span>March 1 - 31, 2026</span>
              </div>
            </div>
            <FilterCombobox
              allLabel="All categories"
              emptyLabel="categories"
              onValueChange={setCategory}
              options={categories}
              searchPlaceholder="Search categories..."
              value={category}
            />
            <FilterCombobox
              allLabel="All accounts"
              emptyLabel="accounts"
              onValueChange={setAccount}
              options={accounts}
              searchPlaceholder="Search accounts..."
              value={account}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Recurring", value: "recurring" },
              { label: "Pending", value: "pending" },
              { label: "Income", value: "income" },
            ].map((item) => (
              <button
                key={item.value}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  quickFilter === item.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
                onClick={() =>
                  setQuickFilter((current) =>
                    current === item.value ? "all" : (item.value as QuickFilter),
                  )
                }
                type="button"
              >
                {item.label}
              </button>
            ))}
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="outline">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTransactions.length === 0 || !selectedTransaction ? (
        <EmptyState
          description="No transactions match these filters. Clear a filter or try a different search."
          title="No matching transactions"
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_320px]">
          <Card className="overflow-hidden border-border/80">
            <CardContent className="p-0">
              {Object.entries(groupedTransactions).map(([groupLabel, groupTransactions]) => (
                <section key={groupLabel}>
                  <div className="border-b border-border/60 px-4 py-4 text-sm font-medium text-foreground">
                    {groupLabel}
                  </div>
                  <div className="divide-y divide-border/60">
                    {groupTransactions.map((transaction) => {
                      const isSelected = selectedId === transaction.id;

                      return (
                        <button
                          className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition ${
                            isSelected ? "bg-muted/55" : "hover:bg-muted/35"
                          }`}
                          key={transaction.id}
                          onClick={() => handleTransactionSelect(transaction.id)}
                          type="button"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-sm font-semibold text-foreground">
                              {getMerchantInitials(transaction.displayName)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {transaction.displayName}
                              </p>
                              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                {transaction.merchantName}
                              </p>
                            </div>
                          </div>

                          <div className="hidden min-w-0 items-center gap-3 md:flex">
                            <Badge variant="outline">{transaction.categoryDetailed}</Badge>
                            <p className="min-w-24 text-sm text-muted-foreground">
                              {transaction.accountName.replace(" Checking", "...1234")}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p
                              className={`text-sm font-semibold ${
                                transaction.direction === "credit"
                                  ? "text-success"
                                  : "text-foreground"
                              }`}
                            >
                              {transaction.direction === "credit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {transaction.pending
                                ? "Pending"
                                : transaction.isRecurring
                                  ? "Recurring"
                                  : formatMonthDay(transaction.date)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </CardContent>
          </Card>

          <div className="hidden md:block">
            <Card className="border-border/80">
              <CardContent className="p-4">
                <TransactionDetailsContent transaction={selectedTransaction} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedTransaction ? (
        <Sheet open={isMobileDetailsOpen} onOpenChange={setIsMobileDetailsOpen}>
          <SheetContent
            className="safe-bottom max-h-[85svh] gap-0 overflow-hidden rounded-t-[28px] border-border/80 bg-card px-0 pb-0 pt-0 text-card-foreground md:hidden"
            side="bottom"
          >
            <SheetHeader className="border-b border-border/70 px-5 py-4 text-left">
              <SheetTitle className="text-base font-semibold text-foreground">
                Transaction details
              </SheetTitle>
              <SheetDescription>
                Review merchant info, receipt status, and transaction metadata.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <TransactionDetailsContent transaction={selectedTransaction} />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
