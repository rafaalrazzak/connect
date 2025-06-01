"use client";

import { ChevronLeft, List, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Report Components
import { EmptyState } from "@/components/reports/empty-state";
import { FilterSection } from "@/components/reports/filter-section";
import { LoadingState } from "@/components/reports/loading-state";
import { MapView } from "@/components/reports/map-view";
import { Pagination } from "@/components/reports/pagination";
import { ReportsList } from "@/components/reports/reports-list";
import { SearchBar } from "@/components/reports/search-bar";

// Hooks & Data
import { useReportFilters } from "@/hooks/use-report-filters";
import { reports } from "@/lib/mock-data";

type ViewMode = "list" | "map";

function ReportContent() {
	const [viewMode, setViewMode] = useState<ViewMode>("list");

	const {
		filters,
		setFilter,
		resetFilters,
		filteredReports,
		paginatedReports,
		totalResults,
		currentPage,
		totalPages,
		goToPage,
		isLoading,
	} = useReportFilters(reports);

	// Derive UI states
	const hasReports = filteredReports.length > 0;
	const showResults = !isLoading && hasReports;

	return (
		<div className="max-w-screen-lg flex flex-col mx-auto px-4 sm:px-6 py-6 pb-20 gap-4">
			{/* Header */}
			<header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
				<div className="flex items-center gap-3 flex-1">
					<Button
						variant="ghost"
						size="icon"
						asChild
						className="rounded-full h-9 w-9 hover:bg-muted/60 flex-shrink-0"
					>
						<Link href="/" aria-label="Kembali ke beranda">
							<ChevronLeft className="h-5 w-5" />
						</Link>
					</Button>

					<div>
						<h1 className="text-xl sm:text-2xl font-bold tracking-tight">
							Semua Laporan
						</h1>
						<p className="text-muted-foreground text-sm">
							Lihat dan cari laporan dari seluruh warga
						</p>
					</div>
				</div>
			</header>

			<div className="flex flex-col gap-4">
				{/* Search and filters */}
				<div className="flex items-center gap-2">
					<SearchBar
						query={filters.query}
						onQueryChange={(value) => setFilter("query", value)}
					/>

					<FilterSection
						category={filters.category}
						status={filters.status}
						sort={filters.sort}
						onCategoryChange={(value) => setFilter("category", value)}
						onStatusChange={(value) => setFilter("status", value)}
						onSortChange={(value) =>
							setFilter("sort", value as "newest" | "oldest" | "upvotes")
						}
						onReset={resetFilters}
						searchQuery={filters.query}
					/>
				</div>

				<Tabs
					value={viewMode}
					onValueChange={(value) => setViewMode(value as ViewMode)}
				>
					<TabsList className="grid grid-cols-2">
						<TabsTrigger value="list" className="px-3 gap-1.5">
							<List className="h-4 w-4" />
							<span>List</span>
						</TabsTrigger>
						<TabsTrigger value="map" className="px-3 gap-1.5">
							<MapIcon className="h-4 w-4" />
							<span>Map</span>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Content area */}
			<div className="space-y-4">
				{isLoading && <LoadingState />}

				{!isLoading && !hasReports && (
					<EmptyState onResetFilters={resetFilters} />
				)}

				{showResults && viewMode === "list" && (
					<>
						<ReportsList reports={paginatedReports} page={currentPage} />
						<div className="mt-5">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								totalItems={totalResults}
								onPageChange={goToPage}
								itemName="laporan"
								compact
							/>
						</div>
					</>
				)}

				{showResults && viewMode === "map" && (
					<MapView reports={filteredReports} />
				)}
			</div>
		</div>
	);
}

export default function ReportsPage() {
	return (
		<Suspense fallback={<LoadingState />}>
			<ReportContent />
		</Suspense>
	);
}
