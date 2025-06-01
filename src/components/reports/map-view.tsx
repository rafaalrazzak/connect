"use client";

import LocationMap from "@/components/location-map";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Report, ReportStatus } from "@/types/report";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Locate, Map as MapIcon, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReportCard } from "../report-card";

interface MapViewProps {
	reports?: Report[];
	isLoading?: boolean;
}

export function MapView({ reports = [], isLoading = false }: MapViewProps) {
	// Optimized state management
	const [mapState, setMapState] = useState({
		selectedReport: null as Report | null,
		zoomLevel: 5,
		isMarkerSelected: false,
		drawerOpen: false,
		isDrawerAnimating: false,
	});

	// Use refs to track interactions for smoother animations
	const markerClickRef = useRef(false);
	const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

	// Default coordinates (center of Indonesia)
	const defaultPosition: [number, number] = [-2.5489, 118.0149];

	// Utility function to safely set timeouts with automatic cleanup
	const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
		const timeoutId = setTimeout(callback, delay);
		timeoutsRef.current.push(timeoutId);
		return timeoutId;
	}, []);

	// Clean up all timeouts on unmount
	useEffect(() => {
		return () => {
			timeoutsRef.current.forEach(clearTimeout);
		};
	}, []);

	// Filter reports with valid coordinates
	const reportsWithCoordinates = useMemo(() => {
		return reports.filter(
			(report) =>
				report.coordinates?.latitude != null &&
				report.coordinates?.longitude != null,
		);
	}, [reports]);

	// Generate markers for the map
	const mapMarkers = useMemo(() => {
		return reportsWithCoordinates.map((report) => ({
			id: report.id,
			position: [report.coordinates.latitude, report.coordinates.longitude] as [
				number,
				number,
			],
			text: `${report.title} - ${report.category?.name || "Umum"}`,
			status: report.status,
		}));
	}, [reportsWithCoordinates]);

	// Manage drawer state when report changes
	useEffect(() => {
		if (mapState.selectedReport) {
			// Small delay before opening drawer to ensure map centers first
			safeSetTimeout(() => {
				setMapState((prev) => ({ ...prev, drawerOpen: true }));
			}, 300);
		}
	}, [mapState.selectedReport, safeSetTimeout]);

	// Handle marker click with improved state updates
	const handleMarkerClick = useCallback(
		(id: string) => {
			// Set flag to prevent competing animations
			markerClickRef.current = true;

			const report = reportsWithCoordinates.find((r) => r.id === id);

			setMapState((prev) => {
				// If clicking the same marker, just toggle drawer
				if (prev.selectedReport?.id === id) {
					return { ...prev, drawerOpen: !prev.drawerOpen };
				}

				// Otherwise select new report
				return {
					...prev,
					selectedReport: report || null,
					isMarkerSelected: Boolean(report),
					drawerOpen: false, // Will be set to true after animation delay
				};
			});

			// Reset the flag after animations complete
			safeSetTimeout(() => {
				markerClickRef.current = false;
			}, 1000);
		},
		[reportsWithCoordinates, safeSetTimeout],
	);

	// Smooth drawer close with proper animation sequence
	const handleCloseDrawer = useCallback(() => {
		setMapState((prev) => ({
			...prev,
			drawerOpen: false,
			isDrawerAnimating: true,
		}));

		// Clear selection after animation completes
		safeSetTimeout(() => {
			setMapState((prev) => ({
				...prev,
				selectedReport: null,
				isMarkerSelected: false,
				isDrawerAnimating: false,
			}));
		}, 300);
	}, [safeSetTimeout]);

	// Handle swipe actions with clean callback structures
	const handleSwipeLeft = useCallback(() => {
		handleCloseDrawer();
	}, [handleCloseDrawer]);

	const handleSwipeRight = useCallback((report: Report) => {
		console.log("Favorited report:", report.id);
		// Add favorite/approve logic here
	}, []);

	// Calculate map center position with optimized dependencies
	const centerPosition = useMemo((): [number, number] => {
		const { selectedReport, isMarkerSelected } = mapState;

		// If a marker was clicked, prioritize that position
		if (markerClickRef.current && selectedReport?.coordinates) {
			return [
				selectedReport.coordinates.latitude,
				selectedReport.coordinates.longitude,
			];
		}

		// If report selected, center on it
		if (selectedReport?.coordinates && isMarkerSelected) {
			return [
				selectedReport.coordinates.latitude,
				selectedReport.coordinates.longitude,
			];
		}

		// Otherwise use average position of markers
		if (mapMarkers.length > 0) {
			const sumLat = mapMarkers.reduce(
				(sum, marker) => sum + marker.position[0],
				0,
			);
			const sumLng = mapMarkers.reduce(
				(sum, marker) => sum + marker.position[1],
				0,
			);
			return [sumLat / mapMarkers.length, sumLng / mapMarkers.length];
		}

		return defaultPosition;
	}, [mapMarkers, mapState]);

	// Optimize zoom level calculation
	const calculatedZoomLevel = useMemo(() => {
		const count = mapMarkers.length;
		if (count === 0) return 5;
		if (count === 1) return 15;
		if (count < 5) return 10;
		if (count < 20) return 7;
		return 5;
	}, [mapMarkers.length]);

	// Update zoom level when calculated zoom changes
	useEffect(() => {
		if (!markerClickRef.current) {
			setMapState((prev) => ({ ...prev, zoomLevel: calculatedZoomLevel }));
		}
	}, [calculatedZoomLevel]);

	// Simplified zoom change handler
	const handleZoomChange = useCallback((newZoom: number) => {
		setMapState((prev) => ({ ...prev, zoomLevel: newZoom }));
	}, []);

	// Get actual zoom to use with clear intent
	const activeZoom = useMemo(() => {
		return mapState.isMarkerSelected ? 17 : mapState.zoomLevel;
	}, [mapState.isMarkerSelected, mapState.zoomLevel]);

	// Optimized category and status stats - moved before any returns
	const { reportsByCategory, reportsByStatus } = useMemo(() => {
		const categories: Record<string, number> = {};
		const statuses: Record<string, number> = {};

		for (const report of reportsWithCoordinates) {
			// Count categories
			const category = report.category?.name || "Umum";
			categories[category] = (categories[category] || 0) + 1;

			// Count statuses
			statuses[report.status] = (statuses[report.status] || 0) + 1;
		}

		return {
			reportsByCategory: Object.entries(categories).sort((a, b) => b[1] - a[1]),
			reportsByStatus: Object.entries(statuses).sort((a, b) => b[1] - a[1]),
		};
	}, [reportsWithCoordinates]);

	// Create render elements before any conditional returns
	const loadingElement = <LoadingMapState />;

	const emptyElement = <EmptyMapState />;

	const mapElement = (
		<motion.div
			className="rounded-lg overflow-hidden border relative"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="h-[500px] sm:h-[550px] md:h-[600px] relative">
				<LocationMap
					position={centerPosition}
					zoom={activeZoom}
					markers={mapMarkers}
					className="h-full w-full"
					interactive={true}
					showZoomControls={false}
					onMarkerClick={handleMarkerClick}
					onZoomChange={handleZoomChange}
					bottomDrawer={
						mapState.selectedReport && (
							<DrawerContents
								report={mapState.selectedReport}
								onClose={handleCloseDrawer}
							/>
						)
					}
					drawerInitiallyExpanded={mapState.drawerOpen}
					onDrawerToggle={(isOpen) => {
						setMapState((prev) => ({ ...prev, drawerOpen: isOpen }));
					}}
					drawerTitle={mapState.selectedReport?.title || "Report Details"}
				/>

				{!mapState.isMarkerSelected && (
					<MapInfoPanel
						markerCount={mapMarkers.length}
						categories={reportsByCategory}
						statuses={reportsByStatus}
					/>
				)}
			</div>
		</motion.div>
	);

	// Return appropriate element AFTER all hooks have been called
	if (isLoading) {
		return loadingElement;
	}

	if (mapMarkers.length === 0) {
		return emptyElement;
	}

	return mapElement;
}

