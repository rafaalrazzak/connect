import { Badge } from "@/components/ui/badge";
import type { Report } from "@/types/report";
import { Calendar, MapPin, User } from "lucide-react";
import { memo } from "react";

const DataPoint = memo(function DataPoint({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="flex flex-col space-y-1">
			<p className="text-xs font-medium text-muted-foreground">{label}</p>
			<div className="text-sm">{value}</div>
		</div>
	);
});

export function ReportInfo({ report }: { report: Report }) {
	// Helper functions for category display
	const getCategoryName = () => {
		if (typeof report.category === "string") return report.category;
		if (typeof report.category === "object" && report.category?.name)
			return report.category.name;
		return "Umum";
	};

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
			<DataPoint
				label="Lokasi"
				value={
					<div className="flex items-center gap-1">
						<MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
						<span className="line-clamp-1">{report.location || "N/A"}</span>
					</div>
				}
			/>
			<DataPoint
				label="Tanggal"
				value={
					<div className="flex items-center gap-1">
						<Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
						<span>
							{new Date(report.date).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "short",
								year: "numeric",
							})}
						</span>
					</div>
				}
			/>
			<DataPoint
				label="Kategori"
				value={
					<Badge variant="outline" className="bg-muted/40 font-normal">
						{getCategoryName()}
					</Badge>
				}
			/>
			<DataPoint
				label="Pelapor"
				value={
					<div className="flex items-center gap-1">
						<User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
						<span>{report.anonymous ? "Anonim" : "Pengguna"}</span>
					</div>
				}
			/>
		</div>
	);
}
