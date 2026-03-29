import { Suspense, type ReactNode } from "react";

import { RouteGate } from "@/components/auth/route-gate";
import { SettingsModalHost } from "@/components/settings/settings-modal-host";
import { MobileBottomNav } from "@/components/shell/mobile-bottom-nav";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { AppTopbar } from "@/components/shell/app-topbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGate mode="app">
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-full lg:gap-4 lg:px-4 lg:py-4">
          <aside className="hidden shrink-0 lg:block lg:w-24 xl:w-[280px]">
            <div className="sticky top-4 h-[calc(100vh-2rem)]">
              <AppSidebar />
            </div>
          </aside>

          <div className="surface-border surface-shadow flex min-w-0 flex-1 flex-col overflow-hidden lg:rounded-[30px] lg:bg-background/90">
            <AppTopbar />
            <main className="flex-1 px-4 py-5 pb-28 sm:px-5 sm:py-5 sm:pb-32 lg:min-h-0 lg:px-6 lg:py-6 lg:pb-6 xl:px-7">
              {children}
            </main>
            <Suspense fallback={null}>
              <SettingsModalHost />
            </Suspense>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    </RouteGate>
  );
}
