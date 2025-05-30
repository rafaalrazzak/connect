"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // Log the error to the console in development
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 flex flex-col items-center justify-center px-4 bg-background">
        {/* Animation container */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error Display */}
          <div className="relative">
            <motion.div
              className="text-8xl sm:text-9xl font-bold text-destructive/10"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              Error
            </motion.div>
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AlertCircle
                className="h-12 w-12 text-destructive/80 mb-2"
                strokeWidth={1.5}
              />
              <h1 className="text-2xl font-semibold">Terjadi Kesalahan</h1>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            className="mt-16 text-muted-foreground max-w-md mx-auto space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Maaf, terjadi kesalahan saat memuat halaman ini. Tim kami sudah
              diberitahu tentang masalah ini dan sedang bekerja untuk
              memperbaikinya.
            </p>

            <p className="text-sm text-muted-foreground/70">
              {error.digest && <span>Error ID: {error.digest}</span>}
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="default"
              size="lg"
              className="gap-2"
              onClick={() => reset()}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Coba Lagi</span>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
