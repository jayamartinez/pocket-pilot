import Image from "next/image";

import budgetsPreview from "@/public/images/landing/budgets-preview.png";
import subscriptionsPreview from "@/public/images/landing/subscriptions-preview.png";
import transactionsPreview from "@/public/images/landing/transactions-preview.png";

import { landingFeatureSections } from "@/components/landing/landing-content";

const budgetsFeature = landingFeatureSections.find((section) => section.id === "budgets");
const subscriptionsFeature = landingFeatureSections.find(
  (section) => section.id === "subscriptions",
);
const transactionsFeature = landingFeatureSections.find(
  (section) => section.id === "transactions",
);

export function LandingFeatureGrid() {
  if (!budgetsFeature || !subscriptionsFeature || !transactionsFeature) {
    return null;
  }

  return (
    <section className="pt-12 sm:pt-14 lg:pt-16" id="features">
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            Budgets lead the read.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Budget pacing, recurring subscriptions, and transaction history, all in one focused app.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.92fr)]">
          <article
            className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(79,140,255,0.12),rgba(79,140,255,0.03)_34%,rgba(255,255,255,0.02)),rgba(18,19,21,0.92)] p-5 shadow-[0_22px_70px_rgb(0_0_0_/_0.18)] sm:p-6"
            id={budgetsFeature.id}
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-20 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.28),transparent_68%)] blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[2rem]">
                {budgetsFeature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {budgetsFeature.description}
              </p>
            </div>

            <div className="relative mt-5 overflow-hidden rounded-[26px] border border-white/8 bg-[#0b0d11] p-3 sm:mt-6 sm:p-4">
              <Image
                alt="PocketPilot budgets preview"
                className="h-auto w-[calc(100%+7rem)] max-w-none rounded-[20px] object-cover object-left-top sm:w-[calc(100%+9rem)] lg:w-[calc(100%+12rem)]"
                sizes="(min-width: 1024px) 58rem, 100vw"
                src={budgetsPreview}
              />
            </div>
          </article>

          <div className="grid gap-4">
            <article
              className="relative overflow-hidden rounded-[30px] border border-white/8 bg-card/54 p-5 shadow-[0_18px_56px_rgb(0_0_0_/_0.16)] backdrop-blur-sm sm:p-6"
              id={subscriptionsFeature.id}
            >
              <div className="max-w-sm">
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">
                  {subscriptionsFeature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {subscriptionsFeature.description}
                </p>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(79,140,255,0.1),rgba(79,140,255,0.02)_36%,rgba(255,255,255,0.02)),#0b0d11] p-3">
                <Image
                  alt="PocketPilot subscriptions preview"
                  className="h-auto w-[calc(100%+3rem)] max-w-none rounded-[18px] object-cover object-top"
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  src={subscriptionsPreview}
                />
              </div>
            </article>

            <article
              className="rounded-[28px] border border-white/6 bg-background/30 p-5 sm:p-6"
              id={transactionsFeature.id}
            >
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground sm:text-xl">
                {transactionsFeature.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {transactionsFeature.description}
              </p>

              <div className="relative mt-5 overflow-hidden rounded-[22px] border border-white/8 bg-[#0b0d11] p-3">
                <div className="relative h-[13rem] overflow-hidden rounded-[16px]">
                  <Image
                    alt="PocketPilot transactions preview"
                    className="w-full max-w-none rounded-[16px] object-cover object-top"
                    sizes="(min-width: 1024px) 32rem, 100vw"
                    src={transactionsPreview}
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
