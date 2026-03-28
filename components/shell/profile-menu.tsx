"use client";

import { useClerk, useUser } from "@clerk/nextjs";
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
import { accountNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || null;

  const ThemeIcon =
    resolvedTheme === "dark"
      ? SunMedium
      : resolvedTheme === "light"
        ? MoonStar
        : Monitor;

  const closeMenu = useEffectEvent(() => {
    setOpen(false);
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } finally {
      setIsSigningOut(false);
      setOpen(false);
    }
  };

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
        aria-label="Open account menu"
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-xl border border-border/80 bg-card/65 px-2.5 text-muted-foreground transition hover:border-border hover:bg-muted/60 hover:text-foreground",
          open && "border-border bg-muted/70 text-foreground",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <User className="size-4 shrink-0" />
        {displayName ? (
          <span className="hidden min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground xl:block">
            {displayName}
          </span>
        ) : null}
        {open ? (
          <ChevronUp className="ml-auto hidden size-4 shrink-0 xl:block" />
        ) : (
          <ChevronDown className="ml-auto hidden size-4 shrink-0 xl:block" />
        )}
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 w-[16rem] rounded-[24px] border border-border/90 bg-card p-2 shadow-[0_22px_48px_rgb(0_0_0_/_0.3)]">
          <div className="space-y-1">
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
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSigningOut}
            onClick={handleSignOut}
            type="button"
          >
            <LogOut className="size-4" />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
