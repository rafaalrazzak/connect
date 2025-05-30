"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	Clock,
	Loader2,
	Locate,
	MapPin,
	Search,
	X,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";

// Types
interface LocationSuggestion {
	id: string;
	name: string;
	displayName: string;
	lat: number;
	lon: number;
}

interface LocationStepProps {
	location: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onUseCurrentLocation: () => void;
}

type Coordinates = [number, number] | null;

// State management with reducer
type LocationState = {
	isSearching: boolean;
	isLoadingLocation: boolean;
	isLoadingSuggestions: boolean;
	isReverseGeocoding: boolean;
	coordinates: Coordinates;
	mapCenter: [number, number];
	autoSearchPending: boolean;
	suggestions: LocationSuggestion[];
	showSuggestions: boolean;
	loadingState:
		| "idle"
		| "location"
		| "suggestions"
		| "search"
		| "reverse-geocoding";
};

type LocationAction =
	| { type: "SET_COORDINATES"; payload: Coordinates; fromUser?: boolean }
	| { type: "SET_MAP_CENTER"; payload: [number, number] }
	| { type: "START_SEARCH" }
	| { type: "COMPLETE_SEARCH" }
	| { type: "START_AUTO_SEARCH" }
	| { type: "CANCEL_AUTO_SEARCH" }
	| { type: "SET_SUGGESTIONS"; payload: LocationSuggestion[] }
	| {
			type: "SET_LOADING_STATE";
			payload:
				| "idle"
				| "location"
				| "suggestions"
				| "search"
				| "reverse-geocoding";
	  }
	| { type: "SHOW_SUGGESTIONS"; payload: boolean }
	| { type: "START_REVERSE_GEOCODING" }
	| { type: "COMPLETE_REVERSE_GEOCODING" }
	| { type: "SUGGESTION_SELECTED"; payload: LocationSuggestion };

// Lazy-loaded Map Component
const MapComponent = dynamic(
	() => import("./map-component").then((mod) => mod.MapComponent),
	{ ssr: false, loading: () => <MapLoadingPlaceholder /> },
);

