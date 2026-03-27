import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    defaultCurrency: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  plaidItems: defineTable({
    userId: v.id("users"),
    plaidItemId: v.string(),
    institutionId: v.optional(v.string()),
    institutionName: v.string(),
    status: v.union(
      v.literal("healthy"),
      v.literal("syncing"),
      v.literal("requires_reauth"),
      v.literal("error"),
    ),
    accessTokenEncrypted: v.optional(v.string()),
    availableProducts: v.array(v.string()),
    billedProducts: v.array(v.string()),
    lastCursor: v.optional(v.string()),
    lastSuccessfulSyncAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_plaid_item_id", ["plaidItemId"]),

  accounts: defineTable({
    userId: v.id("users"),
    plaidItemId: v.id("plaidItems"),
    plaidAccountId: v.string(),
    institutionName: v.string(),
    name: v.string(),
    officialName: v.optional(v.string()),
    mask: v.optional(v.string()),
    type: v.string(),
    subtype: v.optional(v.string()),
    currentBalance: v.number(),
    availableBalance: v.optional(v.number()),
    currencyCode: v.string(),
    syncStatus: v.union(
      v.literal("healthy"),
      v.literal("syncing"),
      v.literal("requires_reauth"),
      v.literal("error"),
    ),
    lastSyncedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_plaid_item_id", ["plaidItemId"])
    .index("by_plaid_account_id", ["plaidAccountId"]),

  transactions: defineTable({
    userId: v.id("users"),
    plaidItemId: v.id("plaidItems"),
    accountId: v.id("accounts"),
    plaidAccountId: v.string(),
    plaidTransactionId: v.string(),
    date: v.string(),
    authorizedDate: v.optional(v.string()),
    amount: v.number(),
    direction: v.union(v.literal("debit"), v.literal("credit")),
    merchantName: v.optional(v.string()),
    displayName: v.string(),
    categoryPrimary: v.optional(v.string()),
    categoryDetailed: v.optional(v.string()),
    paymentChannel: v.optional(v.string()),
    pending: v.boolean(),
    isRecurring: v.boolean(),
    recurringMerchantId: v.optional(v.id("subscriptions")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_and_date", ["userId", "date"])
    .index("by_account_id_and_date", ["accountId", "date"])
    .index("by_plaid_transaction_id", ["plaidTransactionId"]),

  budgets: defineTable({
    userId: v.id("users"),
    month: v.string(),
    categoryPrimary: v.string(),
    limitAmount: v.number(),
    alertThreshold: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_and_month", ["userId", "month"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    merchantName: v.string(),
    normalizedMerchantKey: v.string(),
    categoryPrimary: v.optional(v.string()),
    frequency: v.union(v.literal("weekly"), v.literal("monthly")),
    cadenceDays: v.number(),
    averageAmount: v.number(),
    amountTolerance: v.number(),
    lastChargeDate: v.string(),
    nextChargeDate: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("watch"),
      v.literal("paused"),
      v.literal("cancelled"),
    ),
    confidence: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_and_merchant", ["userId", "normalizedMerchantKey"]),

  syncLogs: defineTable({
    userId: v.id("users"),
    plaidItemId: v.optional(v.id("plaidItems")),
    syncType: v.union(v.literal("initial"), v.literal("manual")),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("success"),
      v.literal("error"),
    ),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    transactionsAdded: v.number(),
    transactionsUpdated: v.number(),
    errorCode: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_and_started_at", ["userId", "startedAt"]),
});
