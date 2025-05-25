"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
	BarChart3,
	Bell,
	FileText,
	HelpCircle,
	Home,
	LogOut,
	Map,
	Menu,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<SidebarProvider defaultOpen={!isMobile}>
			<MobileSidebarTrigger />
			<Sidebar variant="inset" className="border-r border-border">
				<SidebarHeader className="border-b">
					<div className="flex items-center gap-2 px-4 py-3">
						<div className="flex items-center gap-2 flex-1">
							<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
									<circle cx="9" cy="7" r="4"></circle>
									<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
									<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
								</svg>
							</div>
							<div className="font-semibold text-lg">Citizen Connect</div>
						</div>
						<SidebarTrigger />
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Main</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname === "/admin"}
										tooltip="Dashboard"
									>
										<Link href="/admin">
											<BarChart3 className="h-5 w-5" />
											<span>Dashboard</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith("/admin/reports")}
										tooltip="Reports"
									>
										<Link href="/admin/reports">
											<FileText className="h-5 w-5" />
											<span>Reports</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith("/admin/users")}
										tooltip="Users"
									>
										<Link href="/admin/users">
											<Users className="h-5 w-5" />
											<span>Users</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith("/admin/map")}
										tooltip="Map"
									>
										<Link href="/admin/map">
											<Map className="h-5 w-5" />
											<span>Map View</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarGroup>
						<SidebarGroupLabel>System</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith("/admin/notifications")}
										tooltip="Notifications"
									>
										<Link href="/admin/notifications">
											<Bell className="h-5 w-5" />
											<span>Notifications</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith("/admin/settings")}
										tooltip="Settings"
									>
										<Link href="/admin/settings">
											<Settings className="h-5 w-5" />
											<span>Settings</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith("/admin/help")}
										tooltip="Help"
									>
										<Link href="/admin/help">
											<HelpCircle className="h-5 w-5" />
											<span>Help & Support</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className="border-t">
					<div className="p-4">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild tooltip="Back to App">
									<Link href="/">
										<Home className="h-5 w-5" />
										<span>Back to App</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild tooltip="Logout">
									<Link href="/login">
										<LogOut className="h-5 w-5" />
										<span>Logout</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</div>
					<AdminProfile />
				</SidebarFooter>
			</Sidebar>
		</SidebarProvider>
	);
}

function MobileSidebarTrigger() {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			variant="ghost"
			size="icon"
			className="fixed top-4 left-4 z-50 md:hidden"
			onClick={toggleSidebar}
			aria-label="Toggle Menu"
		>
			<Menu className="h-5 w-5" />
		</Button>
	);
}

function AdminProfile() {
	const { state } = useSidebar();

	return (
		<div className="p-4 border-t">
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarImage
						src="/placeholder.svg?height=40&width=40"
						alt="Admin User"
					/>
					<AvatarFallback className="bg-primary/10 text-primary">
						AD
					</AvatarFallback>
				</Avatar>
				{state === "expanded" && (
					<div className="flex-1 min-w-0">
						<p className="font-medium truncate">Admin User</p>
						<p className="text-sm text-muted-foreground truncate">
							admin@citizenconnect.com
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
