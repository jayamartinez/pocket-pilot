"use client";

import { useMutation } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  CircleDashed,
  Landmark,
  LayoutDashboard,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { useCurrentUser } from "@/components/auth/current-user-provider";
import { ErrorPanel } from "@/components/shared/error-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import type { CurrencyPreference } from "@/lib/types/settings";
import { cn } from "@/lib/utils";

type OnboardingStep = "welcome" | "connect-bank" | "completion";

const onboardingUiSteps = [
  { key: "welcome", label: "Welcome", shortLabel: "Intro" },
  { key: "currency", label: "Currency", shortLabel: "Currency" },
  { key: "connect-bank", label: "Connect", shortLabel: "Bank" },
  { key: "sync-preview", label: "Sync", shortLabel: "Sync" },
  { key: "budget", label: "Budget", shortLabel: "Budget" },
  { key: "completion", label: "Ready", shortLabel: "Ready" },
] as const;

type UiStep = (typeof onboardingUiSteps)[number]["key"];

const currencyOptions: Array<{
  label: string;
  name: string;
  symbol: string;
  value: CurrencyPreference;
}> = [
  { value: "USD", label: "USD", symbol: "$", name: "US Dollar" },
  { value: "EUR", label: "EUR", symbol: "€", name: "Euro" },
  { value: "GBP", label: "GBP", symbol: "£", name: "British Pound" },
  { value: "CAD", label: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { value: "AUD", label: "AUD", symbol: "A$", name: "Australian Dollar" },
  { value: "JPY", label: "JPY", symbol: "¥", name: "Japanese Yen" },
  { value: "CHF", label: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { value: "CNY", label: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { value: "INR", label: "INR", symbol: "₹", name: "Indian Rupee" },
  { value: "BRL", label: "BRL", symbol: "R$", name: "Brazilian Real" },
  { value: "MXN", label: "MXN", symbol: "Mex$", name: "Mexican Peso" },
  { value: "KRW", label: "KRW", symbol: "₩", name: "South Korean Won" },
];

const budgetModes = [
  {
    key: "focused",
    label: "Focused",
    title: "Essentials first",
    description: "Tighter limits for bills, groceries, and essentials.",
    highlights: [
      "Prioritize recurring bills and core spending",
      "Keep a smaller buffer for flexible categories",
      "Ideal for a stricter first monthly plan",
    ],
    icon: Target,
  },
  {
    key: "balanced",
    label: "Balanced",
    title: "Simple monthly guardrails",
    description: "Simple monthly targets across essentials, lifestyle, and savings.",
    highlights: [
      "Balanced split across essentials and lifestyle",
      "Easy to refine later once transactions land",
      "Good default for a first real budget",
    ],
    icon: PiggyBank,
  },
  {
    key: "track-only",
    label: "Track only",
    title: "Observe before planning",
    description: "Watch spending first, then turn patterns into budgets later.",
    highlights: [
      "See your spending patterns before setting limits",
      "Ideal if this is your first connected finance workspace",
      "Move into category budgets later from the Budgets page",
    ],
    icon: LayoutDashboard,
  },
] as const;

type BudgetMode = (typeof budgetModes)[number]["key"];

const persistedStepForUiStep: Record<UiStep, OnboardingStep> = {
  welcome: "welcome",
  currency: "welcome",
  "connect-bank": "connect-bank",
  "sync-preview": "connect-bank",
  budget: "connect-bank",
  completion: "completion",
};

const defaultUiStepForPersistedStep: Record<OnboardingStep, UiStep> = {
  welcome: "welcome",
  "connect-bank": "connect-bank",
  completion: "completion",
};

const stepSupportCopy: Record<UiStep, string> = {
  welcome:
    "",
  currency:
    "You can update this later from Settings without redoing the rest of onboarding.",
  "connect-bank": "",
  "sync-preview": "",
  budget:
    "Optional. You can adjust this later from Budgets.",
  completion: "",
};

const validCurrencies: CurrencyPreference[] = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "CNY", "INR", "BRL", "MXN", "KRW"
];

function coerceCurrency(value: string | undefined): CurrencyPreference {
  return (validCurrencies as string[]).includes(value ?? "") 
    ? (value as CurrencyPreference) 
    : "USD";
}

function getUiStepIndex(step: UiStep) {
  return onboardingUiSteps.findIndex((entry) => entry.key === step);
}

function StepIndicator({
  isActive,
  isComplete,
  label,
  shortLabel,
}: {
  isActive: boolean;
  isComplete: boolean;
  label: string;
  shortLabel: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border px-2.5 py-2 transition-colors",
        isActive
          ? "border-primary/35 bg-primary/10"
          : isComplete
            ? "border-border/70 bg-background/55"
            : "border-border/55 bg-background/35",
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
            isComplete
              ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
              : isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
          )}
        >
          {isComplete ? <BadgeCheck className="size-3" /> : shortLabel.slice(0, 1)}
        </div>
        <p className="min-w-0 truncate text-sm font-medium text-foreground">
          <span className="hidden lg:inline">{label}</span>
          <span className="lg:hidden">{shortLabel}</span>
        </p>
      </div>
    </div>
  );
}

