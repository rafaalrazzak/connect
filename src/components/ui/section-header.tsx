import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeaderProps {
	title: string | ReactNode;
	href?: string;
	linkText?: string;
}

export function SectionHeader({
	title,
	href,
	linkText = "Lihat semua",
}: SectionHeaderProps) {
	return (
		<CardHeader className="p-4 flex flex-row items-center justify-between">
			<CardTitle className="text-base font-medium">{title}</CardTitle>
			{href && (
				<Link
					href={href}
					className="text-primary text-xs flex items-center group"
				>
					{linkText}
					<ChevronRight className="ml-0.5 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
				</Link>
			)}
		</CardHeader>
	);
}
