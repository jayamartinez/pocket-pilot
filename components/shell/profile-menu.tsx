"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Monitor,
  MoonStar,
  SunMedium,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";

import { SettingsLink } from "@/components/settings/settings-link";
import type { SettingsTarget } from "@/components/settings/settings-targets";
import { Badge } from "@/components/ui/badge";
import { accountNavigation } from "@/lib/constants/navigation";
import { appSummary } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ThemeIcon =
    resolvedTheme === "dark"
      ? SunMedium
      : resolvedTheme === "light"
        ? MoonStar
        : Monitor;

  const closeMenu = useEffectEvent(() => {
    setOpen(false);
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex h-10 items-center gap-2 rounded-lg border-border/80 px-2.5 text-left transition hover:border-border hover:bg-muted/60",
          open && "border-border bg-muted/70",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <User className="size-4" />
        </div>
        {open ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-[18rem] rounded-[24px] border border-border/90 bg-card p-2 shadow-[0_22px_48px_rgb(0_0_0_/_0.3)]">


          <div className="mt-2 space-y-1">
            {accountNavigation.map((item) => {
              const Icon = item.icon;
              const target = item.href.includes("#")
                ? item.href.split("#")[1]
                : "overview";

              return (
                <SettingsLink
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/80"
                  target={target as SettingsTarget}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="size-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </SettingsLink>
              );
            })}
          </div>

          <div className="my-2 border-t border-border/70" />

          <button
            className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/80"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            type="button"
          >
            <span className="flex items-center gap-3">
              <ThemeIcon className="size-4 text-muted-foreground" />
              <span>Theme</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {isDark ? "Light mode" : "Dark mode"}
            </span>
          </button>

          <button
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10"
            onClick={() => setOpen(false)}
            type="button"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
