"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { ArrowUpRight, Bell, CreditCard, Globe, LogOut, Mail, Monitor, PencilLine, Phone, RefreshCw, ShieldCheck, Smartphone, Trash2, Unplug, WalletCards } from "lucide-react";
import { useTheme } from "next-themes";

import { EmailDialog, NameDialog, PhoneDialog } from "@/components/settings/account-dialogs";
import type { SettingsTarget } from "@/components/settings/settings-targets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/format";
import { billingSummary, connectedAccounts, connectedInstitutions, settingsPreferenceDefaults } from "@/lib/mock-data";
import type { CurrencyPreference, DateFormatPreference, SettingsPreferences, ThemePreference } from "@/lib/types/settings";
import { cn } from "@/lib/utils";

const SETTINGS_PREFS_STORAGE_KEY = "pocketpilot.settings.preferences";
type AccountDialogType = "email" | "name" | "phone" | null;

interface SessionActivitySnapshot {
  browserName?: string;
  browserVersion?: string;
  city?: string;
  country?: string;
  deviceType?: string;
  ipAddress?: string;
  isMobile?: boolean;
}

interface SessionWithActivitySnapshot {
  abandonAt: Date;
  expireAt: Date;
  id: string;
  lastActiveAt: Date;
  latestActivity: SessionActivitySnapshot;
  revoke: () => Promise<unknown>;
  status: string;
}

