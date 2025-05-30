"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  position: [number, number];
  popupText?: string;
  zoom?: number;
  className?: string;
  interactive?: boolean;
  markers?: Array<{
    position: [number, number];
    text?: string;
  }>;
}

/**
 * Interactive map component built on Leaflet
 * Efficiently handles updates and cleanup
 */
const LocationMap: React.FC<LocationMapProps> = ({
  position,
  popupText = "Lokasi",
  zoom = 16,
  className = "",
  interactive = true,
  markers = [],
}) => {
  // Refs to store DOM and Leaflet instances
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Fix Leaflet icon path issues in Next.js
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  // Memoize custom icon creation to avoid recreation on each render
  const createCustomIcon = useCallback(() => {
    return L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8">
          <div class="absolute flex items-center justify-center">
            <div class="h-5 w-5 rounded-full bg-primary"></div>
            <div class="h-10 w-10 rounded-full bg-primary opacity-40 animate-ping absolute"></div>
          </div>
        </div>
      `,
      className: "custom-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }, []);

  // Add markers to the map
  const updateMarkers = useCallback(
    (map: L.Map, customIcon: L.DivIcon) => {
      // Clear previous markers
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];

      // Add main marker
      const mainMarker = L.marker(position, { icon: customIcon }).addTo(map);
      if (popupText) {
        mainMarker.bindPopup(popupText).openPopup();
      }
      markersRef.current.push(mainMarker);

      // Add additional markers if provided
      markers.forEach((marker) => {
        const m = L.marker(marker.position, { icon: customIcon }).addTo(map);
        if (marker.text) {
          m.bindPopup(marker.text);
        }
        markersRef.current.push(m);
      });
    },
    [position, popupText, markers]
  );

  // Initialize and update the map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create custom icon
    const customIcon = createCustomIcon();

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapRef.current, {
          zoomControl: false,
          dragging: interactive,
          touchZoom: interactive,
          scrollWheelZoom: interactive,
          doubleClickZoom: interactive,
          boxZoom: interactive,
        }).setView(position, zoom);

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add markers
        updateMarkers(map, customIcon);

        // Add zoom controls if interactive
        if (interactive) {
          L.control.zoom({ position: "bottomleft" }).addTo(map);
        }

        // Store map instance
        mapInstanceRef.current = map;

        // Force a resize calculation after map is loaded
        setTimeout(() => map.invalidateSize(), 100);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    } else {
      // Update existing map
      const map = mapInstanceRef.current;
      map.setView(position, zoom);

      // Update markers
      updateMarkers(map, customIcon);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current && !mapRef.current) {
        markersRef.current.forEach((marker) => {
          marker.remove();
        });
        markersRef.current = [];
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [position, zoom, interactive, updateMarkers, createCustomIcon]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full relative isolate ${className}`}
      data-testid="location-map"
      role="application"
      aria-label="Map showing location"
    />
  );
};

export default LocationMap;
