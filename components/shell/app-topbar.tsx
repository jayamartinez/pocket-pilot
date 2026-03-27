"use client";

import { Bell, Search } from "lucide-react";

import { AppLogo } from "@/components/shared/app-logo";
import { ProfileMenu } from "@/components/shell/profile-menu";
import { Input } from "@/components/ui/input";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 lg:px-6">
        <div className="lg:hidden">
          <AppLogo compact />
        </div>

        <div className="relative hidden min-w-0 flex-1 md:block lg:max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 border-border/80 bg-card/60 pl-10"
            placeholder="Search merchants, categories, or accounts"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button className="relative flex size-10 items-center justify-center rounded-xl border border-border/80 bg-card/65 text-muted-foreground transition hover:border-border hover:text-foreground">
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
          </button>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
