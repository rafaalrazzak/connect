import { cn } from "@/lib/utils";
import type React from "react";

interface PageHeaderProps {
	title: string;
	description?: string;
	children?: React.ReactNode;
	className?: string;
}

export default function PageHeader({
	title,
	description,
	children,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
				className,
			)}
		>
			<div>
				<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
				{description && (
					<p className="text-muted-foreground mt-1">{description}</p>
				)}
			</div>
			{children && (
				<div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
					{children}
				</div>
			)}
		</div>
	);
}
