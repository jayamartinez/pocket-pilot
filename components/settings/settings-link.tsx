"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  createSettingsModalHref,
  getSettingsPageHref,
  type SettingsTarget,
} from "@/components/settings/settings-targets";
import { useIsDesktop } from "@/components/settings/use-is-desktop";

interface SettingsLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  target?: SettingsTarget;
}

export function SettingsLink({
  onClick,
  target = "overview",
  ...props
}: SettingsLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  return (
    <Link
      href={getSettingsPageHref(target)}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || !isDesktop || pathname === "/settings") {
          return;
        }

        event.preventDefault();
        router.push(
          createSettingsModalHref({
            pathname,
            search: window.location.search,
            target,
          }),
          { scroll: false },
        );
      }}
      {...props}
    />
  );
}
