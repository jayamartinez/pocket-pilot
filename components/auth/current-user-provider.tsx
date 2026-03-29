"use client";

import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type CurrentUser = Doc<"users"> & {
  onboardingCompleted: boolean;
  onboardingStep: "welcome" | "connect-bank" | "completion";
  hasConnectedBank: boolean;
  firstSyncCompleted: boolean;
  canCompleteOnboarding: boolean;
};

type CurrentUserStatus = "error" | "idle" | "loading" | "ready";

type CurrentUserContextValue = {
  error: string | null;
  replaceUser: (user: CurrentUser) => void;
  retry: () => void;
  status: CurrentUserStatus;
  user: CurrentUser | null;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "PocketPilot could not load your user workspace.";
}

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId } = useClerkAuth();
  const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isSignedIn && isAuthenticated ? {} : "skip",
  );
  const getOrCreateUser = useMutation(api.users.getOrCreateCurrentUser);

  const [seedState, setSeedState] = useState<{
    user: CurrentUser | null;
    userId: string | null;
  }>({
    user: null,
    userId: null,
  });
  const [errorState, setErrorState] = useState<{
    message: string | null;
    userId: string | null;
  }>({
    message: null,
    userId: null,
  });
  const requestedUserIdRef = useRef<string | null>(null);

  const hydrateUser = useEffectEvent(async () => {
    if (!userId) {
      return;
    }
    setErrorState({ message: null, userId });
    const user = await getOrCreateUser({});
    setSeedState({ user, userId });
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    if (isConvexAuthLoading || !isAuthenticated) {
      return;
    }

    if (requestedUserIdRef.current === userId) {
      return;
    }

    requestedUserIdRef.current = userId;

    void hydrateUser().catch((caughtError) => {
      requestedUserIdRef.current = null;
      setErrorState({
        message: getErrorMessage(caughtError),
        userId,
      });
    });
  }, [isAuthenticated, isConvexAuthLoading, isLoaded, isSignedIn, userId]);

  const seedUser =
    isSignedIn && userId && seedState.userId === userId ? seedState.user : null;
  const error =
    isSignedIn && userId && errorState.userId === userId
      ? errorState.message
      : null;

  const replaceUser = useCallback((user: CurrentUser) => {
    setSeedState({ user, userId: userId ?? null });
    setErrorState({ message: null, userId: userId ?? null });
  }, [userId]);

  const retry = useCallback(() => {
    requestedUserIdRef.current = null;
    setErrorState({ message: null, userId: userId ?? null });
    if (!currentUser) {
      setSeedState({ user: null, userId: userId ?? null });
    }
  }, [currentUser, userId]);

  const user = currentUser ?? seedUser;
  const convexAuthFailed =
    isLoaded && isSignedIn && !isConvexAuthLoading && !isAuthenticated;
  const resolvedError =
    error ??
    (convexAuthFailed
      ? "PocketPilot could not establish an authenticated Convex session."
      : null);

  let status: CurrentUserStatus = "idle";
  if (resolvedError && !user) {
    status = "error";
  } else if (
    isLoaded &&
    isSignedIn &&
    (!user || isConvexAuthLoading || !isAuthenticated)
  ) {
    status = "loading";
  } else if (user) {
    status = "ready";
  }

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      error: resolvedError,
      replaceUser,
      retry,
      status,
      user,
    }),
    [replaceUser, resolvedError, retry, status, user],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider.");
  }
  return context;
}
