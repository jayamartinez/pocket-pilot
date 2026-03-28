import type { Metadata } from "next";

import { LandingFeatureGrid } from "@/components/landing/landing-feature-grid";
import { LandingFinalCta } from "@/components/landing/landing-final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingPricing } from "@/components/landing/landing-pricing";
import { LandingSmoothScroll } from "@/components/landing/landing-smooth-scroll";

export const metadata: Metadata = {
  title: "PocketPilot | Personal finance command center",
  description:
    "Track balances, cash flow, transactions, budgets, and subscriptions in one calm PocketPilot workspace.",
};

export default function LandingPage() {
  return (
    <LandingSmoothScroll>
      <div className="overflow-x-clip bg-background text-foreground">
        <LandingNavbar />
        <main>
          <LandingHero />
          <LandingFeatureGrid />
          <LandingPricing />
          <LandingFinalCta />
        </main>
        <LandingFooter />
      </div>
    </LandingSmoothScroll>
  );
}
