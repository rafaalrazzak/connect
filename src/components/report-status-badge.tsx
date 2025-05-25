import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ReportStatus = "waiting" | "processing" | "completed" | "rejected";

interface ReportStatusBadgeProps {
	status: ReportStatus;
	size?: "sm" | "md" | "lg";
}

export default function ReportStatusBadge({
	status,
	size = "sm",
}: ReportStatusBadgeProps) {
	const getStatusConfig = (status: ReportStatus) => {
		switch (status) {
			case "waiting":
				return {
					label: "Pending",
					className:
						"bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
				};
			case "processing":
				return {
					label: "In Progress",
					className:
						"bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
				};
			case "completed":
				return {
					label: "Completed",
					className:
						"bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
				};
			case "rejected":
				return {
					label: "Rejected",
					className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
				};
			default:
				return {
					label: "Pending",
					className:
						"bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
				};
		}
	};

	const config = getStatusConfig(status);
	const sizeClasses = {
		sm: "text-xs px-2 py-0.5",
		md: "text-sm px-2.5 py-0.5",
		lg: "px-3 py-1",
	};

	return (
		<Badge
			variant="outline"
			className={cn(
				config.className,
				sizeClasses[size],
				"font-medium rounded-full shadow-sm",
			)}
		>
			{config.label}
		</Badge>
	);
}
