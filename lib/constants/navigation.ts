import {
  ArrowDownUp,
  CircleDollarSign,
  CircleUserRound,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Settings2,
  WalletCards,
} from "lucide-react";

export const appNavigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: ArrowDownUp,
  },
  {
    title: "Budgets",
    href: "/budgets",
    icon: PiggyBank,
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: CircleDollarSign,
  },
] as const;

export const accountNavigation = [
  {
    title: "Profile",
    href: "/settings#profile",
    icon: CircleUserRound,
  },
  {
    title: "Settings",
    href: "/settings#preferences",
    icon: Settings2,
  },
  {
    title: "Billing",
    href: "/settings#billing",
    icon: CreditCard,
  },
  {
    title: "Connected accounts",
    href: "/settings#connections",
    icon: WalletCards,
  },
] as const;
