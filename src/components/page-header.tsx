import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function PageHeader({
	title,
	description,
	children,
	titleComponent,
	backButton = true,
}: {
	title: string;
	description?: string;
	children?: React.ReactNode;
	titleComponent?: React.ReactNode;
	backButton?: boolean;
}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center space-x-3 justify-between">
				<div className="flex gap-1 items-center">
					{backButton && (
						<Link href="/">
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full hover:bg-muted/80"
							>
								<ChevronLeft className="h-5 w-5" />
								<span className="sr-only">Kembali</span>
							</Button>
						</Link>
					)}
					<div className="flex gap-1">
						<h1 className="text-xl font-bold">{title}</h1>
						{titleComponent}
					</div>
				</div>

				{children}
			</div>
			{description && (
				<p className="text-sm text-muted-foreground mt-1">{description}</p>
			)}
		</div>
	);
}
