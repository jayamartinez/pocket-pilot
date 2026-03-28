import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up | PocketPilot",
  description: "Create your PocketPilot account.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SignUp
        fallbackRedirectUrl="/dashboard"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  );
}
