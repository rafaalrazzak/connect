"use client";

import { reports } from "@/lib/mock-data";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ReportGallery } from "@/components/report/report-gallery";
// Components
import { ReportHeader } from "@/components/report/report-header";
import { ReportInfo } from "@/components/report/report-info";
import { ReportTabContent } from "@/components/report/report-tab-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ChevronLeft } from "lucide-react";

// Types
interface ReportDetailProps {
  id: string;
}

export default function ReportDetail({ id }: ReportDetailProps) {
  const report = reports.find((r) => r.id === id);
  const [activeTab, setActiveTab] = useState("details");

  // Handle case when report is not found
  if (!report) {
    return (
      <div className="container max-w-md h-[70vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Laporan Tidak Ditemukan</h2>
        <p className="text-muted-foreground text-center mb-6">
          Maaf, laporan yang Anda cari tidak dapat ditemukan.
        </p>
        <Link href="/reports">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Laporan
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate progress percentage based on status
  const progressPercentage = useMemo(() => {
    switch (report.status) {
      case "completed":
        return 100;
      case "in_progress":
        return 66;
      case "pending":
        return 33;
      case "rejected":
        return 0;
      default:
        return 0;
    }
  }, [report.status]);

  // Get status text
  const statusText = useMemo(() => {
    switch (report.status) {
      case "completed":
        return "Selesai";
      case "in_progress":
        return "Dalam Proses";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      default:
        return "Unknown";
    }
  }, [report.status]);

  return (
    <div className="container max-w-3xl mx-auto px-4">
      {/* Sticky header */}
      <ReportHeader report={report} />

      <div className="space-y-5">
        {/* Image Gallery */}
        <ReportGallery report={report} />

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status: </span>
            <span className="font-medium">{statusText}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Quick Info */}
        <ReportInfo report={report} />

        {/* Main content tabs */}
        <Card className="border">
          <ReportTabContent
            report={report}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Card>
      </div>
    </div>
  );	
}
