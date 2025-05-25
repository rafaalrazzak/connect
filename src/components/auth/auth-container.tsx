import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";

interface AuthContainerProps {
	children: React.ReactNode;
	className?: string;
}

export default function AuthContainer({
	children,
	className,
}: AuthContainerProps) {
	return (
		<div className="min-h-screen w-full flex">
			<div
				className={cn(
					"w-full flex flex-col justify-center items-center p-6",
					className,
				)}
			>
				<div className="w-full mx-auto">{children}</div>
			</div>
		</div>
	);
}
