import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReportStatus } from "@/types/report";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

interface ReportStatusBadgeProps {
	status: ReportStatus;
	size?: "sm" | "md" | "lg";
	showIcon?: boolean;
}

export default function ReportStatusBadge({
	status,
	size = "sm",
	showIcon = true,
}: ReportStatusBadgeProps) {
	const getStatusConfig = (status: ReportStatus) => {
		switch (status) {
			case "pending":
				return {
					label: "Menunggu",
					icon: Clock,
					className:
						"bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/50",
				};
			case "in_progress":
				return {
					label: "Proses",
					icon: AlertTriangle,
					className:
						"bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/50",
				};
			case "completed":
				return {
					label: "Selesai",
					icon: CheckCircle,
					className:
						"bg-green-100 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-950/70 dark:text-green-300 dark:border-green-800/50",
				};
			case "rejected":
				return {
					label: "Ditolak",
					icon: XCircle,
					className:
						"bg-red-100 text-red-800 hover:bg-red-100 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800/50",
				};
			default:
				return {
					label: "Menunggu",
					icon: Clock,
					className:
						"bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/50",
				};
		}
	};

	const config = getStatusConfig(status);
	const Icon = config.icon;

	const sizeClasses = {
		sm: "text-xs px-1.5 py-0.5 h-5",
		md: "text-xs px-2 py-0.5 h-6",
		lg: "text-sm px-2.5 py-1 h-7",
	};

	const iconSizes = {
		sm: "h-3 w-3",
		md: "h-3.5 w-3.5",
		lg: "h-4 w-4",
	};

	return (
		<Badge
			variant="outline"
			className={cn(
				config.className,
				sizeClasses[size],
				"font-medium rounded-full shadow-sm border backdrop-blur-sm flex items-center gap-1 whitespace-nowrap",
			)}
		>
			{showIcon && <Icon className={cn(iconSizes[size], "flex-shrink-0")} />}
			{config.label}
		</Badge>
	);
}
