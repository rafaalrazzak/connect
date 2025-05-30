import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "@/app/globals.css";
import CreateReportDrawer from "@/components/report/create-report-drawer";
import { Splash } from "@/components/splash";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ReportDrawerProvider } from "@/contexts/report-drawer-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citizen Connect",
  description: "Public service reporting application",
  openGraph: {
    title: "Citizen Connect",
    description: "Public service reporting application",
    url: "https://connect.kita.blue",
    siteName: "Citizen Connect",
    images: [
      {
        url: "https://cdn.kita.blue/kita/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Citizen Connect Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Citizen Connect",
    description: "Public service reporting application",
    images: ["https://cdn.kita.blue/kita/thumbnail.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Citizen Connect",
    statusBarStyle: "default",
  },
  metadataBase: new URL("https://connect.kita.blue"),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  },
  alternates: {
    canonical: "https://connect.kita.blue",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/atom+xml": "/atom.xml",
      "application/json": "/api/metadata.json",
      "application/ld+json": "/api/metadata.json",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main>
            <ReportDrawerProvider>
              <Splash />
              {children}
              <Toaster />
              <CreateReportDrawer />
            </ReportDrawerProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
