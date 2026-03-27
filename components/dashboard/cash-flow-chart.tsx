"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { CashFlowDatum } from "@/lib/types/finance";
import { cn } from "@/lib/utils";

export function CashFlowChart({
  data,
  className,
}: {
  data: CashFlowDatum[];
  className?: string;
}) {
  const displayData = useMemo(() => data, [data]);
  const totalIncome = displayData.reduce((sum, item) => sum + item.income, 0);
  const totalSpending = displayData.reduce((sum, item) => sum + item.spending, 0);
  const net = totalIncome - totalSpending;

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%),var(--card)]",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col p-4 lg:p-3.5">
        <DashboardSectionHeader
          controls={
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[var(--chart-1)]" />
                  Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[var(--chart-2)]" />
                  Spending
                </span>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/40 px-3 py-1.5 text-[11px] font-medium text-foreground">
                30 days
              </div>
            </div>
          }
          title="Cash flow"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2 lg:mt-2.5">
          <div className="rounded-2xl border border-border/70 bg-surface-subtle/60 px-3 py-2 text-xs">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Net
            </p>
            <p className="mt-1 font-semibold text-foreground">{formatCurrency(net)}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-surface-subtle/60 px-3 py-2 text-xs">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              In
            </p>
            <p className="mt-1 font-semibold text-foreground">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-surface-subtle/60 px-3 py-2 text-xs">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Out
            </p>
            <p className="mt-1 font-semibold text-foreground">{formatCurrency(totalSpending)}</p>
          </div>
        </div>

        <div className="mt-3 h-[180px] min-h-0 sm:h-[188px] lg:mt-2.5 lg:h-[170px] xl:h-[182px]">
          <AreaChart
            data={displayData}
            margin={{ top: 8, right: 4, left: -8, bottom: 0 }}
            responsive
            style={{ height: "100%", minWidth: 0, width: "100%" }}
          >
            <defs>
              <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.26} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="spendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.24} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="rgb(148 163 184 / 0.12)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "rgb(154 160 170)", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "rgb(154 160 170)", fontSize: 11 }}
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid rgb(42 45 51)",
                background: "rgb(23 24 27 / 0.95)",
                boxShadow: "0 14px 30px rgb(0 0 0 / 0.28)",
              }}
              labelStyle={{ color: "rgb(242 244 247)" }}
              formatter={(value) => formatCompactCurrency(Number(value ?? 0))}
            />
            <Area
              dataKey="income"
              fill="url(#incomeFill)"
              name="Income"
              stroke="var(--chart-1)"
              strokeWidth={2.15}
              type="monotone"
            />
            <Area
              dataKey="spending"
              fill="url(#spendFill)"
              name="Spending"
              stroke="var(--chart-2)"
              strokeWidth={2.15}
              type="monotone"
            />
          </AreaChart>
        </div>
      </CardContent>
    </Card>
  );
}
