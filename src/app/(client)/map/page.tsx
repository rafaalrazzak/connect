"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
	type FC,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";

// Components
import LocationMap from "@/components/location-map";
import { FilterPanel } from "@/components/map/filter-panel";
import { SearchBar } from "@/components/map/search-bar";
import { ReportCard } from "@/components/report-card";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

// Icons
import {
	ChevronLeft,
	Filter,
	Locate,
	Map as MapIcon,
	Search,
	X,
} from "lucide-react";

// Data & Types
import { categories, reports } from "@/lib/mock-data";
import type { Coordinates } from "@/types/map";
import type { Report } from "@/types/report";

// Leaflet CSS
import "leaflet/dist/leaflet.css";

// Types
type FilterState = {
	statuses: string[];
	categories: string[];
	timePeriod: string;
};

export default function MapView() {
	// State management
	const [mapState, setMapState] = useState({
		selectedReport: null as Report | null,
		zoomLevel: 13,
		isMarkerSelected: false,
		drawerOpen: false,
		isDrawerAnimating: false,
		searchPosition: null as Coordinates | null,
	});

	const [searchVisible, setSearchVisible] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [mapReady, setMapReady] = useState<boolean>(false);
	const [activeFilters, setActiveFilters] = useState<FilterState>({
		statuses: ["pending", "in_progress", "completed", "rejected"],
		categories: categories.map((c) => c.id),
		timePeriod: "all",
	});

	// Refs for tracking interactions
	const markerClickRef = useRef(false);
	const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

	// Clean up timeouts on unmount
	useEffect(() => {
		return () => {
			timeoutsRef.current.forEach(clearTimeout);
		};
	}, []);

	// Safe timeout utility
	const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
		const timeoutId = setTimeout(callback, delay);
		timeoutsRef.current.push(timeoutId);
		return timeoutId;
	}, []);

	// Initialize Leaflet
	useEffect(() => {
		const initLeaflet = async (): Promise<(() => void) | undefined> => {
			try {
				if (typeof window === "undefined") return;
				setMapReady(true);
				return () => {};
			} catch (error) {
				console.error("Failed to initialize Leaflet:", error);
				toast.error("Gagal memuat peta. Coba muat ulang halaman.");
			}
		};

		initLeaflet();
	}, []);

	// Filter reports
	const filteredReports = useMemo(
		() =>
			reports.filter(
				(report) =>
					activeFilters.statuses.includes(report.status) &&
					report.category?.id &&
					activeFilters.categories.includes(report.category.id),
			),
		[activeFilters],
	);

	// Generate map markers
	const mapMarkers = useMemo(() => {
		return filteredReports.map((report) => ({
			id: report.id,
			position: [
				report.coordinates.latitude,
				report.coordinates.longitude,
			] as Coordinates,
			text: `${report.title} - ${report.category?.name || "Umum"}`,
			status: report.status,
		}));
	}, [filteredReports]);

	// Get selected report
	const selectedReportData = useMemo(
		() => mapState.selectedReport,
		[mapState.selectedReport],
	);

	// Handle marker click
	const handleMarkerClick = useCallback(
		(id: string) => {
			markerClickRef.current = true;

			const report = filteredReports.find((r) => r.id === id);

			setMapState((prev) => {
				// If clicking the same marker, just toggle drawer
				if (prev.selectedReport?.id === id) {
					return { ...prev, drawerOpen: !prev.drawerOpen };
				}

				return {
					...prev,
					selectedReport: report || null,
					isMarkerSelected: Boolean(report),
					drawerOpen: true, // Open drawer immediately
				};
			});

			safeSetTimeout(() => {
				markerClickRef.current = false;
			}, 1000);
		},
		[filteredReports, safeSetTimeout],
	);

	// Search location
	const searchLocation = useCallback(async (): Promise<void> => {
		if (!searchQuery.trim()) return;

		setIsSearching(true);
		toast.info("Mencari lokasi...");

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					searchQuery,
				)}&limit=1&countrycodes=id`,
			);

			if (!response.ok) throw new Error("Network response was not ok");

			const data = await response.json();

			if (data && data.length > 0) {
				const { lat, lon, display_name } = data[0];
				const coordinates: Coordinates = [
					Number.parseFloat(lat),
					Number.parseFloat(lon),
				];

				setMapState((prev) => ({
					...prev,
					selectedReport: null,
					isMarkerSelected: false,
					zoomLevel: 15,
					searchPosition: coordinates,
				}));

				toast.success(`Lokasi ditemukan: ${display_name.split(",")[0]}`);
			} else {
				toast.warning("Lokasi tidak ditemukan, coba kata kunci lain");
			}
		} catch (error) {
			console.error("Failed to search location:", error);
			toast.error("Gagal mencari lokasi, coba lagi nanti");
		} finally {
			setIsSearching(false);
		}
	}, [searchQuery]);

	// Filter reports
	const handleApplyFilters = useCallback((newFilters: FilterState): void => {
		setActiveFilters(newFilters);
	}, []);

	// Get the current map position based on search or selected report
	const currentMapPosition = useMemo((): Coordinates | undefined => {
		if (mapState.searchPosition) {
			return mapState.searchPosition;
		}

		if (mapState.selectedReport?.coordinates) {
			return [
				mapState.selectedReport.coordinates.latitude,
				mapState.selectedReport.coordinates.longitude,
			];
		}

		if (mapMarkers.length > 0) {
			// Center map on first marker if available
			return mapMarkers[0].position;
		}

		return undefined; // Let the map component use its default
	}, [mapState.searchPosition, mapState.selectedReport, mapMarkers]);

	return (
		<div className="fixed inset-0 overflow-hidden bg-background">
			{/* Top navigation bar */}
			<div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/90 to-transparent pt-3 pb-6 px-3 sm:px-4">
				<div className="flex justify-between items-center">
					{/* Back button */}
					<Link href="/">
						<Button
							variant="outline"
							size="full"
							aria-label="Kembali ke beranda"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
					</Link>

					{/* Search or title */}
					<AnimatePresence mode="wait">
						{searchVisible ? (
							<motion.div
								key="search"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="flex-1 mx-2"
							>
								<SearchBar
									searchQuery={searchQuery}
									setSearchQuery={setSearchQuery}
									searchLocation={searchLocation}
									isSearching={isSearching}
									onClose={() => setSearchVisible(false)}
								/>
							</motion.div>
						) : (
							<motion.h1
								key="title"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="text-base sm:text-lg font-bold bg-background/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md"
							>
								Peta Laporan
							</motion.h1>
						)}
					</AnimatePresence>

					{/* Action buttons */}
					<div className="flex gap-2">
						{!searchVisible && (
							<Button
								variant="outline"
								size="icon"
								className="bg-background/95 shadow-md rounded-full backdrop-blur-sm border-muted/30"
								onClick={() => setSearchVisible(true)}
								aria-label="Cari lokasi"
							>
								<Search className="h-5 w-5" />
							</Button>
						)}

						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="bg-background/95 shadow-md rounded-full backdrop-blur-sm border-muted/30"
									aria-label="Filter laporan"
								>
									<Filter className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent className="sm:max-w-md">
								<SheetHeader>
									<SheetTitle>Filter Laporan</SheetTitle>
								</SheetHeader>
								<FilterPanel
									categories={categories}
									initialFilters={activeFilters}
									onApplyFilters={handleApplyFilters}
								/>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>

			{/* Map Container */}
			<div className="absolute inset-0">
				{mapReady ? (
					<LocationMap
						togglePosition="bottom-left"
						zoom={mapState.zoomLevel}
						position={currentMapPosition}
						markers={mapMarkers}
						onMarkerClick={handleMarkerClick}
						onZoomChange={(newZoom) =>
							setMapState((prev) => ({ ...prev, zoomLevel: newZoom }))
						}
					/>
				) : (
					<MapLoadingPlaceholder />
				)}
			</div>

			{/* Selected report card */}
			<AnimatePresence>
				{selectedReportData && (
					<motion.div
						initial={{ opacity: 0, y: 100 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 100 }}
						transition={{ type: "spring", damping: 20 }}
						className="absolute bottom-20 left-0 right-0 px-3 sm:px-4 max-w-2xl mx-auto z-30 bg-transparent"
					>
						<ReportCard report={selectedReportData} />
						<Button
							onClick={() =>
								setMapState((prev) => ({
									...prev,
									selectedReport: null,
									isMarkerSelected: false,
								}))
							}
							variant="outline"
							size="sm"
							className="absolute -top-2 -right-1 rounded-full bg-background shadow-md h-8 w-8 p-0"
							aria-label="Close report details"
						>
							<X className="h-4 w-4" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// Loading placeholder
const MapLoadingPlaceholder: FC = memo(() => (
	<div className="h-full w-full flex items-center justify-center bg-muted/10">
		<div className="flex flex-col items-center">
			<div className="animate-spin rounded-full h-12 w-12 border-4 border-muted-foreground/30 border-t-primary mb-4" />
			<p className="text-muted-foreground">Memuat peta...</p>
		</div>
	</div>
));
MapLoadingPlaceholder.displayName = "MapLoadingPlaceholder";
