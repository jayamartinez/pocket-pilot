import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingFinalCta() {
  return (
    <section className="pb-20 pt-20 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28" id="cta">
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_45%),var(--card)] px-6 py-12 text-center shadow-[0_24px_80px_rgb(0_0_0_/_0.26)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              PocketPilot
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[3.5rem] lg:leading-[1.02]">
              Start with the calmer version of your money workflow.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Create an account for the core experience now, then step into richer insights
              and future premium tracking when the paid tier is ready.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-6 shadow-[0_14px_36px_rgb(79_140_255_/_0.22)]",
                )}
                href="/sign-up"
              >
                Sign up
              </Link>
              <Link
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "rounded-full border border-white/8 bg-card/58 px-6",
                )}
                href="/log-in"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
