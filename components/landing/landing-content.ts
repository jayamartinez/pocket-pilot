export const landingNavigation = [
  { href: "#overview", label: "Overview" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
] as const;


export const landingFeatureSections = [
  {
    id: "budgets",
    eyebrow: "Budgets",
    title: "Budgets",
    description: "Track category spending before you go over.",
  },
  {
    id: "subscriptions",
    eyebrow: "Subscriptions",
    title: "Subscriptions",
    description: "See recurring charges before they hit.",
  },
  {
    id: "transactions",
    eyebrow: "Transactions",
    title: "Transactions",
    description: "Search and review transactions quickly.",
  },
] satisfies ReadonlyArray<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}>;

export const pricingTiers = [
  {
    name: "Free",
    priceLabel: "$0",
    cadence: "/ month",
    description: "A clean starting point for day-to-day money review.",
    note: "For getting your core financial picture in one place.",
    highlights: [
      "Core dashboard access",
      "Transaction review",
      "Basic budgeting",
      "Subscription visibility",
    ],
    featured: false,
    ctaLabel: "Start free",
    href: "/sign-up",
  },
  {
    name: "Pro",
    priceLabel: "$X",
    cadence: "/ month",
    description: "Placeholder-friendly pricing for the premium PocketPilot tier.",
    note: "Final price can be dropped in later without changing the layout.",
    highlights: [
      "Everything in Free",
      "Expanded insights",
      "Smarter organization",
      "Future premium tracking features",
    ],
    featured: true,
    ctaLabel: "Join waitlist",
    href: "/sign-up",
  },
] as const;

export const landingFooterLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/sign-in", label: "Log in" },
  { href: "/sign-up", label: "Sign up" },
] as const;
