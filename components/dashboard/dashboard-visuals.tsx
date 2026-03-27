"use client";

import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { SpendingCategoryChart } from "@/components/dashboard/spending-category-chart";
import { cashFlowSeries, spendingByCategory } from "@/lib/mock-data";

export function DashboardVisuals({ type }: { type: "cash-flow" | "spending" }) {
  if (type === "cash-flow") {
    return <CashFlowChart data={cashFlowSeries} />;
  }

  return <SpendingCategoryChart data={spendingByCategory} />;
}
