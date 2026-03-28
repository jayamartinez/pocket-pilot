"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeAlert,
  Bell,
  CheckCheck,
  ChevronRight,
  Compass,
  CreditCard,
  Lightbulb,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/shared/app-logo";
import { ProfileMenu } from "@/components/shell/profile-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { appNavigation } from "@/lib/constants/navigation";
import { appSummary, mockNotifications, type NotificationRecord } from "@/lib/mock-data";
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

function NotificationList({
  notifications,
  onNotificationClick,
}: {
  notifications: NotificationRecord[];
  onNotificationClick: (id: string) => void;
}) {
  const unread = notifications.filter((n) => n.unread);
  const earlier = notifications.filter((n) => !n.unread);

  const renderGroup = (items: NotificationRecord[], label: string) => {
    if (items.length === 0) return null;
    return (
      <section className="pt-3 first:pt-0">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <span className="text-xs text-muted-foreground">{items.length}</span>
        </div>
        <div className="space-y-2">
          {items.map((n) => {
            const meta = notificationMeta[n.category];
            const tone = notificationToneMeta[n.tone];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[22px] border px-3 py-3 text-left transition",
                  n.unread
                    ? "border-border/80 bg-card shadow-[0_10px_30px_rgb(0_0_0_/_0.08)] hover:border-border hover:bg-muted/35"
                    : "border-transparent bg-transparent hover:border-border/60 hover:bg-muted/35",
                )}
                onClick={() => onNotificationClick(n.id)}
                type="button"
              >
                <div className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl", meta.className)}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]", tone.className)}>{tone.label}</span>
                      </div>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">{n.message}</p>
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
    <div className="max-h-[26rem] overflow-y-auto bg-background/95 p-3">
      {renderGroup(unread, "New")}
      {renderGroup(earlier, "Earlier")}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () =>
    setNotifications((cur) => cur.map((n) => ({ ...n, unread: false })));

  const handleNotificationClick = (id: string) =>
    setNotifications((cur) =>
      cur.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

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

      {/* Top controls: notifications + profile */}
      <div className="mt-5 space-y-2 xl:mt-6">
        {/* Profile / account */}
        <ProfileMenu />

        {/* Notifications */}
        <Dialog>
          <DialogContent className="overflow-hidden rounded-[28px] border-border/80 p-0 sm:max-w-[44rem]">
            <DialogHeader className="border-b border-border/70 bg-card/95 px-4 py-4 pr-12">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <DialogTitle className="text-sm font-semibold text-foreground">Notifications</DialogTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {unreadCount > 0
                      ? `${unreadCount} new alerts need your attention`
                      : "You are all caught up"}
                  </p>
                </div>
                <button
                  className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-border/70 px-3 text-xs font-medium text-muted-foreground transition hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={unreadCount === 0}
                  onClick={markAllAsRead}
                  type="button"
                >
                  <CheckCheck className="size-3.5" />
                  Mark all read
                </button>
              </div>
            </DialogHeader>
            <NotificationList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />
          </DialogContent>
          <DialogTrigger asChild>
            <button
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
              className="relative flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/65 px-2.5 text-muted-foreground transition hover:border-border hover:bg-muted/60 hover:text-foreground data-[state=open]:border-border data-[state=open]:bg-muted/70 data-[state=open]:text-foreground"
              type="button"
            >
              <Bell className="size-4 shrink-0" />
              <span className="hidden min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground xl:block">
                Notifications
              </span>
              {unreadCount > 0 ? (
                <>
                  <span className="hidden size-5 shrink-0 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white xl:flex">
                    {unreadCount}
                  </span>
                  <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger xl:hidden" />
                </>
              ) : null}
            </button>
          </DialogTrigger>
        </Dialog>
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
