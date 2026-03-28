"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SettingsContent } from "@/components/settings/settings-content";
import {
  normalizeSettingsTarget,
  removeSettingsParam,
} from "@/components/settings/settings-targets";
import { useIsDesktop } from "@/components/settings/use-is-desktop";
import { Button } from "@/components/ui/button";

const EXIT_DURATION_MS = 180;

export function SettingsModalHost() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useIsDesktop();
  const wasOpenRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const shouldOpen = isDesktop && pathname !== "/settings" && searchParams.has("settings");
  const requestedTarget = normalizeSettingsTarget(searchParams.get("settings"));
  const closeHref = removeSettingsParam({
    pathname,
    search: searchParams.toString(),
  });

  const handleClose = () => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    overlayRef.current?.classList.remove("animate-settings-overlay-in");
    overlayRef.current?.classList.add("animate-settings-overlay-out");
    panelRef.current?.classList.remove("animate-settings-panel-in");
    panelRef.current?.classList.add("animate-settings-panel-out");
    closeTimeoutRef.current = window.setTimeout(() => {
      router.replace(closeHref, { scroll: false });
    }, EXIT_DURATION_MS);
  };

  useEffect(() => {
    if (shouldOpen && !wasOpenRef.current) {
      isClosingRef.current = false;
    }

    wasOpenRef.current = shouldOpen;
  }, [shouldOpen]);

  useEffect(() => {
    if (!shouldOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldOpen]);

  useEffect(() => {
    if (!shouldOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isClosingRef.current) {
          return;
        }

        isClosingRef.current = true;
        overlayRef.current?.classList.remove("animate-settings-overlay-in");
        overlayRef.current?.classList.add("animate-settings-overlay-out");
        panelRef.current?.classList.remove("animate-settings-panel-in");
        panelRef.current?.classList.add("animate-settings-panel-out");
        closeTimeoutRef.current = window.setTimeout(() => {
          router.replace(closeHref, { scroll: false });
        }, EXIT_DURATION_MS);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeHref, router, shouldOpen]);

  useEffect(() => {
    if (!shouldOpen || !contentRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (requestedTarget === "overview") {
        contentRef.current?.scrollTo({ behavior: "smooth", top: 0 });
        return;
      }

      const section = contentRef.current?.querySelector<HTMLElement>(
        `[data-settings-section="${requestedTarget}"]`,
      );

      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [requestedTarget, shouldOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!shouldOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] px-4 py-6 lg:px-8 lg:py-10 animate-settings-overlay-in"
      ref={overlayRef}
    >
      <button
        aria-label="Close settings"
        className="absolute inset-0 bg-background/76 backdrop-blur-[6px]"
        onClick={handleClose}
        type="button"
      />

      <div className="relative mx-auto flex h-full max-w-4xl items-start justify-center">
        <div
          aria-labelledby="settings-modal-title"
          aria-modal="true"
          className="surface-border surface-shadow relative flex h-full w-full max-h-full flex-col overflow-hidden rounded-[28px] bg-card/98 animate-settings-panel-in"
          ref={panelRef}
          role="dialog"
        >
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-foreground" id="settings-modal-title">
              Settings
            </h2>
            <Button
              aria-label="Close settings"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleClose}
              size="icon"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6" ref={contentRef}>
            <SettingsContent />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
