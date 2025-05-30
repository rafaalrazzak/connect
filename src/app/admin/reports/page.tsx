"use client";

import {
	createActionsDropdown,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { reports } from "@/lib/mock-data";
import type { ColumnDef } from "@tanstack/react-table";
import {
	AlertTriangle,
	CheckCircle,
	Download,
	Eye,
	FileText,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Report = {
	id: string;
	title: string;
	reporter: string;
	location: string;
	date: string;
	status: string;
	category?: string;
	description?: string;
	imageUrl?: string;
	timeline?: any[];
	comments?: any[];
	currentStep?: number;
};

export default function AdminReports() {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");

	// Simulate data loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleStatusChange = (report: Report, newStatus: string) => {
		// In a real app, this would update the status via API
		toast({
			title: "Status Diperbarui",
			description: `Laporan ${report.id} telah ditandai sebagai ${getStatusLabel(newStatus)}`,
		});
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "waiting":
				return "Menunggu";
			case "processing":
				return "Diproses";
			case "completed":
				return "Selesai";
			case "rejected":
				return "Ditolak";
			default:
				return status;
		}
	};

	// Filter reports based on active tab
	const getFilteredReports = () => {
		if (activeTab === "all") return reports;

		const statusMap: Record<string, string> = {
			pending: "waiting",
			inprogress: "processing",
			completed: "completed",
			rejected: "rejected",
		};

		return reports.filter((report) => report.status === statusMap[activeTab]);
	};

	const columns: ColumnDef<Report>[] = [
		{
			accessorKey: "id",
			header: createSortableHeader("ID", "id"),
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue("id")}</div>
			),
		},
		{
			accessorKey: "title",
			header: createSortableHeader("Judul", "title"),
			cell: ({ row }) => (
				<div className="max-w-[200px] truncate">{row.getValue("title")}</div>
			),
		},
		{
			accessorKey: "reporter",
			header: createSortableHeader("Pelapor", "reporter"),
			cell: ({ row }) => row.getValue("reporter"),
			enableHiding: true,
		},
		{
			accessorKey: "location",
			header: createSortableHeader("Lokasi", "location"),
			cell: ({ row }) => (
				<div className="max-w-[200px] truncate">{row.getValue("location")}</div>
			),
			enableHiding: true,
		},
		{
			accessorKey: "date",
			header: createSortableHeader("Tanggal", "date"),
			cell: ({ row }) => row.getValue("date"),
			enableHiding: true,
		},
		{
			accessorKey: "status",
			header: createSortableHeader("Status", "status"),
			cell: ({ row }) => createStatusBadge(row.getValue("status")),
		},
		{
			id: "actions",
			cell: createActionsDropdown([
				{
					label: "Lihat Detail",
					icon: <Eye className="mr-2 h-4 w-4" />,
					onClick: (report: Report) =>
						router.push(`/admin/reports/${report.id}`),
				},
				{
					label: "Tandai Selesai",
					icon: <CheckCircle className="mr-2 h-4 w-4" />,
					onClick: (report: Report) => handleStatusChange(report, "completed"),
				},
				{
					label: "Tandai Diproses",
					icon: <AlertTriangle className="mr-2 h-4 w-4" />,
					onClick: (report: Report) => handleStatusChange(report, "processing"),
				},
				{
					label: "Tolak Laporan",
					icon: <XCircle className="mr-2 h-4 w-4" />,
					onClick: (report: Report) => handleStatusChange(report, "rejected"),
				},
			]),
		},
	];

	if (isLoading) {
		return (
			<div className="h-[calc(100vh-120px)] flex items-center justify-center">
				<LoadingSpinner size="lg" text="Loading reports..." />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Laporan"
				description="Kelola dan tanggapi laporan warga"
			>
				<Button>
					<Download className="mr-2 h-4 w-4" />
					Ekspor
				</Button>
			</PageHeader>

			<Tabs
				defaultValue="all"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="w-full max-w-md mx-auto grid grid-cols-5">
					<TabsTrigger value="all">Semua</TabsTrigger>
					<TabsTrigger value="pending">Menunggu</TabsTrigger>
					<TabsTrigger value="inprogress">Diproses</TabsTrigger>
					<TabsTrigger value="completed">Selesai</TabsTrigger>
					<TabsTrigger value="rejected">Ditolak</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-4 mt-6">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle>Laporan</CardTitle>
							<CardDescription>
								Kelola dan tanggapi laporan warga
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DataTable
								columns={columns}
								data={getFilteredReports()}
								searchPlaceholder="Cari laporan..."
								searchColumn="title"
								emptyState={{
									icon: <FileText className="h-12 w-12" />,
									title: "Tidak ada laporan ditemukan",
									description: "Coba sesuaikan pencarian atau kriteria filter",
									action: {
										label: "Hapus filter",
										onClick: () => setActiveTab("all"),
									},
								}}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
