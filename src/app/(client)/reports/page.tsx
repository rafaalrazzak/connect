"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, List, Map as MapIcon } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/reports/search-bar";
import { FilterSection } from "@/components/reports/filter-section";
import { ResultsInfo } from "@/components/reports/results-info";
import { ReportsList } from "@/components/reports/reports-list";
import { MapView } from "@/components/reports/map-view";
import { EmptyState } from "@/components/reports/empty-state";
import { Pagination } from "@/components/reports/pagination";

// Hooks
import { useReportFilters } from "@/hooks/use-report-filters";

// Data
import { reports } from "@/lib/mock-data";

function ReportContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortOrder,
    setSortOrder,
    filteredReports,
    paginatedReports,
    currentPage,
    totalPages,
    updateFilters,
    goToPage,
    resetFilters,
  } = useReportFilters(reports);

  // Simulate data loading
  useEffect(() => {
    const loadReports = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);
    };

    loadReports();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 pb-20">
      {/* Header with back button and title */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full h-9 w-9 hover:bg-muted/60"
        >
          <Link href="/" aria-label="Back to home">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Semua Laporan</h1>
          <p className="text-muted-foreground text-sm">
            Lihat dan cari laporan dari seluruh warga
          </p>
        </div>

        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "list" | "map")}
          className="w-auto"
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

      <div className="space-y-5 mb-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSubmit={(query) =>
            updateFilters(selectedCategory, selectedStatus, query, sortOrder)
          }
        />

        <FilterSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          searchQuery={searchQuery}
        />
      </div>

      {!isLoading && (
        <ResultsInfo
          filteredCount={filteredReports.length}
          currentPage={currentPage}
          reportsPerPage={5}
          totalPages={totalPages}
        />
      )}

      {isLoading ? (
        <ReportsList.Skeleton />
      ) : viewMode === "list" ? (
        filteredReports.length > 0 ? (
          <>
            <ReportsList reports={paginatedReports} page={currentPage} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        ) : (
          <EmptyState onResetFilters={resetFilters} />
        )
      ) : (
        <MapView />
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense>
      <ReportContent />
    </Suspense>
  );
}