export function SettingsContent() {
  const { user, isLoaded } = useUser();
  const { sessionId } = useAuth();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

  const [activeDialog, setActiveDialog] = useState<AccountDialogType>(null);
  const [preferences, setPreferences] = useState<SettingsPreferences>(settingsPreferenceDefaults);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [sessions, setSessions] = useState<SessionWithActivitySnapshot[]>([]);
  const [sessionsState, setSessionsState] = useState<"error" | "loaded" | "loading">("loading");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionActionId, setSessionActionId] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const loadSessions = async (targetUser = user) => {
    if (!targetUser) {
      return;
    }

    setSessionsState("loading");
    setSessionError(null);

    try {
      setSessions(await targetUser.getSessions());
      setSessionsState("loaded");
    } catch (error) {
      setSessionError(getErrorMessage(error, "Unable to load session visibility right now."));
      setSessionsState("error");
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setSessionsState("loading");
    setSessionError(null);

    void user
      .getSessions()
      .then((nextSessions) => {
        setSessions(nextSessions);
        setSessionsState("loaded");
      })
      .catch((error) => {
        setSessionError(getErrorMessage(error, "Unable to load session visibility right now."));
        setSessionsState("error");
      });
  }, [user]);

  useEffect(() => {
    if (preferencesLoaded || typeof window === "undefined") {
      return;
    }

    const fallbackTheme = normalizeThemePreference(theme);
    const rawPreferences = window.localStorage.getItem(SETTINGS_PREFS_STORAGE_KEY);

    if (!rawPreferences) {
      setPreferences({ ...settingsPreferenceDefaults, theme: fallbackTheme });
      setPreferencesLoaded(true);
      return;
    }

    try {
      const nextPreferences = sanitizePreferences(JSON.parse(rawPreferences), fallbackTheme);
      setPreferences(nextPreferences);

      if (nextPreferences.theme !== fallbackTheme) {
        setTheme(nextPreferences.theme);
      }
    } catch {
      setPreferences({ ...settingsPreferenceDefaults, theme: fallbackTheme });
    } finally {
      setPreferencesLoaded(true);
    }
  }, [preferencesLoaded, setTheme, theme]);

  useEffect(() => {
    if (preferencesLoaded && typeof window !== "undefined") {
      window.localStorage.setItem(SETTINGS_PREFS_STORAGE_KEY, JSON.stringify(preferences));
    }
  }, [preferences, preferencesLoaded]);

  const currentSession = useMemo(
    () => sessions.find((session) => session.id === sessionId) ?? null,
    [sessionId, sessions],
  );
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName || user?.primaryEmailAddress?.emailAddress);
  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? "Not provided";
  const primaryPhone = user?.primaryPhoneNumber?.phoneNumber
    ? formatPhoneNumber(user.primaryPhoneNumber.phoneNumber)
    : "Not added";
  const hasMultipleSessions = sessions.length > 1;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone.",
    );
    if (!confirmed) return;
    setIsDeletingAccount(true);
    try {
      await user.delete();
      await signOut({ redirectUrl: "/" });
    } catch {
      setIsDeletingAccount(false);
    }
  };

  const handleSessionRevoke = async (targetSession: SessionWithActivitySnapshot) => {
    setSessionActionId(targetSession.id);
    setSessionError(null);

    try {
      await targetSession.revoke();
      await loadSessions();
    } catch (error) {
      setSessionError(getErrorMessage(error, "Unable to sign out that session."));
    } finally {
      setSessionActionId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <SettingsSection sectionId="account" title="Account">
          <SurfaceCard>
            {!isLoaded ? (
              <div className="space-y-3">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : (
              <>
                <AccountFieldRow actionLabel={displayName ? "Edit" : "Add"} icon={<PencilLine className="size-4 text-primary" />} label="Name" onAction={() => setActiveDialog("name")} value={displayName || "Not provided"} />
                <AccountFieldRow actionLabel="Edit" badge={<Badge variant={user?.primaryEmailAddress?.verification.status === "verified" ? "success" : "warning"}>{user?.primaryEmailAddress?.verification.status === "verified" ? "Verified" : "Pending"}</Badge>} icon={<Mail className="size-4 text-primary" />} label="Email" onAction={() => setActiveDialog("email")} value={primaryEmail} />
                <AccountFieldRow actionLabel={user?.primaryPhoneNumber ? "Edit" : "Add"} badge={user?.primaryPhoneNumber ? <Badge variant={user.primaryPhoneNumber.verification.status === "verified" ? "success" : "outline"}>{user.primaryPhoneNumber.verification.status === "verified" ? "Verified" : "Pending"}</Badge> : <Badge variant="outline">Optional</Badge>} icon={<Phone className="size-4 text-primary" />} isLast label="Phone" onAction={() => setActiveDialog("phone")} value={primaryPhone} />
              </>
            )}
          </SurfaceCard>
        </SettingsSection>

        <SettingsSection sectionId="security" title="Security">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            <SurfaceCard>
              {!isLoaded || sessionsState === "loading" ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-10 w-36" />
                </div>
              ) : currentSession ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {(() => { const Icon = getSessionDeviceIcon(currentSession.latestActivity); return <Icon className="size-4" />; })()}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{formatSessionDevice(currentSession)}</p>
                        <p className="text-sm text-muted-foreground">{formatSessionLocation(currentSession)}</p>
                      </div>
                    </div>
                    <Badge variant="success">This device</Badge>
                  </div>
                  <div className="mt-4">
                    <Button disabled={isSigningOut} onClick={handleSignOut} size="sm" variant="secondary">
                      <LogOut className="size-3.5" />
                      {isSigningOut ? "Signing out..." : "Sign out current session"}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">Current session data has not loaded yet.</p>
              )}
            </SurfaceCard>
          </div>

          <SurfaceCard>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Active sessions</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {hasMultipleSessions
                    ? "Review other signed-in devices and end access where needed."
                    : "No other active sessions detected."}
                </p>
              </div>
              <Badge variant="outline">
                {sessionsState === "loaded" ? `${sessions.length} session${sessions.length === 1 ? "" : "s"}` : "Loading"}
              </Badge>
            </div>

            {sessionsState === "loading" ? (
              <div className="mt-4 space-y-3">
                <Skeleton className="h-18" />
                <Skeleton className="h-18" />
              </div>
            ) : sessionError ? (
              <div className="mt-4 rounded-2xl border border-danger/30 bg-danger/8 px-4 py-3">
                <p className="text-sm text-danger">{sessionError}</p>
                <Button className="mt-3" onClick={() => void loadSessions()} size="sm" variant="secondary">
                  Retry
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {sessions.map((session) => {
                  const isCurrent = session.id === sessionId;
                  const SessionIcon = getSessionDeviceIcon(session.latestActivity);

                  return (
                    <div className="flex flex-col gap-3 rounded-[20px] border border-border/75 bg-background/55 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between" key={session.id}>
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <SessionIcon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-semibold text-foreground">{formatSessionDevice(session)}</p>
                            <Badge variant={isCurrent ? "default" : "outline"}>{isCurrent ? "This device" : session.status}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatSessionLocation(session)} / Last active {formatDateTime(session.lastActiveAt)}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            Expires {formatDateTime(session.expireAt)}
                          </p>
                        </div>
                      </div>

                      {isCurrent ? null : (
                        <Button disabled={sessionActionId === session.id} onClick={() => void handleSessionRevoke(session)} size="sm" variant="outline">
                          <LogOut className="size-3.5" />
                          {sessionActionId === session.id ? "Signing out..." : "Sign out session"}
                        </Button>
                      )}
                    </div>
                  );
                })}

                {!hasMultipleSessions ? (
                  <div className="rounded-[20px] border border-border/75 bg-surface-subtle/25 px-4 py-3 text-sm leading-6 text-muted-foreground">
                    No other active sessions are currently available to revoke.
                  </div>
                ) : null}
              </div>
            )}
          </SurfaceCard>
        </SettingsSection>

        <SettingsSection sectionId="billing" title="Billing">
          <div className="rounded-[24px] border border-border/80 bg-surface-subtle/40 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CreditCard className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current plan</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{billingSummary.currentPlan}</p>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>

              </div>

              <div className="rounded-2xl border border-border/80 bg-card/70 px-4 py-3 sm:min-w-40">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Monthly cost</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {formatCurrency(billingSummary.monthlyCost)}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2">
              <DetailBlock label="Billing date" value={formatDate(billingSummary.nextBillingDate)} />
              <DetailBlock label="Payment method" value={billingSummary.paymentMethod} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button disabled size="sm" variant="secondary">Change plan</Button>
              <Button disabled size="sm" variant="ghost">Cancel subscription</Button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection sectionId="connections" title="Connected Accounts">
          <div className="overflow-hidden rounded-[22px] border border-border/80 bg-surface-subtle/35">
            {connectedInstitutions.map((institution, index) => {
              const isHealthy = institution.status === "healthy";

              return (
                <div key={institution.id}>
                  <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          {isHealthy ? <ShieldCheck className="size-4" /> : <WalletCards className="size-4" />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{institution.institutionName}</p>
                          <p className="text-sm text-muted-foreground">{institution.accountCount} linked accounts</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:justify-end">
                      <p className="text-sm text-muted-foreground">Updated {formatDate(institution.lastSyncAt)}</p>
                      <Badge variant={isHealthy ? "success" : "danger"}>
                        {isHealthy ? "Connected" : "Action needed"}
                      </Badge>
                    </div>
                  </div>

                  {index < connectedInstitutions.length - 1 ? <div className="border-b border-border/70" /> : null}
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {connectedAccounts.map((account) => (
              <div className="rounded-[22px] border border-border/80 bg-surface-subtle/25 px-4 py-3.5" key={account.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{account.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {account.institutionName} / {account.type}
                    </p>
                  </div>
                  <Badge variant={account.syncStatus === "healthy" ? "success" : "danger"}>
                    {account.syncStatus === "healthy" ? "Healthy" : "Needs action"}
                  </Badge>
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">{formatCurrency(account.currentBalance)}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {account.subtype} / **** {account.mask}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button disabled size="sm" variant="secondary">
                    <RefreshCw className="size-3.5" />
                    Refresh
                  </Button>
                  {account.syncStatus === "healthy" ? null : (
                    <Button disabled size="sm" variant="outline">
                      <ArrowUpRight className="size-3.5" />
                      Update credentials
                    </Button>
                  )}
                  <Button disabled size="sm" variant="ghost">
                    <Unplug className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection sectionId="preferences" title="Preferences">
          <div className="grid gap-3 lg:grid-cols-3">
            <PreferenceSelectCard icon={<WalletCards className="size-4 text-primary" />} label="Currency" onChange={(value) => setPreferences((current) => ({ ...current, currency: value as CurrencyPreference }))} options={[{ label: `USD / ${getCurrencyPreview("USD")}`, value: "USD" }, { label: `EUR / ${getCurrencyPreview("EUR")}`, value: "EUR" }, { label: `GBP / ${getCurrencyPreview("GBP")}`, value: "GBP" }]} value={preferences.currency} />
            <PreferenceSelectCard icon={<Globe className="size-4 text-primary" />} label="Date format" onChange={(value) => setPreferences((current) => ({ ...current, dateFormat: value as DateFormatPreference }))} options={[{ label: `Month / Day / Year / ${getDatePreview("month-day-year")}`, value: "month-day-year" }, { label: `Day / Month / Year / ${getDatePreview("day-month-year")}`, value: "day-month-year" }, { label: `Year / Month / Day / ${getDatePreview("year-month-day")}`, value: "year-month-day" }]} value={preferences.dateFormat} />
            <PreferenceSelectCard icon={<Monitor className="size-4 text-primary" />} label="Theme" onChange={(value) => { setPreferences((current) => ({ ...current, theme: value as ThemePreference })); setTheme(value as ThemePreference); }} options={[{ label: "System", value: "system" }, { label: "Dark", value: "dark" }, { label: "Light", value: "light" }]} value={preferences.theme} />
          </div>

          <div className="overflow-hidden rounded-[22px] border border-border/80 bg-surface-subtle/35">
            <PreferenceToggleRow description="Surface overspend and threshold changes inside the product." enabled={preferences.budgetAlerts} icon={<Bell className="size-4 text-primary" />} label="Budget alerts" onToggle={() => setPreferences((current) => ({ ...current, budgetAlerts: !current.budgetAlerts }))} />
            <PreferenceToggleRow description="Keep a compact weekly summary flow ready for the next backend pass." enabled={preferences.weeklyDigest} icon={<Mail className="size-4 text-primary" />} label="Weekly digest" onToggle={() => setPreferences((current) => ({ ...current, weeklyDigest: !current.weeklyDigest }))} />
            <PreferenceToggleRow description="Track financial account reconnect and sync health updates." enabled={preferences.syncAlerts} icon={<ShieldCheck className="size-4 text-primary" />} isLast label="Sync alerts" onToggle={() => setPreferences((current) => ({ ...current, syncAlerts: !current.syncAlerts }))} />
          </div>
        </SettingsSection>

        <SettingsSection sectionId="danger" title="Danger Zone">
          <SurfaceCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">Sign out</p>
                <p className="text-sm text-muted-foreground">End the current session and return to the landing page.</p>
              </div>
              <Button disabled={isSigningOut} onClick={handleSignOut} size="sm" variant="danger">
                <LogOut className="size-3.5" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">Delete account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This cannot be undone.</p>
              </div>
              <Button disabled={isDeletingAccount || !isLoaded} onClick={handleDeleteAccount} size="sm" variant="danger">
                <Trash2 className="size-3.5" />
                {isDeletingAccount ? "Deleting..." : "Delete account"}
              </Button>
            </div>
          </SurfaceCard>
        </SettingsSection>
      </div>

      {user ? (
        <>
          <NameDialog onOpenChange={(open) => setActiveDialog(open ? "name" : null)} open={activeDialog === "name"} user={user} />
          <EmailDialog onOpenChange={(open) => setActiveDialog(open ? "email" : null)} open={activeDialog === "email"} user={user} />
          <PhoneDialog onOpenChange={(open) => setActiveDialog(open ? "phone" : null)} open={activeDialog === "phone"} user={user} />
        </>
      ) : null}
    </>
  );
}

function SettingsSection({ title, description, sectionId, action, children }: { action?: ReactNode; children: ReactNode; description?: string; sectionId: Exclude<SettingsTarget, "overview">; title: string; }) {
  return (
    <section className="space-y-4 scroll-mt-24" data-settings-section={sectionId} id={sectionId}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SurfaceCard({ children }: { children: ReactNode }) {
  return <div className="rounded-[24px] border border-border/80 bg-surface-subtle/30 p-4 sm:p-5">{children}</div>;
}

function AccountFieldRow({ label, value, icon, actionLabel, badge, onAction, isLast }: { actionLabel: string; badge?: ReactNode; icon: ReactNode; isLast?: boolean; label: string; onAction: () => void; value: string; }) {
  return (
    <div className={cn("flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between", !isLast && "border-b border-border/70")}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            {badge}
          </div>
          <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
        </div>
      </div>
      <Button className="sm:shrink-0" onClick={onAction} size="sm" variant="ghost">
        <PencilLine className="size-3.5" />
        {actionLabel}
      </Button>
    </div>
  );
}

function SecurityLine({ icon, title, children }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <div className="rounded-[20px] border border-border/75 bg-background/55 px-4 py-3">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/75 bg-card/55 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function PreferenceSelectCard({ label, value, options, onChange, icon }: { icon: ReactNode; label: string; onChange: (value: string) => void; options: Array<{ label: string; value: string }>; value: string; }) {
  return (
    <div className="rounded-[22px] border border-border/80 bg-surface-subtle/25 px-4 py-3.5">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      </div>
      <Select className="mt-3" onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

function PreferenceToggleRow({ label, description, icon, enabled, onToggle, isLast }: { description: string; enabled: boolean; icon: ReactNode; isLast?: boolean; label: string; onToggle: () => void; }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5", !isLast && "border-b border-border/70")}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>

      <button
        aria-checked={enabled}
        className={cn("relative inline-flex h-7 w-12 shrink-0 rounded-full border transition", enabled ? "border-primary/30 bg-primary/80" : "border-border bg-background/70")}
        onClick={onToggle}
        role="switch"
        type="button"
      >
        <span className={cn("absolute top-0.5 inline-flex size-5 items-center justify-center rounded-full bg-white text-[10px] text-primary shadow transition", enabled ? "left-[1.45rem]" : "left-0.5")}>
          {enabled ? "" : ""}
        </span>
      </button>
    </div>
  );
}

function sanitizePreferences(value: unknown, fallbackTheme: ThemePreference): SettingsPreferences {
  const record = typeof value === "object" && value !== null ? (value as Partial<SettingsPreferences>) : {};
  return {
    budgetAlerts: typeof record.budgetAlerts === "boolean" ? record.budgetAlerts : settingsPreferenceDefaults.budgetAlerts,
    currency: record.currency === "EUR" || record.currency === "GBP" || record.currency === "USD" ? record.currency : settingsPreferenceDefaults.currency,
    dateFormat: record.dateFormat === "day-month-year" || record.dateFormat === "month-day-year" || record.dateFormat === "year-month-day" ? record.dateFormat : settingsPreferenceDefaults.dateFormat,
    syncAlerts: typeof record.syncAlerts === "boolean" ? record.syncAlerts : settingsPreferenceDefaults.syncAlerts,
    theme: normalizeThemePreference(record.theme ?? fallbackTheme),
    weeklyDigest: typeof record.weeklyDigest === "boolean" ? record.weeklyDigest : settingsPreferenceDefaults.weeklyDigest,
  };
}

function normalizeThemePreference(value: unknown): ThemePreference {
  return value === "light" || value === "system" ? value : "dark";
}

function getDisplayName(user: ReturnType<typeof useUser>["user"]) {
  return user ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username || "" : "";
}

function getInitials(value: string | null | undefined) {
  return (value ?? "PocketPilot").split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((segment) => segment[0]?.toUpperCase() ?? "").join("") || "PP";
}

function getSessionDeviceIcon(activity: SessionActivitySnapshot) {
  const deviceType = activity.deviceType?.toLowerCase() ?? "";
  return activity.isMobile || deviceType.includes("mobile") || deviceType.includes("phone") ? Smartphone : Monitor;
}

function formatSessionDevice(session: SessionWithActivitySnapshot) {
  const browserLabel = session.latestActivity.browserName ? `${session.latestActivity.browserName}${session.latestActivity.browserVersion ? ` ${session.latestActivity.browserVersion}` : ""}` : "Browser session";
  const deviceLabel = session.latestActivity.deviceType && session.latestActivity.deviceType !== "unknown" ? session.latestActivity.deviceType : session.latestActivity.isMobile ? "Mobile" : "Desktop";
  return `${browserLabel} on ${deviceLabel}`;
}

function formatSessionLocation(session: SessionWithActivitySnapshot) {
  const parts = [session.latestActivity.city, session.latestActivity.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : session.latestActivity.ipAddress || "Location unavailable";
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", hour: "numeric", minute: "2-digit", month: "short", year: "numeric" }).format(value);
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "errors" in error && Array.isArray((error as { errors?: Array<{ longMessage?: string; message?: string }> }).errors)) {
    const clerkError = (error as { errors: Array<{ longMessage?: string; message?: string }> }).errors[0];
    return clerkError?.longMessage || clerkError?.message || fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value;
}

function getCurrencyPreview(currency: CurrencyPreference) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(12430.55);
}

function getDatePreview(format: DateFormatPreference) {
  switch (format) {
    case "day-month-year":
      return "14 Apr 2026";
    case "year-month-day":
      return "2026-04-14";
    default:
      return "Apr 14, 2026";
  }
}
