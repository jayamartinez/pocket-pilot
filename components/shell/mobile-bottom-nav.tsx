"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 bg-background/90 px-3 pt-2 backdrop-blur-xl lg:hidden">
      <div className="surface-border mx-auto grid max-w-xl grid-cols-4 gap-1 rounded-[24px] bg-sidebar/95 p-2">
        {appNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              className={cn(
                "flex min-h-15 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-card text-foreground"
                  : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
              )}
              href={item.href}
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
