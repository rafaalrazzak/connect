"use client";

import { motion } from "framer-motion";
import { ReportCard, ReportCardSkeleton } from "@/components/report-card";
import type { Report } from "@/types/report";

interface ReportsListProps {
  reports: Report[];
  page: number;
}

export function ReportsList({ reports, page }: ReportsListProps) {
  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      animate="visible"
      key={`page-${page}`}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {reports.map((report) => (
        <motion.div
          key={report.id}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
        >
          <ReportCard report={report} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Add skeleton loading state directly to the component
ReportsList.Skeleton = function ReportsListSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <ReportCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};