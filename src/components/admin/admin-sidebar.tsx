"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	BarChart3,
	Bell,
	FileText,
	Home,
	LogOut,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
	return (
		<SidebarProvider defaultOpen={true}>
			<Sidebar>
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
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={usePathname() === "/admin"}>
								<Link href="/admin">
									<BarChart3 className="h-5 w-5" />
									<span>Dashboard</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								isActive={usePathname() === "/admin/reports"}
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
								isActive={usePathname() === "/admin/users"}
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
								isActive={usePathname() === "/admin/notifications"}
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
								isActive={usePathname() === "/admin/settings"}
							>
								<Link href="/admin/settings">
									<Settings className="h-5 w-5" />
									<span>Settings</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter className="border-t">
					<div className="p-4">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/">
										<Home className="h-5 w-5" />
										<span>Back to App</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
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

function AdminProfile() {
	const { state } = useSidebar();

	return (
		<div className="p-4 border-t">
			<div className="flex items-center gap-3">
				<Avatar>
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
