import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type React from "react";

interface StatCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	change?: {
		value: string;
		isPositive: boolean;
	};
	subtitle?: string;
	className?: string;
	isLoading?: boolean;
}

export default function StatCard({
	title,
	value,
	icon,
	change,
	subtitle,
	className,
	isLoading,
}: StatCardProps) {
	if (isLoading) {
		return (
			<Card className={cn("overflow-hidden", className)}>
				<CardContent className="p-6">
					<div className="flex items-center justify-between space-y-0 pb-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
					<div className="flex items-baseline justify-between">
						<Skeleton className="h-8 w-16" />
						<Skeleton className="h-4 w-16" />
					</div>
					<Skeleton className="h-3 w-32 mt-1" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			className={cn(
				"overflow-hidden transition-all hover:shadow-md",
				className,
			)}
		>
			<CardContent className="p-6">
				<div className="flex items-center justify-between space-y-0 pb-2">
					<p className="text-sm font-medium text-muted-foreground">{title}</p>
					<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
						{icon}
					</div>
				</div>
				<div className="flex items-baseline justify-between">
					<div className="text-2xl font-bold">{value}</div>
					{change && (
						<div
							className={cn(
								"flex items-center text-sm font-medium",
								change.isPositive ? "text-emerald-600" : "text-rose-600",
							)}
						>
							{change.isPositive ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="w-4 h-4 mr-1"
								>
									<path
										fillRule="evenodd"
										d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
										clipRule="evenodd"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="w-4 h-4 mr-1"
								>
									<path
										fillRule="evenodd"
										d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.916.369l-4.453-1.498a.75.75 0 01.468-1.424l2.897.968a19.422 19.422 0 00-3.655-6.602L7 10.072l-4.72-4.72a.75.75 0 010-1.06z"
										clipRule="evenodd"
									/>
								</svg>
							)}
							{change.value}
						</div>
					)}
				</div>
				{subtitle && (
					<p className="text-xs text-muted-foreground pt-1">{subtitle}</p>
				)}
			</CardContent>
		</Card>
	);
}
