import { Navbar } from "@/components/navbar";
import type { ReactNode } from "react";

export default function DesignGuidelinesLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col gap-12">
			<Navbar />
			{children}
		</div>
	);
}
