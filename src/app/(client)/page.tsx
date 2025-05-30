"use client";

import { ChevronRight, FileEdit } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Components
import CategoryCarousel from "@/components/category-carousel";
import {
	NoReports,
	ReportCard,
	ReportCardSkeleton,
} from "@/components/report-card";
import { ReportButton } from "@/components/report/create-report-drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useReportDrawer } from "@/contexts/report-drawer-context";

// Data
import { reports } from "@/lib/mock-data";

function HomeContent() {
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(true);
	const [loadedReports, setLoadedReports] = useState<typeof reports>([]);
	const { openDrawer } = useReportDrawer();

	// Auto-open drawer if query parameter is present
	useEffect(() => {
		const shouldOpenReport = searchParams.has("report");
		if (shouldOpenReport) {
			openDrawer();
		}
	}, [searchParams, openDrawer]);

	// Simulate data fetching
	useEffect(() => {
		const fetchReports = async () => {
			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setLoadedReports(reports.slice(0, 3));
			setIsLoading(false);
		};

		fetchReports();
	}, []);

	return (
		<div className="px-4 py-6 space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">Citizen Connect</h1>
					<p className="text-muted-foreground">
						Laporkan masalah di lingkungan kamu
					</p>
				</div>
				<Avatar className="h-10 w-10 border-2 border-primary/10">
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
			</div>

			{/* Report Button */}
			<ReportButton className="gradient-primary w-full rounded-lg p-5 justify-start text-white shadow-md h-fit items-start">
				<div className="flex space-x-4">
					<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
						<FileEdit className="w-6 h-6" />
					</div>
					<div className="flex items-start flex-col space-y-1">
						<h3 className="font-bold text-lg">Laporkan Masalah</h3>
						<p className="text-sm text-white/80">
							Pelaporan yang mudah dan cepat
						</p>
					</div>
				</div>
			</ReportButton>

			{/* Categories */}
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">Kategori</h2>
					<Link
						href="/categories"
						className="text-primary text-sm flex items-center group"
					>
						Lihat semua{" "}
						<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>
				<CategoryCarousel />
			</div>

			{/* Recent Reports */}
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">Laporan Terbaru</h2>
					<Link
						href="/reports"
						className="text-primary text-sm flex items-center group"
					>
						Lihat semua{" "}
						<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>

				<div className="grid gap-4">
					{isLoading ? (
						<>
							<ReportCardSkeleton />
							<ReportCardSkeleton />
							<ReportCardSkeleton />
						</>
					) : loadedReports.length > 0 ? (
						loadedReports.map((report) => (
							<ReportCard key={report.id} report={report} />
						))
					) : (
						<NoReports />
					)}
				</div>
			</div>
		</div>
	);
}

export default function HomePage() {
	return (
		<Suspense>
			<HomeContent />
		</Suspense>
	);
}
