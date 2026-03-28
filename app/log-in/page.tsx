import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In | PocketPilot",
  description: "Redirecting to PocketPilot sign in.",
};

export default function LogInPage() {
  redirect("/sign-in");
}
