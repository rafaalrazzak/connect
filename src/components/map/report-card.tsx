import { formatRelative } from "date-fns";
import { id } from "date-fns/locale";
import { X } from "lucide-react";
import Link from "next/link";

import ReportStatusBadge from "@/components/report-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Report } from "@/types/report";

interface MapReportCardProps {
	report: Report;
	onClose: () => void;
}

export function MapReportCard({ report, onClose }: MapReportCardProps) {
	// Format the date properly
	const formattedDate =
		typeof report.date === "string"
			? formatRelative(new Date(report.date), new Date(), { locale: id })
			: report.date instanceof Date
				? formatRelative(report.date, new Date(), { locale: id })
				: "Tanggal tidak tersedia";

	return (
		<Card className="w-full shadow-lg border-muted/60 backdrop-blur-sm bg-card/95">
			<CardContent className="p-4 relative">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 absolute right-2 top-2 rounded-full hover:bg-muted/80 z-10"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onClose();
					}}
				>
					<X className="h-4 w-4" />
				</Button>

				<Link href={`/report/${report.id}`} className="block">
					<div className="flex gap-4">
						<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
							<img
								src={report.imageUrls[0] || "/placeholder.svg"}
								alt={report.title}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
						<div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
							<div className="flex justify-between items-start gap-2">
								<h3 className="font-medium line-clamp-1 text-sm sm:text-base">
									{report.title}
								</h3>
								<ReportStatusBadge status={report.status} />
							</div>
							<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
								{report.location}
							</p>
							<p className="text-xs sm:text-sm text-muted-foreground">
								{formattedDate}
							</p>

							<div className="pt-2">
								<Button size="sm" className="w-full sm:w-auto rounded-full">
									Lihat Detail
								</Button>
							</div>
						</div>
					</div>
				</Link>
			</CardContent>
		</Card>
	);
}
