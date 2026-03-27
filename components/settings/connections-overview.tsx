import { ArrowUpRight, RefreshCw, Unplug } from "lucide-react";

import { ErrorPanel } from "@/components/shared/error-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AccountSummary, InstitutionSummary } from "@/lib/types/finance";

export function ConnectionsOverview({
  institutions,
  accounts,
}: {
  institutions: InstitutionSummary[];
  accounts: AccountSummary[];
}) {
  const hasConnectionIssue = institutions.some(
    (institution) => institution.status === "requires_reauth",
  );

  return (
    <div className="space-y-4">
      {hasConnectionIssue ? (
        <ErrorPanel
          actionLabel="Update credentials"
          description="American Express needs attention before PocketPilot can refresh new activity."
          title="One connection needs attention"
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Connected institutions</CardTitle>
          <CardDescription>
            Refresh linked accounts and fix connection issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3.5 xl:grid-cols-2">
          {institutions.map((institution) => (
            <div
              key={institution.id}
              className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {institution.institutionName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {institution.accountCount} linked accounts
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Last updated {formatDate(institution.lastSyncAt)}
                  </p>
                </div>
                <Badge variant={institution.status === "healthy" ? "success" : "danger"}>
                  {institution.status === "healthy" ? "Connected" : "Action needed"}
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                <Button size="sm" variant="secondary">
                  <RefreshCw className="size-4" />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  variant={institution.status === "healthy" ? "outline" : "danger"}
                >
                  <ArrowUpRight className="size-4" />
                  Update credentials
                </Button>
                <Button size="sm" variant="outline">
                  <Unplug className="size-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounts and balances</CardTitle>
          <CardDescription>
            Balances from each linked account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          <div className="space-y-3 md:hidden">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-2xl border border-border/80 bg-surface-subtle/55 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{account.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {account.institutionName} / {account.type}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">**** {account.mask}</p>
                  </div>
                  <Badge variant={account.syncStatus === "healthy" ? "success" : "danger"}>
                    {account.syncStatus === "healthy" ? "Connected" : "Action needed"}
                  </Badge>
                </div>
                <p className="mt-4 text-lg font-semibold text-foreground">
                  {formatCurrency(account.currentBalance)}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{account.name}</p>
                        <p className="text-sm text-muted-foreground">**** {account.mask}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {account.institutionName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {account.type} / {account.subtype}
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.syncStatus === "healthy" ? "success" : "danger"}>
                        {account.syncStatus === "healthy" ? "Connected" : "Action needed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatCurrency(account.currentBalance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
