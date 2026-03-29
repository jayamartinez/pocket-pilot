import type { Metadata } from "next";

import { RouteGate } from "@/components/auth/route-gate";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "PocketPilot | Onboarding",
  description:
    "Complete your PocketPilot setup before unlocking the personal finance dashboard.",
};

export default function OnboardingPage() {
  return (
    <RouteGate mode="onboarding">
      <OnboardingFlow />
    </RouteGate>
  );
}
