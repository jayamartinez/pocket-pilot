"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Receipt,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type InsightTone = "danger" | "warning" | "primary" | "neutral";

interface InsightItem {
  id: string;
  label: string;
  summary: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
  tone: InsightTone;
}

const toneStyles: Record<InsightTone, string> = {
  danger: "border-danger/25 bg-danger/10 text-danger",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  primary: "border-primary/25 bg-primary/10 text-primary",
  neutral: "border-border/70 bg-surface-subtle/70 text-foreground",
};

const toneBadges: Record<InsightTone, string> = {
  danger: "Needs attention",
  warning: "Watch",
  primary: "Insight",
  neutral: "Summary",
};

export function InsightsStrip({ items }: { items: ReadonlyArray<InsightItem> }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className="rounded-xl border border-border/70 bg-card/85 p-3 backdrop-blur-sm">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const isActive = item.id === activeItem.id;
          const Icon =
            item.id === "accounts"
              ? WalletCards
              : item.id === "budgets"
                ? AlertTriangle
                : item.id === "renewals"
                  ? Receipt
                  : ArrowUpRight;

          return (
            <button
              key={item.id}
              className={cn(
                "group flex min-w-[220px] shrink-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all hover:-translate-y-px hover:border-border/90 sm:min-w-0 sm:flex-1",
                isActive
                  ? toneStyles[item.tone]
                  : "border-border/70 bg-background/50 text-foreground hover:bg-surface-subtle/80",
              )}
              onClick={() => setActiveId(item.id)}
              type="button"
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  isActive ? "bg-background/55" : "bg-muted/80",
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.label}</p>
                <p className="truncate text-xs opacity-80">{item.summary}</p>
              </div>
            </button>
          );
        })}
      </div>

      {activeItem ? (
        <div className="mt-3 rounded-lg border border-border/70 bg-background/45 px-3.5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{toneBadges[activeItem.tone]}</Badge>
            <p className="text-sm font-semibold text-foreground">{activeItem.label}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{activeItem.detail}</p>
          {activeItem.href ? (
            <Link
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary/80"
              href={activeItem.href}
            >
              {activeItem.hrefLabel ?? "Open"}
              <ChevronRight className="size-4" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
