"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

// CSS for Leaflet
import "leaflet/dist/leaflet.css";

// Default marker icon
const defaultIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

interface MapProps {
	initialPosition: [number, number];
	center?: [number, number];
	zoom?: number;
	onMarkerMove: (position: [number, number]) => void;
}

export function MapComponent({
	initialPosition,
	center,
	zoom = 15,
	onMarkerMove,
}: MapProps) {
	return (
		<MapContainer
			center={center || initialPosition}
			zoom={zoom}
			style={{ height: "100%", width: "100%", zIndex: 0 }}
			className="leaflet-container"
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<MapEventHandler
				initialPosition={initialPosition}
				onMarkerMove={onMarkerMove}
			/>
		</MapContainer>
	);
}

// Separate component to handle map events
function MapEventHandler({
	initialPosition,
	onMarkerMove,
}: {
	initialPosition: [number, number];
	onMarkerMove: (position: [number, number]) => void;
}) {
	const markerRef = useRef<L.Marker | null>(null);
	const map = useMapEvents({
		click(e) {
			const { lat, lng } = e.latlng;
			const newPosition: [number, number] = [lat, lng];

			if (markerRef.current) {
				markerRef.current.setLatLng(e.latlng);
			}

			onMarkerMove(newPosition);
		},
	});

	// Initialize marker position
	useEffect(() => {
		map.flyTo(initialPosition, 15);
	}, [map, initialPosition]);

	return (
		<Marker
			position={initialPosition}
			draggable={true}
			icon={defaultIcon}
			ref={markerRef}
			eventHandlers={{
				dragend: (e) => {
					const marker = e.target;
					const position = marker.getLatLng();
					const newPos: [number, number] = [position.lat, position.lng];
					onMarkerMove(newPos);
				},
			}}
		/>
	);
}