// Extracted drawer contents component - no conditional hooks
function DrawerContents({
	report,
	onClose,
}: {
	report: Report;
	onClose: () => void;
}) {
	return (
		<div className="w-full">
			<AnimatePresence mode="wait">
				<motion.div
					key={report.id}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.2 }}
				>
					<ReportCard report={report} />
				</motion.div>
			</AnimatePresence>

			<div className="flex justify-end mt-4">
				<Button
					variant="outline"
					size="sm"
					onClick={onClose}
					className="gap-1.5"
				>
					<X className="h-3.5 w-3.5" />
					<span>Close</span>
				</Button>
			</div>
		</div>
	);
}

// Map information panel
function MapInfoPanel({
	markerCount,
	categories = [],
	statuses = [],
}: {
	markerCount: number;
	categories: [string, number][];
	statuses: [string, number][];
}) {
	const [showLegend, setShowLegend] = useState(false);

	const toggleLegend = useCallback(() => {
		setShowLegend((prev) => !prev);
	}, []);

	return (
		<motion.div
			className="absolute bottom-3 inset-x-3 bg-background/95 backdrop-blur-sm rounded-lg shadow-md z-30"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2, duration: 0.3 }}
		>
			<div className="p-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10">
							<MapPin className="h-3.5 w-3.5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">
								<span className="font-semibold">{markerCount}</span>{" "}
								<span className="text-muted-foreground">
									laporan ditampilkan
								</span>
							</p>
							<p className="text-xs text-muted-foreground">
								Klik pada marker untuk melihat detail laporan
							</p>
						</div>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 -mr-1"
						onClick={toggleLegend}
					>
						{showLegend ? (
							<X className="h-4 w-4" />
						) : (
							<MapIcon className="h-4 w-4" />
						)}
						<span className="sr-only">
							{showLegend ? "Sembunyikan legenda" : "Tampilkan legenda"}
						</span>
					</Button>
				</div>

				<AnimatePresence>
					{showLegend && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<Separator className="my-2" />
							<div className="mb-2">
								<p className="text-xs font-medium mb-1.5">Kategori:</p>
								<div className="flex flex-wrap gap-1.5">
									{categories.map(([category, count]) => (
										<Badge
											key={category}
											variant="outline"
											className="text-xs font-normal"
										>
											{category}: {count}
										</Badge>
									))}
								</div>
							</div>
							<div className="mt-2">
								<p className="text-xs font-medium mb-1.5">Status:</p>
								<div className="flex flex-wrap gap-1.5">
									{statuses.map(([status, count]) => (
										<StatusBadge
											key={status}
											status={status as ReportStatus}
											size="sm"
										>
											{count}
										</StatusBadge>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}

// Loading state component - no conditional hooks
function LoadingMapState() {
	return (
		<motion.div
			className="rounded-lg overflow-hidden bg-gradient-to-b from-muted/30 to-background border"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="h-[500px] p-8 flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="h-10 w-10 animate-spin text-muted-foreground/60 mx-auto" />
					<p className="text-muted-foreground">Memuat peta...</p>
				</div>
			</div>
		</motion.div>
	);
}

// Empty state component - no conditional hooks
function EmptyMapState() {
	return (
		<motion.div
			className="rounded-lg overflow-hidden bg-gradient-to-b from-muted/30 to-background border"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="h-[500px] p-8 flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<div className="mx-auto w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center">
						<MapPin className="h-7 w-7 text-muted-foreground/60" />
					</div>
					<h3 className="text-xl font-semibold">Peta Laporan</h3>
					<p className="text-muted-foreground">
						Tidak ada laporan dengan lokasi GPS yang dapat ditampilkan saat ini.
					</p>
					<Button variant="outline" className="mt-2" disabled>
						<MapIcon className="mr-2 h-4 w-4" />
						Tidak Ada Lokasi untuk Ditampilkan
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
