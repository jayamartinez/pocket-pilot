export type TransactionDirection = "debit" | "credit";
export type SyncState = "healthy" | "syncing" | "requires_reauth" | "error";
export type TrendDirection = "up" | "down";
export type BudgetState = "on_track" | "warning" | "over";
export type SubscriptionFrequency = "weekly" | "monthly";

export interface DashboardMetric {
  label: string;
  amount: number;
  changeLabel: string;
  trend: TrendDirection;
}

export interface SpendingCategoryDatum {
  category: string;
  amount: number;
  color: string;
}

export interface CashFlowDatum {
  label: string;
  income: number;
  spending: number;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  plaidItemId: string;
  plaidAccountId: string;
  plaidTransactionId: string;
  accountName: string;
  date: string;
  amount: number;
  direction: TransactionDirection;
  merchantName: string;
  displayName: string;
  categoryPrimary: string;
  categoryDetailed: string;
  pending: boolean;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  id: string;
  categoryPrimary: string;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
  state: BudgetState;
}

export interface SubscriptionSummary {
  id: string;
  merchantName: string;
  averageAmount: number;
  frequency: SubscriptionFrequency;
  lastChargeDate: string;
  nextChargeDate: string;
  confidence: number;
}

export interface InstitutionSummary {
  id: string;
  plaidItemId: string;
  institutionName: string;
  accountCount: number;
  status: SyncState;
  lastSyncAt: string;
}

export interface AccountSummary {
  id: string;
  institutionName: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  currentBalance: number;
  availableBalance?: number;
  syncStatus: SyncState;
}
