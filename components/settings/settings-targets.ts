export const settingsTargets = [
  "overview",
  "account",
  "billing",
  "connections",
] as const;

export type SettingsTarget = (typeof settingsTargets)[number];

export function normalizeSettingsTarget(
  value: string | null | undefined,
): SettingsTarget {
  if (value && settingsTargets.includes(value as SettingsTarget)) {
    return value as SettingsTarget;
  }

  return "overview";
}

export function getSettingsPageHref(target: SettingsTarget) {
  if (target === "overview") {
    return "/settings";
  }

  return `/settings#${target}`;
}

export function createSettingsModalHref({
  pathname,
  search,
  target,
}: {
  pathname: string;
  search: string;
  target: SettingsTarget;
}) {
  const params = new URLSearchParams(search);
  params.set("settings", target);

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function removeSettingsParam({
  pathname,
  search,
}: {
  pathname: string;
  search: string;
}) {
  const params = new URLSearchParams(search);
  params.delete("settings");

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
