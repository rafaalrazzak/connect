"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Locate, MapPin, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import type { Map as LeafletMap } from "leaflet";

// Import leaflet CSS only on client side
import "leaflet/dist/leaflet.css";

// Import hooks directly, they'll only be used client-side within components
import { useMap, useMapEvents } from "react-leaflet";

// Define no-op versions for SSR
const clientSideHooks = {
  useMap: typeof window === "undefined" ? () => null : useMap,
  useMapEvents: typeof window === "undefined" ? () => null : useMapEvents,
};

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface LocationStepProps {
  location: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUseCurrentLocation: () => void;
}

export function LocationStep({
  location,
  onChange,
  onUseCurrentLocation,
}: LocationStepProps) {
  // Default koordinat (Jakarta)
  const defaultPosition: [number, number] = [-6.2, 106.816666];

  const [markerPosition, setMarkerPosition] = useState(defaultPosition);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const prevLocationRef = useRef<string>(location);
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  // Initialize Leaflet icon only on client side
  useEffect(() => {
    // Import Leaflet only on client side
    const L = require("leaflet");

    // Create marker icon
    const icon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    setMarkerIcon(icon);
  }, []);

  // Ekstrak koordinat dari string lokasi
  const extractCoordinates = useCallback(
    (locationStr: string): [number, number] | null => {
      if (locationStr.includes(",")) {
        const matches = locationStr.match(/([-\d.]+),\s*([-\d.]+)/);
        if (matches) {
          const lat = Number.parseFloat(matches[1]);
          const lng = Number.parseFloat(matches[2]);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            return [lat, lng];
          }
        }
      }
      return null;
    },
    []
  );

  // Update marker position saat lokasi berubah dari luar
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      prevLocationRef.current = location;
      const coords = extractCoordinates(location);
      if (coords) {
        setMarkerPosition(coords);
      }
    }
  }, [location, extractCoordinates]);

  // Fungsi untuk mencari lokasi dari teks input
  const searchLocation = useCallback(async () => {
    if (!location || location.trim() === "") return;

    const coords = extractCoordinates(location);
    if (coords) {
      // Jika lokasi sudah dalam format koordinat, langsung set marker
      setMarkerPosition(coords);
      return;
    }

    setIsSearching(true);
    toast.info("Mencari lokasi...");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}&limit=1&countrycodes=id`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [
          Number.parseFloat(lat),
          Number.parseFloat(lon),
        ];
        setMarkerPosition(newPosition);
        toast.success("Lokasi berhasil ditemukan!");
      } else {
        toast.warning("Lokasi tidak ditemukan, coba kata kunci lain");
      }
    } catch (error) {
      console.error("Gagal mencari lokasi:", error);
      toast.error("Gagal mencari lokasi, coba lagi nanti");
    } finally {
      setIsSearching(false);
    }
  }, [location, extractCoordinates]);

  // Memperbarui alamat saat marker dipindahkan
  const updateAddressFromMarker = useCallback(
    async (position: [number, number]) => {
      try {
        const [lat, lng] = position;

        // Tampilkan koordinat dulu sementara menunggu hasil geocoding
        const tempEvent = {
          target: {
            name: "location",
            value: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(tempEvent);
        prevLocationRef.current = tempEvent.target.value;

        // Cari alamat berdasarkan koordinat
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );

        if (!response.ok) throw new Error("Gagal mendapatkan alamat");

        const data = await response.json();

        if (data?.display_name) {
          const syntheticEvent = {
            target: {
              name: "location",
              value: data.display_name,
            },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(syntheticEvent);
          prevLocationRef.current = syntheticEvent.target.value;
        }
      } catch (error) {
        console.error("Gagal mendapatkan alamat:", error);
      }
    },
    [onChange]
  );

  // Komponen untuk mengupdate posisi peta saat markerPosition berubah
  function MapUpdater() {
    // Komponen untuk mengupdate posisi peta saat markerPosition berubah
    function MapUpdater() {
      const map = clientSideHooks.useMap();

      // Set the map reference once it's available
      useEffect(() => {
        if (map && !mapRef.current) {
          mapRef.current = map;
          setMapReady(true);
        }
      }, [map]);

      useEffect(() => {
        if (map && markerPosition) {
          map.flyTo(markerPosition, 16, {
            animate: true,
            duration: 1.5,
          });
        }
      }, [map, markerPosition]);

      return null;
    }

    // Komponen untuk menangani events pada peta
    function MapEvents() {
      clientSideHooks.useMapEvents({
        click: (e) => {
          const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
          setMarkerPosition(newPos);
          updateAddressFromMarker(newPos);
        },
      });

      return null;
    }
    const handleUseCurrentLocation = useCallback(() => {
      setIsLoadingLocation(true);

      // Call the original handler
      onUseCurrentLocation();

      // Check for location changes every 500ms for up to 3 seconds
      // This ensures we detect when the location has been updated
      let checkCount = 0;
      const checkInterval = setInterval(() => {
        checkCount++;

        // Check if location has coordinates format
        const coords = extractCoordinates(location);
        if (coords) {
          clearInterval(checkInterval);
          setMarkerPosition(coords);
          setIsLoadingLocation(false);
        }

        // Timeout after 3 seconds (6 checks)
        if (checkCount >= 6) {
          clearInterval(checkInterval);
          setIsLoadingLocation(false);
        }
      }, 500);

      // Clean up interval on component unmount
      return () => clearInterval(checkInterval);
    }, [onUseCurrentLocation, location, extractCoordinates]);

    // Only render map when we're in browser and marker icon is ready
    const shouldRenderMap =
      typeof window !== "undefined" && markerIcon !== null;

    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Tentukan lokasi masalah yang ingin kamu laporkan.
        </p>

        <div className="space-y-4">
          {/* Input Lokasi */}
          <div className="space-y-2">
            <Label htmlFor="location">Alamat atau Lokasi</Label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location"
                  name="location"
                  placeholder="Masukkan alamat atau deskripsikan lokasi"
                  value={location}
                  onChange={onChange}
                  className="pl-10"
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleUseCurrentLocation}
                className="flex items-center gap-2"
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
            <div className="flex justify-end">
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
                    Cari di Peta
                    <Search className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Peta - Only render when on client side and icon is ready */}
          <div className="aspect-video w-full rounded-md border overflow-hidden">
            {shouldRenderMap ? (
              <MapContainer
                center={markerPosition}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                whenReady={() => {
                  setMapReady(true);
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markerIcon && (
                  <Marker
                    position={markerPosition}
                    draggable={true}
                    icon={markerIcon}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        const newPos: [number, number] = [
                          position.lat,
                          position.lng,
                        ];
                        setMarkerPosition(newPos);
                        updateAddressFromMarker(newPos);
                      },
                    }}
                  />
                )}
                <MapEvents />
                <MapUpdater />
              </MapContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted/30">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded text-primary">
                <MapPin className="w-3 h-3" />
              </span>
              <span>
                <span className="font-medium">Tips:</span> Klik di peta untuk
                menempatkan pin, atau geser pin untuk menentukan lokasi yang
                lebih tepat. Gunakan tombol "Lokasi Saat Ini" untuk menggunakan
                lokasi kamu sekarang.
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
