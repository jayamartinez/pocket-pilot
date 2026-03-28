"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useReverification, useUser } from "@clerk/nextjs";
import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SettingsUser = NonNullable<ReturnType<typeof useUser>["user"]>;

interface AccountDialogProps {
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
  open: boolean;
  user: SettingsUser;
}

export function NameDialog({
  onOpenChange,
  onSaved,
  open,
  user,
}: AccountDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateName = useReverification(async (nextFirstName: string, nextLastName: string) => {
    await user.update({
      firstName: nextFirstName || null,
      lastName: nextLastName || null,
    });
    await user.reload();
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setError(null);
  }, [open, user.firstName, user.lastName]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setError(null);

    try {
      await updateName(firstName.trim(), lastName.trim());
      onSaved?.();
      onOpenChange(false);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "Unable to update your name right now."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="rounded-[28px] border-border/80 bg-card/98 p-0 shadow-[0_28px_80px_rgb(0_0_0_/_0.28)] sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border/70 px-5 py-5 sm:px-6">
            <DialogTitle className="text-left text-lg font-semibold text-foreground">
              Edit name
            </DialogTitle>
            <DialogDescription className="text-left leading-6">
              Update the name PocketPilot shows across your workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <Field label="First name">
              <Input
                autoComplete="given-name"
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                value={firstName}
              />
            </Field>
            <Field label="Last name">
              <Input
                autoComplete="family-name"
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                value={lastName}
              />
            </Field>
            {error ? <InlineError message={error} /> : null}
          </div>

          <DialogFooter className="border-t border-border/70 px-5 py-4 sm:px-6">
            <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EmailDialog({
  onOpenChange,
  onSaved,
  open,
  user,
}: AccountDialogProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pendingEmailId, setPendingEmailId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const startEmailChange = useReverification(async (nextEmail: string) => {
    const created = await user.createEmailAddress({ email: nextEmail });
    await created.prepareVerification({ strategy: "email_code" });
    return created.id;
  });

  const verifyEmailChange = useReverification(async (emailId: string, verificationCode: string) => {
    const targetEmail = user.emailAddresses.find((entry) => entry.id === emailId);

    if (!targetEmail) {
      throw new Error("That email verification request has expired. Start again.");
    }

    const verified = await targetEmail.attemptVerification({ code: verificationCode });

    if (verified.verification.status !== "verified") {
      throw new Error("Enter the latest verification code to continue.");
    }

    await user.update({ primaryEmailAddressId: verified.id });
    await user.reload();
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setEmail("");
    setCode("");
    setPendingEmailId(null);
    setError(null);
    setIsWorking(false);
  }, [open]);

  const handleStart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter an email address to continue.");
      return;
    }

    if (normalizedEmail === user.primaryEmailAddress?.emailAddress.toLowerCase()) {
      setError("That email is already your primary address.");
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const nextEmailId = await startEmailChange(normalizedEmail);
      setPendingEmailId(nextEmailId);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "Unable to send an email verification code."));
    } finally {
      setIsWorking(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pendingEmailId) {
      setError("Start an email update first.");
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      await verifyEmailChange(pendingEmailId, code.trim());
      onSaved?.();
      onOpenChange(false);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "Unable to verify that email right now."));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="rounded-[28px] border-border/80 bg-card/98 p-0 shadow-[0_28px_80px_rgb(0_0_0_/_0.28)] sm:max-w-xl">
        <form onSubmit={pendingEmailId ? handleVerify : handleStart}>
          <DialogHeader className="border-b border-border/70 px-5 py-5 sm:px-6">
            <DialogTitle className="text-left text-lg font-semibold text-foreground">
              {pendingEmailId ? "Verify new email" : "Update email"}
            </DialogTitle>
            <DialogDescription className="text-left leading-6">
              {pendingEmailId
                ? "Enter the verification code Clerk sent to your new email address."
                : "Add a new email and PocketPilot will verify it before making it primary."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            {pendingEmailId ? (
              <div className="rounded-2xl border border-border/75 bg-background/55 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="size-4 text-primary" />
                  <span>{email.trim().toLowerCase()}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The previous email stays on the account. This flow only promotes the new
                  address to primary once it is verified.
                </p>
              </div>
            ) : (
              <Field label="New email">
                <Input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                />
              </Field>
            )}

            {pendingEmailId ? (
              <Field label="Verification code">
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="123456"
                  value={code}
                />
              </Field>
            ) : null}

            {error ? <InlineError message={error} /> : null}
          </div>

          <DialogFooter className="border-t border-border/70 px-5 py-4 sm:px-6">
            <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isWorking} type="submit">
              {isWorking
                ? pendingEmailId
                  ? "Verifying..."
                  : "Sending code..."
                : pendingEmailId
                  ? "Verify email"
                  : "Send code"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PhoneDialog({
  onOpenChange,
  onSaved,
  open,
  user,
}: AccountDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [pendingPhoneId, setPendingPhoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const startPhoneChange = useReverification(async (nextPhoneNumber: string) => {
    const created = await user.createPhoneNumber({ phoneNumber: nextPhoneNumber });
    await created.prepareVerification();
    return created.id;
  });

  const verifyPhoneChange = useReverification(async (phoneId: string, verificationCode: string) => {
    const targetPhone = user.phoneNumbers.find((entry) => entry.id === phoneId);

    if (!targetPhone) {
      throw new Error("That phone verification request has expired. Start again.");
    }

    const verified = await targetPhone.attemptVerification({ code: verificationCode });

    if (verified.verification.status !== "verified") {
      throw new Error("Enter the latest verification code to continue.");
    }

    await user.update({ primaryPhoneNumberId: verified.id });
    await user.reload();
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setPhoneNumber("");
    setCode("");
    setPendingPhoneId(null);
    setError(null);
    setIsWorking(false);
  }, [open]);

  const handleStart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

    if (!normalizedPhoneNumber) {
      setError("Enter a valid phone number using +country code or a 10-digit US number.");
      return;
    }

    if (normalizedPhoneNumber === user.primaryPhoneNumber?.phoneNumber) {
      setError("That phone number is already your primary number.");
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const nextPhoneId = await startPhoneChange(normalizedPhoneNumber);
      setPendingPhoneId(nextPhoneId);
      setPhoneNumber(normalizedPhoneNumber);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "Unable to send a phone verification code."));
    } finally {
      setIsWorking(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pendingPhoneId) {
      setError("Start a phone update first.");
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      await verifyPhoneChange(pendingPhoneId, code.trim());
      onSaved?.();
      onOpenChange(false);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "Unable to verify that phone number right now."));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="rounded-[28px] border-border/80 bg-card/98 p-0 shadow-[0_28px_80px_rgb(0_0_0_/_0.28)] sm:max-w-xl">
        <form onSubmit={pendingPhoneId ? handleVerify : handleStart}>
          <DialogHeader className="border-b border-border/70 px-5 py-5 sm:px-6">
            <DialogTitle className="text-left text-lg font-semibold text-foreground">
              {pendingPhoneId
                ? "Verify phone number"
                : user.primaryPhoneNumber
                  ? "Update phone number"
                  : "Add phone number"}
            </DialogTitle>
            <DialogDescription className="text-left leading-6">
              {pendingPhoneId
                ? "Enter the SMS code Clerk sent before PocketPilot promotes this phone number."
                : "Phone is optional today, but it enables cleaner identity and security coverage later."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            {pendingPhoneId ? (
              <div className="rounded-2xl border border-border/75 bg-background/55 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Phone className="size-4 text-primary" />
                  <span>{phoneNumber}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Password management stays hidden in PocketPilot until password auth is part of
                  the product.
                </p>
              </div>
            ) : (
              <Field label="Phone number">
                <Input
                  autoComplete="tel"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+1 212 555 0189"
                  value={phoneNumber}
                />
              </Field>
            )}

            {pendingPhoneId ? (
              <Field label="Verification code">
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="123456"
                  value={code}
                />
              </Field>
            ) : null}

            {error ? <InlineError message={error} /> : null}
          </div>

          <DialogFooter className="border-t border-border/70 px-5 py-4 sm:px-6">
            <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isWorking} type="submit">
              {isWorking
                ? pendingPhoneId
                  ? "Verifying..."
                  : "Sending code..."
                : pendingPhoneId
                  ? "Verify phone"
                  : "Send code"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-danger/30 bg-danger/8 px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors?: Array<{ longMessage?: string; message?: string }> }).errors)
  ) {
    const clerkError = (error as { errors: Array<{ longMessage?: string; message?: string }> })
      .errors[0];

    if (clerkError?.longMessage) {
      return clerkError.longMessage;
    }

    if (clerkError?.message) {
      return clerkError.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("+")) {
    const digits = trimmed.replace(/[^\d+]/g, "");
    return digits.length >= 8 ? digits : null;
  }

  const digitsOnly = trimmed.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    return `+${digitsOnly}`;
  }

  return null;
}
