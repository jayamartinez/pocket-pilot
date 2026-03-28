"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

interface LandingSmoothScrollProps {
  children: ReactNode;
}

const LANDING_SCROLL_OFFSET = -96;
type LandingLenisOptions = ConstructorParameters<typeof Lenis>[0] & {
  smoothTouch?: boolean;
};

export function LandingSmoothScroll({ children }: LandingSmoothScrollProps) {
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotionQuery.matches) {
      return;
    }

    // Keep touch smoothing disabled across Lenis package variants.
    const options: LandingLenisOptions = {
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
      smoothTouch: false,
    };
    const lenis = new Lenis(options as ConstructorParameters<typeof Lenis>[0]);

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    const scrollToHash = (hash: string, immediate = false) => {
      const targetId = hash.replace("#", "");
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      lenis.scrollTo(target, {
        immediate,
        offset: LANDING_SCROLL_OFFSET,
      });
      window.history.replaceState(null, "", hash);
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest('a[href^="#"]');

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      if (!document.getElementById(href.slice(1))) {
        return;
      }

      event.preventDefault();
      scrollToHash(href);
    };

    frameId = window.requestAnimationFrame(raf);
    document.addEventListener("click", handleAnchorClick);

    if (window.location.hash) {
      scrollToHash(window.location.hash, true);
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return children;
}
