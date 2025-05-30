"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ArrowRight, Share2, Download } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Content component that uses search params
function SuccessContent() {
  const searchParams = useSearchParams();

  // Generate a random report ID
  const [reportData, setReportData] = useState<{
    id: string;
    date: Date;
    category?: string;
  }>({
    id: "",
    date: new Date(),
  });

  // Initialize report data on mount
  useEffect(() => {
    // Get report ID from query params if available
    const idFromParams = searchParams.get("id");
    const categoryFromParams = searchParams.get("category");

    setReportData({
      // Use ID from params or generate a random one
      id:
        idFromParams ||
        `CC${Math.floor(Math.random() * 10000000)
          .toString()
          .padStart(7, "0")}`,
      date: new Date(),
      category: categoryFromParams || "Infrastruktur", // Use category from params or default
    });
  }, [searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container max-w-2xl flex flex-col items-center justify-center px-4 py-12 text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center shadow-md"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </motion.div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold text-foreground">
          Laporan Berhasil Dikirim!
        </h1>
        <p className="text-muted-foreground">
          Terima kasih atas kontribusimu! Laporan kamu sudah diteruskan ke pihak
          yang berwenang.
        </p>
      </div>

      <Card className="w-full max-w-md border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/30 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-foreground">Detail Laporan</h2>
            <Badge
              variant="outline"
              className="bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Terkirim
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center border-b border-green-100 dark:border-green-900/50 pb-2">
              <span className="text-muted-foreground">ID Laporan</span>
              <span className="font-medium text-foreground">
                {reportData.id}
              </span>
            </div>
            {reportData.category && (
              <div className="flex justify-between items-center border-b border-green-100 dark:border-green-900/50 pb-2">
                <span className="text-muted-foreground">Kategori</span>
                <span className="text-foreground">{reportData.category}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-b border-green-100 dark:border-green-900/50 pb-2">
              <span className="text-muted-foreground">Dikirim pada</span>
              <span className="text-foreground">
                {reportData.date.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-green-100 dark:border-green-900/50 pb-2">
              <span className="text-muted-foreground">Estimasi respons</span>
              <span className="text-foreground">24-48 jam</span>
            </div>
          </div>

          <div className="text-sm bg-white dark:bg-zinc-900 p-4 rounded-lg border border-green-200 dark:border-green-900 shadow-sm">
            <p className="text-green-800 dark:text-green-400">
              Kamu akan mendapat notifikasi seiring perkembangan laporan ini.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Link href={`/report/${reportData.id}`} className="flex-1">
          <Button className="w-full rounded-full" size="lg">
            Lihat Detail
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full rounded-full" size="lg">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            // In a real app, implement share functionality
            if (navigator.share) {
              navigator
                .share({
                  title: `Laporan ${reportData.id}`,
                  text: `Laporan berhasil dikirim dengan ID: ${reportData.id}`,
                  url: window.location.href,
                })
                .catch((err) => console.error("Error sharing:", err));
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link berhasil disalin!");
            }
          }}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Bagikan
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            // In a real app, implement download functionality
            window.print();
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Simpan
        </Button>
      </div>
    </motion.div>
  );
}

function SuccessLoadingFallback() {
  return (
    <div className="container max-w-2xl flex flex-col items-center justify-center px-4 py-12 text-center space-y-8">
      {/* Icon placeholder */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/40 to-muted/60 flex items-center justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>``

      {/* Title and description */}
      <div className="space-y-3 w-full max-w-md">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </div>

      {/* Card with report details */}
      <Card className="w-full max-w-md border-muted bg-card/50 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-left">
            {/* Report ID */}
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Category */}
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Date */}
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Response time */}
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Notice box */}
          <div className="p-4 rounded-lg border border-muted/20">
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Skeleton className="h-12 w-full rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>

      {/* Share and download buttons */}
      <div className="flex justify-center gap-4 pt-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ReportSuccess() {
  return (
    <Suspense fallback={<SuccessLoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
