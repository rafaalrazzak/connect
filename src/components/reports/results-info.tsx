"use client";

import { motion } from "framer-motion";

interface ResultsInfoProps {
  filteredCount: number;
  currentPage: number;
  reportsPerPage: number;
  totalPages: number;
}

export function ResultsInfo({
  filteredCount,
  currentPage,
  reportsPerPage,
  totalPages,
}: ResultsInfoProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <motion.p
        key={filteredCount}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground"
      >
        {filteredCount > 0 ? (
          <>
            <span className="font-medium">{filteredCount}</span> laporan
            ditemukan
            {totalPages > 1 && (
              <span className="hidden sm:inline">
                , menampilkan{" "}
                <span className="font-medium">
                  {(currentPage - 1) * reportsPerPage + 1}-
                  {Math.min(currentPage * reportsPerPage, filteredCount)}
                </span>
              </span>
            )}
          </>
        ) : (
          "Tidak ada laporan yang ditemukan"
        )}
      </motion.p>
    </div>
  );
}
