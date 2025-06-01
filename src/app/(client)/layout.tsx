import { BottomNavigation } from "@/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-background">
			<main className="max-w-screen-sm mx-auto min-h-screen">{children}</main>
			<BottomNavigation />
		</div>
	);
}
