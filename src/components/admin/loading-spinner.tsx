import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
	className?: string;
	size?: "sm" | "md" | "lg";
	text?: string;
}

export default function LoadingSpinner({
	className,
	size = "md",
	text,
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div className={cn("flex flex-col items-center justify-center", className)}>
			<Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
			{text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
		</div>
	);
}
