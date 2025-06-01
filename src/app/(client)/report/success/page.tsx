"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useReportDrawer } from "@/contexts/report-drawer-context";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, FileText, Home, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export function ReportSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const reportType = searchParams.get("type") || "Laporan";
  const { openDrawer } = useReportDrawer();

  // Redirect if no report ID is present
  useEffect(() => {
    if (!reportId) {
      router.replace("/");
    }
  }, [reportId, router]);

  if (!reportId) return null;

  return (
    <div className="container max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-green-200 bg-gradient-to-b from-background to-green-50/50 dark:from-background dark:to-green-950/10 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.2,
              }}
            >
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
            </motion.div>

            <motion.h1
              className="text-2xl font-bold mt-6 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Laporan Berhasil Dikirim!
            </motion.h1>

            <motion.p
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {reportType} Anda telah diterima dan sedang diproses.
              <br />
              <span className="font-medium text-foreground">
                ID: {reportId}
              </span>
            </motion.p>

            <motion.div
              className="bg-muted/50 rounded-lg p-4 w-full mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-muted-foreground">
                Terima kasih atas partisipasi Anda dalam meningkatkan layanan
                publik. Tim kami akan segera menindaklanjuti laporan ini.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                className="w-full gap-2"
                onClick={() => openDrawer()}
                size="lg"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Laporan Baru</span>
              </Button>

              <div className="flex gap-3 w-full">
                <Button asChild variant="outline" className="flex-1 gap-2">
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Beranda</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="flex-1 gap-2">
                  <Link href={`/report/${reportId}`}>
                    <FileText className="h-4 w-4" />
                    <span>Detail</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            asChild
            variant="link"
            className="mt-6 mx-auto flex items-center text-muted-foreground"
          >
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ReportSuccessPage() {
  return (
    <Suspense>
      <ReportSuccessContent />
    </Suspense>
  );
}
