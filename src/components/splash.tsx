"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashProps {
  minDuration?: number; // Minimum time to show the splash screen
  onComplete?: () => void;
  showLogo?: boolean;
}

export function Splash({
  minDuration = 1000, // Minimum duration to show splash even if loading is faster
  onComplete,
  showLogo = true,
}: SplashProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Track document loading state
  useEffect(() => {
    // For initial resource loading progress
    const updateProgress = () => {
      // Calculate rough loading progress based on loaded resources
      const resources = performance.getEntriesByType("resource");
      const totalResources = Math.max(1, resources.length);
      const loadedResources = resources.filter((r) => r.duration > 0).length;
      const loadProgress = Math.min(
        90,
        Math.round((loadedResources / totalResources) * 100)
      );
      setProgress(loadProgress);
    };

    // Check if document is already complete
    if (document.readyState === "complete") {
      setIsLoaded(true);
      setProgress(100);
    } else {
      // Update progress periodically during loading
      const progressInterval = setInterval(updateProgress, 200);

      // Mark as loaded when document is fully loaded
      const handleLoad = () => {
        clearInterval(progressInterval);
        setIsLoaded(true);
        setProgress(100);
      };

      window.addEventListener("load", handleLoad);

      return () => {
        clearInterval(progressInterval);
        window.removeEventListener("load", handleLoad);
      };
    }
  }, []);

  // Handle splash visibility with minimum display time
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoaded) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, minDuration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoaded, minDuration, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          <div className="flex flex-col items-center justify-center">
            {showLogo && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-4"
              >
                <motion.img
                  src="/logo.png"
                  alt="Logo"
                  className="h-24 w-auto"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: isLoaded ? 0 : Infinity,
                    repeatType: "loop",
                  }}
                />
              </motion.div>
            )}

            <motion.h1
              className="text-3xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Citizen Connect
            </motion.h1>

            <motion.div
              className="mt-8 relative h-1 w-48 bg-muted rounded-full overflow-hidden"
              initial={{ opacity: 0, width: "0%" }}
              animate={{ opacity: 1, width: "12rem" }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {!isLoaded ? (
                // Loading in progress - show pulsing indicator
                <motion.div
                  className="absolute h-full bg-primary"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                />
              ) : (
                // Loading complete - show full progress
                <motion.div
                  className="absolute h-full bg-primary"
                  initial={{ width: `${progress}%` }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
