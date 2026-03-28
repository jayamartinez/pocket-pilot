import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import dashboardPreview from "@/public/images/landing/dashboard-preview.png";

import { LandingPreviewFrame } from "@/components/landing/landing-preview-frame";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36" id="overview">
      {/* Bottom fade — spans full viewport width, bypasses max-w- containers */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-48 bg-[linear-gradient(to_top,var(--background)_8%,transparent)] lg:block" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[35rem] bg-[radial-gradient(circle_at_16%_16%,rgba(79,140,255,0.2),transparent_26%),radial-gradient(circle_at_84%_10%,rgba(34,211,238,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_52%)]" />
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div className="relative lg:min-h-[46rem] xl:min-h-[48rem]">
          <div className="relative z-20 mx-auto max-w-[35rem] py-10 text-center sm:py-12 lg:mx-0 lg:py-10 lg:text-left xl:py-12">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Your finances, at a glance
              </div>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[4.5rem] lg:leading-[0.94]">
              Your money,
              <br />
              <span className="text-primary">perfectly piloted.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:mx-auto sm:text-lg sm:leading-8 lg:mx-0">
              PocketPilot keeps balances, cash flow, budgets, and recurring spend in
              one calm app so you can catch the important changes before they
              become cleanup work.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Show when="signed-out">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full px-6 shadow-[0_14px_36px_rgb(79_140_255_/_0.24)]",
                  )}
                  href="/sign-up"
                >
                  Sign up
                  <ArrowRight className="size-4" />
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full px-6 shadow-[0_14px_36px_rgb(79_140_255_/_0.24)]",
                  )}
                  href="/dashboard"
                >
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Show>
            </div>
          </div>

          <div className="hidden lg:block">
            <LandingPreviewFrame
              alt="PocketPilot dashboard preview"
              className="pointer-events-none absolute 
              right-[calc(((100vw-100%)/-2)-30rem)] top-10 z-0 w-[72rem] 
              max-w-none xl:right-[calc(((100vw-100%)/-2)-32rem)] xl:w-[78rem] 
              2xl:w-[84rem]"
              imageClassName="rounded-[22px]"
              priority
              sizes="(min-width: 1536px) 84rem, (min-width: 1280px) 78rem, 72rem"
              src={dashboardPreview}
            />

          </div>
        </div>
      </div>
    </section>
  );
}
