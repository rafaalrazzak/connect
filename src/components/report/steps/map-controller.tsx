"use client";

import type { Map as LeafletMap } from "leaflet";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

interface MapControllerProps {
	position: [number, number];
	onMapClick: (lat: number, lng: number) => void;
	setMapRef: (map: LeafletMap) => void;
}

/**
 * Controller component for Leaflet map
 * Handles map events and updates
 */
export function MapController({
	position,
	onMapClick,
	setMapRef,
}: MapControllerProps) {
	// Get map instance
	const map = useMap();

	// Set map reference
	useEffect(() => {
		if (map) {
			setMapRef(map);
		}
	}, [map, setMapRef]);

	// Update map position when marker changes
	useEffect(() => {
		if (map && position) {
			map.flyTo(position, 16, {
				animate: true,
				duration: 1.5,
			});
		}
	}, [map, position]);

	// Handle map click events
	useMapEvents({
		click: (e) => {
			onMapClick(e.latlng.lat, e.latlng.lng);
		},
	});

	return null;
}
