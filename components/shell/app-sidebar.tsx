"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/shared/app-logo";
import { Badge } from "@/components/ui/badge";
import { appNavigation } from "@/lib/constants/navigation";
import { appSummary } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="surface-border surface-shadow flex h-full flex-col rounded-[28px] bg-sidebar px-3 py-5 xl:px-4 xl:py-6">
      <div className="px-2 xl:px-1">
        <div className="xl:hidden">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] text-primary-foreground">
            <Compass className="size-5" />
          </div>
        </div>
        <div className="hidden xl:block">
          <AppLogo />
        </div>
      </div>

      <div className="mt-7 space-y-1.5 xl:mt-9">
        {appNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              className={cn(
                "flex items-center justify-center rounded-2xl px-3 py-3 text-sm font-medium transition-colors xl:justify-between xl:px-4",
                isActive
                  ? "bg-card text-foreground shadow-[0_8px_20px_rgb(0_0_0_/_0.12)]"
                  : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
              )}
              href={item.href}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                <span className="hidden xl:inline">{item.title}</span>
              </span>
              {item.title === "Subscriptions" ? (
                <Badge className="hidden xl:inline-flex" variant="outline">
                  {appSummary.recurringMerchantCount}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
