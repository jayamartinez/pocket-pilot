"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { SettingsContent } from "@/components/settings/settings-content";
import { Button } from "@/components/ui/button";

export function SettingsPageShell() {
  const router = useRouter();

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="lg:mx-auto lg:max-w-4xl lg:py-3">
      <div className="space-y-4 lg:space-y-0 lg:overflow-hidden lg:rounded-[28px] lg:bg-card/98 lg:surface-border lg:surface-shadow">
        <div className="relative flex items-center justify-center border-b border-border/70 pb-4 lg:justify-between lg:px-6 lg:py-4">
          <Button
            aria-label="Go back"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={handleClose}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-[1.125rem] font-semibold tracking-tight text-foreground lg:text-lg">
            Settings
          </h1>
          <Button
            aria-label="Close settings"
            className="hidden text-muted-foreground hover:text-foreground lg:inline-flex"
            onClick={handleClose}
            size="icon"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="lg:px-6 lg:py-5">
          <SettingsContent />
        </div>
      </div>
    </div>
  );
}
