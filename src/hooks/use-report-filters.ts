"use client";

import type { Report, ReportStatus } from "@/types/report";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Constants
const REPORTS_PER_PAGE = 5;
const LOADING_DELAY = 500; // ms

// Filter state type
interface FilterState {
	category: string;
	status: ReportStatus | "all";
	query: string;
	sort: "newest" | "oldest" | "upvotes";
	page: number;
}

// Default filter values
const DEFAULT_FILTERS: Omit<FilterState, "page"> = {
	category: "all",
	status: "all",
	query: "",
	sort: "newest",
};

export function useReportFilters(allReports: Report[]) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	// Parse URL params with fallbacks to defaults
	const initialFilters = useMemo(
		(): FilterState => ({
			category: searchParams.get("category") || DEFAULT_FILTERS.category,
			status:
				(searchParams.get("status") as FilterState["status"]) ||
				DEFAULT_FILTERS.status,
			query: searchParams.get("q") || DEFAULT_FILTERS.query,
			sort:
				(searchParams.get("sort") as FilterState["sort"]) ||
				DEFAULT_FILTERS.sort,
			page: Math.max(
				1,
				Number.parseInt(searchParams.get("page") || "1", 10) || 1,
			),
		}),
		[searchParams],
	);

	const [filters, setFilters] = useState<FilterState>(initialFilters);

	// Simulate loading state (replace with real data fetching)
	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), LOADING_DELAY);
		return () => clearTimeout(timer);
	}, []);

	// Update URL with current filters
	const syncUrl = useCallback(
		(newFilters: FilterState) => {
			const params = new URLSearchParams();

			// Only add non-default params to URL
			for (const [key, value] of Object.entries(newFilters)) {
				if (key === "page") {
					if (value > 1) params.set(key, String(value));
				} else if (key === "query") {
					if (value) params.set("q", value);
				} else if (
					value !== DEFAULT_FILTERS[key as keyof typeof DEFAULT_FILTERS]
				) {
					params.set(key, String(value));
				}
			}

			const queryString = params.toString();
			router.push(`/reports${queryString ? `?${queryString}` : ""}`, {
				scroll: false,
			});
		},
		[router],
	);

	// Update a single filter
	const setFilter = useCallback(
		<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
			setFilters((prev) => {
				// Reset page when changing any filter except page itself
				const shouldResetPage = key !== "page" && prev.page > 1;

				const newFilters = {
					...prev,
					[key]: value,
					...(shouldResetPage ? { page: 1 } : {}),
				};

				syncUrl(newFilters);
				return newFilters;
			});
		},
		[syncUrl],
	);

	// Reset all filters to defaults
	const resetFilters = useCallback(() => {
		const defaultState = { ...DEFAULT_FILTERS, page: 1 };
		setFilters(defaultState);
		syncUrl(defaultState);
	}, [syncUrl]);

	// Apply filters to reports
	const filteredReports = useMemo(() => {
		if (!allReports?.length) return [];

		return allReports
			.filter((report) => {
				// Apply all filters
				if (filters.query) {
					const query = filters.query.toLowerCase();
					if (
						!(
							report.title.toLowerCase().includes(query) ||
							report.description?.toLowerCase().includes(query) ||
							report.location?.toLowerCase().includes(query)
						)
					) {
						return false;
					}
				}

				if (
					filters.category !== "all" &&
					(!report.category ||
						typeof report.category !== "object" ||
						report.category.id !== filters.category)
				) {
					return false;
				}

				if (filters.status !== "all" && report.status !== filters.status) {
					return false;
				}

				return true;
			})
			.sort((a, b) => {
				// Sort based on selected order
				switch (filters.sort) {
					case "newest":
						return new Date(b.date).getTime() - new Date(a.date).getTime();
					case "oldest":
						return new Date(a.date).getTime() - new Date(b.date).getTime();
					case "upvotes":
						return (b.upvotes || 0) - (a.upvotes || 0);
					default:
						return 0;
				}
			});
	}, [allReports, filters]);

	// Calculate pagination values
	const totalResults = filteredReports.length;
	const totalPages = Math.max(1, Math.ceil(totalResults / REPORTS_PER_PAGE));

	// Ensure page is valid
	useEffect(() => {
		if (filters.page > totalPages && totalPages > 0) {
			setFilter("page", 1);
		}
	}, [filters.page, totalPages, setFilter]);

	// Get current page of reports
	const paginatedReports = useMemo(() => {
		const start = (filters.page - 1) * REPORTS_PER_PAGE;
		return filteredReports.slice(start, start + REPORTS_PER_PAGE);
	}, [filteredReports, filters.page]);

	// Page navigation with smooth scrolling
	const goToPage = useCallback(
		(newPage: number) => {
			const validPage = Math.max(1, Math.min(newPage, totalPages));
			if (validPage === filters.page) return;

			setFilter("page", validPage);

			// Smooth scroll to top
			requestAnimationFrame(() => {
				window.scrollTo({ top: 0, behavior: "smooth" });
			});
		},
		[filters.page, totalPages, setFilter],
	);

	return {
		filters,
		setFilter,
		resetFilters,
		filteredReports,
		paginatedReports,
		totalResults,
		currentPage: filters.page,
		totalPages,
		goToPage,
		isLoading,
	};
}
