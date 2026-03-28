import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echo — AI Navigator for EVE Frontier",
  description:
    "An AI-powered space navigator that queries EVE Frontier's World API in real-time. Explore solar systems, analyze smart assemblies, and navigate the frontier with Claude AI tool use and 3D star map visualization.",
  openGraph: {
    title: "Echo — AI Navigator for EVE Frontier",
    description:
      "Explore the EVE Frontier universe with an AI navigator. 3D star map + Claude-powered assistant with real-time World API access.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
