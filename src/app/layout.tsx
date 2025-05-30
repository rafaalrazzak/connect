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

// Base URLs and assets
const APP_NAME = "Kita - Citizen Connect";
const APP_DESCRIPTION = "Public service reporting platform by Kita";
const BASE_URL = "https://connect.kita.blue";
const OG_IMAGE = "https://cdn.kita.blue/kita/thumbnail.png";
const LOGO_PATH = "/logo.png";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  generator: "Next.js",
  keywords: ["citizen", "public service", "reporting", "community", "kita"],
  authors: [{ name: "Kita", url: "https://kita.blue" }],
  creator: "Kita",
  publisher: "Kita",

  // Open Graph metadata
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: BASE_URL,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - ${APP_DESCRIPTION}`,
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@kita",
  },

  // App icons
  icons: {
    icon: LOGO_PATH,
    shortcut: LOGO_PATH,
    apple: LOGO_PATH,
    other: {
      rel: "apple-touch-icon",
      url: LOGO_PATH,
    },
  },

  // Theme and manifest
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  manifest: "/manifest.json",

  // Mobile web app configuration
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },

  // Base URL for canonical links
  metadataBase: new URL(BASE_URL),

  // Crawler directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  // Alternative formats
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": `${BASE_URL}/en-US`,
      "id-ID": `${BASE_URL}/id-ID`,
    },
  },

  // Verification for search engines
  verification: {
    google: "google-site-verification-code", // Replace with actual code if available
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
