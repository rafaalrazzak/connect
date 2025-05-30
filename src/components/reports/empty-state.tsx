"use client";

import { motion } from "framer-motion";
import { Search, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  // Icon can be any Lucide icon component
  icon?: LucideIcon;
  // Message/title to display
  message?: string;
  // Description text
  description?: string;
  // Optional action button
  actionLabel?: string;
  // Optional action handler
  onAction?: () => void;
  // For reports filtering specific case
  onResetFilters?: () => void;
  // Add customization props
  iconClassName?: string;
  className?: string;
  iconContainerClassName?: string;
}

export function EmptyState({
  icon: Icon = Search,
  message = "Tidak ada data ditemukan",
  description = "Tidak ada data untuk ditampilkan saat ini.",
  actionLabel = "Reset semua filter",
  onAction,
  onResetFilters,
  iconClassName = "h-10 w-10 text-muted-foreground/50",
  className = "",
  iconContainerClassName = "p-4 rounded-full bg-muted/30 border border-muted",
}: EmptyStateProps) {
  // Determine which action handler to use
  const handleAction = onAction || onResetFilters;

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center py-16 space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={iconContainerClassName}>
        <Icon className={iconClassName} />
      </div>
      <h3 className="text-xl font-semibold">{message}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
      {handleAction && (
        <Button
          variant="outline"
          onClick={handleAction}
          className="mt-2"
          size="lg"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
