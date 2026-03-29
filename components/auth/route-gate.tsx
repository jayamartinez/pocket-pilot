"use client";

import { LoaderCircle } from "lucide-react";
import { startTransition, useEffect, useEffectEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/components/auth/current-user-provider";
import { AppLogo } from "@/components/shared/app-logo";
import { ErrorPanel } from "@/components/shared/error-panel";

type RouteGateMode = "app" | "onboarding";

function GateFallback({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <div className="surface-border surface-shadow w-full overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_42%),var(--card)] px-6 py-10 sm:px-10 sm:py-12">
          <AppLogo showTagline={false} />
          <div className="mt-10 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <LoaderCircle className="size-5 animate-spin" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                PocketPilot
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-[2.4rem]">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GateError({
  description,
  onRetry,
  title,
}: {
  description: string;
  onRetry: () => void;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center">
        <div className="w-full rounded-[34px] border border-border/80 bg-card/88 p-6 shadow-[0_22px_60px_rgb(17_24_39_/_0.16)] sm:p-8">
          <AppLogo showTagline={false} />
          <ErrorPanel
            actionLabel="Retry"
            className="mt-8"
            description={description}
            onAction={onRetry}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}

export function RouteGate({
  children,
  mode,
}: {
  children: ReactNode;
  mode: RouteGateMode;
}) {
  const router = useRouter();
  const { error, retry, status, user } = useCurrentUser();

  const redirect = useEffectEvent((href: string) => {
    startTransition(() => {
      router.replace(href);
    });
  });

  useEffect(() => {
    if (status !== "ready" || !user) {
      return;
    }

    if (mode === "app" && !user.onboardingCompleted) {
      redirect("/onboarding");
      return;
    }

    if (mode === "onboarding" && user.onboardingCompleted) {
      redirect("/dashboard");
    }
  }, [mode, status, user]);

  if (status === "error") {
    return (
      <GateError
        description={
          error ??
          "PocketPilot could not load the authenticated user record from Convex."
        }
        onRetry={retry}
        title="Unable to load your workspace state"
      />
    );
  }

  if (status !== "ready" || !user) {
    return (
      <GateFallback
        description="PocketPilot is creating or hydrating your Convex user record before it decides whether to open the dashboard or continue onboarding."
        title="Checking your workspace"
      />
    );
  }

  if (mode === "app" && !user.onboardingCompleted) {
    return (
      <GateFallback
        description="PocketPilot keeps the product shell locked until onboarding is complete, so you're being redirected into the setup flow."
        title="Opening onboarding"
      />
    );
  }

  if (mode === "onboarding" && user.onboardingCompleted) {
    return (
      <GateFallback
        description="Your onboarding state is already complete in Convex, so PocketPilot is taking you to the dashboard."
        title="Opening dashboard"
      />
    );
  }

  return <>{children}</>;
}
