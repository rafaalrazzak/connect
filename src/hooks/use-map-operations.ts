import type { LatLngTuple } from "leaflet";
import { useCallback } from "react";
import { useMap } from "react-leaflet";

export function useMapOperations() {
	const map = useMap();

	/**
	 * Fly to a specific location on the map
	 */
	const flyToLocation = useCallback(
		(
			position: LatLngTuple,
			zoom = 13,
			options = { animate: true, duration: 1 },
		) => {
			map.flyTo(position, zoom, options);
		},
		[map],
	);

	/**
	 * Reset map view to initial position
	 */
	const resetView = useCallback(
		(defaultPosition: LatLngTuple, defaultZoom = 13) => {
			map.setView(defaultPosition, defaultZoom);
		},
		[map],
	);

	/**
	 * Get current map center
	 */
	const getCurrentCenter = useCallback((): LatLngTuple => {
		const center = map.getCenter();
		return [center.lat, center.lng];
	}, [map]);

	/**
	 * Get current zoom level
	 */
	const getCurrentZoom = useCallback((): number => {
		return map.getZoom();
	}, [map]);

	return {
		flyToLocation,
		resetView,
		getCurrentCenter,
		getCurrentZoom,
		map,
	};
}
