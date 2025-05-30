"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
	type FC,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";

import { FilterPanel } from "@/components/map/filter-panel";
import { SearchBar } from "@/components/map/search-bar";
import { ReportCard } from "@/components/report-card";
// Components
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
	Bell,
	ChevronLeft,
	Filter,
	Home,
	Locate,
	MapPin,
	Search,
	User,
	X,
} from "lucide-react";

// Data & Types
import { categories, reports } from "@/lib/mock-data";
import type { Report } from "@/types/report";
import type { LatLngTuple } from "leaflet";

// Leaflet CSS
import "leaflet/dist/leaflet.css";

// Types
type FilterState = {
	statuses: string[];
	categories: string[];
	timePeriod: string;
};

interface MapControllerProps {
	selectedReport: string | null;
	userPosition: LatLngTuple;
}

interface BottomNavigationProps {
	className?: string;
}

// Constants
const MARKER_ICON_URL =
	"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const MARKER_ICON_2X_URL =
	"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const MARKER_SHADOW_URL =
	"https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";
const DEFAULT_POSITION: LatLngTuple = [-6.2, 106.816666]; // Jakarta

// Sample coordinates for reports
const reportCoordinates: Record<string, LatLngTuple> = {
	"report-1": [-6.2, 106.816666],
	"report-2": [-6.205, 106.82],
	"report-3": [-6.195, 106.812],
	"report-4": [-6.21, 106.818],
	"report-5": [-6.202, 106.83],
	"report-6": [-6.198, 106.805],
};

// Dynamically import map components
const MapContainer = dynamic(
	() => import("react-leaflet").then((mod) => mod.MapContainer),
	{ ssr: false, loading: () => <MapLoadingPlaceholder /> },
);

const TileLayer = dynamic(
	() => import("react-leaflet").then((mod) => mod.TileLayer),
	{ ssr: false },
);
const Marker = dynamic(
	() => import("react-leaflet").then((mod) => mod.Marker),
	{ ssr: false },
);
const ZoomControl = dynamic(
	() => import("react-leaflet").then((mod) => mod.ZoomControl),
	{ ssr: false },
);

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

// Helper component to fly to selected report
const MapController: FC<MapControllerProps> = ({
	selectedReport,
	userPosition,
}) => {
	const { useMap } = require("react-leaflet");
	const map = useMap();

	useEffect(() => {
		if (!map) return;

		const target =
			selectedReport && reportCoordinates[selectedReport]
				? { coords: reportCoordinates[selectedReport], zoom: 16 }
				: { coords: userPosition, zoom: 13 };

		map.flyTo(target.coords, target.zoom, { animate: true, duration: 1 });
	}, [selectedReport, userPosition, map]);

	return null;
};

