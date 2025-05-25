"use client";

import CreateReportDrawer from "@/components/report/create-report-drawer";
import { cn } from "@/lib/utils";
import { Bell, Home, MapPin, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
	return (
		<div className="w-full py-4 px-6 lg:px-24 z-[999] sticky top-0 left-0 right-0 border-b bg-background/95 backdrop-blur-md mx-auto">
			<nav className="flex w-full">
				<Link href="/" className="text-primary flex w-full">
					<Image
						src="/logo.png"
						alt="Logo"
						width={300}
						height={100}
						className="h-8 w-auto"
						priority
					/>
				</Link>
			</nav>
		</div>
	);
}

export function BottomNavigation() {
	const pathname = usePathname();

	const navItems = [
		{
			label: "Home",
			href: "/",
			icon: Home,
		},
		{
			label: "Map",
			href: "/map",
			icon: MapPin,
		},
		{
			label: "Notifications",
			href: "/notifications",
			icon: Bell,
		},
		{
			label: "Profile",
			href: "/profile",
			icon: User,
		},
	];

	return (
		<div className="sticky bottom-0 left-0 right-0 z-[999] border-t bg-background/95 backdrop-blur-md max-w-screen-sm mx-auto">
			<nav className="flex justify-around items-center h-16">
				{navItems.map((item, index) => (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex flex-col items-center justify-center w-full h-full",
							pathname === item.href ? "text-primary" : "text-muted-foreground",
						)}
					>
						<item.icon className="w-5 h-5" />
						<span className="text-xs mt-1">{item.label}</span>
					</Link>
				))}
			</nav>

			<div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
				<CreateReportDrawer>
					<div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-6 h-6"
						>
							<path d="M5 12h14" />
							<path d="M12 5v14" />
						</svg>
					</div>
				</CreateReportDrawer>
			</div>
		</div>
	);
}
