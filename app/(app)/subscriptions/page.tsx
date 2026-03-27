import { SubscriptionList } from "@/components/subscriptions/subscription-list";
import { PageHeader } from "@/components/shared/page-header";
import { subscriptionSummaries } from "@/lib/mock-data";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader title="Subscriptions" />
      <SubscriptionList subscriptions={subscriptionSummaries} />
    </div>
  );
}
