"use client";

import { Filter, ArrowUpDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReportStatus } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { CategoryIcon } from "./category-icon";
import { categories } from "@/lib/mock-data";

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

interface FilterSectionProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: ReportStatus | "all";
  setSelectedStatus: (status: ReportStatus | "all") => void;
  sortOrder: string;
  setSortOrder: (sort: string) => void;
  updateFilters: (
    category: string,
    status: ReportStatus | "all",
    query: string,
    sort: string
  ) => void;
  resetFilters: () => void;
  searchQuery: string;
}

export function FilterSection({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortOrder,
  setSortOrder,
  updateFilters,
  resetFilters,
  searchQuery,
}: FilterSectionProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <FilterPopover
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <SortSelect
          value={sortOrder}
          onChange={(value) => {
            setSortOrder(value);
            updateFilters(selectedCategory, selectedStatus, searchQuery, value);
          }}
        />
      </div>

      <ActiveFilters
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        updateFilters={updateFilters}
        setSelectedCategory={setSelectedCategory}
        setSelectedStatus={setSelectedStatus}
        searchQuery={searchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resetFilters={resetFilters}
      />
    </>
  );
}

// Filter popover component
function FilterPopover({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  updateFilters,
  resetFilters,
  searchQuery,
  sortOrder,
}: FilterSectionProps) {
  const hasActiveFilters =
    selectedCategory !== "all" || selectedStatus !== "all";

  return (
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
              {(selectedCategory !== "all" ? 1 : 0) +
                (selectedStatus !== "all" ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-5">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base">Filter Laporan</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8"
              >
                Reset
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Kategori</label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-muted/70 transition-colors px-3 py-1"
                  onClick={() => {
                    setSelectedCategory("all");
                    updateFilters(
                      "all",
                      selectedStatus,
                      searchQuery,
                      sortOrder
                    );
                  }}
                >
                  Semua
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    className="cursor-pointer hover:bg-muted/70 transition-colors px-3 py-1 gap-1.5"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      updateFilters(
                        category.id,
                        selectedStatus,
                        searchQuery,
                        sortOrder
                      );
                    }}
                  >
                    <CategoryIcon category={category} className="h-3 w-3" />
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Status</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedStatus === "all" ? "default" : "outline"}
                  size="sm"
                  className="h-9 text-xs justify-start px-3"
                  onClick={() => {
                    setSelectedStatus("all");
                    updateFilters(
                      selectedCategory,
                      "all",
                      searchQuery,
                      sortOrder
                    );
                  }}
                >
                  Semua Status
                </Button>
                <Button
                  variant={selectedStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  className="h-9 text-xs justify-start px-3"
                  onClick={() => {
                    setSelectedStatus("pending");
                    updateFilters(
                      selectedCategory,
                      "pending",
                      searchQuery,
                      sortOrder
                    );
                  }}
                >
                  Menunggu
                </Button>
                <Button
                  variant={
                    selectedStatus === "in_progress" ? "default" : "outline"
                  }
                  size="sm"
                  className="h-9 text-xs justify-start px-3"
                  onClick={() => {
                    setSelectedStatus("in_progress");
                    updateFilters(
                      selectedCategory,
                      "in_progress",
                      searchQuery,
                      sortOrder
                    );
                  }}
                >
                  Dalam Proses
                </Button>
                <Button
                  variant={
                    selectedStatus === "completed" ? "default" : "outline"
                  }
                  size="sm"
                  className="h-9 text-xs justify-start px-3"
                  onClick={() => {
                    setSelectedStatus("completed");
                    updateFilters(
                      selectedCategory,
                      "completed",
                      searchQuery,
                      sortOrder
                    );
                  }}
                >
                  Selesai
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={() => document.body.click()}>
            Terapkan Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Sort select component
function SortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto h-11 gap-2 rounded-xl border-muted/60">
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
  );
}

// Active filters display
function ActiveFilters({
  selectedCategory,
  selectedStatus,
  updateFilters,
  setSelectedCategory,
  setSelectedStatus,
  searchQuery,
  sortOrder,
}: FilterSectionProps) {
  return (
    <AnimatePresence>
      {(selectedCategory !== "all" || selectedStatus !== "all") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedCategory !== "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <Badge
                  variant="secondary"
                  className="pl-3 pr-2 py-1.5 h-auto bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>
                      Kategori:{" "}
                      {categories.find((c) => c.id === selectedCategory)
                        ?.name || selectedCategory}
                    </span>
                    <button
                      className="rounded-full p-1 hover:bg-accent/50 transition-colors"
                      onClick={() => {
                        setSelectedCategory("all");
                        updateFilters(
                          "all",
                          selectedStatus,
                          searchQuery,
                          sortOrder
                        );
                      }}
                      aria-label="Remove category filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </Badge>
              </motion.div>
            )}

            {selectedStatus !== "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15, delay: 0.05 }}
              >
                <Badge
                  variant="secondary"
                  className="pl-3 pr-2 py-1.5 h-auto bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>Status: {getStatusName(selectedStatus)}</span>
                    <button
                      className="rounded-full p-1 hover:bg-accent/50 transition-colors"
                      onClick={() => {
                        setSelectedStatus("all");
                        updateFilters(
                          selectedCategory,
                          "all",
                          searchQuery,
                          sortOrder
                        );
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
  );
}
