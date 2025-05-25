"use client";

import {
	createActionsDropdown,
	createAvatarWithName,
	createRoleBadge,
	createSortableHeader,
	createStatusBadge,
} from "@/components/admin/data-table/columns";
import { DataTable } from "@/components/admin/data-table/data-table";
import LoadingSpinner from "@/components/admin/loading-spinner";
import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Eye, Shield, UserPlus, UserX, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Sample user data
const users = [
	{
		id: "USR001",
		name: "John Doe",
		email: "john.doe@example.com",
		role: "user",
		status: "active",
		reports: 12,
		joined: "May 10, 2023",
		lastActive: "Today",
	},
	{
		id: "USR002",
		name: "Jane Smith",
		email: "jane.smith@example.com",
		role: "user",
		status: "active",
		reports: 8,
		joined: "June 15, 2023",
		lastActive: "Yesterday",
	},
	{
		id: "USR003",
		name: "Robert Johnson",
		email: "robert.johnson@example.com",
		role: "moderator",
		status: "active",
		reports: 5,
		joined: "April 22, 2023",
		lastActive: "3 days ago",
	},
	{
		id: "USR004",
		name: "Emily Davis",
		email: "emily.davis@example.com",
		role: "admin",
		status: "active",
		reports: 0,
		joined: "January 5, 2023",
		lastActive: "Today",
	},
	{
		id: "USR005",
		name: "Michael Wilson",
		email: "michael.wilson@example.com",
		role: "user",
		status: "inactive",
		reports: 3,
		joined: "March 18, 2023",
		lastActive: "2 weeks ago",
	},
	{
		id: "USR006",
		name: "Sarah Brown",
		email: "sarah.brown@example.com",
		role: "user",
		status: "suspended",
		reports: 7,
		joined: "February 9, 2023",
		lastActive: "1 month ago",
	},
	{
		id: "USR007",
		name: "David Miller",
		email: "david.miller@example.com",
		role: "user",
		status: "active",
		reports: 15,
		joined: "July 3, 2023",
		lastActive: "Today",
	},
	{
		id: "USR008",
		name: "Jennifer Taylor",
		email: "jennifer.taylor@example.com",
		role: "moderator",
		status: "active",
		reports: 9,
		joined: "August 27, 2023",
		lastActive: "Yesterday",
	},
	{
		id: "USR009",
		name: "James Anderson",
		email: "james.anderson@example.com",
		role: "user",
		status: "active",
		reports: 4,
		joined: "September 14, 2023",
		lastActive: "4 days ago",
	},
	{
		id: "USR010",
		name: "Lisa Thomas",
		email: "lisa.thomas@example.com",
		role: "user",
		status: "inactive",
		reports: 2,
		joined: "October 8, 2023",
		lastActive: "3 weeks ago",
	},
];

type User = {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
	reports: number;
	joined: string;
	lastActive: string;
};

export default function AdminUsers() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);

	// Simulate data loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleUserAction = (user: User, action: string) => {
		// In a real app, this would call an API
		toast({
			title: "Aksi Pengguna",
			description: `Aksi ${action} dilakukan pada pengguna ${user.id}`,
		});
	};

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "name",
			header: createSortableHeader("Pengguna", "name"),
			cell: ({ row }) =>
				createAvatarWithName(row.original.name, row.original.email),
		},
		{
			accessorKey: "role",
			header: createSortableHeader("Peran", "role"),
			cell: ({ row }) => createRoleBadge(row.getValue("role")),
			enableHiding: true,
		},
		{
			accessorKey: "status",
			header: createSortableHeader("Status", "status"),
			cell: ({ row }) => createStatusBadge(row.getValue("status")),
			enableHiding: true,
		},
		{
			accessorKey: "reports",
			header: createSortableHeader("Laporan", "reports"),
			cell: ({ row }) => row.getValue("reports"),
			enableHiding: true,
		},
		{
			accessorKey: "joined",
			header: createSortableHeader("Bergabung", "joined"),
			cell: ({ row }) => row.getValue("joined"),
			enableHiding: true,
		},
		{
			accessorKey: "lastActive",
			header: createSortableHeader("Terakhir Aktif", "lastActive"),
			cell: ({ row }) => row.getValue("lastActive"),
			enableHiding: true,
		},
		{
			id: "actions",
			cell: createActionsDropdown([
				{
					label: "Lihat Profil",
					icon: <Eye className="mr-2 h-4 w-4" />,
					onClick: (user: User) => handleUserAction(user, "view"),
				},
				{
					label: "Ubah Peran",
					icon: <Shield className="mr-2 h-4 w-4" />,
					onClick: (user: User) => handleUserAction(user, "change-role"),
				},
				{
					label: "Suspend Pengguna",
					icon: <UserX className="mr-2 h-4 w-4" />,
					onClick: (user: User) => handleUserAction(user, "suspend"),
				},
			]),
		},
	];

	if (isLoading) {
		return (
			<div className="h-[calc(100vh-120px)] flex items-center justify-center">
				<LoadingSpinner size="lg" text="Loading users..." />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader title="Pengguna" description="Kelola akun pengguna dan izin">
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Ekspor
				</Button>
				<Button>
					<UserPlus className="mr-2 h-4 w-4" />
					Tambah Pengguna
				</Button>
			</PageHeader>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle>Pengguna</CardTitle>
					<CardDescription>Kelola akun pengguna dan izin</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={users}
						searchPlaceholder="Cari pengguna..."
						searchColumn="name"
						emptyState={{
							icon: <Users className="h-12 w-12" />,
							title: "Tidak ada pengguna ditemukan",
							description: "Coba sesuaikan kriteria pencarian",
							action: {
								label: "Hapus filter",
								onClick: () => window.location.reload(),
							},
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
