"use client";

import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import L from "leaflet";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Home,
	Loader2,
	Locate,
	Maximize2,
	Minimize2,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

// Define position options for toggle controls
type TogglePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Coordinates = [number, number];

interface MapMarker {
	position: Coordinates;
	text?: string;
	id?: string;
	status?: string;
	onClick?: () => void;
}

interface LocationMapProps {
	position?: Coordinates;
	popupText?: string;
	zoom?: number;
	className?: string;
	interactive?: boolean;
	showZoomControls?: boolean;
	markers?: MapMarker[];
	onLoad?: () => void;
	onMarkerClick?: (id: string) => void;
	onZoomChange?: (zoom: number) => void;
	customControls?: React.ReactNode;
	bottomDrawer?: React.ReactNode;
	drawerInitiallyExpanded?: boolean;
	drawerTitle?: string;
	onDrawerToggle?: (isExpanded: boolean) => void;
	// New prop for toggle control position
	togglePosition?: TogglePosition;
}

const INDONESIA_DEFAULT_POSITION = [0.7893, 113.9213]; // Center of Indonesia

// Helper function to get position classes based on toggle position
const getTogglePositionClasses = (position: TogglePosition): string => {
	switch (position) {
		case "top-left":
			return "top-3 left-3";
		case "top-right":
			return "top-3 right-3";
		case "bottom-left":
			return "bottom-20 left-3"; // Leave space for drawer
		case "bottom-right":
			return "bottom-20 right-3"; // Leave space for drawer
		default:
			return "top-3 left-3";
	}
};

// Helper function to get panel position classes based on toggle position
const getPanelPositionClasses = (position: TogglePosition): string => {
	switch (position) {
		case "top-left":
			return "top-16 left-3";
		case "top-right":
			return "top-16 right-3";
		case "bottom-left":
			return "bottom-32 left-3"; // Position above toggle
		case "bottom-right":
			return "bottom-32 right-3"; // Position above toggle
		default:
			return "top-16 left-3";
	}
};

// Helper function to get transform classes for slide animation
const getTransformClasses = (
	position: TogglePosition,
	expanded: boolean,
): string => {
	if (expanded) return "opacity-100 translate-x-0";

	switch (position) {
		case "top-left":
		case "bottom-left":
			return "opacity-0 -translate-x-full pointer-events-none";
		case "top-right":
		case "bottom-right":
			return "opacity-0 translate-x-full pointer-events-none";
		default:
			return "opacity-0 -translate-x-full pointer-events-none";
	}
};

// Helper function to get the appropriate chevron icon based on position and state
const getChevronIcon = (position: TogglePosition, expanded: boolean) => {
	if (position.includes("right")) {
		return expanded ? (
			<ChevronRight className="h-5 w-5" />
		) : (
			<ChevronLeft className="h-5 w-5" />
		);
	}
	return expanded ? (
		<ChevronLeft className="h-5 w-5" />
	) : (
		<ChevronRight className="h-5 w-5" />
	);
};

/**
 * Interactive map component built on Leaflet
 * Google Maps style behavior and controls
 */
