// Root Layout file defining global fonts, SEO metadata, and wrapping the app in global client layout providers.
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/layout/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Cine-Stellar | Premium OTT Streaming Experience",
  description: "Immerse yourself in ultra-high-definition, seamless video streams of blockbusters, series, and cast details with premium glassmorphic UI controls.",
  keywords: ["cine-stellar", "streaming", "ott", "movies", "tv shows", "netflix alternative"],
  authors: [{ name: "Cine-Stellar Team" }],
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
