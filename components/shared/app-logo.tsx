import { Compass } from "lucide-react";

export function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] text-primary-foreground shadow-[0_10px_24px_rgb(79_140_255_/_0.24)]">
        <Compass className="size-5" />
      </div>
      <div className={compact ? "hidden" : "block"}>
        <p className="text-[1.05rem] font-semibold tracking-tight text-foreground">
          PocketPilot
        </p>
        <p className="text-xs text-muted-foreground">Personal finance command center</p>
      </div>
    </div>
  );
}
