import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type React from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 flex flex-col">
			<header className="container flex items-center h-14 px-4 md:px-6">
				<Link href="/">
					<Button variant="ghost" size="icon" className="mr-2 rounded-full">
						<ChevronLeft className="h-5 w-5" />
						<span className="sr-only">Back to home</span>
					</Button>
				</Link>
				<Link href="/" className="flex items-center gap-2">
					<span className="font-bold text-lg">Citizen Connect</span>
				</Link>
			</header>
			<main className="flex-1 flex items-center justify-center p-4">
				{children}
			</main>
			<footer className="py-6 text-center text-sm text-muted-foreground">
				<p>© 2025 Citizen Connect. All rights reserved.</p>
			</footer>
		</div>
	);
}
