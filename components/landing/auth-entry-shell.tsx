import Link from "next/link";
import type { ReactNode } from "react";

import { AppLogo } from "@/components/shared/app-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthEntryShellProps {
  eyebrow: string;
  title: string;
  description: string;
  alternateHref: string;
  alternateLabel: string;
  children: ReactNode;
}

export function AuthEntryShell({
  eyebrow,
  title,
  description,
  alternateHref,
  alternateLabel,
  children,
}: AuthEntryShellProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1420px] items-center">
        <Link href="/">
          <AppLogo className="gap-2.5" showTagline={false} />
        </Link>
      </div>

      <main className="mx-auto mt-16 max-w-3xl">
        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_45%),var(--card)] px-6 py-12 shadow-[0_24px_80px_rgb(0_0_0_/_0.26)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[3.5rem] lg:leading-[1.02]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-6 shadow-[0_14px_36px_rgb(79_140_255_/_0.22)]",
              )}
              href={alternateHref}
            >
              {alternateLabel}
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "rounded-full border border-white/8 bg-card/58 px-6",
              )}
              href="/"
            >
              Back home
            </Link>
          </div>

          <div className="mt-10 rounded-[26px] border border-white/8 bg-background/44 p-5">
            <div className="mx-auto flex w-full max-w-md justify-center">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
