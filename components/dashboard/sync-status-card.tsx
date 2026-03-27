"use client";

import { useState } from "react";

import { CompactInstitutionRow } from "@/components/dashboard/compact-institution-row";
import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { SettingsLink } from "@/components/settings/settings-link";
import { Card, CardContent } from "@/components/ui/card";
import type { InstitutionSummary } from "@/lib/types/finance";

export function SyncStatusCard({
  institutions,
}: {
  institutions: InstitutionSummary[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(
    institutions.find((institution) => institution.status !== "healthy")?.id ?? null,
  );

  return (
    <Card className="border-border/70">
      <CardContent className="p-4 sm:p-5">
        <DashboardSectionHeader
          action={
            <SettingsLink
              className="text-sm font-medium text-primary transition hover:text-primary/80"
              target="connections"
            >
              Manage
            </SettingsLink>
          }
          description="Linked institutions and their current status."
          title="Institutions"
        />

        <div className="mt-4 space-y-2.5">
          {institutions.map((institution) => (
            <CompactInstitutionRow
              expanded={expandedId === institution.id}
              institution={institution}
              key={institution.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === institution.id ? null : institution.id,
                )
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
