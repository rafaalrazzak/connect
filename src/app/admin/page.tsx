"use client";

import ChartContainer from "@/components/admin/dashboard/chart-container";
import StatCard from "@/components/admin/dashboard/stat-card";
import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Clock, FileText, Users } from "lucide-react";
import { Download, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export default function AdminDashboard() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
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
				title: "Dasbor Diperbarui",
				description: "Data dasbor sudah diperbarui.",
			});
		}, 1500);
	};

	// Sample data for charts
	const reportsByCategory = [
		{ name: "Kerusakan Jalan", value: 35 },
		{ name: "Lampu Jalan", value: 25 },
		{ name: "Masalah Sampah", value: 20 },
		{ name: "Ketertiban Umum", value: 10 },
		{ name: "Fasilitas Umum", value: 15 },
	];

	const reportsByStatus = [
		{ name: "Menunggu", value: 30, color: "#f59e0b" },
		{ name: "Diproses", value: 45, color: "#3b82f6" },
		{ name: "Selesai", value: 20, color: "#10b981" },
		{ name: "Ditolak", value: 5, color: "#ef4444" },
	];

	const reportsTrend = [
		{ name: "Jan", reports: 65 },
		{ name: "Feb", reports: 59 },
		{ name: "Mar", reports: 80 },
		{ name: "Apr", reports: 81 },
		{ name: "May", reports: 56 },
		{ name: "Jun", reports: 55 },
		{ name: "Jul", reports: 40 },
	];

	const responseTime = [
		{ name: "Mon", time: 24 },
		{ name: "Tue", time: 22 },
		{ name: "Wed", time: 26 },
		{ name: "Thu", time: 23 },
		{ name: "Fri", time: 20 },
		{ name: "Sat", time: 18 },
		{ name: "Sun", time: 16 },
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Dasbor"
				description="Ringkasan performa sistem dan metrik utama"
			>
				<Button
					variant="outline"
					onClick={handleRefresh}
					disabled={isRefreshing}
				>
					{isRefreshing ? (
						<>
							<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
							Memperbarui...
						</>
					) : (
						<>
							<RefreshCw className="mr-2 h-4 w-4" />
							Perbarui
						</>
					)}
				</Button>
				<Button>
					<Download className="mr-2 h-4 w-4" />
					Ekspor
				</Button>
			</PageHeader>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Laporan"
					value="2,853"
					icon={<FileText className="h-4 w-4 text-primary" />}
					change={{ value: "12.5%", isPositive: true }}
					subtitle="+24 dari kemarin"
					isLoading={isLoading}
				/>
				<StatCard
					title="Pengguna Aktif"
					value="10,482"
					icon={<Users className="h-4 w-4 text-primary" />}
					change={{ value: "8.2%", isPositive: true }}
					subtitle="+189 minggu ini"
					isLoading={isLoading}
				/>
				<StatCard
					title="Tingkat Penyelesaian"
					value="85.4%"
					icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
					change={{ value: "2.1%", isPositive: false }}
					subtitle="-0.5% dari bulan lalu"
					isLoading={isLoading}
				/>
				<StatCard
					title="Rata-rata Waktu Respons"
					value="24h"
					icon={<Clock className="h-4 w-4 text-primary" />}
					change={{ value: "5.3%", isPositive: true }}
					subtitle="Membaik 2 jam"
					isLoading={isLoading}
				/>
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				<ChartContainer
					title="Laporan per Kategori"
					description="Distribusi laporan berdasarkan kategori"
					contentClassName="px-2 pb-2"
					isLoading={isLoading}
				>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={reportsByCategory}
								layout="vertical"
								margin={{ left: 25 }}
							>
								<CartesianGrid strokeDasharray="3 3" horizontal={false} />
								<XAxis type="number" />
								<YAxis dataKey="name" type="category" width={100} />
								<Tooltip
									contentStyle={{
										backgroundColor: "white",
										borderRadius: "8px",
										border: "1px solid #e2e8f0",
									}}
								/>
								<Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</ChartContainer>

				<ChartContainer
					title="Laporan per Status"
					description="Status terkini semua laporan yang masuk"
					contentClassName="px-2 pb-2"
					isLoading={isLoading}
				>
					<div className="h-80 flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={reportsByStatus}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
									labelLine={false}
								>
									{reportsByStatus.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "white",
										borderRadius: "8px",
										border: "1px solid #e2e8f0",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
					<div className="flex justify-center gap-4 mt-2 pb-4">
						{reportsByStatus.map((status, index) => (
							<div key={index} className="flex items-center">
								<div
									className="w-3 h-3 rounded-full mr-1"
									style={{ backgroundColor: status.color }}
								></div>
								<span className="text-xs">{status.name}</span>
							</div>
						))}
					</div>
				</ChartContainer>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<ChartContainer
					title="Tren Laporan"
					description="Jumlah laporan yang masuk dari waktu ke waktu"
					contentClassName="px-2 pb-2"
					isLoading={isLoading}
				>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={reportsTrend}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip
									contentStyle={{
										backgroundColor: "white",
										borderRadius: "8px",
										border: "1px solid #e2e8f0",
									}}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="reports"
									stroke="#3b82f6"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</ChartContainer>

				<ChartContainer
					title="Waktu Respons"
					description="Rata-rata waktu respons dalam jam per hari"
					contentClassName="px-2 pb-2"
					isLoading={isLoading}
				>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={responseTime}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip
									contentStyle={{
										backgroundColor: "white",
										borderRadius: "8px",
										border: "1px solid #e2e8f0",
									}}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="time"
									stroke="#10b981"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</ChartContainer>
			</div>
		</div>
	);
}
