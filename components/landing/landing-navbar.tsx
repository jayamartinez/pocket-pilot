"use client";

import { Show } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

import { landingNavigation } from "@/components/landing/landing-content";
import { AppLogo } from "@/components/shared/app-logo";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  const updateScrolledState = useEffectEvent(() => {
    setScrolled(window.scrollY > 24);
  });

  useEffect(() => {
    updateScrolledState();

    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6 lg:px-8">
      <header
        className={cn(
          " mx-auto flex items-center gap-4 rounded-full text-foreground transition-all duration-500",
          scrolled
            ? "max-w-5xl px-4 py-2.5 shadow-[0_20px_60px_rgb(0_0_0_/_0.28)] surface-border bg-background/76 backdrop-blur-2xl"
            : "max-w-[1420px] px-5 py-3.5 shadow-[0_14px_42px_rgb(0_0_0_/_0.18)]",
        )}
      >
        <Link
          aria-label="PocketPilot home"
          className="flex min-w-0 items-center"
          href="/"
        >
          <AppLogo className="gap-2.5" showTagline={false} />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 rounded-full border border-white/6 bg-white/[0.02] p-1 md:flex">
          {landingNavigation.map((item) => (
            <Link
              key={item.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.04] hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Show when="signed-out">
            <Link
              className={cn(
                buttonVariants({ size: "default", variant: "ghost" }),
                "rounded-full border border-white/8 bg-white/[0.02] px-4 text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
              )}
              href="/sign-in"
            >
              Log in
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "default" }),
                "rounded-full px-5 shadow-[0_10px_30px_rgb(79_140_255_/_0.28)]",
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
                buttonVariants({ size: "default", variant: "ghost" }),
                "rounded-full border border-white/8 bg-white/[0.02] px-4 text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
              )}
              href="/settings"
            >
              Settings
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "default" }),
                "rounded-full px-5 shadow-[0_10px_30px_rgb(79_140_255_/_0.28)]",
              )}
              href="/dashboard"
            >
              Open dashboard
            </Link>
          </Show>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Show when="signed-out">
            <Link
              className={cn(buttonVariants({ size: "sm" }), "rounded-full px-3.5")}
              href="/sign-up"
            >
              Sign up
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "rounded-full border border-white/8 bg-card/58 px-3.5",
              )}
              href="/settings"
            >
              Settings
            </Link>
          </Show>
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open navigation"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border/80 bg-card/78 text-foreground transition hover:bg-card"
                type="button"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent
              className="gap-0 rounded-b-[28px] border-border/80 bg-card/96 px-0 pb-6 pt-0 text-card-foreground"
              side="top"
            >
              <div className="border-b border-border/70 px-5 py-4">
                <SheetTitle className="text-left">
                  <AppLogo className="gap-2.5" showTagline={false} />
                </SheetTitle>
              </div>
              <nav className="space-y-1 px-4 pt-4">
                {landingNavigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      className="flex items-center justify-between rounded-[20px] px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80"
                      href={item.href}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="grid gap-2 px-4 pt-4">
                <Show when="signed-out">
                  <SheetClose asChild>
                    <Link
                      className={cn(
                        buttonVariants({ size: "lg", variant: "secondary" }),
                        "w-full rounded-full border border-white/8 bg-card/58",
                      )}
                      href="/sign-in"
                    >
                      Log in
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full")}
                      href="/sign-up"
                    >
                      Sign up
                    </Link>
                  </SheetClose>
                </Show>
                <Show when="signed-in">
                  <SheetClose asChild>
                    <Link
                      className={cn(
                        buttonVariants({ size: "lg", variant: "secondary" }),
                        "w-full rounded-full border border-white/8 bg-card/58",
                      )}
                      href="/settings"
                    >
                      Account settings
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full")}
                      href="/dashboard"
                    >
                      Open dashboard
                    </Link>
                  </SheetClose>
                </Show>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