// LocationStep Component
export const LocationStep = memo(function LocationStep({
	location,
	onChange,
	onUseCurrentLocation,
}: LocationStepProps) {
	// References
	const lastSearchedRef = useRef<string>("");
	const locationUpdatedRef = useRef<boolean>(false);
	const autoSearchTimerRef = useRef<number | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const reverseGeocodingDebounceRef = useRef<NodeJS.Timeout | null>(null);

	// Location state reducer
	const [state, dispatch] = useReducer(
		(state: LocationState, action: LocationAction): LocationState => {
			switch (action.type) {
				case "SET_COORDINATES":
					if (action.fromUser) {
						locationUpdatedRef.current = true;
					}
					return {
						...state,
						coordinates: action.payload,
					};
				case "SET_MAP_CENTER":
					return {
						...state,
						mapCenter: action.payload,
					};
				case "START_SEARCH":
					return {
						...state,
						isSearching: true,
						autoSearchPending: false,
						loadingState: "search",
					};
				case "COMPLETE_SEARCH":
					return {
						...state,
						isSearching: false,
						loadingState: "idle",
					};
				case "START_AUTO_SEARCH":
					return {
						...state,
						autoSearchPending: true,
					};
				case "CANCEL_AUTO_SEARCH":
					return {
						...state,
						autoSearchPending: false,
					};
				case "SET_SUGGESTIONS":
					return {
						...state,
						suggestions: action.payload,
						isLoadingSuggestions: false,
						showSuggestions: action.payload.length > 0,
						loadingState:
							action.payload.length > 0 ? state.loadingState : "idle",
					};
				case "SET_LOADING_STATE":
					return {
						...state,
						loadingState: action.payload,
						isLoadingLocation: action.payload === "location",
						isLoadingSuggestions: action.payload === "suggestions",
						isSearching: action.payload === "search",
						isReverseGeocoding: action.payload === "reverse-geocoding",
					};
				case "SHOW_SUGGESTIONS":
					return {
						...state,
						showSuggestions: action.payload,
					};
				case "START_REVERSE_GEOCODING":
					return {
						...state,
						isReverseGeocoding: true,
						loadingState: "reverse-geocoding",
					};
				case "COMPLETE_REVERSE_GEOCODING":
					return {
						...state,
						isReverseGeocoding: false,
						loadingState: "idle",
					};
				case "SUGGESTION_SELECTED":
					return {
						...state,
						showSuggestions: false,
						autoSearchPending: false,
						coordinates: [action.payload.lat, action.payload.lon],
						mapCenter: [action.payload.lat, action.payload.lon],
					};
				default:
					return state;
			}
		},
		{
			isSearching: false,
			isLoadingLocation: false,
			isLoadingSuggestions: false,
			isReverseGeocoding: false,
			coordinates: null,
			mapCenter: [-6.2, 106.816666], // Default: Jakarta
			autoSearchPending: false,
			suggestions: [],
			showSuggestions: false,
			loadingState: "idle",
		},
	);

	// Extract values from state for easier access
	const {
		coordinates,
		mapCenter,
		isSearching,
		isLoadingLocation,
		isLoadingSuggestions,
		isReverseGeocoding,
		autoSearchPending,
		suggestions,
		showSuggestions,
	} = state;

	// Extract coordinates from location string when it changes
	useEffect(() => {
		if (location) {
			const matches = location.match(/([-\d.]+),\s*([-\d.]+)/);
			if (matches) {
				const lat = Number.parseFloat(matches[1]);
				const lng = Number.parseFloat(matches[2]);
				if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
					const newCoords: [number, number] = [lat, lng];
					dispatch({ type: "SET_COORDINATES", payload: newCoords });

					// Only center map if this is from external update like current location
					if (!locationUpdatedRef.current) {
						dispatch({ type: "SET_MAP_CENTER", payload: newCoords });
					}
					locationUpdatedRef.current = false;
				}
			}
		}
	}, [location]);

	/**
	 * Perform reverse geocoding to get address from coordinates
	 */
	const reverseGeocode = useCallback(
		async (
			position: [number, number],
			skipDebounce = false,
		): Promise<string> => {
			dispatch({ type: "START_REVERSE_GEOCODING" });

			try {
				const [lat, lon] = position;
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
				);

				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}

				const data = await response.json();

				if (data?.display_name) {
					return data.display_name;
				}
				return `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
			} catch (error) {
				console.error("Reverse geocoding failed:", error);
				// Fallback to coordinates if reverse geocoding fails
				return `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
			} finally {
				dispatch({ type: "COMPLETE_REVERSE_GEOCODING" });
			}
		},
		[],
	);

	// Conditionally apply debounce for reverse geocoding
	const processReverseGeocode = useCallback(
		(position: [number, number], skipDebounce = false) => {
			// Always clear any existing timer first
			if (reverseGeocodingDebounceRef.current) {
				clearTimeout(reverseGeocodingDebounceRef.current);
				reverseGeocodingDebounceRef.current = null;
			}

			// Set a temporary coordinate format immediately
			const syntheticTempEvent = {
				target: {
					name: "location",
					value: `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`,
				},
			} as React.ChangeEvent<HTMLInputElement>;

			onChange(syntheticTempEvent);

			// For non-manual inputs (like current location), skip debounce
			if (skipDebounce) {
				// Perform geocoding immediately without debounce
				reverseGeocode(position).then((address) => {
					const syntheticEvent = {
						target: {
							name: "location",
							value: address,
						},
					} as React.ChangeEvent<HTMLInputElement>;

					onChange(syntheticEvent);
				});
			} else {
				// Use debounce for manual inputs (like map dragging)
				reverseGeocodingDebounceRef.current = setTimeout(async () => {
					const address = await reverseGeocode(position);

					// Update with the resolved address
					const syntheticEvent = {
						target: {
							name: "location",
							value: address,
						},
					} as React.ChangeEvent<HTMLInputElement>;

					onChange(syntheticEvent);
				}, 800); // Delay to prevent too many API calls while dragging
			}
		},
		[onChange, reverseGeocode],
	);

	// Debounced auto search effect
	useEffect(() => {
		// Clear previous timer
		if (autoSearchTimerRef.current) {
			window.clearTimeout(autoSearchTimerRef.current);
			autoSearchTimerRef.current = null;
		}

		// Don't auto-search if location is empty or same as last search
		if (
			!location ||
			location.trim() === "" ||
			location === lastSearchedRef.current
		) {
			dispatch({ type: "CANCEL_AUTO_SEARCH" });
			return;
		}

		dispatch({ type: "START_AUTO_SEARCH" });

		// Set new timer for 5 seconds
		autoSearchTimerRef.current = window.setTimeout(() => {
			searchLocation();
			dispatch({ type: "CANCEL_AUTO_SEARCH" });
		}, 5000);

		return () => {
			if (autoSearchTimerRef.current) {
				window.clearTimeout(autoSearchTimerRef.current);
			}
		};
	}, [location]);

	/**
	 * Fetch location suggestions based on input
	 */
	const fetchSuggestions = useCallback(async (query: string) => {
		if (!query || query.trim().length < 3) {
			dispatch({ type: "SET_SUGGESTIONS", payload: [] });
			return;
		}

		// Check if input is coordinates - don't suggest for coordinates
		const coordMatches = query.match(/([-\d.]+),\s*([-\d.]+)/);
		if (coordMatches) {
			dispatch({ type: "SET_SUGGESTIONS", payload: [] });
			return;
		}

		dispatch({ type: "SET_LOADING_STATE", payload: "suggestions" });

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					query,
				)}&limit=5&countrycodes=id&addressdetails=1`,
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data = await response.json();

			if (data && data.length > 0) {
				const mappedSuggestions: LocationSuggestion[] = data.map(
					(item: any) => ({
						id: item.place_id,
						name: item.display_name.split(",")[0],
						displayName: item.display_name,
						lat: Number.parseFloat(item.lat),
						lon: Number.parseFloat(item.lon),
					}),
				);

				dispatch({ type: "SET_SUGGESTIONS", payload: mappedSuggestions });
			} else {
				dispatch({ type: "SET_SUGGESTIONS", payload: [] });
			}
		} catch (error) {
			console.error("Failed to fetch suggestions:", error);
			dispatch({ type: "SET_SUGGESTIONS", payload: [] });
		}
	}, []);

	// Create debounced version of fetchSuggestions
	const debouncedFetchSuggestions = useDebounce(fetchSuggestions, 400);

	/**
	 * Search for a location based on text input
	 */
	const searchLocation = useCallback(async () => {
		if (!location || location.trim() === "") {
			toast.warning("Masukkan alamat atau lokasi terlebih dahulu");
			return;
		}

		// Don't search if same as last search
		if (location === lastSearchedRef.current) {
			return;
		}

		// Update last searched value
		lastSearchedRef.current = location;

		// Check if input is already coordinates
		const coordMatches = location.match(/([-\d.]+),\s*([-\d.]+)/);
		if (coordMatches) {
			const lat = Number.parseFloat(coordMatches[1]);
			const lng = Number.parseFloat(coordMatches[2]);
			if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
				const newCoords: [number, number] = [lat, lng];
				dispatch({ type: "SET_COORDINATES", payload: newCoords });
				dispatch({ type: "SET_MAP_CENTER", payload: newCoords });
				return;
			}
		}

		dispatch({ type: "START_SEARCH" });
		toast.info("Mencari lokasi...");

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					location,
				)}&limit=1&countrycodes=id`,
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data = await response.json();

			if (data && data.length > 0) {
				const { lat, lon } = data[0];
				const newPosition: [number, number] = [
					Number.parseFloat(lat),
					Number.parseFloat(lon),
				];
				dispatch({ type: "SET_COORDINATES", payload: newPosition });
				dispatch({ type: "SET_MAP_CENTER", payload: newPosition });
				toast.success("Lokasi berhasil ditemukan!");
			} else {
				toast.warning("Lokasi tidak ditemukan, coba kata kunci lain");
			}
		} catch (error) {
			console.error("Gagal mencari lokasi:", error);
			toast.error("Gagal mencari lokasi, coba lagi nanti");
		} finally {
			dispatch({ type: "COMPLETE_SEARCH" });
		}
	}, [location]);

	/**
	 * Handle input change with debounced suggestions
	 */
	const handleLocationChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// Clear any existing auto search timer
			if (autoSearchTimerRef.current) {
				window.clearTimeout(autoSearchTimerRef.current);
				autoSearchTimerRef.current = null;
			}

			const newValue = e.target.value;

			// Fetch suggestions for the new value
			debouncedFetchSuggestions(newValue);

			// Pass the change to parent component
			onChange(e);
		},
		[onChange, debouncedFetchSuggestions],
	);

	/**
	 * Handle selecting a suggestion
	 */
	const handleSelectSuggestion = useCallback(
		(suggestion: LocationSuggestion) => {
			// Update state with selected suggestion
			dispatch({ type: "SUGGESTION_SELECTED", payload: suggestion });

			// Create synthetic event to update location text field
			const syntheticEvent = {
				target: {
					name: "location",
					value: suggestion.displayName,
				},
			} as React.ChangeEvent<HTMLInputElement>;

			onChange(syntheticEvent);

			// Update last searched to prevent duplicate search
			lastSearchedRef.current = suggestion.displayName;

			toast.success("Lokasi dipilih!");
		},
		[onChange],
	);

	/**
	 * Handle "Use Current Location" button click
	 */
	const handleUseCurrentLocation = useCallback(() => {
		dispatch({ type: "SET_LOADING_STATE", payload: "location" });
		dispatch({ type: "SHOW_SUGGESTIONS", payload: false });

		// Get location directly first for immediate response
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					const newCoords: [number, number] = [latitude, longitude];

					// Update coordinates and center map immediately
					dispatch({ type: "SET_COORDINATES", payload: newCoords });
					dispatch({ type: "SET_MAP_CENTER", payload: newCoords });

					// Mark that we've updated location programmatically
					locationUpdatedRef.current = true;

					// Set temporary coordinates while we fetch the address
					const syntheticTempEvent = {
						target: {
							name: "location",
							value: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
						},
					} as React.ChangeEvent<HTMLInputElement>;

					onChange(syntheticTempEvent);

					// Immediately perform reverse geocoding without debounce for current location
					reverseGeocode(newCoords)
						.then((address) => {
							const syntheticEvent = {
								target: {
									name: "location",
									value: address,
								},
							} as React.ChangeEvent<HTMLInputElement>;

							onChange(syntheticEvent);
							dispatch({ type: "SET_LOADING_STATE", payload: "idle" });
						})
						.catch(() => {
							// If reverse geocoding fails, we already have the coordinates set
							dispatch({ type: "SET_LOADING_STATE", payload: "idle" });
						});
				},
				(error) => {
					console.error("Error getting current location:", error);
					toast.error(
						"Tidak dapat mengakses lokasi Anda. Periksa izin lokasi.",
					);
					dispatch({ type: "SET_LOADING_STATE", payload: "idle" });
				},
			);
		} else {
			toast.error("Browser Anda tidak mendukung geolokasi");
			dispatch({ type: "SET_LOADING_STATE", payload: "idle" });
		}
	}, [onChange, reverseGeocode]);

	/**
	 * Update location when marker on map is moved
	 */
	const handleMarkerPositionChange = useCallback(
		(newPosition: [number, number]) => {
			dispatch({
				type: "SET_COORDINATES",
				payload: newPosition,
				fromUser: true,
			});

			// Perform reverse geocoding to get address from coordinates
			processReverseGeocode(newPosition);

			dispatch({ type: "SHOW_SUGGESTIONS", payload: false });
		},
		[processReverseGeocode],
	);

	// Handle clicks outside of suggestions to close them
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				showSuggestions &&
				inputRef.current &&
				!inputRef.current.contains(e.target as Node)
			) {
				dispatch({ type: "SHOW_SUGGESTIONS", payload: false });
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showSuggestions]);

	// Handle escape key to close suggestions
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && showSuggestions) {
				dispatch({ type: "SHOW_SUGGESTIONS", payload: false });
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [showSuggestions]);

	// Clean up any pending reverse geocoding requests
	useEffect(() => {
		return () => {
			if (reverseGeocodingDebounceRef.current) {
				clearTimeout(reverseGeocodingDebounceRef.current);
			}
		};
	}, []);

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{/* Location Input with Suggestions */}
				<div className="space-y-2">
					<Label htmlFor="location" className="font-medium">
						Alamat atau Lokasi <span className="text-red-500">*</span>
					</Label>
					<div className="flex gap-2">
						<div className="relative flex-grow">
							<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								ref={inputRef}
								id="location"
								name="location"
								placeholder="Masukkan alamat atau deskripsikan lokasi"
								value={location}
								onChange={handleLocationChange}
								className="pl-10 pr-10 transition-all"
								required
								onFocus={() => {
									if (suggestions.length > 0) {
										dispatch({ type: "SHOW_SUGGESTIONS", payload: true });
									}
								}}
								aria-expanded={showSuggestions}
								aria-autocomplete="list"
								autoComplete="off"
							/>
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
								{(isLoadingSuggestions || isReverseGeocoding) && (
									<Loader2 className="w-4 h-4 animate-spin" />
								)}
								{autoSearchPending &&
									!isLoadingSuggestions &&
									!isReverseGeocoding && (
										<Clock className="w-4 h-4 animate-pulse" />
									)}
								{location &&
									!isLoadingSuggestions &&
									!autoSearchPending &&
									!isReverseGeocoding && (
										<button
											type="button"
											onClick={() => {
												const syntheticEvent = {
													target: {
														name: "location",
														value: "",
													},
												} as React.ChangeEvent<HTMLInputElement>;
												onChange(syntheticEvent);
												inputRef.current?.focus();
											}}
											className="hover:text-foreground transition-colors"
											aria-label="Clear input"
										>
											<X className="w-4 h-4" />
										</button>
									)}
							</div>

							{/* Location Suggestions */}
							<AnimatePresence>
								{showSuggestions && suggestions.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										transition={{ duration: 0.15 }}
										className="absolute z-20 w-full mt-1 bg-background rounded-md border shadow-lg"
									>
										<Command className="rounded-lg overflow-hidden">
											<CommandList>
												<CommandGroup heading="Rekomendasi Lokasi">
													{suggestions.map((suggestion) => (
														<CommandItem
															key={suggestion.id}
															onSelect={() =>
																handleSelectSuggestion(suggestion)
															}
															className="cursor-pointer py-2 hover:bg-accent/50"
															value={suggestion.displayName}
														>
															<div className="flex items-start gap-2">
																<MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
																<div className="flex flex-col">
																	<span className="font-medium text-sm">
																		{suggestion.name}
																	</span>
																	<span className="text-xs text-muted-foreground truncate max-w-[280px]">
																		{suggestion.displayName}
																	</span>
																</div>
															</div>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
											<div className="px-2 py-1.5 border-t text-xs text-muted-foreground flex items-center justify-center">
												<span>Data dari OpenStreetMap</span>
											</div>
										</Command>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<Button
							type="button"
							variant="outline"
							onClick={handleUseCurrentLocation}
							className="flex items-center gap-2 whitespace-nowrap"
							disabled={isLoadingLocation}
						>
							{isLoadingLocation ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Locate className="w-4 h-4" />
							)}
							<span className="hidden sm:inline">
								{isLoadingLocation ? "Mencari..." : "Lokasi Saat Ini"}
							</span>
						</Button>
					</div>
					<div className="flex justify-between items-center">
						{isReverseGeocoding && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-xs text-muted-foreground flex items-center gap-1"
							>
								<Loader2 className="w-3 h-3 animate-spin" />
								<span>Mendapatkan alamat dari lokasi...</span>
							</motion.p>
						)}
						{autoSearchPending && !isReverseGeocoding && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-xs text-muted-foreground flex items-center gap-1"
							>
								<Clock className="w-3 h-3" />
								<span>Pencarian otomatis dalam 5 detik...</span>
							</motion.p>
						)}
						<div className="ml-auto">
							<Button
								type="button"
								variant="ghost"
								onClick={searchLocation}
								disabled={isSearching || !location.trim()}
								size="sm"
								className="text-xs mt-1"
							>
								{isSearching ? (
									<>
										<Loader2 className="w-3 h-3 mr-1 animate-spin" />
										Mencari...
									</>
								) : (
									<>
										Cari Sekarang
										<Search className="w-3 h-3 ml-1" />
									</>
								)}
							</Button>
						</div>
					</div>
				</div>

				{/* Map */}
				<div className="aspect-video w-full rounded-md border overflow-hidden bg-muted/30 relative">
					<MapComponent
						initialPosition={coordinates || mapCenter}
						center={mapCenter}
						onMarkerMove={handleMarkerPositionChange}
						zoom={coordinates ? 16 : 12}
					/>

					{/* Map Controls Overlay */}
					<div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
						<Button
							size="icon"
							variant="secondary"
							className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-lg"
							onClick={handleUseCurrentLocation}
							disabled={isLoadingLocation}
							title="Gunakan lokasi saat ini"
						>
							{isLoadingLocation ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Locate className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				{/* Tips */}
				<LocationTips />
			</div>
		</div>
	);
});

// MapLoadingPlaceholder and LocationTips components
const MapLoadingPlaceholder = () => (
	<div className="h-full w-full flex items-center justify-center bg-muted/30">
		<div className="flex flex-col items-center gap-2">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			<p className="text-sm text-muted-foreground animate-pulse">
				Memuat peta...
			</p>
		</div>
	</div>
);

const LocationTips = () => (
	<div className="bg-muted/50 rounded-lg p-3">
		<p className="text-xs text-muted-foreground flex items-start gap-2">
			<span className="bg-primary/10 p-1 rounded text-primary">
				<MapPin className="w-3 h-3" />
			</span>
			<span>
				<span className="font-medium">Tips:</span> Klik di peta untuk
				menempatkan pin, atau geser pin untuk menentukan lokasi yang lebih
				tepat. Gunakan tombol "Lokasi Saat Ini" untuk menggunakan lokasi kamu
				sekarang. Pencarian otomatis dilakukan setelah 5 detik.
			</span>
		</p>
	</div>
);
