"use client";

import type { Report, ReportStatus } from "@/types/report";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Pagination constants
const REPORTS_PER_PAGE = 5;

export function useReportFilters(allReports: Report[]) {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Initial values from URL
	const initialCategory = searchParams.get("category") || "all";
	const initialStatus = (searchParams.get("status") || "all") as
		| ReportStatus
		| "all";
	const initialQuery = searchParams.get("q") || "";
	const initialSort = searchParams.get("sort") || "newest";
	const initialPage = Number.parseInt(searchParams.get("page") || "1", 10);

	// State
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [selectedCategory, setSelectedCategory] = useState(initialCategory);
	const [selectedStatus, setSelectedStatus] = useState(initialStatus);
	const [sortOrder, setSortOrder] = useState(initialSort);
	const [currentPage, setCurrentPage] = useState(initialPage);

	// Update URL when filters or page change
	const updateFilters = useCallback(
		(
			category: string,
			status: ReportStatus | "all",
			query: string,
			sort: string,
			page = 1,
		) => {
			const params = new URLSearchParams();

			if (category !== "all") params.set("category", category);
			if (status !== "all") params.set("status", status);
			if (query) params.set("q", query);
			if (sort !== "newest") params.set("sort", sort);
			if (page > 1) params.set("page", page.toString());

			const newUrl = params.toString() ? `?${params.toString()}` : "";
			router.push(`/reports${newUrl}`, { scroll: false });
		},
		[router],
	);

	// Apply filters and sort
	const filteredReports = useMemo(() => {
		let filtered = [...allReports];

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(report) =>
					report.title.toLowerCase().includes(query) ||
					report.description?.toLowerCase().includes(query) ||
					report.location?.toLowerCase().includes(query),
			);
		}

		// Filter by category
		if (selectedCategory !== "all") {
			filtered = filtered.filter((report) => {
				if (typeof report.category === "object" && report.category?.id) {
					return report.category.id === selectedCategory;
				}
				return false;
			});
		}

		// Filter by status
		if (selectedStatus !== "all") {
			filtered = filtered.filter((report) => report.status === selectedStatus);
		}

		// Sort reports
		filtered.sort((a, b) => {
			if (sortOrder === "newest")
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			if (sortOrder === "oldest")
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			if (sortOrder === "upvotes") return (b.upvotes || 0) - (a.upvotes || 0);
			return 0;
		});

		return filtered;
	}, [allReports, searchQuery, selectedCategory, selectedStatus, sortOrder]);

	// Calculate pagination
	const totalPages = Math.max(
		1,
		Math.ceil(filteredReports.length / REPORTS_PER_PAGE),
	);

	// Ensure current page is valid
	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(1);
			updateFilters(
				selectedCategory,
				selectedStatus,
				searchQuery,
				sortOrder,
				1,
			);
		}
	}, [
		currentPage,
		totalPages,
		updateFilters,
		selectedCategory,
		selectedStatus,
		searchQuery,
		sortOrder,
	]);

	// Get paginated reports for current page
	const paginatedReports = useMemo(() => {
		const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
		const endIndex = startIndex + REPORTS_PER_PAGE;
		return filteredReports.slice(startIndex, endIndex);
	}, [filteredReports, currentPage]);

	// Navigation function with smooth scroll
	const goToPage = useCallback(
		(page: number) => {
			const newPage = Math.max(1, Math.min(page, totalPages));
			if (newPage === currentPage) return; // Avoid unnecessary updates

			setCurrentPage(newPage);
			updateFilters(
				selectedCategory,
				selectedStatus,
				searchQuery,
				sortOrder,
				newPage,
			);

			// Smooth scroll to top of results
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		[
			totalPages,
			currentPage,
			selectedCategory,
			selectedStatus,
			searchQuery,
			sortOrder,
			updateFilters,
		],
	);

	const resetFilters = useCallback(() => {
		setSelectedCategory("all");
		setSelectedStatus("all");
		setSearchQuery("");
		setSortOrder("newest");
		setCurrentPage(1);
		updateFilters("all", "all", "", "newest", 1);
	}, [updateFilters]);

	return {
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
	};
}
