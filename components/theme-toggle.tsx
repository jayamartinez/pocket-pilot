"use client";

import { Monitor, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isResolved = resolvedTheme === "dark" || resolvedTheme === "light";

  return (
    <Button
      aria-label={
        isResolved
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      className={compact ? "size-10 px-0" : "h-10 px-3 sm:px-4"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size={compact ? "icon" : "sm"}
      variant="secondary"
    >
      {isResolved ? (
        isDark ? (
          <SunMedium className="size-4" />
        ) : (
          <MoonStar className="size-4" />
        )
      ) : (
        <Monitor className="size-4" />
      )}
      {compact ? null : (
        <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
      )}
    </Button>
  );
}
