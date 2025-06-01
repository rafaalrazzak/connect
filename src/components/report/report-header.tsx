"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Report } from "@/types/report";
import { ChevronLeft, Flag, Share2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export function ReportHeader({ report }: { report: Report }) {
	const [isShareSupported, setIsShareSupported] = useState(false);

	// Check if Web Share API is supported
	useEffect(() => {
		setIsShareSupported(!!navigator.share);
	}, []);

	const handleShare = useCallback(async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: `Citizen Connect: ${report.title}`,
					text: `Laporan tentang ${report.title}`,
					url: window.location.href,
				});
			} catch (err) {
				console.error("Error sharing:", err);
			}
		} else {
			// Fallback for browsers that don't support sharing
			navigator.clipboard.writeText(window.location.href);
			alert("Link berhasil disalin ke clipboard!");
		}
	}, [report.title]);

	return (
		<div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-4 -mx-4 py-3 border-b shadow-sm">
			<div className="flex items-center justify-between max-w-screen-md mx-auto">
				<div className="flex items-center gap-3 min-w-0">
					<Link href="/reports">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-full hover:bg-muted/80 shrink-0"
							aria-label="Back to reports"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
					</Link>
					<h1 className="font-semibold text-base sm:text-lg truncate max-w-[220px] sm:max-w-sm md:max-w-md">
						{report.title}
					</h1>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={handleShare}
									aria-label="Share report"
								>
									<Share2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isShareSupported ? "Bagikan" : "Salin link"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-full"
									aria-label="Flag report"
								>
									<Flag className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Laporkan masalah</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}
