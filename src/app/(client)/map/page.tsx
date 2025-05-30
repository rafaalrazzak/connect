"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Custom Components
import ReportStatusBadge from "@/components/report-status-badge";
import { FilterPanel } from "@/components/map/filter-panel";
import { SearchBar } from "@/components/map/search-bar";
import { MapReportCard } from "@/components/map/report-card";

// Icons
import { ChevronLeft, Filter, Locate, Search, X } from "lucide-react";

// Data & Types
import { categories, reports } from "@/lib/mock-data";
import type { LatLngTuple } from "leaflet";
import type { Report } from "@/types/report";

// Hooks
import { useMapOperations } from "@/hooks/use-map-operations";

// Dynamically import map components to avoid SSR issues
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
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Sample coordinates for reports - in production this would come from the database
const reportCoordinates: Record<string, LatLngTuple> = {
  "report-1": [-6.2, 106.816666],
  "report-2": [-6.205, 106.82],
  "report-3": [-6.195, 106.812],
  "report-4": [-6.21, 106.818],
  "report-5": [-6.202, 106.83],
  "report-6": [-6.198, 106.805],
};

interface MapControllerProps {
  selectedReport: string | null;
  userPosition: LatLngTuple;
}

// Helper component to fly to selected report - extracted for clarity
const MapController: FC<MapControllerProps> = ({
  selectedReport,
  userPosition,
}) => {
  const { flyToLocation } = useMapOperations();

  useEffect(() => {
    if (selectedReport && reportCoordinates[selectedReport]) {
      flyToLocation(reportCoordinates[selectedReport], 16);
    } else {
      flyToLocation(userPosition, 13);
    }
  }, [selectedReport, userPosition, flyToLocation]);

  return null;
};

export default function MapView() {
  // Core state
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [userPosition, setUserPosition] = useState<LatLngTuple>([
    -6.2, 106.816666,
  ]);
  const [activeFilters, setActiveFilters] = useState({
    statuses: ["pending", "in_progress", "completed", "rejected"],
    categories: categories.map((c) => c.id),
    timePeriod: "all",
  });

  // Get the selected report data
  const selectedReportData = useMemo(
    () =>
      selectedReport ? reports.find((r) => r.id === selectedReport) : null,
    [selectedReport]
  );

  // Initialize Leaflet
  useEffect(() => {
    const initLeaflet = async () => {
      try {
        const L = await import("leaflet");
        // Fix default icon paths
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: "/images/map/marker-icon.png",
          iconRetinaUrl: "/images/map/marker-icon-2x.png",
          shadowUrl: "/images/map/marker-shadow.png",
        });
        setMapReady(true);
      } catch (error) {
        console.error("Failed to initialize Leaflet:", error);
        toast.error("Gagal memuat peta. Coba muat ulang halaman.");
      }
    };

    initLeaflet();

    // Add CSS to customize markers by status
    const style = document.createElement("style");
    style.innerHTML = `
      .marker-pending { filter: hue-rotate(200deg); }
      .marker-in_progress { filter: hue-rotate(60deg); }
      .marker-completed { filter: hue-rotate(120deg); }
      .marker-rejected { filter: hue-rotate(280deg); }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Create marker icon (memoized)
  const createMarkerIcon = useCallback((status: string) => {
    if (typeof window === "undefined") return null;

    try {
      const L = require("leaflet");
      return new L.Icon({
        iconUrl: "/images/map/marker-icon.png",
        iconRetinaUrl: "/images/map/marker-icon-2x.png",
        shadowUrl: "/images/map/marker-shadow.png",
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

  // Search location function
  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    toast.info("Mencari lokasi...");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&countrycodes=id`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setUserPosition([Number.parseFloat(lat), Number.parseFloat(lon)]);
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

  // Get user's current location
  const getUserLocation = useCallback(() => {
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
          { id: "geolocation" }
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Filter reports based on active filters
  const filteredReports = useMemo(() => {
    return reports.filter(
      (report) =>
        activeFilters.statuses.includes(report.status) &&
        report.category &&
        typeof report.category === "object" &&
        activeFilters.categories.includes(report.category.id)
    );
  }, [activeFilters]);

  // Apply filters
  const handleApplyFilters = useCallback((filters: typeof activeFilters) => {
    setActiveFilters(filters);
  }, []);

  return (
    <div className="relative h-screen w-full bg-muted/10 overflow-hidden">
      {/* Top navigation bar with background */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/90 to-transparent pt-3 pb-6 px-3 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Back button */}
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="bg-background/95 shadow-md rounded-full backdrop-blur-sm border-muted/30 hover:bg-background"
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
                className="bg-background/95 backdrop-blur-sm shadow-md rounded-full border-muted/30 hover:bg-background/80"
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
                  className="bg-background/95 backdrop-blur-sm shadow-md rounded-full border-muted/30 hover:bg-background/80"
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
              className="bg-background/95 backdrop-blur-sm shadow-md rounded-full border-muted/30 hover:bg-background/80"
              onClick={getUserLocation}
              aria-label="Temukan lokasi saya"
            >
              <Locate className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* OpenStreetMap */}
      {mapReady ? (
        <div className="h-full w-full z-10">
          <MapContainer
            center={userPosition}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

            {/* Controller to handle map movements */}
            <MapController
              selectedReport={selectedReport}
              userPosition={userPosition}
            />
          </MapContainer>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted/10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted-foreground/30 border-t-primary mb-4"></div>
            <p className="text-muted-foreground">Memuat peta...</p>
          </div>
        </div>
      )}

      {/* Selected report card */}
      <AnimatePresence>
        {selectedReportData && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-8 left-0 right-0 px-3 sm:px-4 max-w-2xl mx-auto z-30"
          >
            <MapReportCard
              report={selectedReportData}
              onClose={() => setSelectedReport(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
