import { BudgetOverview } from "@/components/budgets/budget-overview";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { budgetSummaries } from "@/lib/mock-data";

export default function BudgetsPage() {
  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader actions={<Button>Create/Edit budgets</Button>} title="Budgets" />
      <BudgetOverview budgets={budgetSummaries} />
    </div>
  );
}
