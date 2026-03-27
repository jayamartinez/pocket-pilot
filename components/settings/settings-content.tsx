import type { ReactNode } from "react";
import {
  ArrowUpRight,
  CreditCard,
  PencilLine,
  RefreshCw,
  ShieldCheck,
  Unplug,
  WalletCards,
} from "lucide-react";

import type { SettingsTarget } from "@/components/settings/settings-targets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  billingSummary,
  connectedAccounts,
  connectedInstitutions,
  settingsProfile,
} from "@/lib/mock-data";

const billingSummaryCopy =
  "Your workspace is on the active monthly plan with recurring charge tracking enabled.";

const accountFields = [
  { label: "Name", value: settingsProfile.name },
  { label: "Email", value: settingsProfile.email },
  { label: "Phone number", value: settingsProfile.phoneNumber },
] as const;

export function SettingsContent() {
  return (
    <div className="space-y-6">
      <SettingsSection
        description="Contact details tied to your PocketPilot workspace."
        sectionId="account"
        title="Account"
      >
        <div className="overflow-hidden rounded-[22px] border border-border/80 bg-surface-subtle/35">
          {accountFields.map((field, index) => (
            <SettingsField
              isLast={index === accountFields.length - 1}
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        description="Plan details, billing cadence, and payment method."
        sectionId="billing"
        title="Billing"
      >
        <div className="rounded-[24px] border border-border/80 bg-surface-subtle/40 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Current plan
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-foreground">
                      {billingSummary.currentPlan}
                    </p>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                {billingSummaryCopy}
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/70 px-4 py-3 sm:min-w-40">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Monthly cost
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {formatCurrency(billingSummary.monthlyCost)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2">
            <DetailBlock
              label="Next billing date"
              value={formatDate(billingSummary.nextBillingDate)}
            />
            <DetailBlock label="Payment method" value={billingSummary.paymentMethod} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm">Change plan</Button>
            <Button
              className="text-muted-foreground hover:text-foreground"
              size="sm"
              variant="ghost"
            >
              Cancel subscription
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        description="Linked institutions and the balances currently visible to PocketPilot."
        sectionId="connections"
        title="Connected accounts"
      >
        <div className="overflow-hidden rounded-[22px] border border-border/80 bg-surface-subtle/35">
          {connectedInstitutions.map((institution, index) => {
            const isHealthy = institution.status === "healthy";

            return (
              <div key={institution.id}>
                <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {isHealthy ? (
                          <ShieldCheck className="size-4" />
                        ) : (
                          <WalletCards className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {institution.institutionName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {institution.accountCount} linked accounts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    <p className="text-sm text-muted-foreground">
                      Updated {formatDate(institution.lastSyncAt)}
                    </p>
                    <Badge variant={isHealthy ? "success" : "danger"}>
                      {isHealthy ? "Connected" : "Action needed"}
                    </Badge>
                  </div>
                </div>

                {index < connectedInstitutions.length - 1 ? (
                  <div className="border-b border-border/70" />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {connectedAccounts.map((account) => (
            <div
              className="rounded-[22px] border border-border/80 bg-surface-subtle/25 px-4 py-3.5"
              key={account.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{account.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {account.institutionName} / {account.type}
                  </p>
                </div>
                <Badge
                  variant={account.syncStatus === "healthy" ? "success" : "danger"}
                >
                  {account.syncStatus === "healthy" ? "Healthy" : "Needs action"}
                </Badge>
              </div>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {formatCurrency(account.currentBalance)}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                **** {account.mask}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary">
                  <RefreshCw className="size-3.5" />
                  Refresh
                </Button>
                {account.syncStatus === "healthy" ? null : (
                  <Button size="sm" variant="outline">
                    <ArrowUpRight className="size-3.5" />
                    Update credentials
                  </Button>
                )}
                <Button size="sm" variant="ghost">
                  <Unplug className="size-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  sectionId,
  action,
  children,
}: {
  title: string;
  description: string;
  sectionId: Exclude<SettingsTarget, "overview">;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 scroll-mt-24" data-settings-section={sectionId} id={sectionId}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SettingsField({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
        isLast ? "" : "border-b border-border/70"
      }`}
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
      <Button className="mt-3 sm:mt-0" size="sm" variant="ghost">
        <PencilLine className="size-3.5" />
        Edit
      </Button>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/75 bg-card/55 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
