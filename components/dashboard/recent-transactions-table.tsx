import Link from "next/link";

import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { TransactionListItem } from "@/components/dashboard/transaction-list-item";
import { Card, CardContent } from "@/components/ui/card";
import type { TransactionRecord } from "@/lib/types/finance";

export function RecentTransactionsTable({
  transactions,
}: {
  transactions: TransactionRecord[];
}) {
  return (
    <Card className="h-full border-border/80">
      <CardContent className="flex h-full flex-col p-4 lg:p-3.5">
        <DashboardSectionHeader
          action={
            <Link
              className="text-sm font-medium text-primary transition hover:text-primary/80"
              href="/transactions"
            >
              View all
            </Link>
          }
          title="Recent transactions"
        />

        <div className="mt-3 flex-1 lg:mt-2.5">
          <div className="grid h-full grid-rows-4 gap-2 lg:gap-1.5">
            {transactions.slice(0, 4).map((transaction) => (
              <div key={transaction.id} className="min-h-0">
                <TransactionListItem transaction={transaction} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
