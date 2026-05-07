import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Challenge Funnel in a Box | Launch Your 30-Day Challenge Fast",
  description:
    "Generate a complete, conversion-ready 30-day fitness challenge funnel in minutes. Landing pages, email sequences, ad copy, and more — built for coaches.",
  keywords: [
    "fitness funnel",
    "30 day challenge",
    "personal trainer marketing",
    "fitness coach leads",
    "challenge funnel generator",
  ],
  openGraph: {
    title: "Challenge Funnel in a Box",
    description: "Launch your 30-day challenge funnel in minutes, not days.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
