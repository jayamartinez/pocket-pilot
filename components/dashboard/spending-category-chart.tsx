"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { SpendingCategoryDatum } from "@/lib/types/finance";
import { cn } from "@/lib/utils";

type TimeRange = "7d" | "30d" | "90d";
type SpendingView = "donut" | "list";

const rangeOptions: TimeRange[] = ["7d", "30d", "90d"];
const viewOptions: SpendingView[] = ["donut", "list"];

function buildCategoryData(data: SpendingCategoryDatum[], range: TimeRange) {
  const multiplier = range === "7d" ? 0.34 : range === "90d" ? 2.75 : 1;
  return data
    .map((item) => ({
      ...item,
      amount: Math.round(item.amount * multiplier),
    }))
    .sort((left, right) => right.amount - left.amount);
}

function getRangeDescription(range: TimeRange) {
  if (range === "7d") {
    return "Top categories over the past week.";
  }

  if (range === "90d") {
    return "Top categories across the last three months.";
  }

  return "Where your money is going this month.";
}

export function SpendingCategoryChart({
  data,
}: {
  data: SpendingCategoryDatum[];
}) {
  const [range, setRange] = useState<TimeRange>("30d");
  const [view, setView] = useState<SpendingView>(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? "list"
      : "donut",
  );

  const displayData = useMemo(() => buildCategoryData(data, range), [data, range]);
  const total = displayData.reduce((sum, item) => sum + item.amount, 0);
  const topCategory = displayData[0];

  return (
    <Card className="border-border/70">
      <CardContent className="p-4 sm:p-5">
        <DashboardSectionHeader
          controls={
            <>
              <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
                {rangeOptions.map((option) => (
                  <Button
                    key={option}
                    className="h-8 px-3"
                    onClick={() => setRange(option)}
                    size="sm"
                    variant={range === option ? "default" : "ghost"}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
                {viewOptions.map((option) => (
                  <Button
                    key={option}
                    className="h-8 px-3 capitalize"
                    onClick={() => setView(option)}
                    size="sm"
                    variant={view === option ? "default" : "ghost"}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </>
          }
          description={getRangeDescription(range)}
          title="Spending"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="rounded-lg bg-surface-subtle/80 px-3 py-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Total
            </p>
            <p className="mt-1 font-semibold text-foreground">{formatCurrency(total)}</p>
          </div>
          {topCategory ? (
            <div className="rounded-lg bg-surface-subtle/80 px-3 py-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Largest category
              </p>
              <p className="mt-1 font-semibold text-foreground">{topCategory.category}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          {view === "donut" ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
              <div className="h-[200px]">
                <PieChart responsive style={{ height: "100%", minWidth: 0, width: "100%" }}>
                  <Pie
                    data={displayData}
                    dataKey="amount"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {displayData.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                </PieChart>
              </div>

              <div className="space-y-2.5">
                {displayData.slice(0, 5).map((item, index) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between gap-3 rounded-lg bg-surface-subtle/70 px-3.5 py-2.5 transition-colors hover:bg-surface-subtle"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayData.map((item, index) => {
                const width = total === 0 ? 0 : (item.amount / total) * 100;
                return (
                  <div
                    key={item.category}
                    className="rounded-lg bg-surface-subtle/70 px-3.5 py-3 transition-colors hover:bg-surface-subtle"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate text-sm font-medium text-foreground">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-[width]")}
                        style={{ backgroundColor: item.color, width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
