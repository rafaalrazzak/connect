import ErrorBoundary from "@/components/admin/error-boundary";
import AdminSidebar from "@/components/admin/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	// In a real app, you would check if the user is authenticated and has admin privileges
	// For demo purposes, we'll just simulate this check
	const isAdmin = true;

	if (!isAdmin) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-muted/30">
			<ErrorBoundary
				fallback={
					<div className="p-6">
						Something went wrong. Please try refreshing the page.
					</div>
				}
			>
				<div className="flex h-screen overflow-hidden">
					<AdminSidebar />
					<SidebarInset>
						<main className="p-4 md:p-6">{children}</main>
					</SidebarInset>
				</div>
				<Toaster />
			</ErrorBoundary>
		</div>
	);
}
