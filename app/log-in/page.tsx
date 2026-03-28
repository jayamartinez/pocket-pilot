import type { Metadata } from "next";

import { AuthEntryShell } from "@/components/landing/auth-entry-shell";

export const metadata: Metadata = {
  title: "Log In | PocketPilot",
  description: "Log in to PocketPilot.",
};

export default function LogInPage() {
  return (
    <AuthEntryShell
      description="PocketPilot log-in is being reserved as a public route while authentication is connected. The landing page can now point to a stable destination instead of a missing route."
      eyebrow="Log in"
      primaryLabel="Replace this with the production log-in form."
      title="Return to your PocketPilot workspace."
    />
  );
}
