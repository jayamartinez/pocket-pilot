import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PocketPilot",
  description: "A modern personal finance dashboard for tracking spending, budgets, and subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} h-full bg-background antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
