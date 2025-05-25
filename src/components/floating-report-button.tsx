import { Plus } from "lucide-react";
import Link from "next/link";

export default function FloatingReportButton() {
	return (
		<Link
			href="/report/new"
			className="fixed bottom-24 right-6 md:bottom-6 md:right-6 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
		>
			<Plus className="w-6 h-6" />
			<span className="sr-only">Create Report</span>
		</Link>
	);
}
