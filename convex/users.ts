import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

const onboardingStepValidator = v.union(
  v.literal("welcome"),
  v.literal("connect-bank"),
  v.literal("completion"),
);

const currencyValidator = v.union(
  v.literal("USD"),
  v.literal("EUR"),
  v.literal("GBP"),
  v.literal("CAD"),
  v.literal("AUD"),
  v.literal("JPY"),
  v.literal("CHF"),
  v.literal("CNY"),
  v.literal("INR"),
  v.literal("BRL"),
  v.literal("MXN"),
  v.literal("KRW"),
);

type OnboardingStep = "welcome" | "connect-bank" | "completion";

type CurrentUser = Doc<"users"> & {
  onboardingCompleted: boolean;
  onboardingStep: OnboardingStep;
  hasConnectedBank: boolean;
  firstSyncCompleted: boolean;
  canCompleteOnboarding: boolean;
};

type IdentityPatch = {
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: OnboardingStep;
  hasConnectedBank?: boolean;
  firstSyncCompleted?: boolean;
  updatedAt?: number;
};

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication is required.");
  }
  return identity;
}

async function getUserByClerkUserId(
  ctx: QueryCtx | MutationCtx,
  clerkUserId: string,
) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
}

function normalizeCurrentUser(user: Doc<"users">): CurrentUser {
  const onboardingCompleted = user.onboardingCompleted ?? false;
  const onboardingStep = onboardingCompleted
    ? user.onboardingStep ?? "completion"
    : user.onboardingStep ?? "welcome";
  const hasConnectedBank = user.hasConnectedBank ?? false;
  const firstSyncCompleted = user.firstSyncCompleted ?? false;

  return {
    ...user,
    onboardingCompleted,
    onboardingStep,
    hasConnectedBank,
    firstSyncCompleted,
    canCompleteOnboarding: hasConnectedBank && firstSyncCompleted,
  };
}

function buildIdentityPatch(
  user: Doc<"users">,
  now: number,
  identity: Awaited<ReturnType<typeof requireIdentity>>,
) {
  const patch: IdentityPatch = {};

  if (identity?.email && identity.email !== user.email) {
    patch.email = identity.email;
  }

  if (identity?.givenName && identity.givenName !== user.firstName) {
    patch.firstName = identity.givenName;
  }

  if (identity?.familyName && identity.familyName !== user.lastName) {
    patch.lastName = identity.familyName;
  }

  if (identity?.pictureUrl && identity.pictureUrl !== user.imageUrl) {
    patch.imageUrl = identity.pictureUrl;
  }

  if (user.onboardingCompleted === undefined) {
    patch.onboardingCompleted = false;
  }

  if (!user.onboardingStep) {
    patch.onboardingStep = "welcome";
  }

  if (user.hasConnectedBank === undefined) {
    patch.hasConnectedBank = false;
  }

  if (user.firstSyncCompleted === undefined) {
    patch.firstSyncCompleted = false;
  }

  if (Object.keys(patch).length > 0) {
    patch.updatedAt = now;
  }

  return patch;
}

async function ensureCurrentUserRecord(ctx: MutationCtx) {
  const identity = await requireIdentity(ctx);
  const now = Date.now();
  const existingUser = await getUserByClerkUserId(ctx, identity.subject);

  if (!existingUser) {
    const userId = await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      email: identity.email,
      firstName: identity.givenName,
      lastName: identity.familyName,
      imageUrl: identity.pictureUrl,
      defaultCurrency: "USD",
      onboardingCompleted: false,
      onboardingStep: "welcome",
      hasConnectedBank: false,
      firstSyncCompleted: false,
      createdAt: now,
      updatedAt: now,
    });

    const createdUser = await ctx.db.get(userId);
    if (!createdUser) {
      throw new ConvexError("Unable to load the newly created user.");
    }

    return createdUser;
  }

  const identityPatch = buildIdentityPatch(existingUser, now, identity);
  if (Object.keys(identityPatch).length > 0) {
    await ctx.db.patch(existingUser._id, identityPatch);
    return {
      ...existingUser,
      ...identityPatch,
    };
  }

  return existingUser;
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await getUserByClerkUserId(ctx, identity.subject);
    return user ? normalizeCurrentUser(user) : null;
  },
});

export const getOrCreateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ensureCurrentUserRecord(ctx);
    return normalizeCurrentUser(user);
  },
});

export const updateOnboardingState = mutation({
  args: {
    onboardingStep: onboardingStepValidator,
    defaultCurrency: v.optional(currencyValidator),
  },
  handler: async (ctx, args) => {
    const user = await ensureCurrentUserRecord(ctx);

    await ctx.db.patch(user._id, {
      onboardingStep: args.onboardingStep,
      defaultCurrency: args.defaultCurrency ?? user.defaultCurrency,
      updatedAt: Date.now(),
    });

    const updatedUser = await ctx.db.get(user._id);
    if (!updatedUser) {
      throw new ConvexError("Unable to load the updated onboarding state.");
    }

    return normalizeCurrentUser(updatedUser);
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ensureCurrentUserRecord(ctx);
    const normalizedUser = normalizeCurrentUser(user);

    if (!normalizedUser.canCompleteOnboarding) {
      throw new ConvexError(
        "Connect a bank and finish the first sync before completing onboarding.",
      );
    }

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
      onboardingStep: "completion",
      updatedAt: Date.now(),
    });

    const updatedUser = await ctx.db.get(user._id);
    if (!updatedUser) {
      throw new ConvexError("Unable to finalize onboarding.");
    }

    return normalizeCurrentUser(updatedUser);
  },
});
