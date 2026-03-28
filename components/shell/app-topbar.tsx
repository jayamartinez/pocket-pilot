"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  BadgeAlert,
  Bell,
  CheckCheck,
  ChevronRight,
  CreditCard,
  Lightbulb,
  LogOut,
  Monitor,
  MoonStar,
  ShieldAlert,
  SunMedium,
  User,
  Wallet,
} from "lucide-react";
import { useTheme } from "next-themes";

import { AppLogo } from "@/components/shared/app-logo";
import { SettingsLink } from "@/components/settings/settings-link";
import type { SettingsTarget } from "@/components/settings/settings-targets";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { accountNavigation } from "@/lib/constants/navigation";
import {
  mockNotifications,
  type NotificationRecord,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const notificationMeta = {
  budget: { icon: BadgeAlert, className: "bg-danger/12 text-danger ring-1 ring-inset ring-danger/20" },
  income: { icon: Wallet, className: "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400" },
  insight: { icon: Lightbulb, className: "bg-primary/12 text-primary ring-1 ring-inset ring-primary/20" },
  security: { icon: ShieldAlert, className: "bg-amber-500/12 text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400" },
  subscription: { icon: CreditCard, className: "bg-sky-500/12 text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-400" },
} as const;

const notificationToneMeta = {
  critical: { label: "Urgent", className: "bg-danger/10 text-danger" },
  warning: { label: "Needs review", className: "bg-amber-500/12 text-amber-700 dark:text-amber-400" },
  positive: { label: "Good news", className: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400" },
  info: { label: "Update", className: "bg-primary/10 text-primary" },
} as const;

function MobileNotificationSheet({
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onNotificationClick,
}: {
  notifications: NotificationRecord[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (id: string) => void;
  unreadCount: number;
}) {
  const unread = notifications.filter((n) => n.unread);
  const earlier = notifications.filter((n) => !n.unread);

  const renderGroup = (items: NotificationRecord[], label: string) => {
    if (items.length === 0) return null;
    return (
      <section className="pt-4 first:pt-0">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <span className="text-xs text-muted-foreground">{items.length}</span>
        </div>
        <div className="divide-y divide-border/60">
          {items.map((n) => {
            const meta = notificationMeta[n.category];
            const tone = notificationToneMeta[n.tone];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                className="flex w-full items-start gap-3 py-4 text-left transition first:pt-0 last:pb-0"
                onClick={() => onNotificationClick(n.id)}
                type="button"
              >
                <div className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl", meta.className)}>
                  <Icon className="size-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]", tone.className)}>{tone.label}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{n.message}</p>
                    </div>
                    {n.unread ? <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" /> : null}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{n.timeLabel}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                      {n.actionLabel}
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative flex size-10 items-center justify-center rounded-xl border border-border/80 bg-card/65 text-muted-foreground transition hover:border-border hover:text-foreground"
          type="button"
        >
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <>
              <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
              <span className="sr-only">{unreadCount} unread</span>
            </>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent
        className="safe-bottom max-h-[88svh] gap-0 overflow-hidden rounded-t-[30px] border-border/80 bg-card px-0 pb-0 pt-0 text-card-foreground"
        side="bottom"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border/70 px-5 pb-4 pt-3">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border/80" />
            <div className="flex items-start justify-between gap-3 pr-12">
              <div>
                <SheetTitle className="text-base">Notification inbox</SheetTitle>
                <SheetDescription className="mt-1 leading-5">
                  Important account changes and money updates.
                </SheetDescription>
              </div>
              <button
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-border/70 px-3 text-xs font-medium text-muted-foreground transition hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                disabled={unreadCount === 0}
                onClick={onMarkAllAsRead}
                type="button"
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">{unreadCount} new</span>
              <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">{notifications.length} total</span>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-2">
            {renderGroup(unread, "New")}
            {renderGroup(earlier, "Earlier")}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileProfileSheet() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isDark = resolvedTheme === "dark";
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || null;
  const ThemeIcon =
    resolvedTheme === "dark" ? SunMedium : resolvedTheme === "light" ? MoonStar : Monitor;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open account menu"
          className="flex size-10 items-center justify-center rounded-xl border border-border/80 bg-card/65 text-muted-foreground transition hover:border-border hover:text-foreground"
          type="button"
        >
          <User className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        className="safe-bottom max-h-[75svh] gap-0 overflow-hidden rounded-t-[30px] border-border/80 bg-card px-0 pb-0 pt-0 text-card-foreground"
        side="bottom"
      >
        <div className="flex flex-col">
          <div className="border-b border-border/70 px-5 pb-4 pt-3">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border/80" />
            <SheetTitle className="text-base">{displayName ?? "My account"}</SheetTitle>
            <SheetDescription className="mt-0.5 leading-5">
              Manage your account and preferences.
            </SheetDescription>
          </div>
          <div className="overflow-y-auto px-3 py-3">
            <div className="space-y-1">
              {accountNavigation.map((item) => {
                const Icon = item.icon;
                const target = item.href.includes("#")
                  ? item.href.split("#")[1]
                  : "overview";
                return (
                  <SettingsLink
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80"
                    target={target as SettingsTarget}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{item.title}</span>
                  </SettingsLink>
                );
              })}
            </div>
            <div className="my-2 border-t border-border/70" />
            <button
              className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80"
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
              className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:opacity-70"
              disabled={isSigningOut}
              onClick={handleSignOut}
              type="button"
            >
              <LogOut className="size-4" />
              <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function AppTopbar() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () =>
    setNotifications((cur) => cur.map((n) => ({ ...n, unread: false })));

  const handleNotificationClick = (id: string) =>
    setNotifications((cur) =>
      cur.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/92 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <AppLogo compact />
        <div className="ml-auto flex items-center gap-2">
          <MobileNotificationSheet
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllAsRead={markAllAsRead}
            onNotificationClick={handleNotificationClick}
          />
          <MobileProfileSheet />
        </div>
      </div>
    </header>
  );
}
