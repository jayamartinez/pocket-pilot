import { CreditCard, Settings2, UserCircle2, WalletCards } from "lucide-react";

import { ConnectionsOverview } from "@/components/settings/connections-overview";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appSummary, connectedAccounts, connectedInstitutions } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader title="Settings" />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card className="scroll-mt-24" id="profile">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserCircle2 className="size-5" />
              </div>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>Profile and workspace defaults.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Name
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {appSummary.userName}
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Workspace
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">Personal</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Default month
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {appSummary.activeBudgetMonth}
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Activity volume
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {appSummary.transactionCount} imported transactions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="scroll-mt-24" id="preferences">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Settings2 className="size-5" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Theme and display defaults.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-sm font-semibold text-foreground">Theme</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Switch between light and dark mode from the profile menu.
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-sm font-semibold text-foreground">Navigation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Product pages stay in the main nav. Account actions live here.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="scroll-mt-24" id="billing">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </div>
              <div>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Plan and payment details.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Current plan
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">PocketPilot Pro</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Billing cycle
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">Monthly</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Payment method
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">Visa ending in 4242</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="scroll-mt-24" id="connections">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <WalletCards className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Connected accounts</h2>
            <p className="text-sm text-muted-foreground">Institution status and balances.</p>
          </div>
        </div>
        <ConnectionsOverview
          accounts={connectedAccounts}
          institutions={connectedInstitutions}
        />
      </section>
    </div>
  );
}
