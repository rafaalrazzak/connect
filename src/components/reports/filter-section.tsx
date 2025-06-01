"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/mock-data";
import type { ReportStatus } from "@/types/report";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, Filter, X } from "lucide-react";
import { Icon } from "../icons";
import { Label } from "../ui/label";

// Status display helper
export const getStatusName = (status: ReportStatus): string => {
	switch (status) {
		case "pending":
			return "Menunggu";
		case "in_progress":
			return "Dalam Proses";
		case "completed":
			return "Selesai";
		case "rejected":
			return "Ditolak";
		default:
			return "Unknown";
	}
};

// Props that match page.tsx usage
interface FilterSectionProps {
	category: string;
	onCategoryChange: (category: string) => void;
	status: ReportStatus | "all";
	onStatusChange: (status: ReportStatus | "all") => void;
	sort: string;
	onSortChange: (sort: string) => void;
	onReset: () => void;
	searchQuery?: string;
}

export function FilterSection({
	category,
	onCategoryChange,
	status,
	onStatusChange,
	sort,
	onSortChange,
	onReset,
}: FilterSectionProps) {
	const hasActiveFilters = category !== "all" || status !== "all";

	return (
		<>
			<div className="flex items-center gap-2">
				{/* Filter button and popover */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={hasActiveFilters ? "default" : "outline"}
							size="sm"
							className="h-11 gap-2 px-4 rounded-xl"
						>
							<Filter className="h-4 w-4" />
							<span className="hidden sm:inline">Filter</span>
							{hasActiveFilters && (
								<Badge className="ml-1 bg-primary-foreground text-primary">
									{(category !== "all" ? 1 : 0) + (status !== "all" ? 1 : 0)}
								</Badge>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent align="end" className="w-[340px] p-5">
						<div className="space-y-5">
							{/* Header */}
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-base">Filter Laporan</h3>
								{hasActiveFilters && (
									<Button
										variant="ghost"
										size="sm"
										onClick={onReset}
										className="h-8"
									>
										Reset
									</Button>
								)}
							</div>

							<div className="space-y-4">
								{/* Category filters */}
								<div className="space-y-3">
									<Label className="text-sm font-medium">Kategori</Label>
									<div className="flex flex-wrap gap-2">
										<Badge
											variant={category === "all" ? "default" : "outline"}
											className="cursor-pointer transition-colors px-3 py-1"
											onClick={() => onCategoryChange("all")}
										>
											Semua
										</Badge>
										{categories.map((cat) => (
											<Badge
												key={cat.id}
												variant={category === cat.id ? "default" : "outline"}
												className="cursor-pointer transition-colors px-3 py-1 gap-1.5"
												onClick={() => onCategoryChange(cat.id)}
											>
												<Icon name={cat.iconName} className="h-3 w-3" />
												{cat.name}
											</Badge>
										))}
									</div>
								</div>

								{/* Status filters */}
								<div className="space-y-3">
									<Label className="text-sm font-medium">Status</Label>
									<div className="grid grid-cols-2 gap-2">
										<StatusButton
											status="all"
											currentStatus={status}
											onClick={onStatusChange}
											Label="Semua Status"
										/>
										<StatusButton
											status="pending"
											currentStatus={status}
											onClick={onStatusChange}
											Label="Menunggu"
										/>
										<StatusButton
											status="in_progress"
											currentStatus={status}
											onClick={onStatusChange}
											Label="Dalam Proses"
										/>
										<StatusButton
											status="completed"
											currentStatus={status}
											onClick={onStatusChange}
											Label="Selesai"
										/>
									</div>
								</div>
							</div>

							{/* Apply button */}
							<Button className="w-full" onClick={() => document.body.click()}>
								Terapkan Filter
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				{/* Sort dropdown */}
				<Select value={sort} onValueChange={onSortChange}>
					<SelectTrigger className="w-auto h-11 gap-2 rounded-xl">
						<div className="flex items-center gap-2">
							<ArrowUpDown className="h-4 w-4" />
							<span className="hidden sm:inline">Urutkan</span>
						</div>
					</SelectTrigger>
					<SelectContent align="end">
						<SelectItem value="newest">Terbaru</SelectItem>
						<SelectItem value="oldest">Terlama</SelectItem>
						<SelectItem value="upvotes">Jumlah Dukungan</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Active filters */}
			<AnimatePresence>
				{hasActiveFilters && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden"
						transition={{ duration: 0.2 }}
					>
						<div className="flex flex-wrap gap-2 pt-2">
							{category !== "all" && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.15 }}
								>
									<Badge
										variant="secondary"
										className="pl-3 pr-2 py-1.5 h-auto transition-colors"
									>
										<div className="flex items-center gap-2">
											<span>
												Kategori:{" "}
												{categories.find((c) => c.id === category)?.name ||
													category}
											</span>
											<button
												type="button"
												className="rounded-full p-1 hover:bg-accent/50 transition-colors"
												onClick={() => {
													onCategoryChange("all");
												}}
												aria-label="Remove category filter"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									</Badge>
								</motion.div>
							)}

							{status !== "all" && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.15, delay: 0.05 }}
								>
									<Badge
										variant="secondary"
										className="pl-3 pr-2 py-1.5 h-auto transition-colors"
									>
										<div className="flex items-center gap-2">
											<span>Status: {getStatusName(status)}</span>
											<button
												type="button"
												className="rounded-full p-1 hover:bg-accent/50 transition-colors"
												onClick={() => {
													onStatusChange("all");
												}}
												aria-label="Remove status filter"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									</Badge>
								</motion.div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

// Status button component
function StatusButton({
	status,
	currentStatus,
	onClick,
	Label,
}: {
	status: ReportStatus | "all";
	currentStatus: ReportStatus | "all";
	onClick: (status: ReportStatus | "all") => void;
	Label: string;
}) {
	return (
		<Button
			variant={currentStatus === status ? "default" : "outline"}
			size="sm"
			className="h-9 text-xs justify-start px-3"
			onClick={() => onClick(status)}
		>
			{Label}
		</Button>
	);
}
