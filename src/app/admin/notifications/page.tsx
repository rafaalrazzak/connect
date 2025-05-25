"use client";

import LoadingSpinner from "@/components/admin/loading-spinner";
import PageHeader from "@/components/admin/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Bell, CheckCircle, RefreshCw, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Sample notifications data
const notifications = [
	{
		id: "notif-001",
		title: "New Report Submitted",
		description:
			"A new report has been submitted for Road Damage at Main Street.",
		time: "5 minutes ago",
		read: false,
		user: {
			name: "John Doe",
			avatar: "JD",
		},
		type: "report",
	},
	{
		id: "notif-002",
		title: "Report Status Updated",
		description: "The report #REP-2023-0568 has been marked as In Progress.",
		time: "1 hour ago",
		read: false,
		user: {
			name: "Admin System",
			avatar: "AS",
		},
		type: "status",
	},
	{
		id: "notif-003",
		title: "New Comment",
		description:
			"Sarah Brown commented on report #REP-2023-0542: 'When will this be fixed?'",
		time: "3 hours ago",
		read: true,
		user: {
			name: "Sarah Brown",
			avatar: "SB",
		},
		type: "comment",
	},
	{
		id: "notif-004",
		title: "New User Registered",
		description: "A new user Michael Wilson has registered to the platform.",
		time: "Yesterday",
		read: true,
		user: {
			name: "Michael Wilson",
			avatar: "MW",
		},
		type: "user",
	},
	{
		id: "notif-005",
		title: "Report Assigned",
		description:
			"Report #REP-2023-0539 has been assigned to Public Works Department.",
		time: "Yesterday",
		read: true,
		user: {
			name: "Admin System",
			avatar: "AS",
		},
		type: "assignment",
	},
	{
		id: "notif-006",
		title: "System Update",
		description:
			"The system will undergo maintenance on Sunday, May 19th from 2am to 4am.",
		time: "2 days ago",
		read: true,
		user: {
			name: "System",
			avatar: "SY",
		},
		type: "system",
	},
];

