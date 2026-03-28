export type CurrencyPreference = "USD" | "EUR" | "GBP";
export type DateFormatPreference =
  | "month-day-year"
  | "day-month-year"
  | "year-month-day";
export type ThemePreference = "system" | "light" | "dark";

export interface SettingsPreferences {
  currency: CurrencyPreference;
  dateFormat: DateFormatPreference;
  budgetAlerts: boolean;
  weeklyDigest: boolean;
  syncAlerts: boolean;
  theme: ThemePreference;
}