const LocationMap: React.FC<LocationMapProps> = ({
	position = INDONESIA_DEFAULT_POSITION,
	popupText = "Lokasi",
	zoom = 5, // Better default zoom for Indonesia
	className = "",
	interactive = true,
	showZoomControls = false,
	markers = [],
	onLoad,
	onMarkerClick,
	onZoomChange,
	customControls,
	bottomDrawer,
	drawerInitiallyExpanded = true,
	drawerTitle,
	onDrawerToggle,
	// Default position for toggle controls
	togglePosition = "top-left",
}) => {
	// State
	const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
	const [isLocating, setIsLocating] = useState(false);
	const [locationError, setLocationError] = useState<string | null>(null);
	const [currentZoom, setCurrentZoom] = useState(zoom);
	const [isZooming, setIsZooming] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [controlsExpanded, setControlsExpanded] = useState(false);
	const [showLabels, setShowLabels] = useState(true);
	const [drawerExpanded, setDrawerExpanded] = useState(drawerInitiallyExpanded);
	const [leafletLoaded, setLeafletLoaded] = useState(false);

	// Refs and other state/handlers (abbreviated)
	const mapRef = useRef<HTMLDivElement>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<L.Map | null>(null);
	const markerLayerRef = useRef<L.LayerGroup | null>(null);
	const markersRef = useRef<Map<string, L.Marker>>(new Map());
	const userMarkerRef = useRef<L.CircleMarker | null>(null);
	const userCircleRef = useRef<L.CircleMarker | null>(null);
	const pulseAnimationRef = useRef<number | null>(null);
	const initialPositionRef = useRef<Coordinates>(position as Coordinates);

	// Control flags
	const isUserControlledRef = useRef(false);
	const isDraggingRef = useRef(false);
	const lastInteractionTimeRef = useRef(0);
	const initialPositionAppliedRef = useRef(false);

	// Fix Leaflet icon path issues in Next.js
	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/performance/noDelete: <explanation>
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: "/leaflet/marker-icon-2x.png",
			iconUrl: "/leaflet/marker-icon.png",
			shadowUrl: "/leaflet/marker-shadow.png",
		});
	}, []);

	// Handle fullscreen change events
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(document.fullscreenElement === mapContainerRef.current);

			// Resize map after fullscreen change to prevent rendering issues
			if (mapInstanceRef.current) {
				setTimeout(() => {
					mapInstanceRef.current?.invalidateSize();
				}, 100);
			}
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
			document.removeEventListener(
				"webkitfullscreenchange",
				handleFullscreenChange,
			);
		};
	}, []);

	// Toggle controls expansion state
	const toggleControls = useCallback(() => {
		setControlsExpanded((prev) => !prev);
	}, []);

	// Get position classes for toggle button
	const togglePositionClasses = getTogglePositionClasses(togglePosition);

	// Get position classes for panel
	const panelPositionClasses = getPanelPositionClasses(togglePosition);

	// Get transform classes for animation
	const transformClasses = getTransformClasses(
		togglePosition,
		controlsExpanded,
	);

	// Get the appropriate chevron icon
	const chevronIcon = getChevronIcon(togglePosition, controlsExpanded);

	// Update drawer state when prop changes
	useEffect(() => {
		setDrawerExpanded(drawerInitiallyExpanded);
	}, [drawerInitiallyExpanded]);

	// Toggle drawer expansion state
	const toggleDrawer = useCallback(() => {
		const newState = !drawerExpanded;
		setDrawerExpanded(newState);
		if (onDrawerToggle) {
			onDrawerToggle(newState);
		}
	}, [drawerExpanded, onDrawerToggle]);

	// Toggle fullscreen mode
	const toggleFullscreen = useCallback(() => {
		if (isFullscreen) {
			document.exitFullscreen?.();
		} else if (mapContainerRef.current) {
			mapContainerRef.current.requestFullscreen?.();
		}
	}, [isFullscreen]);

	// Check viewport width on mount and resize
	useEffect(() => {
		const handleResize = () => {
			setShowLabels(window.innerWidth >= 640); // Show labels on screens >= 640px (sm breakpoint)
		};

		// Initial check
		handleResize();

		// Add resize listener
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Clean up pulse animation
	useEffect(() => {
		return () => {
			if (pulseAnimationRef.current) {
				cancelAnimationFrame(pulseAnimationRef.current);
			}
		};
	}, []);

	// Get user location from browser
	const getUserLocation = useCallback(() => {
		if (!navigator.geolocation) {
			setLocationError("Geolocation tidak tersedia di browser Anda");
			return;
		}

		setIsLocating(true);
		setLocationError(null);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const userCoords: Coordinates = [
					position.coords.latitude,
					position.coords.longitude,
				];
				setUserLocation(userCoords);
				setIsLocating(false);

				if (mapInstanceRef.current) {
					// Add user marker
					updateUserLocationMarker(mapInstanceRef.current, userCoords);

					// Set user controlled flag
					isUserControlledRef.current = true;
					lastInteractionTimeRef.current = Date.now();

					// Fly to user location
					mapInstanceRef.current.flyTo(userCoords, 16, {
						duration: 1,
						easeLinearity: 0.25,
					});

					setCurrentZoom(16);
					if (onZoomChange) onZoomChange(16);
				}
			},
			(error) => {
				setIsLocating(false);
				if (error.code === error.PERMISSION_DENIED) {
					setLocationError("Izin lokasi ditolak");
				} else {
					setLocationError("Tidak dapat mendeteksi lokasi");
				}
				setTimeout(() => setLocationError(null), 3000);
			},
			{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
		);
	}, [onZoomChange]);

	// Create a stable pulse effect for user location
	const createPulseEffect = useCallback((map: L.Map, center: Coordinates) => {
		// Cancel any existing animation
		if (pulseAnimationRef.current) {
			cancelAnimationFrame(pulseAnimationRef.current);
			pulseAnimationRef.current = null;
		}

		// Minimum and maximum radius for the pulse effect
		const minRadius = 8;
		const maxRadius = 20;
		const animationDuration = 1500; // 1.5 seconds for full cycle

		// Create the pulsing circle (no animation yet, just the base)
		if (userCircleRef.current) {
			map.removeLayer(userCircleRef.current);
		}

		userCircleRef.current = L.circleMarker(center, {
			radius: minRadius,
			fillColor: "hsl(var(--primary))",
			fillOpacity: 0.4,
			stroke: true,
			color: "hsl(var(--primary))",
			weight: 1,
			opacity: 0.5,
		}).addTo(map);

		// Animation variables
		let startTime: number | null = null;

		// Animation function
		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;

			// Calculate progress (0 to 1)
			const elapsed = timestamp - startTime;
			const progress = (elapsed % animationDuration) / animationDuration;

			// Create a smooth pulse using sine function (oscillates between 0 and 1)
			const pulse = Math.abs(Math.sin(progress * Math.PI));

			// Calculate current radius based on pulse
			const radius = minRadius + pulse * (maxRadius - minRadius);

			// Calculate opacity (decrease as radius increases)
			const opacity = 0.6 - pulse * 0.4; // Fades from 0.6 to 0.2

			// Update circle properties if it exists
			if (userCircleRef.current) {
				userCircleRef.current.setRadius(radius);
				userCircleRef.current.setStyle({
					fillOpacity: opacity,
				});
			}

			// Continue animation loop
			pulseAnimationRef.current = requestAnimationFrame(animate);
		};

		// Start animation
		pulseAnimationRef.current = requestAnimationFrame(animate);

		// Return a cleanup function
		return () => {
			if (pulseAnimationRef.current) {
				cancelAnimationFrame(pulseAnimationRef.current);
			}
		};
	}, []);

	// Add/update user location marker
	const updateUserLocationMarker = useCallback(
		(map: L.Map, coords: Coordinates) => {
			// Remove previous markers
			if (userMarkerRef.current) {
				map.removeLayer(userMarkerRef.current);
			}

			if (userCircleRef.current) {
				map.removeLayer(userCircleRef.current);
			}

			// Stop any ongoing pulse animation
			if (pulseAnimationRef.current) {
				cancelAnimationFrame(pulseAnimationRef.current);
				pulseAnimationRef.current = null;
			}

			// Create user location marker (center dot)
			userMarkerRef.current = L.circleMarker(coords, {
				radius: 6,
				fillColor: "hsl(var(--primary))",
				color: "#ffffff",
				weight: 2,
				opacity: 1,
				fillOpacity: 0.9,
			}).addTo(map);

			userMarkerRef.current.bindPopup("Lokasi Anda");

			// Create stable pulse animation
			createPulseEffect(map, coords);
		},
		[createPulseEffect],
	);

	// Create custom icon based on status
	const createCustomIcon = useCallback((status?: string) => {
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let color;
		switch (status) {
			case "completed":
				color = "hsl(var(--secondary))"; // Green
				break;
			case "in_progress":
				color = "hsl(39, 100%, 50%)"; // Amber
				break;
			case "rejected":
				color = "hsl(var(--destructive))"; // Red
				break;
			default:
				color = "hsl(var(--primary))"; // Default blue
		}

		return L.divIcon({
			html: `
        <div class="flex items-center justify-center w-8 h-8">
          <div class="absolute flex items-center justify-center">
            <div class="h-5 w-5 rounded-full" style="background-color: ${color}"></div>
            <div class="h-10 w-10 rounded-full opacity-40 animate-ping absolute" style="background-color: ${color}"></div>
          </div>
        </div>
      `,
			className: "custom-marker",
			iconSize: [40, 40],
			iconAnchor: [20, 20],
		});
	}, []);

	// Handle zoom change
	const handleZoomChange = useCallback(
		(newZoom: number) => {
			if (!mapInstanceRef.current || isZooming) return;

			const targetZoom = Math.max(3, Math.min(19, newZoom));
			if (targetZoom === currentZoom) return;

			setIsZooming(true);
			isUserControlledRef.current = true;
			lastInteractionTimeRef.current = Date.now();

			mapInstanceRef.current.flyTo(
				mapInstanceRef.current.getCenter(),
				targetZoom,
				{ duration: 0.5, easeLinearity: 0.25 },
			);

			setCurrentZoom(targetZoom);
			if (onZoomChange) onZoomChange(targetZoom);

			setTimeout(() => setIsZooming(false), 600);
		},
		[currentZoom, isZooming, onZoomChange],
	);

	// Fly to marker with animation
	const flyToMarker = useCallback(
		(markerPosition: Coordinates, markerId: string) => {
			if (!mapInstanceRef.current || isZooming) return;

			// Mark as user controlled - THIS IS KEY for preventing position reset
			isUserControlledRef.current = true;
			lastInteractionTimeRef.current = Date.now();
			setIsZooming(true);

			// Fly to marker position
			mapInstanceRef.current.flyTo(markerPosition, 17, {
				duration: 1,
				easeLinearity: 0.25,
			});

			// Update zoom state
			setCurrentZoom(17);
			if (onZoomChange) onZoomChange(17);

			// Open marker popup after animation
			const marker = markersRef.current.get(markerId);
			if (marker) {
				setTimeout(() => marker.openPopup(), 500);
			}

			// Only reset the zooming flag, NOT the user control flag
			setTimeout(() => setIsZooming(false), 1200);
		},
		[isZooming, onZoomChange],
	);

	// Reset view to initial position
	const resetView = useCallback(() => {
		if (!mapInstanceRef.current || !initialPositionRef.current) return;

		isUserControlledRef.current = true;
		lastInteractionTimeRef.current = Date.now();

		mapInstanceRef.current.flyTo(initialPositionRef.current, zoom, {
			duration: 1,
			easeLinearity: 0.25,
		});

		setCurrentZoom(zoom);
		if (onZoomChange) onZoomChange(zoom);
	}, [zoom, onZoomChange]);

	// Add markers to the map
	const updateMarkers = useCallback(
		(map: L.Map) => {
			// Clear previous markers
			if (markerLayerRef.current) {
				map.removeLayer(markerLayerRef.current);
			}

			// Create new marker layer
			markerLayerRef.current = L.layerGroup().addTo(map);
			markersRef.current.clear();

			// Add main marker
			const mainMarker = L.marker(position as [number, number], {
				icon: createCustomIcon(),
				zIndexOffset: 1000,
			}).addTo(markerLayerRef.current);

			if (popupText) {
				mainMarker.bindPopup(popupText);
			}

			markersRef.current.set("main", mainMarker);

			// Add additional markers
			for (const marker of markers) {
				// Make sure markerLayerRef.current exists before adding to it
				if (!markerLayerRef.current) continue;

				const m = L.marker(marker.position, {
					icon: createCustomIcon(marker.status),
				}).addTo(markerLayerRef.current);

				if (marker.text) {
					m.bindPopup(marker.text);
				}

				if (marker.id) {
					m.on("click", () => {
						// Important: handle marker click to keep position
						if (onMarkerClick && marker.id) onMarkerClick(marker.id);
						if (marker.id) flyToMarker(marker.position, marker.id);
						if (marker.onClick) marker.onClick();
					});

					markersRef.current.set(marker.id, m);
				}
			}

			// Re-add user location marker if it exists
			if (userLocation) {
				updateUserLocationMarker(map, userLocation);
			}
		},
		[
			position,
			popupText,
			markers,
			createCustomIcon,
			onMarkerClick,
			flyToMarker,
			userLocation,
			updateUserLocationMarker,
		],
	);

	// Initialize and update map
	useEffect(() => {
		if (!mapRef.current) return;

		// Initialize map
		if (!mapInstanceRef.current) {
			try {
				const map = L.map(mapRef.current, {
					zoomControl: false,
					dragging: interactive,
					touchZoom: interactive,
					scrollWheelZoom: interactive,
					doubleClickZoom: interactive,
					boxZoom: interactive,
					zoomAnimation: true,
					fadeAnimation: true,
				}).setView(position as [number, number], zoom);

				// Store initial position
				initialPositionRef.current = position as [number, number];

				// Add tile layer
				L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
					maxZoom: 19,
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				}).addTo(map);

				// Set up user interaction handlers
				map.on("dragstart", () => {
					isDraggingRef.current = true;
					isUserControlledRef.current = true;
				});

				map.on("dragend", () => {
					isDraggingRef.current = false;
					lastInteractionTimeRef.current = Date.now();
				});

				map.on("zoomstart", () => {
					isUserControlledRef.current = true;
				});

				map.on("zoomend", () => {
					lastInteractionTimeRef.current = Date.now();
					const newZoom = map.getZoom();
					setCurrentZoom(newZoom);
					if (onZoomChange) onZoomChange(newZoom);
				});

				// Handle clicks on the map - user is interacting
				map.on("click", () => {
					isUserControlledRef.current = true;
					lastInteractionTimeRef.current = Date.now();
				});

				// Add markers
				updateMarkers(map);

				// Add standard zoom controls if requested
				if (interactive && showZoomControls) {
					L.control.zoom({ position: "bottomleft" }).addTo(map);
				}

				mapInstanceRef.current = map;
				initialPositionAppliedRef.current = true;

				// Force resize calculation
				setTimeout(() => {
					map.invalidateSize();
					if (onLoad) onLoad();
				}, 100);
			} catch (error) {
				console.error("Error initializing map:", error);
			}
		} else {
			// Update existing map
			const map = mapInstanceRef.current;

			// Only update position if user hasn't interacted with the map recently
			const recentInteraction =
				Date.now() - lastInteractionTimeRef.current < 2000;

			if (
				isDraggingRef.current ||
				isUserControlledRef.current ||
				recentInteraction
			) {
				// Just update markers without changing position
				updateMarkers(map);
				return;
			}

			// Only change position if it changed significantly
			const currentCenter = map.getCenter();
			const positionChanged =
				Math.abs(position[0] - currentCenter.lat) > 0.0001 ||
				Math.abs(position[1] - currentCenter.lng) > 0.0001;

			if (!initialPositionAppliedRef.current || positionChanged) {
				map.flyTo(position as [number, number], zoom, {
					duration: 1,
					easeLinearity: 0.25,
				});
				initialPositionAppliedRef.current = true;
				setCurrentZoom(zoom);
			}

			updateMarkers(map);
		}

		// Cleanup
		return () => {
			if (mapInstanceRef.current && !mapRef.current) {
				if (markerLayerRef.current) {
					markerLayerRef.current.clearLayers();
				}
				if (userMarkerRef.current) {
					userMarkerRef.current.remove();
				}
				if (userCircleRef.current) {
					userCircleRef.current.remove();
				}
				if (pulseAnimationRef.current) {
					cancelAnimationFrame(pulseAnimationRef.current);
					pulseAnimationRef.current = null;
				}
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
				markersRef.current.clear();
			}
		};
	}, [
		position,
		zoom,
		interactive,
		showZoomControls,
		updateMarkers,
		onLoad,
		onZoomChange,
	]);

	// Map control button component with label support
	const MapControlButton = ({
		onClick,
		disabled = false,
		ariaLabel,
		icon,
		label,
		className,
	}: {
		onClick: () => void;
		disabled?: boolean;
		ariaLabel: string;
		icon: React.ReactNode;
		label: string;
		className?: string;
	}) => (
		<Button
			variant="outline"
			size={showLabels ? "sm" : "icon"}
			className={cn(
				showLabels
					? "h-9 min-w-[9rem] px-3 justify-start gap-2 text-left"
					: "h-9 w-9",
				className,
			)}
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
		>
			<span className={cn("flex-shrink-0", showLabels ? "mr-1" : "")}>
				{icon}
			</span>
			{showLabels && <span>{label}</span>}
		</Button>
	);

	return (
		<div
			ref={mapContainerRef}
			className={cn(
				"w-full h-full relative isolate overflow-hidden rounded-lg",
				isFullscreen ? "!rounded-none" : "",
				className,
			)}
			data-testid="location-map"
		>
			{/* Map container */}
			<div
				ref={mapRef}
				className="w-full h-full"
				role="application"
				aria-label="Map showing location"
				aria-live="polite"
				style={{
					position: "relative",
					overflow: "hidden",
					borderRadius: isFullscreen ? "0" : "0.5rem",
					zIndex: 0,
				}}
			/>

			{/* Toggle Controls Button - Now with dynamic positioning */}
			<div className={cn("absolute z-10", togglePositionClasses)}>
				<Button
					variant="outline"
					size="icon"
					onClick={toggleControls}
					aria-label={
						controlsExpanded ? "Collapse controls" : "Expand controls"
					}
				>
					{chevronIcon}
				</Button>
			</div>

			{/* Controls Panel - Now with dynamic positioning */}
			<div
				className={cn(
					"absolute z-10 transition-all duration-300 ease-in-out",
					panelPositionClasses,
					transformClasses,
				)}
			>
				<div className="bg-background/90 backdrop-blur-sm rounded-md shadow-md border p-2 flex flex-col gap-2">
					{/* Fullscreen button */}
					<MapControlButton
						onClick={toggleFullscreen}
						ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
						icon={
							isFullscreen ? (
								<Minimize2 className="h-4 w-4" />
							) : (
								<Maximize2 className="h-4 w-4" />
							)
						}
						label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
					/>

					{/* Home button */}
					<MapControlButton
						onClick={resetView}
						ariaLabel="Reset view"
						icon={<Home className="h-4 w-4" />}
						label="Reset View"
					/>

					{/* Location button */}
					{interactive && (
						<MapControlButton
							onClick={getUserLocation}
							disabled={isLocating}
							ariaLabel="Find my location"
							icon={
								isLocating ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Locate className="h-4 w-4" />
								)
							}
							label="My Location"
							className={isLocating ? "animate-pulse" : ""}
						/>
					)}

					{/* Zoom controls */}
					{interactive && !showZoomControls && (
						<>
							<div className="h-[1px] w-full bg-border my-1" />
							<MapControlButton
								onClick={() => handleZoomChange(currentZoom + 1)}
								disabled={isZooming || currentZoom >= 19}
								ariaLabel="Zoom in"
								icon={<ZoomIn className="h-4 w-4" />}
								label="Zoom In"
							/>
							<MapControlButton
								onClick={() => handleZoomChange(currentZoom - 1)}
								disabled={isZooming || currentZoom <= 3}
								ariaLabel="Zoom out"
								icon={<ZoomOut className="h-4 w-4" />}
								label="Zoom Out"
							/>
						</>
					)}

					{/* Custom controls */}
					{customControls && (
						<>
							<div className="h-[1px] w-full bg-border my-1" />
							{customControls}
						</>
					)}
				</div>
			</div>

			{/* Error display */}
			{locationError && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-background/95 border-destructive border text-destructive text-sm p-3 px-4 rounded-md shadow-lg max-w-[90%] animate-in fade-in">
					<div className="flex items-center gap-2">
						<div className="rounded-full bg-destructive/10 p-1">
							{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
						</div>
						{locationError}
					</div>
				</div>
			)}

			{/* Bottom Drawer for Report Details - Google Maps Style */}
			{bottomDrawer && (
				<div
					className={cn(
						"absolute bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-in-out",
						"bg-background/95 backdrop-blur-sm border-t shadow-lg rounded-t-xl",
						drawerExpanded ? "translate-y-0" : "translate-y-[calc(100%-3rem)]",
					)}
				>
					{/* Drawer Handle/Header */}
					<button
						type="button"
						className="w-full h-18 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors group"
						onClick={toggleDrawer}
						aria-label={drawerExpanded ? "Collapse details" : "Expand details"}
					>
						<div className="w-12 h-1 my-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-muted-foreground/50 transition-colors" />

						<div className="flex items-center justify-between w-full px-4">
							<span className="text-sm font-medium truncate">
								{drawerTitle || "Report Details"}
							</span>
							<div className="text-muted-foreground transition-transform">
								{drawerExpanded ? (
									<ChevronDown className="h-4 w-4" />
								) : (
									<ChevronUp className="h-4 w-4" />
								)}
							</div>
						</div>
					</button>

					{/* Drawer Content */}
					<div
						className={cn(
							"max-h-[60vh] overflow-y-auto transition-opacity",
							drawerExpanded ? "opacity-100" : "opacity-0 pointer-events-none",
						)}
					>
						<div className="p-4">{bottomDrawer}</div>
					</div>
				</div>
			)}
		</div>
	);
};

// Export with dynamic import to avoid SSR issues
export default dynamic(() => Promise.resolve(LocationMap), { ssr: false });
