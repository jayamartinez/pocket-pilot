import type { Metadata } from "next";

import { AuthEntryShell } from "@/components/landing/auth-entry-shell";

export const metadata: Metadata = {
  title: "Sign Up | PocketPilot",
  description: "Create a PocketPilot account.",
};

export default function SignUpPage() {
  return (
    <AuthEntryShell
      description="PocketPilot account creation is the next public route to wire into Clerk. This placeholder keeps the signed-out landing flow coherent without breaking navigation."
      eyebrow="Sign up"
      primaryLabel="Replace this with the production sign-up form."
      title="Create your PocketPilot account."
    />
  );
}
