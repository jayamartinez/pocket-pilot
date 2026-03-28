import Link from "next/link";

import { landingFooterLinks } from "@/components/landing/landing-content";
import { AppLogo } from "@/components/shared/app-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/6 pb-10 pt-8">
      <div className="mx-auto flex max-w-[1420px] flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="space-y-3">
          <AppLogo className="gap-2.5" />
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            A calmer way to review balances, cash flow, budgets, and recurring spend.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          {landingFooterLinks.map((item) => (
            <Link
              className="transition hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
