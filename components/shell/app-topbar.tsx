"use client";

import { forwardRef, type ComponentProps, useState } from "react";
import {
  BadgeAlert,
  Bell,
  CheckCheck,
  ChevronRight,
  CreditCard,
  Lightbulb,
  Search,
  ShieldAlert,
  Wallet,
} from "lucide-react";

import { AppLogo } from "@/components/shared/app-logo";
import { ProfileMenu } from "@/components/shell/profile-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  mockNotifications,
  type NotificationRecord,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const notificationMeta = {
  budget: {
    icon: BadgeAlert,
    className: "bg-danger/12 text-danger ring-1 ring-inset ring-danger/20",
  },
  income: {
    icon: Wallet,
    className:
      "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400",
  },
  insight: {
    icon: Lightbulb,
    className: "bg-primary/12 text-primary ring-1 ring-inset ring-primary/20",
  },
  security: {
    icon: ShieldAlert,
    className:
      "bg-amber-500/12 text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400",
  },
  subscription: {
    icon: CreditCard,
    className:
      "bg-sky-500/12 text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-400",
  },
} as const;

const notificationToneMeta = {
  critical: {
    label: "Urgent",
    className: "bg-danger/10 text-danger",
  },
  warning: {
    label: "Needs review",
    className: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
  positive: {
    label: "Good news",
    className: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
  info: {
    label: "Update",
    className: "bg-primary/10 text-primary",
  },
} as const;

const NotificationsBellButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { unreadCount: number }
>(function NotificationsBellButton(
  { className, type = "button", unreadCount, ...props },
  ref,
) {
  return (
    <button
      aria-label={
        unreadCount > 0
          ? `Open notifications, ${unreadCount} unread`
          : "Open notifications"
      }
      className={cn(
        "relative flex size-10 items-center justify-center rounded-xl border border-border/80 bg-card/65 text-muted-foreground transition hover:border-border hover:text-foreground data-[state=open]:border-border data-[state=open]:bg-card",
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      <Bell className="size-4" />
      {unreadCount > 0 ? (
        <>
          <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
          <span className="sr-only">{unreadCount} unread notifications</span>
        </>
      ) : null}
    </button>
  );
});

NotificationsBellButton.displayName = "NotificationsBellButton";

interface NotificationListSectionProps {
  mobile?: boolean;
  notifications: NotificationRecord[];
  onNotificationClick: (notificationId: string) => void;
  title: string;
}

function NotificationListSection({
  mobile = false,
  notifications,
  onNotificationClick,
  title,
}: NotificationListSectionProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <section className={cn(mobile ? "pt-4 first:pt-0" : "pt-3 first:pt-0")}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <span className="text-xs text-muted-foreground">
          {notifications.length}
        </span>
      </div>

      <div className={cn(mobile ? "divide-y divide-border/60" : "space-y-2")}>
        {notifications.map((notification) => {
          const meta = notificationMeta[notification.category];
          const tone = notificationToneMeta[notification.tone];
          const Icon = meta.icon;

          return (
            <button
              key={notification.id}
              className={cn(
                "flex w-full items-start gap-3 text-left transition",
                mobile
                  ? "py-4 first:pt-0 last:pb-0"
                  : notification.unread
                    ? "rounded-[22px] border border-border/80 bg-card px-3 py-3 shadow-[0_10px_30px_rgb(0_0_0_/_0.08)] hover:border-border hover:bg-muted/35"
                    : "rounded-[22px] border border-transparent bg-transparent px-3 py-3 hover:border-border/60 hover:bg-muted/35",
              )}
              onClick={() => onNotificationClick(notification.id)}
              type="button"
            >
              <div
                className={cn(
                  "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl",
                  meta.className,
                )}
              >
                <Icon className="size-[18px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {notification.title}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                          tone.className,
                        )}
                      >
                        {tone.label}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1 leading-5 text-muted-foreground",
                        mobile ? "text-[13px]" : "text-sm",
                      )}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {notification.unread ? (
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    {notification.timeLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                    {notification.actionLabel}
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
}

interface NotificationCenterContentProps {
  mobile?: boolean;
  notifications: NotificationRecord[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (notificationId: string) => void;
  unreadCount: number;
}

function NotificationCenterContent({
  mobile = false,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
  unreadCount,
}: NotificationCenterContentProps) {
  const unreadNotifications = notifications.filter((item) => item.unread);
  const earlierNotifications = notifications.filter((item) => !item.unread);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          "border-b border-border/70",
          mobile ? "px-5 pb-4 pt-3" : "bg-card/95 px-4 py-4",
        )}
      >
        {mobile ? (
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border/80" />
        ) : null}

        <div className={cn("flex items-start justify-between gap-3", mobile && "pr-12")}>
          <div className="min-w-0">
            {mobile ? (
              <>
                <SheetTitle className="text-base">Notification inbox</SheetTitle>
                <SheetDescription className="mt-1 leading-5">
                  Important account changes and money updates show up here first.
                </SheetDescription>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">
                  Notifications
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} new alerts need your attention`
                    : "You are all caught up"}
                </p>
              </>
            )}
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

        {mobile ? (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
              {unreadCount} new
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
              {notifications.length} total
            </span>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          mobile ? "px-5 pb-6 pt-2" : "max-h-[26rem] bg-background/95 p-3",
        )}
      >
        <NotificationListSection
          mobile={mobile}
          notifications={unreadNotifications}
          onNotificationClick={onNotificationClick}
          title="New"
        />
        <NotificationListSection
          mobile={mobile}
          notifications={earlierNotifications}
          onNotificationClick={onNotificationClick}
          title="Earlier"
        />
      </div>
    </div>
  );
}

export function AppTopbar() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false })),
    );
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, unread: false } : item,
      ),
    );
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 lg:px-6">
        <div className="lg:hidden">
          <AppLogo compact />
        </div>

        <div className="relative hidden min-w-0 flex-1 md:block lg:max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 border-border/80 bg-card/60 pl-10"
            placeholder="Search merchants, categories, or accounts"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <Popover>
              <PopoverTrigger asChild>
                <NotificationsBellButton unreadCount={unreadCount} />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[24rem] overflow-hidden rounded-[28px] border-border/80 p-0"
                sideOffset={10}
              >
                <NotificationCenterContent
                  notifications={notifications}
                  onMarkAllAsRead={markAllAsRead}
                  onNotificationClick={handleNotificationClick}
                  unreadCount={unreadCount}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <NotificationsBellButton unreadCount={unreadCount} />
              </SheetTrigger>
              <SheetContent
                className="safe-bottom max-h-[88svh] gap-0 overflow-hidden rounded-t-[30px] border-border/80 bg-card px-0 pb-0 pt-0 text-card-foreground"
                side="bottom"
              >
                <NotificationCenterContent
                  mobile
                  notifications={notifications}
                  onMarkAllAsRead={markAllAsRead}
                  onNotificationClick={handleNotificationClick}
                  unreadCount={unreadCount}
                />
              </SheetContent>
            </Sheet>
          </div>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
