import Link from "next/link";

import { pricingTiers } from "@/components/landing/landing-content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingPricing() {
  return (
    <section className="pt-14 sm:pt-16 lg:pt-20" id="pricing">
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Start free, then layer in more insight when the premium tier is ready.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              The pricing section stays intentionally small: one free plan for the core
              workflow and one paid tier for richer insight, smarter organization, and
              future premium tracking features.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {pricingTiers.map((tier) => (
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-[30px] border border-white/8 bg-card/56 p-5 backdrop-blur-sm sm:p-6",
                  tier.featured &&
                    "border-primary/28 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%),var(--card)] shadow-[0_20px_60px_rgb(0_0_0_/_0.22)]",
                )}
                key={tier.name}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{tier.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                  {tier.featured ? (
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                      Planned
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
                    {tier.priceLabel}
                  </span>
                  <span className="pb-1 text-sm text-muted-foreground">{tier.cadence}</span>
                </div>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">{tier.note}</p>

                <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                  {tier.highlights.map((highlight) => (
                    <li className="flex gap-3" key={highlight}>
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: tier.featured ? "default" : "secondary",
                    }),
                    "mt-6 rounded-full",
                    !tier.featured && "border border-white/8 bg-card/58",
                  )}
                  href={tier.href}
                >
                  {tier.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
