import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type React from "react";

interface ChartContainerProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	isLoading?: boolean;
	height?: number;
}

export default function ChartContainer({
	title,
	description,
	children,
	className,
	contentClassName,
	isLoading,
	height = 300,
}: ChartContainerProps) {
	if (isLoading) {
		return (
			<Card className={cn("overflow-hidden", className)}>
				<CardHeader className="pb-3">
					<Skeleton className="h-6 w-48 mb-2" />
					{description && <Skeleton className="h-4 w-64" />}
				</CardHeader>
				<CardContent className={cn("p-0", contentClassName)}>
					<Skeleton className={`h-[${height}px] w-full rounded-md`} />
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
			<CardHeader className="pb-3">
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className={cn("p-0", contentClassName)}>
				{children}
			</CardContent>
		</Card>
	);
}
