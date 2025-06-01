"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useMemo } from "react";
import { Card, CardContent } from "../ui/card";

// Types
interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	itemsPerPage?: number;
	totalItems?: number;
	itemName?: string;
	compact?: boolean;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
	itemsPerPage = 10,
	totalItems,
	itemName = "item",
	compact = false,
}: PaginationProps) {
	// Calculate displayed item range for info text
	const itemRange = useMemo(() => {
		const start = Math.max((currentPage - 1) * itemsPerPage + 1, 1);
		const total = totalItems || totalPages * itemsPerPage;
		const end = Math.min(currentPage * itemsPerPage, total);
		return { start, end, total };
	}, [currentPage, itemsPerPage, totalItems, totalPages]);

	// Navigation callbacks
	const goToPrevPage = useCallback(
		() => onPageChange(Math.max(1, currentPage - 1)),
		[currentPage, onPageChange],
	);

	const goToNextPage = useCallback(
		() => onPageChange(Math.min(totalPages, currentPage + 1)),
		[currentPage, totalPages, onPageChange],
	);

	// Show pagination only if there's multiple pages or we have items to show
	if (totalPages <= 0 || itemRange.total <= 0) return null;

	// Button states
	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	return (
		<Card>
			<CardContent className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between gap-4 p-4">
				{/* Range indicator */}
				<div className="text-sm text-muted-foreground flex items-center gap-1">
					<span className="hidden sm:inline-block">Menampilkan </span>
					<span
						className={cn("font-medium tabular-nums", compact && "text-xs")}
					>
						{itemRange.start}-{itemRange.end}
					</span>{" "}
					<span>dari </span>
					<span className="font-medium tabular-nums">{itemRange.total}</span>{" "}
					<span className={compact ? "hidden xs:inline" : ""}>{itemName}</span>
				</div>

				{/* Navigation buttons */}
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size={compact ? "sm" : "default"}
						className={cn(
							"border-border/40",
							"hover:bg-muted/20 hover:text-foreground",
							compact ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm",
							isFirstPage && "opacity-50 pointer-events-none",
						)}
						onClick={goToPrevPage}
						disabled={isFirstPage}
						aria-label="Halaman sebelumnya"
					>
						Sebelumnya
					</Button>

					<Button
						variant="outline"
						size={compact ? "sm" : "default"}
						className={cn(
							"border-border/40",
							"hover:bg-muted/20 hover:text-foreground",
							compact ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm",
							isLastPage && "opacity-50 pointer-events-none",
						)}
						onClick={goToNextPage}
						disabled={isLastPage}
						aria-label="Halaman selanjutnya"
					>
						Selanjutnya
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