export default function MapView() {
	// State
	const [selectedReport, setSelectedReport] = useState<string | null>(null);
	const [searchVisible, setSearchVisible] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [mapReady, setMapReady] = useState<boolean>(false);
	const [userPosition, setUserPosition] =
		useState<LatLngTuple>(DEFAULT_POSITION);
	const [activeFilters, setActiveFilters] = useState<FilterState>({
		statuses: ["pending", "in_progress", "completed", "rejected"],
		categories: categories.map((c) => c.id),
		timePeriod: "all",
	});

	// Get selected report
	const selectedReportData = useMemo<Report | null>(
		() =>
			selectedReport
				? reports.find((r) => r.id === selectedReport) || null
				: null,
		[selectedReport],
	);

	// Initialize Leaflet
	useEffect(() => {
		const initLeaflet = async (): Promise<(() => void) | undefined> => {
			try {
				const L = await import("leaflet");

				// Fix icon paths
				delete L.Icon.Default.prototype._getIconUrl;
				L.Icon.Default.mergeOptions({
					iconUrl: MARKER_ICON_URL,
					iconRetinaUrl: MARKER_ICON_2X_URL,
					shadowUrl: MARKER_SHADOW_URL,
				});

				// Add map styles
				const style = document.createElement("style");
				style.innerHTML = `
          .leaflet-container {
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }
          .marker-pending { filter: hue-rotate(200deg); }
          .marker-in_progress { filter: hue-rotate(60deg); }
          .marker-completed { filter: hue-rotate(120deg); }
          .marker-rejected { filter: hue-rotate(280deg); }
        `;
				document.head.appendChild(style);

				setMapReady(true);

				return () => {
					document.head.removeChild(style);
				};
			} catch (error) {
				console.error("Failed to initialize Leaflet:", error);
				toast.error("Gagal memuat peta. Coba muat ulang halaman.");
			}
		};

		initLeaflet();
	}, []);

	// Create marker icon
	const createMarkerIcon = useCallback((status: string) => {
		if (typeof window === "undefined") return null;

		try {
			const L = require("leaflet");
			return new L.Icon({
				iconUrl: MARKER_ICON_URL,
				iconRetinaUrl: MARKER_ICON_2X_URL,
				shadowUrl: MARKER_SHADOW_URL,
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41],
				className: `marker-${status}`,
			});
		} catch (error) {
			console.error("Failed to create marker icon:", error);
			return null;
		}
	}, []);

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
				setUserPosition([Number(lat), Number(lon)]);
				setSelectedReport(null);
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

	// Get user location
	const getUserLocation = useCallback((): void => {
		if (!navigator.geolocation) {
			toast.error("Browser Anda tidak mendukung geolokasi");
			return;
		}

		toast.loading("Mencari lokasi Anda...", { id: "geolocation" });

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setUserPosition([latitude, longitude]);
				setSelectedReport(null);
				toast.success("Lokasi Anda ditemukan!", { id: "geolocation" });
			},
			(error) => {
				console.error("Error getting location:", error);
				toast.error(
					error.code === 1
						? "Akses lokasi ditolak. Izinkan akses lokasi di pengaturan browser Anda."
						: "Tidak dapat menemukan lokasi Anda",
					{ id: "geolocation" },
				);
			},
			{ timeout: 10000, enableHighAccuracy: true },
		);
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

	// Handle filter changes
	const handleApplyFilters = useCallback((newFilters: FilterState): void => {
		setActiveFilters(newFilters);
	}, []);

	return (
		<div className="fixed inset-0 overflow-hidden bg-background">
			{/* Top navigation bar */}
			<div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/90 to-transparent pt-3 pb-6 px-3 sm:px-4">
				<div className="flex justify-between items-center">
					{/* Back button */}
					<Link href="/">
						<Button
							variant="outline"
							size="icon"
							className="bg-background/95 shadow-md rounded-full backdrop-blur-sm border-muted/30"
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

						<Button
							variant="outline"
							size="icon"
							className="bg-background/95 shadow-md rounded-full backdrop-blur-sm border-muted/30"
							onClick={getUserLocation}
							aria-label="Temukan lokasi saya"
						>
							<Locate className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Map Container */}
			<div className="absolute inset-0 pb-16">
				{mapReady ? (
					<MapContainer
						center={userPosition}
						zoom={13}
						className="z-10"
						attributionControl={false}
						zoomControl={false}
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						/>

						<ZoomControl position="bottomright" />

						{/* Report markers */}
						{filteredReports.map((report) => {
							const coordinates = reportCoordinates[report.id] || userPosition;
							const icon = createMarkerIcon(report.status);

							return (
								icon && (
									<Marker
										key={report.id}
										position={coordinates}
										icon={icon}
										eventHandlers={{
											click: () => setSelectedReport(report.id),
										}}
									/>
								)
							);
						})}

						<MapController
							selectedReport={selectedReport}
							userPosition={userPosition}
						/>
					</MapContainer>
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
						className="absolute bottom-20 left-0 right-0 px-3 sm:px-4 max-w-2xl mx-auto z-30"
					>
						<ReportCard
							report={selectedReportData}
							className="bg-background/95 backdrop-blur-sm shadow-lg"
						/>
						<Button
							onClick={() => setSelectedReport(null)}
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