export default function AdminNotifications() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");
	const [notificationsList, setNotificationsList] = useState(notifications);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Simulate data loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleRefresh = () => {
		setIsRefreshing(true);

		// Simulate API call
		setTimeout(() => {
			setIsRefreshing(false);
			toast({
				title: "Notifications Refreshed",
				description: "Your notifications have been updated.",
			});
		}, 1500);
	};

	const handleMarkAllAsRead = () => {
		setNotificationsList(
			notificationsList.map((notification) => ({
				...notification,
				read: true,
			})),
		);

		toast({
			title: "Marked as Read",
			description: "All notifications have been marked as read.",
		});
	};

	const handleClearAll = () => {
		setNotificationsList([]);

		toast({
			title: "Notifications Cleared",
			description: "All notifications have been cleared.",
		});
	};

	const handleMarkAsRead = (id: string) => {
		setNotificationsList(
			notificationsList.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification,
			),
		);

		toast({
			title: "Marked as Read",
			description: "Notification has been marked as read.",
		});
	};

	const handleDelete = (id: string) => {
		setNotificationsList(
			notificationsList.filter((notification) => notification.id !== id),
		);

		toast({
			title: "Notification Deleted",
			description: "The notification has been removed.",
		});
	};

	// Filter notifications based on active tab
	const getFilteredNotifications = () => {
		if (activeTab === "all") return notificationsList;
		if (activeTab === "unread")
			return notificationsList.filter((notification) => !notification.read);

		// Filter by type
		return notificationsList.filter(
			(notification) => notification.type === activeTab,
		);
	};

	const filteredNotifications = getFilteredNotifications();
	const unreadCount = notificationsList.filter(
		(notification) => !notification.read,
	).length;

	if (isLoading) {
		return (
			<div className="h-[calc(100vh-120px)] flex items-center justify-center">
				<LoadingSpinner size="lg" text="Loading notifications..." />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Notifications"
				description="Manage system notifications and alerts"
			>
				<Button
					variant="outline"
					onClick={handleRefresh}
					disabled={isRefreshing}
				>
					{isRefreshing ? (
						<>
							<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
							Refreshing...
						</>
					) : (
						<>
							<RefreshCw className="mr-2 h-4 w-4" />
							Refresh
						</>
					)}
				</Button>
				<Button
					variant="outline"
					onClick={handleMarkAllAsRead}
					disabled={unreadCount === 0}
				>
					<CheckCircle className="mr-2 h-4 w-4" />
					Mark All as Read
				</Button>
			</PageHeader>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Notifications List */}
				<div className="md:col-span-3 space-y-6">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-center">
								<div>
									<CardTitle>Notifications</CardTitle>
									<CardDescription>
										View and manage your notifications
									</CardDescription>
								</div>
								{notificationsList.length > 0 && (
									<Button variant="ghost" size="sm" onClick={handleClearAll}>
										<Trash2 className="mr-2 h-4 w-4" />
										Clear All
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<Tabs
								defaultValue="all"
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="w-full grid grid-cols-6">
									<TabsTrigger value="all" className="relative">
										All
										{unreadCount > 0 && (
											<Badge className="ml-1 bg-primary text-primary-foreground absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-xs">
												{unreadCount}
											</Badge>
										)}
									</TabsTrigger>
									<TabsTrigger value="unread">Unread</TabsTrigger>
									<TabsTrigger value="report">Reports</TabsTrigger>
									<TabsTrigger value="comment">Comments</TabsTrigger>
									<TabsTrigger value="user">Users</TabsTrigger>
									<TabsTrigger value="system">System</TabsTrigger>
								</TabsList>

								<TabsContent value={activeTab} className="mt-6">
									{filteredNotifications.length === 0 ? (
										<div className="text-center py-12">
											<Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
											<p className="font-medium">No notifications</p>
											<p className="text-sm text-muted-foreground mt-1">
												{activeTab === "all"
													? "You don't have any notifications yet."
													: activeTab === "unread"
														? "You don't have any unread notifications."
														: `You don't have any ${activeTab} notifications.`}
											</p>
										</div>
									) : (
										<div className="space-y-1">
											{filteredNotifications.map((notification) => (
												<div
													key={notification.id}
													className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${
														notification.read ? "bg-background" : "bg-muted"
													}`}
												>
													<Avatar className="h-10 w-10">
														<AvatarFallback className="bg-primary/10 text-primary">
															{notification.user.avatar}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1 min-w-0">
														<div className="flex justify-between items-start">
															<div>
																<p className="font-medium">
																	{notification.title}
																</p>
																<p className="text-sm text-muted-foreground mt-1">
																	{notification.description}
																</p>
															</div>
															<p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
																{notification.time}
															</p>
														</div>
														<div className="flex justify-end gap-2 mt-2">
															{!notification.read && (
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleMarkAsRead(notification.id)
																	}
																>
																	Mark as read
																</Button>
															)}
															<Button
																variant="ghost"
																size="sm"
																className="text-destructive hover:text-destructive"
																onClick={() => handleDelete(notification.id)}
															>
																Delete
															</Button>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>

				{/* Settings Sidebar */}
				<div className="md:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Settings className="h-5 w-5" />
								Notification Settings
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Email Notifications</h3>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label htmlFor="email-reports" className="text-sm">
											New Reports
										</Label>
										<Switch id="email-reports" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="email-comments" className="text-sm">
											New Comments
										</Label>
										<Switch id="email-comments" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="email-users" className="text-sm">
											User Registrations
										</Label>
										<Switch id="email-users" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="email-system" className="text-sm">
											System Updates
										</Label>
										<Switch id="email-system" defaultChecked />
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-sm font-medium">In-App Notifications</h3>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label htmlFor="app-reports" className="text-sm">
											New Reports
										</Label>
										<Switch id="app-reports" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="app-comments" className="text-sm">
											New Comments
										</Label>
										<Switch id="app-comments" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="app-users" className="text-sm">
											User Registrations
										</Label>
										<Switch id="app-users" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="app-system" className="text-sm">
											System Updates
										</Label>
										<Switch id="app-system" defaultChecked />
									</div>
								</div>
							</div>

							<Button className="w-full">Save Preferences</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
