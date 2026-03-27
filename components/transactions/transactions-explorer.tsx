"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Receipt,
  Repeat,
  Search,
} from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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

function buildMapPattern() {
  return {
    backgroundColor: "#e8ebef",
    backgroundImage:
      "linear-gradient(90deg, rgba(255,255,255,0.88) 0 12%, transparent 12% 18%, rgba(255,255,255,0.88) 18% 30%, transparent 30% 36%, rgba(255,255,255,0.88) 36% 44%, transparent 44% 52%, rgba(255,255,255,0.88) 52% 64%, transparent 64% 70%, rgba(255,255,255,0.88) 70% 82%, transparent 82%), linear-gradient(rgba(255,255,255,0.9) 0 14%, transparent 14% 22%, rgba(255,255,255,0.9) 22% 36%, transparent 36% 44%, rgba(255,255,255,0.9) 44% 58%, transparent 58% 66%, rgba(255,255,255,0.9) 66% 80%, transparent 80%)",
  };
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
      return;
    }

    if (!filteredTransactions.some((transaction) => transaction.id === selectedId)) {
      setSelectedId(filteredTransactions[0]?.id ?? null);
    }
  }, [filteredTransactions, selectedId]);

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
            <Select onChange={(event) => setCategory(event.target.value)} value={category}>
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Select onChange={(event) => setAccount(event.target.value)} value={account}>
              <option value="all">All accounts</option>
              {accounts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
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
                          onClick={() => setSelectedId(transaction.id)}
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

          <Card className="border-border/80">
            <CardContent className="space-y-5 p-4">
              <div>
                <h3 className="text-[1.6rem] font-semibold text-foreground">
                  {selectedTransaction.displayName}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedTransaction.merchantName}
                </p>
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
                        {selectedTransaction.isRecurring ? "Repeats monthly" : "Not recurring"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-6 w-11 rounded-full p-1 transition ${
                      selectedTransaction.isRecurring ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`size-4 rounded-full bg-white transition ${
                        selectedTransaction.isRecurring ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Amount
                    </p>
                    <p
                      className={`mt-2 text-2xl font-semibold ${
                        selectedTransaction.direction === "credit"
                          ? "text-success"
                          : "text-foreground"
                      }`}
                    >
                      {selectedTransaction.direction === "credit" ? "+" : "-"}
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Category
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {selectedTransaction.categoryDetailed}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Account
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <CreditCard className="size-4 text-muted-foreground" />
                        <span>{selectedTransaction.accountName}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Date
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {formatMonthDay(selectedTransaction.date)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-surface-subtle/45 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Status
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant={
                            selectedTransaction.pending
                              ? "warning"
                              : selectedTransaction.direction === "credit"
                                ? "success"
                                : "outline"
                          }
                        >
                          {selectedTransaction.pending
                            ? "Pending"
                            : selectedTransaction.direction === "credit"
                              ? "Income"
                              : "Posted"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
