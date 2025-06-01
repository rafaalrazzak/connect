import {
	NoReports,
	ReportCard,
	ReportCardSkeleton,
} from "@/components/report-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReports } from "@/hooks/use-reports";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

const popularIssues = [
	"Jalan Rusak",
	"Sampah",
	"Lampu Jalan",
	"Banjir",
	"Keamanan",
	"Fasilitas Umum",
];

export function ReportsTabs() {
	const { isLoading, reports } = useReports();

	return (
		<Tabs defaultValue="latest" className="w-full">
			<TabsList className="grid grid-cols-2">
				<TabsTrigger value="latest">Terbaru</TabsTrigger>
				<TabsTrigger value="trending">Terpopuler</TabsTrigger>
			</TabsList>

			<TabsContent value="latest">
				<Card>
					<SectionHeader title="Laporan Terbaru" href="/reports" />

					<CardContent className="space-y-4">
						{isLoading ? (
							<>
								<ReportCardSkeleton />
								<ReportCardSkeleton />
							</>
						) : reports.length > 0 ? (
							reports.map((report) => (
								<ReportCard key={report.id} report={report} showUpvotes />
							))
						) : (
							<NoReports />
						)}
					</CardContent>

					{!isLoading && reports.length > 0 && (
						<div className="px-4 pb-4">
							<Button variant="outline" className="w-full text-sm" asChild>
								<Link href="/reports">Lihat Semua Laporan</Link>
							</Button>
						</div>
					)}
				</Card>
			</TabsContent>

			<TabsContent value="trending">
				<Card>
					<SectionHeader
						title={
							<span className="flex gap-2 items-center">
								<TrendingUp className="w-4 h-4 text-primary" />
								Isu Populer
							</span>
						}
					/>

					<div className="p-4">
						<div className="flex flex-wrap gap-2 mb-4">
							{popularIssues.map((issue) => (
								<Badge
									key={issue}
									variant="outline"
									className="bg-muted/10 hover:bg-muted/20"
								>
									{issue}
								</Badge>
							))}
						</div>

						<div className="space-y-4">
							{isLoading ? (
								<ReportCardSkeleton />
							) : reports.length > 0 ? (
								reports
									.slice(0, 2)
									.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0))
									.map((report) => (
										<ReportCard key={report.id} report={report} showUpvotes />
									))
							) : (
								<NoReports />
							)}
						</div>
					</div>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
