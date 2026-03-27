import { PageHeader } from "@/components/shared/page-header";
import { TransactionsExplorer } from "@/components/transactions/transactions-explorer";
import { transactions } from "@/lib/mock-data";

export default function TransactionsPage() {
  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader title="Transactions" />
      <TransactionsExplorer transactions={transactions} />
    </div>
  );
}