function StepHero({
  badgeLabel,
  description,
  icon,
  title,
}: {
  badgeLabel: string;
  description: string;
  icon: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-[20px] border border-primary/20 bg-primary/10 text-primary shadow-[0_16px_40px_rgb(79_140_255_/_0.10)]">
        {icon}
      </div>
      <Badge className="mt-3" variant="outline">
        {badgeLabel}
      </Badge>
      <h1 className="mt-3 text-balance text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-[1.75rem] sm:leading-tight">
        {title}
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-pretty text-[0.9rem] leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StatusRow({
  description,
  icon,
  state,
  statusText,
  title,
}: {
  description: string;
  icon: ReactNode;
  state: "active" | "neutral" | "ready";
  statusText: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-[14px] border border-border/70 bg-background/55 px-3 py-2.5">
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg",
          state === "ready"
            ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
            : state === "active"
              ? "bg-primary/12 text-primary"
              : "bg-muted text-muted-foreground",
        )}
      >
        {state === "ready" ? <CheckCircle2 className="size-3.5" /> : icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[0.8rem] font-semibold text-foreground">{title}</p>
          <Badge
            variant={
              state === "ready"
                ? "success"
                : state === "active"
                  ? "default"
                  : "outline"
            }
          >
            {statusText}
          </Badge>
        </div>
        <p className="mt-0.5 text-[0.8rem] leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const { replaceUser, user } = useCurrentUser();
  const updateOnboardingState = useMutation(api.users.updateOnboardingState);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyPreference>(
    coerceCurrency(user?.defaultCurrency),
  );
  const [selectedBudgetMode, setSelectedBudgetMode] =
    useState<BudgetMode>("balanced");
  const [uiStep, setUiStep] = useState<UiStep>("welcome");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCurrency(coerceCurrency(user?.defaultCurrency));
  }, [user?.defaultCurrency]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (persistedStepForUiStep[uiStep] !== user.onboardingStep) {
      setUiStep(defaultUiStepForPersistedStep[user.onboardingStep]);
    }
  }, [uiStep, user]);

  if (!user) {
    return null;
  }

  const currentCurrencyMeta =
    currencyOptions.find((option) => option.value === selectedCurrency) ??
    currencyOptions[0];
  const selectedBudgetModeMeta =
    budgetModes.find((mode) => mode.key === selectedBudgetMode) ?? budgetModes[1];
  const uiStepIndex = getUiStepIndex(uiStep);

  const setPersistedStep = async (
    nextStep: OnboardingStep,
    nextCurrency?: CurrencyPreference,
  ) => {
    setError(null);
    const updatedUser = await updateOnboardingState({
      onboardingStep: nextStep,
      defaultCurrency: nextCurrency,
    });
    replaceUser(updatedUser);
  };

  const runWithPendingState = async (
    label: string,
    fallbackMessage: string,
    action: () => Promise<void>,
  ) => {
    setError(null);
    setPendingLabel(label);

    try {
      await action();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : fallbackMessage,
      );
    } finally {
      setPendingLabel(null);
    }
  };

  const handleCompleteOnboarding = async () => {
    await runWithPendingState(
      "Opening dashboard",
      "PocketPilot could not complete onboarding.",
      async () => {
        const updatedUser = await completeOnboarding({});
        replaceUser(updatedUser);
      },
    );
  };

  const renderWelcomeStep = () => (
    <>
      <StepHero
        badgeLabel="PocketPilot onboarding"
        description="A short setup pass gives balances, budgets, and recurring spend a clearer starting point before live account data arrives."
        icon={<Sparkles className="size-5" />}
        title={
          <>
            Set up the workspace that keeps your money in{" "}
            <span className="text-primary">view</span>.
          </>
        }
      />

      <div className="mt-6 flex justify-center">
        <Button
          disabled={pendingLabel !== null}
          onClick={() => {
            setError(null);
            setUiStep("currency");
          }}
          size="lg"
        >
          Get started
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </>
  );

  const renderCurrencyStep = () => {
    const topCurrencies = currencyOptions.slice(0, 3);
    const otherCurrencies = currencyOptions.slice(3);
    const isOtherSelected = otherCurrencies.some(c => c.value === selectedCurrency);
    const selectedOtherOption = otherCurrencies.find(c => c.value === selectedCurrency);
    
    return (
      <>
        <StepHero
          badgeLabel="Currency preference"
          description="This becomes the default format across balances, budgets, and reports, and it stays editable from Settings later on."
          icon={<Banknote className="size-5" />}
          title={
            <>
              Choose the currency that will frame every{" "}
              <span className="text-primary">balance</span>.
            </>
          }
        />

        <div className="mt-5 space-y-4">
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
            {topCurrencies.map((option) => (
              <button
                className={cn(
                  "rounded-[14px] border bg-background/50 p-3 text-left transition-all cursor-pointer hover:border-primary/35 hover:bg-background/65",
                  option.value === selectedCurrency && !isOtherSelected
                    ? "border-primary/45 bg-primary/10 shadow-[0_8px_16px_rgb(79_140_255_/_0.10)]"
                    : "border-border/65",
                )}
                key={option.value}
                onClick={() => setSelectedCurrency(option.value)}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-lg font-semibold">{option.symbol}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{option.value}</p>
                    <p className="truncate text-xs text-muted-foreground">{option.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className={cn(
                    "w-[200px] justify-between font-normal",
                    isOtherSelected
                      ? "bg-primary/10 text-primary hover:bg-primary/15 border-primary/45 shadow-[0_4px_12px_rgb(79_140_255_/_0.08)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isOtherSelected
                    ? `${selectedOtherOption?.name} (${selectedOtherOption?.value})`
                    : "Search other currencies..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="center" side="bottom">
                <Command>
                  <CommandInput placeholder="Search currency..." />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup>
                      {otherCurrencies.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={`${option.name} ${option.value}`}
                          onSelect={() => {
                            setSelectedCurrency(option.value);
                            setComboboxOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCurrency === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.name} ({option.value})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </>
    );
  };

  const renderConnectBankStep = () => (
    <>
      <StepHero
        badgeLabel="Bank connection"
        description="Securely link your accounts to start tracking your finances."
        icon={<Landmark className="size-5" />}
        title="Connect your bank account"
      />

      <div className="mt-5 flex justify-center">
        <div className="w-full max-w-[360px] rounded-[18px] border border-border/70 bg-background/50 px-4 py-5 text-center">
          <Button
            className="w-full justify-center"
            onClick={() => {
              setError(null);
              setUiStep("sync-preview");
            }}
            size="lg"
          >
            <Building2 className="size-4" />
            Connect bank
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Takes less than a minute
          </p>
        </div>
      </div>
    </>
  );

  const renderSyncPreviewStep = () => (
    <>
      <StepHero
        badgeLabel="Preparing your workspace"
        description="We're preparing your balances and transactions."
        icon={<CircleDashed className="size-5" />}
        title="Syncing your data"
      />

      <div className="mt-5 flex justify-center">
        <div className="w-full max-w-[420px] rounded-[18px] border border-border/70 bg-background/50 px-4 py-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-[14px] bg-card/70 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Bank connected
                </span>
              </div>
              <Badge variant={user.hasConnectedBank ? "success" : "outline"}>
                {user.hasConnectedBank ? "Done" : "Waiting"}
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[14px] bg-card/70 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CircleDashed className="size-4 animate-spin" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Syncing data
                </span>
              </div>
              <Badge variant={user.firstSyncCompleted ? "success" : "outline"}>
                {user.firstSyncCompleted ? "Done" : "In progress"}
              </Badge>
            </div>
          </div>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            This usually finishes in a moment.
          </p>
        </div>
      </div>
    </>
  );

  const renderBudgetStep = () => (
    <>
      <StepHero
        badgeLabel="Optional budget setup"
        description="Pick a starting mode. You can change it later."
        icon={<PiggyBank className="size-5" />}
        title="Choose how you want to budget."
      />

      <div className="mt-5 space-y-3">
        <div className="grid gap-2 lg:grid-cols-3">
          {budgetModes.map((mode) => {
            const ModeIcon = mode.icon;

            return (
              <button
                className={cn(
                  "rounded-[18px] border bg-background/50 p-3 text-left transition-all hover:border-primary/35 hover:bg-background/65",
                  mode.key === selectedBudgetMode
                    ? "border-primary/45 bg-primary/10 shadow-[0_12px_28px_rgb(79_140_255_/_0.10)]"
                    : "border-border/65",
                )}
                key={mode.key}
                onClick={() => setSelectedBudgetMode(mode.key)}
                type="button"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ModeIcon className="size-4" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{mode.title}</p>
                  </div>
                  <Badge
                    variant={mode.key === selectedBudgetMode ? "default" : "outline"}
                  >
                    {mode.key === selectedBudgetMode ? "Selected" : mode.label}
                  </Badge>
                </div>

                <p className="mt-2 text-[0.8rem] leading-5 text-muted-foreground">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="rounded-[18px] border border-border/70 bg-background/50 p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Selected starting mode
              </p>
              <h3 className="mt-1.5 text-[0.9rem] font-semibold text-foreground">
                {selectedBudgetModeMeta.title}
              </h3>
              <p className="mt-1 text-[0.8rem] leading-5 text-muted-foreground">
                {selectedBudgetModeMeta.description}
              </p>
            </div>

            <Badge variant="outline">Preview only</Badge>
          </div>

          <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
            {selectedBudgetModeMeta.highlights.map((highlight) => (
              <div
                className="rounded-[12px] border border-border/60 bg-card/70 px-3 py-2"
                key={highlight}
              >
                <p className="text-[0.8rem] leading-5 text-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderCompletionStep = () => (
    <>
      <StepHero
        badgeLabel={user.canCompleteOnboarding ? "Ready" : "Almost there"}
        description={
          user.canCompleteOnboarding
            ? "Your dashboard is ready to open."
            : "Your workspace is set up and waiting for live data."
        }
        icon={
          user.canCompleteOnboarding ? (
            <BadgeCheck className="size-5" />
          ) : (
            <ShieldCheck className="size-5" />
          )
        }
        title="You're ready"
      />

      <div className="mt-5 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[18px] border border-border/70 bg-background/50 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Workspace summary
          </p>
          <div className="mt-2.5 space-y-2">
            <StatusRow
              description={`${currentCurrencyMeta.name} anchors balances, budgets, and reports.`}
              icon={<Banknote className="size-3.5" />}
              state="active"
              statusText={currentCurrencyMeta.label}
              title="Default currency"
            />
            <StatusRow
              description="At least one connected institution is required."
              icon={<Building2 className="size-3.5" />}
              state={user.hasConnectedBank ? "ready" : "neutral"}
              statusText={user.hasConnectedBank ? "Connected" : "Waiting"}
              title="Bank connection"
            />
            <StatusRow
              description="First import needed so the dashboard starts with real activity."
              icon={<CircleDashed className="size-3.5" />}
              state={user.firstSyncCompleted ? "ready" : "neutral"}
              statusText={user.firstSyncCompleted ? "Complete" : "Waiting"}
              title="First import"
            />
          </div>
        </div>

        <div className="rounded-[18px] border border-border/70 bg-background/50 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Dashboard access
          </p>
          <div className="mt-2.5 rounded-[14px] border border-border/65 bg-card/75 p-3">
            <Badge variant={user.canCompleteOnboarding ? "success" : "outline"}>
              {user.canCompleteOnboarding ? "Ready now" : "Waiting on live sync"}
            </Badge>
            <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-foreground">
              {user.canCompleteOnboarding
                ? "Open PocketPilot"
                : "One last step remains"}
            </h3>
            <p className="mt-1 text-[0.8rem] leading-5 text-muted-foreground">
              {user.canCompleteOnboarding
                ? "Everything is ready."
                : "We'll unlock the dashboard as soon as your data is ready."}
            </p>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between gap-3 rounded-[10px] bg-background/60 px-3 py-2">
                <span className="text-[0.8rem] text-muted-foreground">Currency saved</span>
                <span className="text-[0.8rem] font-semibold text-foreground">
                  {currentCurrencyMeta.label}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[10px] bg-background/60 px-3 py-2">
                <span className="text-[0.8rem] text-muted-foreground">Institution linked</span>
                <span className="text-[0.8rem] font-semibold text-foreground">
                  {user.hasConnectedBank ? "Yes" : "Not yet"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[10px] bg-background/60 px-3 py-2">
                <span className="text-[0.8rem] text-muted-foreground">First import complete</span>
                <span className="text-[0.8rem] font-semibold text-foreground">
                  {user.firstSyncCompleted ? "Yes" : "Not yet"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCurrentStep = () => {
    switch (uiStep) {
      case "welcome":
        return renderWelcomeStep();
      case "currency":
        return renderCurrencyStep();
      case "connect-bank":
        return renderConnectBankStep();
      case "sync-preview":
        return renderSyncPreviewStep();
      case "budget":
        return renderBudgetStep();
      case "completion":
      default:
        return renderCompletionStep();
    }
  };

  const renderActions = () => {
    if (uiStep === "welcome") {
      return null;
    }

    if (uiStep === "currency") {
      return (
        <>
          <Button
            disabled={pendingLabel !== null}
            onClick={() => {
              setError(null);
              setUiStep("welcome");
            }}
            size="lg"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            disabled={pendingLabel !== null}
            onClick={() =>
              void runWithPendingState(
                "Saving workspace",
                "PocketPilot could not save your currency preference.",
                async () => {
                  await setPersistedStep("connect-bank", selectedCurrency);
                  setUiStep("connect-bank");
                },
              )
            }
            size="lg"
          >
            {pendingLabel === "Saving workspace" ? "Saving..." : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </>
      );
    }

    if (uiStep === "connect-bank") {
      return (
        <Button
          disabled={pendingLabel !== null}
          onClick={() =>
            void runWithPendingState(
              "Returning to currency",
              "PocketPilot could not reopen the currency step.",
              async () => {
                await setPersistedStep("welcome", selectedCurrency);
                setUiStep("currency");
              },
            )
          }
          size="lg"
          variant="ghost"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      );
    }

    if (uiStep === "sync-preview") {
      return (
        <>
          <Button
            disabled={pendingLabel !== null}
            onClick={() => {
              setError(null);
              setUiStep("connect-bank");
            }}
            size="lg"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            disabled={pendingLabel !== null}
            onClick={() => {
              setError(null);
              setUiStep("budget");
            }}
            size="lg"
          >
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </>
      );
    }

    if (uiStep === "budget") {
      return (
        <>
          <Button
            disabled={pendingLabel !== null}
            onClick={() => {
              setError(null);
              setUiStep("sync-preview");
            }}
            size="lg"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            disabled={pendingLabel !== null}
            onClick={() =>
              void runWithPendingState(
                "Saving progress",
                "PocketPilot could not save your onboarding progress.",
                async () => {
                  await setPersistedStep("completion");
                  setUiStep("completion");
                },
              )
            }
            size="lg"
          >
            {pendingLabel === "Saving progress" ? "Saving..." : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </>
      );
    }

    return (
      <>
        <Button
          disabled={pendingLabel !== null}
          onClick={() =>
            void runWithPendingState(
              "Returning to budget setup",
              "PocketPilot could not reopen the budget step.",
              async () => {
                await setPersistedStep("connect-bank");
                setUiStep("budget");
              },
            )
          }
          size="lg"
          variant="ghost"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          disabled={pendingLabel !== null || !user.canCompleteOnboarding}
          onClick={() => void handleCompleteOnboarding()}
          size="lg"
        >
          {pendingLabel === "Opening dashboard"
            ? "Opening..."
            : user.canCompleteOnboarding
              ? "Open dashboard"
              : user.hasConnectedBank
                ? "Waiting for first import"
                : "Waiting for bank connection"}
          <ArrowRight className="size-4" />
        </Button>
      </>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_26%)]" />

      <div className="relative mx-auto flex h-screen max-w-[1400px] flex-col px-4 py-3 sm:px-6 sm:py-4 lg:px-8">


        <main className="flex min-h-0 flex-1 flex-col justify-center py-2 sm:py-3">
          <section className="surface-border surface-shadow relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)),var(--card)]">
            <div className="panel-grid absolute inset-0 opacity-25" />

            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="shrink-0 border-b border-border/70 px-5 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Set up your financial workspace
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Clear steps, real readiness, and no fake completion state.
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {uiStepIndex + 1} / {onboardingUiSteps.length}
                  </p>
                </div>

                <div className="mt-3 grid gap-1.5 md:grid-cols-6">
                  {onboardingUiSteps.map((step, index) => (
                    <StepIndicator
                      isActive={step.key === uiStep}
                      isComplete={index < uiStepIndex}
                      key={step.key}
                      label={step.label}
                      shortLabel={step.shortLabel}
                    />
                  ))}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 lg:px-8">
                {error ? (
                  <ErrorPanel
                    actionLabel="Dismiss"
                    className="mb-4"
                    description={error}
                    onAction={() => setError(null)}
                    title="PocketPilot could not update onboarding"
                  />
                ) : null}

                <div className="mx-auto flex w-full max-w-[1060px] flex-1 flex-col justify-center">
                  {renderCurrentStep()}
                </div>

                {uiStep !== "welcome" && (
                  <div className="mt-4 shrink-0 border-t border-border/70 pt-3">
                    <div
                      className={cn(
                        "flex flex-col gap-3 lg:flex-row lg:items-center",
                        stepSupportCopy[uiStep]
                          ? "lg:justify-between"
                          : "lg:justify-end",
                      )}
                    >
                      {stepSupportCopy[uiStep] ? (
                        <p className="max-w-2xl text-sm leading-5 text-muted-foreground">
                          {stepSupportCopy[uiStep]}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap gap-2">{renderActions()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
