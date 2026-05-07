import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "FitPro Launch | Build Your 30-Day Challenge Funnel in Minutes",
  description:
    "Generate a complete, conversion-ready 30-day fitness challenge funnel in minutes. Landing pages, email sequences, ad copy, and more — built for coaches.",
  keywords: [
    "fitness funnel",
    "30 day challenge",
    "personal trainer marketing",
    "fitness coach leads",
    "fitpro launch",
  ],
  openGraph: {
    title: "FitPro Launch",
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
    <html lang="en">
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
