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
	generator: "v0.dev",
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
