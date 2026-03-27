import { CheckCircle2, ChevronDown, ShieldAlert } from "lucide-react";

import { SettingsLink } from "@/components/settings/settings-link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { InstitutionSummary } from "@/lib/types/finance";
import { cn } from "@/lib/utils";

interface CompactInstitutionRowProps {
  institution: InstitutionSummary;
  expanded: boolean;
  onToggle: () => void;
}

export function CompactInstitutionRow({
  institution,
  expanded,
  onToggle,
}: CompactInstitutionRowProps) {
  const isHealthy = institution.status === "healthy";

  return (
    <div className="rounded-lg border border-border/70 bg-surface-subtle/70 transition-colors hover:border-border/90 hover:bg-surface-subtle">
      <button
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
        onClick={onToggle}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              isHealthy
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger",
            )}
          >
            {isHealthy ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <ShieldAlert className="size-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {institution.institutionName}
            </p>
            <p className="text-xs text-muted-foreground">
              {institution.accountCount} accounts / Updated {formatDate(institution.lastSyncAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isHealthy ? "success" : "danger"}>
            {isHealthy ? "Connected" : "Action needed"}
          </Badge>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-border/60 px-3.5 py-3">
          <p className="text-sm text-muted-foreground">
            {isHealthy
              ? "Everything looks up to date. You can refresh this connection from Settings if needed."
              : "Reconnect this institution from Settings to resume transaction imports."}
          </p>
          <SettingsLink
            className={cn(
              "mt-3 inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors",
              isHealthy
                ? "bg-card text-foreground surface-border shadow-sm hover:bg-muted/70"
                : "bg-danger text-danger-foreground shadow-sm hover:opacity-90",
            )}
            target="connections"
          >
            {isHealthy ? "Refresh in Settings" : "Reconnect in Settings"}
          </SettingsLink>
        </div>
      ) : null}
    </div>
  );
}
