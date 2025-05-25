"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type React from "react";

// Helper function to create a sortable header
export function createSortableHeader(label: string, accessorKey: string) {
	return ({ column }) => {
		return (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="p-0 hover:bg-transparent"
			>
				{label}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		);
	};
}

// Helper function to create a status badge
export function createStatusBadge(status: string) {
	switch (status) {
		case "active":
			return (
				<Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
					Active
				</Badge>
			);
		case "inactive":
			return (
				<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">
					Inactive
				</Badge>
			);
		case "suspended":
			return (
				<Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200">
					Suspended
				</Badge>
			);
		case "waiting":
			return (
				<Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
					Pending
				</Badge>
			);
		case "processing":
			return (
				<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
					In Progress
				</Badge>
			);
		case "completed":
			return (
				<Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
					Completed
				</Badge>
			);
		case "rejected":
			return (
				<Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200">
					Rejected
				</Badge>
			);
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
}

// Helper function to create a role badge
export function createRoleBadge(role: string) {
	switch (role) {
		case "admin":
			return (
				<Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">
					Admin
				</Badge>
			);
		case "moderator":
			return (
				<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
					Moderator
				</Badge>
			);
		case "user":
			return <Badge variant="outline">User</Badge>;
		default:
			return <Badge variant="outline">{role}</Badge>;
	}
}

// Helper function to create an avatar with name
export function createAvatarWithName(name: string, email: string) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	return (
		<div className="flex items-center gap-3">
			<Avatar className="h-8 w-8">
				<AvatarFallback className="bg-primary/10 text-primary text-xs">
					{initials}
				</AvatarFallback>
			</Avatar>
			<div>
				<div className="font-medium">{name}</div>
				<div className="text-sm text-muted-foreground">{email}</div>
			</div>
		</div>
	);
}

// Helper function to create an actions dropdown
export function createActionsDropdown(
	actions: {
		label: string;
		icon: React.ReactNode;
		onClick: (row: any) => void;
	}[],
) {
	return ({ row }) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{actions.map((action, index) => (
						<DropdownMenuItem
							key={index}
							onClick={() => action.onClick(row.original)}
						>
							{action.icon}
							{action.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};
}
