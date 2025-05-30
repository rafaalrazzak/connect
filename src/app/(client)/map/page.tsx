"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ReportStatusBadge from "@/components/report-status-badge";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Icons
import { ChevronLeft, Filter, Locate, MapPin, Search, X } from "lucide-react";

// Data
import { categories, reports } from "@/lib/mock-data";

// Types
import type { LatLngTuple } from "leaflet";
import { useMap } from "react-leaflet";
import { Report } from "@/types/report";

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

// Sample coordinates for reports
const reportCoordinates: Record<string, LatLngTuple> = {
  "report-1": [-6.2, 106.816666],
  "report-2": [-6.205, 106.82],
  "report-3": [-6.195, 106.812],
  "report-4": [-6.21, 106.818],
  "report-5": [-6.202, 106.83],
  "report-6": [-6.198, 106.805],
};

// Helper component to fly to selected report
function MapController({
  selectedReport,
  userPosition,
}: {
  selectedReport: string | null;
  userPosition: LatLngTuple;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedReport && reportCoordinates[selectedReport]) {
      map.flyTo(reportCoordinates[selectedReport], 16, {
        animate: true,
        duration: 1,
      });
    } else {
      map.flyTo(userPosition, 13, { animate: true, duration: 1 });
    }
  }, [selectedReport, userPosition, map]);

  return null;
}

// Search bar component
function SearchBar({
  searchQuery,
  setSearchQuery,
  searchLocation,
  isSearching,
  setSearchVisible,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLocation: () => Promise<void>;
  isSearching: boolean;
  setSearchVisible: (visible: boolean) => void;
}) {
  return (
    <div className="flex-1 mx-2 relative">
      <Input
        placeholder="Cari lokasi..."
        className="pl-10 pr-10 bg-background/95 backdrop-blur-sm shadow-md rounded-full border-muted"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchLocation()}
        aria-label="Cari lokasi"
      />
      {isSearching ? (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
      ) : (
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={searchLocation}
        />
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
        onClick={() => setSearchVisible(false)}
        aria-label="Tutup pencarian"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Report card component
function ReportCard({ report }: { report: Report }) {
  return (
    <Link href={`/report/${report.id}`}>
      <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 border-muted/80">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
              <img
                src={report.imageUrls[0] || "/placeholder.svg"}
                alt={report.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-medium line-clamp-1 text-sm sm:text-base">
                  {report.title}
                </h3>
                <ReportStatusBadge status={report.status} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {report.location}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {report.date}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function MapView() {
  // State management
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [userPosition, setUserPosition] = useState<LatLngTuple>([
    -6.2, 106.816666,
  ]);

  // Selected report data
  const selectedReportData = useMemo(
    () =>
      selectedReport ? reports.find((r) => r.id === selectedReport) : null,
    [selectedReport]
  );

  // Initialize Leaflet
  useEffect(() => {
    try {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
      setMapReady(true);
    } catch (error) {
      console.error("Failed to initialize Leaflet:", error);
      toast.error("Gagal memuat peta");
    }
  }, []);

  // Create marker icon (memoized)
  const createMarkerIcon = useCallback((status: string) => {
    try {
      const L = require("leaflet");
      return new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
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
        const { lat, lon } = data[0];
        setUserPosition([Number.parseFloat(lat), Number.parseFloat(lon)]);
        setSelectedReport(null); // Clear selected report when searching
        toast.success("Lokasi ditemukan!");
      } else {
        toast.warning("Lokasi tidak ditemukan, coba kata kunci lain");
      }
    } catch (error) {
      console.error("Gagal mencari lokasi:", error);
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

    toast.info("Mencari lokasi Anda...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        setSelectedReport(null); // Clear selected report when getting user location
        toast.success("Lokasi Anda ditemukan!");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Tidak dapat menemukan lokasi Anda");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className="relative h-[100vh] w-full">
      {/* Top navigation bar with background */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/90 to-transparent pt-3 pb-6 px-3 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Back button */}
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="bg-background/95 shadow-md rounded-full backdrop-blur-sm"
              aria-label="Kembali ke beranda"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>

          {/* Search or title */}
          {searchVisible ? (
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchLocation={searchLocation}
              isSearching={isSearching}
              setSearchVisible={setSearchVisible}
            />
          ) : (
            <h1 className="text-base sm:text-lg font-bold bg-background/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md">
              Peta Laporan
            </h1>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {!searchVisible && (
              <Button
                variant="outline"
                size="icon"
                className="bg-background/95 backdrop-blur-sm shadow-md rounded-full"
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
                  className="bg-background/95 backdrop-blur-sm shadow-md rounded-full"
                  aria-label="Filter laporan"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Laporan</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  {/* Status filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Status</h3>
                    <div className="space-y-2">
                      {["Menunggu", "Diproses", "Selesai", "Ditolak"].map(
                        (status) => (
                          <div
                            key={status}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox id={`status-${status}`} defaultChecked />
                            <Label htmlFor={`status-${status}`}>{status}</Label>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Category filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Kategori</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            defaultChecked
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="truncate"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time period filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Periode Waktu</h3>
                    <div className="space-y-2">
                      {[
                        "Hari Ini",
                        "Minggu Ini",
                        "Bulan Ini",
                        "Semua Waktu",
                      ].map((period) => (
                        <div
                          key={period}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`period-${period}`}
                            defaultChecked={period === "Semua Waktu"}
                          />
                          <Label htmlFor={`period-${period}`}>{period}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1 rounded-full">
                      Reset
                    </Button>
                    <Button className="flex-1 rounded-full">
                      Terapkan Filter
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              size="icon"
              className="bg-background/95 backdrop-blur-sm shadow-md rounded-full"
              onClick={getUserLocation}
              aria-label="Temukan lokasi saya"
            >
              <Locate className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* OpenStreetMap */}
      {mapReady && (
        <div className="h-full w-full z-[1]">
          <MapContainer
            center={userPosition}
            zoom={13}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
            attributionControl={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Report markers */}
            {reports.map((report) => {
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
      )}

      {/* Selected report card */}
      {selectedReportData && (
        <div className="absolute bottom-24 left-0 right-0 px-3 sm:px-4 max-w-2xl mx-auto z-30">
          <ReportCard report={selectedReportData} />
        </div>
      )}
    </div>
  );
}
