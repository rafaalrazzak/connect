"use client";

import LoadingSpinner from "@/components/admin/loading-spinner";
import PageHeader from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reports } from "@/lib/data";
import { Filter, Layers, MapPin, Search, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminMap() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter reports based on search query and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchQuery === "" ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      (report.category &&
        report.category.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "#f59e0b"; // amber
      case "processing":
        return "#3b82f6"; // blue
      case "completed":
        return "#10b981"; // green
      case "rejected":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading map..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Map View"
        description="Visualize reports geographically"
      >
        <Button variant="outline">
          <Layers className="mr-2 h-4 w-4" />
          Map Layers
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter reports on the map</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search locations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="waiting">Pending</SelectItem>
                  <SelectItem value="processing">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="road damage">Road Damage</SelectItem>
                  <SelectItem value="street lights">Street Lights</SelectItem>
                  <SelectItem value="waste issues">Waste Issues</SelectItem>
                  <SelectItem value="public order">Public Order</SelectItem>
                  <SelectItem value="public facilities">
                    Public Facilities
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" placeholder="From" />
                <Input type="date" placeholder="To" />
              </div>
            </div>

            <Button className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Map Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Rejected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="md:col-span-3">
          <CardContent className="p-0 relative">
            <div className="h-[calc(100vh-200px)] bg-muted rounded-md flex items-center justify-center relative">
              {/* This would be replaced with an actual map component */}
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Interactive map would be displayed here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing {filteredReports.length} reports
                </p>
              </div>

              {/* Map pins for reports */}
              {filteredReports.map((report, index) => {
                // In a real implementation, these would be positioned based on geocoordinates
                const left = `${Math.random() * 80 + 10}%`;
                const top = `${Math.random() * 80 + 10}%`;
                return (
                  <div
                    key={report.id}
                    className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left, top }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md transition-all group-hover:w-5 group-hover:h-5"
                      style={{ backgroundColor: getStatusColor(report.status) }}
                    ></div>
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg min-w-[200px] z-10 transition-opacity">
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.location}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            backgroundColor: `${getStatusColor(
                              report.status
                            )}20`,
                            color: getStatusColor(report.status),
                            borderColor: `${getStatusColor(report.status)}40`,
                          }}
                        >
                          {report.status === "waiting"
                            ? "Pending"
                            : report.status === "processing"
                            ? "In Progress"
                            : report.status.charAt(0).toUpperCase() +
                              report.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {report.date}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Map controls */}
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <Button variant="outline" size="icon" className="bg-background">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-background">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
