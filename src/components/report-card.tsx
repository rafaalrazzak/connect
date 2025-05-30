"use client";

import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import type { Report, ReportStatus } from "@/types/report";

interface ReportCardProps {
  report: Report;
  className?: string;
}

/**
 * ReportStatusBadge component to show the current status of a report
 */
export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const statusConfig = {
    pending: {
      label: "Menunggu",
      className: "bg-amber-500 text-white",
    },
    in_progress: {
      label: "Diproses",
      className: "bg-blue-500 text-white",
    },
    completed: {
      label: "Selesai",
      className: "bg-green-500 text-white",
    },
    rejected: {
      label: "Ditolak",
      className: "bg-red-500 text-white",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        "text-xs font-medium px-2 py-0.5 rounded-full",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

/**
 * ReportCard component showing report preview with image and details
 */
export function ReportCard({ report, className }: ReportCardProps) {
  return (
    <Link href={`/report/${report.id}`} className="block">
      <Card
        className={cn(
          "overflow-hidden hover:shadow-md transition-all duration-300 border-muted/80",
          className
        )}
      >
        <CardContent className="p-0">
          <div className="flex h-28">
            {/* Report Image */}
            <div className="w-1/3 relative">
              <img
                src={report.imageUrls?.[0] || "/placeholder.svg"}
                alt={report.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Status Badge */}
              <div className="absolute bottom-2 left-2">
                <ReportStatusBadge status={report.status} />
              </div>
            </div>

            {/* Report Details */}
            <div className="w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-medium line-clamp-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {report.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[100px]">
                    {report.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDate(report.date)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Skeleton loader for report card using the UI Skeleton component
 */
export function ReportCardSkeleton() {
  return (
    <Card className="overflow-hidden border-muted/80">
      <CardContent className="p-0">
        <div className="flex h-28">
          {/* Image skeleton */}
          <div className="w-1/3">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content skeleton */}
          <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Empty state for when there are no reports
 */
export function NoReports({
  message = "Tidak ada laporan yang ditemukan",
  description = "Coba buat laporan baru atau periksa kembali nanti.",
}) {
  return (
    <div className="text-center py-8 border rounded-lg bg-muted/20">
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium">{message}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
