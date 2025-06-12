"use client";

import { Icon } from "@/components/icons";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { MotionCard } from "@/components/ui/motion-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import type { Report } from "@/types/report";
import {
  AnimatePresence,
  type PanInfo,
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileX,
  MapPin,
  ThumbsUp,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./ui/card";

// Report card variants
type ReportCardVariant = "default" | "compact" | "featured";

interface ReportCardProps {
  report: Report;
  variant?: ReportCardVariant;
  showUpvotes?: boolean;
  isNew?: boolean;
  className?: string;
  enableSwipe?: boolean;
  onSwipeLeft?: (report: Report) => void;
  onSwipeRight?: (report: Report) => void;
  leftSwipeAction?: string;
  rightSwipeAction?: string;
  // New prop to allow clicking even in swipe mode
  allowNavigation?: boolean;
}

/**
 * ReportCard displays citizen reports with modern swipe interactions
 */
export function ReportCard({
  report,
  variant = "default",
  showUpvotes = false,
  isNew = false,
  className,
  enableSwipe = false,
  onSwipeLeft,
  onSwipeRight,
  leftSwipeAction = "Dismiss",
  rightSwipeAction = "Approve",
  allowNavigation = true,
}: ReportCardProps) {
  // Existing state and refs
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [swipeComplete, setSwipeComplete] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const router = useRouter();

  // Add state to track if we're on a touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Check if we're on a touch device on mount
  useEffect(() => {
    const isTouchEnabled =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouchEnabled);
  }, []);

  // Enhanced motion values with spring physics for natural feel
  const x = useMotionValue(0);
  const springConfig = { stiffness: 400, damping: 40 };
  const springX = useSpring(x, springConfig);

  // Transform values for visual feedback
  const cardRotate = useTransform(springX, [-200, 0, 200], [-8, 0, 8]);
  const cardScale = useTransform(
    springX,
    [-200, -100, 0, 100, 200],
    [0.95, 0.98, 1, 0.98, 0.95]
  );

  // Action indicators with improved visual feedback
  const leftActionOpacity = useTransform(springX, [-200, -80, 0], [1, 0.6, 0]);
  const rightActionOpacity = useTransform(springX, [0, 80, 200], [0, 0.6, 1]);
  const leftActionScale = useTransform(springX, [-200, -100, 0], [1.2, 1, 0.6]);
  const rightActionScale = useTransform(springX, [0, 100, 200], [0.6, 1, 1.2]);

  // Progress indicators for swipe actions
  const leftProgress = useTransform(springX, [-150, 0], [100, 0]);
  const rightProgress = useTransform(springX, [0, 150], [0, 100]);

  // Style configuration based on variant
  const styles = useMemo(() => {
    const variantStyles = {
      compact: {
        container: "sm:h-24",
        image: "h-32 sm:h-full",
        imageWidth: "sm:w-1/4",
        contentWidth: "sm:w-3/4",
        title: "text-sm font-medium",
        description: "text-xs line-clamp-1",
        badge: "sm" as const,
        padding: "p-3",
        metadataGap: "gap-2",
      },
      featured: {
        container: "sm:h-40",
        image: "h-56 sm:h-full",
        imageWidth: "sm:w-2/5",
        contentWidth: "sm:w-3/5",
        title: "text-xl font-semibold",
        description: "text-sm line-clamp-3",
        badge: "md" as const,
        padding: "p-5",
        metadataGap: "gap-4",
      },
      default: {
        container: "sm:h-40",
        image: "h-48 sm:h-full",
        imageWidth: "sm:w-1/3",
        contentWidth: "sm:w-2/3",
        title: "text-base font-medium",
        description: "text-sm line-clamp-2",
        badge: "sm" as const,
        padding: "p-4",
        metadataGap: "gap-3",
      },
    };

    return variantStyles[variant];
  }, [variant]);

  // Memoized data
  const relativeTime = useMemo(
    () => formatRelativeTime(report.date),
    [report.date]
  );
  const formattedDate = useMemo(() => formatDate(report.date), [report.date]);
  const category = useMemo(() => {
    if (!report.category) return null;
    return typeof report.category === "object" ? report.category : null;
  }, [report.category]);

  // Reset animation when swipe is complete
  useEffect(() => {
    if (swipeComplete) {
      setSwipeComplete(false);
      x.set(0);
    }
  }, [swipeComplete, x]);

  // Handle tooltip click to prevent navigation
  const handleTooltipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // Navigate to report detail - improved to work better on desktop
  const handleNavigate = (e: React.MouseEvent) => {
    // On desktop (non-touch devices), only allow navigation when not actively swiping
    if (!isTouchDevice && isSwiping) {
      e.preventDefault();
      return;
    }

    // For touch devices, use the existing logic
    if (!enableSwipe || (enableSwipe && allowNavigation && !isSwiping)) {
      // Standard link behavior - let the Link component handle it
      return;
    }
    // Prevent navigation when swiping is enabled and we're actively swiping
    e.preventDefault();
  };

  // Detect when a drag/swipe starts
  const handleDragStart = () => {
    setIsSwiping(true);
  };

  // Enhanced drag handler with improved physics
  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsSwiping(false);

    const threshold = 120;
    const velocity = Math.abs(info.velocity.x);
    const isFlick = velocity > 800;

    if (
      (info.offset.x < -threshold || (isFlick && info.velocity.x < 0)) &&
      onSwipeLeft
    ) {
      await controls.start({
        x: -window.innerWidth,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeOut" },
      });
      setSwipeComplete(true);
      onSwipeLeft(report);
    } else if (
      (info.offset.x > threshold || (isFlick && info.velocity.x > 0)) &&
      onSwipeRight
    ) {
      await controls.start({
        x: window.innerWidth,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeOut" },
      });
      setSwipeComplete(true);
      onSwipeRight(report);
    } else {
      controls.start({ x: 0, transition: { type: "spring", ...springConfig } });
    }
  };

  // Vibration feedback for swipe actions (if supported)
  const triggerHapticFeedback = () => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        // Vibration not supported or disabled
      }
    }
  };

  // Handle drag movements with haptic feedback at threshold points
  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const currentX = x.get();

    // Trigger haptic feedback when crossing threshold
    if (
      (currentX <= -threshold && info.delta.x < 0) ||
      (currentX >= threshold && info.delta.x > 0)
    ) {
      triggerHapticFeedback();
    }
  };

  // Card content component
  const cardContent = (
    <div className={cn("flex flex-col sm:flex-row", styles.container)}>
      {/* Image container */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted/20 z-1",
          styles.image,
          styles.imageWidth
        )}
      >
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/10 z-[1]"
          aria-hidden="true"
        />

        <Image
          src={report.imageUrls?.[0] || "/placeholder.svg"}
          alt=""
          fill
          className={cn(
            "object-cover transition-all duration-300",
            imageLoaded ? "opacity-100" : "opacity-0 scale-105",
            "group-hover:scale-[1.03]"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setImageLoaded(true)}
          priority={variant === "featured"}
        />

        <div className="absolute bottom-3 left-3 z-10">
          <StatusBadge status={report.status} size={styles.badge} />
        </div>

        {isNew && (
          <div className="absolute top-3 right-3 z-10">
            <Badge
              iconName="sparkles"
              variant="subtle-primary"
              className="font-medium"
            >
              Baru
            </Badge>
          </div>
        )}
      </div>

      {/* Content section */}
      <div
        className={cn(
          "flex flex-col justify-between flex-grow",
          styles.padding,
          styles.contentWidth
        )}
      >
        <div className="space-y-2 items-start flex flex-col jusifty-between w-full">
          {category && (
            <Badge variant="outline" className="text-xs">
              <div className="flex items-center gap-1.5">
                {category.iconName && (
                  <Icon name={category.iconName} className="h-3 w-3" />
                )}
                <span>{category.name}</span>
              </div>
            </Badge>
          )}

          <div className="flex items-start justify-between gap-2 w-full">
            <h3
              className={cn(
                "line-clamp-1 group-hover:text-primary transition-colors",
                styles.title
              )}
            >
              {report.title}
            </h3>

            <ArrowUpRight
              className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </div>

          <p
            className={cn(
              "text-muted-foreground text-start",
              styles.description
            )}
          >
            {report.description}
          </p>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-between mt-3",
            styles.metadataGap
          )}
        >
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild onClick={handleTooltipClick}>
                  <span className="inline-flex cursor-default">
                    <MetadataItem
                      icon={
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      }
                    >
                      <span className="truncate max-w-[120px]">
                        {report.location}
                      </span>
                    </MetadataItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={5}
                  className="max-w-[200px]"
                >
                  <p className="text-xs">{report.location}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild onClick={handleTooltipClick}>
                  <span className="inline-flex cursor-default">
                    <MetadataItem
                      icon={
                        <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      }
                    >
                      {relativeTime}
                    </MetadataItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>
                  <p className="text-xs">{formattedDate}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showUpvotes && (
            <div
              className={cn(
                "flex items-center px-2 py-1 rounded-full bg-primary/5 text-xs font-medium",
                "group-hover:bg-primary/10 transition-colors"
              )}
            >
              <ThumbsUp className="h-3 w-3 mr-1.5 flex-shrink-0 text-primary" />
              <span>{report.upvotes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Modern swipe-enabled implementation
  if (enableSwipe && (onSwipeLeft || onSwipeRight)) {
    const cardElement = (
      <div className="relative overflow-hidden" ref={cardRef}>
        <AnimatePresence>
          {!swipeComplete && (
            <>
              {/* Action indicators - positioned outside the card to prevent collision */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Left action indicator - improved positioning and visibility */}
                {onSwipeLeft && (
                  <motion.div
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
                    style={{
                      opacity: leftActionOpacity,
                      scale: leftActionScale,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-destructive/90 text-destructive-foreground p-3 rounded-full shadow-lg mb-2">
                      <X className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-medium text-destructive drop-shadow-sm">
                      {leftSwipeAction}
                    </p>
                    <motion.div
                      className="absolute -z-10 rounded-full h-20 w-20 bg-destructive/15"
                      style={{
                        scale: useTransform(leftProgress, [0, 100], [0, 1.5]),
                      }}
                    />
                  </motion.div>
                )}

                {/* Right action indicator - improved positioning and visibility */}
                {onSwipeRight && (
                  <motion.div
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
                    style={{
                      opacity: rightActionOpacity,
                      scale: rightActionScale,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg mb-2">
                      <Check className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-medium text-secondary drop-shadow-sm">
                      {rightSwipeAction}
                    </p>
                    <motion.div
                      className="absolute -z-10 rounded-full h-20 w-20 bg-secondary/15"
                      style={{
                        scale: useTransform(rightProgress, [0, 100], [0, 1.5]),
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Swipeable card with  */}
              <motion.button
                drag="x"
                dragSnapToOrigin
                dragElastic={0.7}
                dragConstraints={cardRef}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{
                  x: springX,
                  rotate: cardRotate,
                  scale: cardScale,
                }}
                animate={controls}
                whileTap={{ cursor: "grabbing" }}
                className="touch-none"
                aria-label={`Report: ${report.title}. Swipe left to ${leftSwipeAction}, swipe right to ${rightSwipeAction}`}
              >
                <MotionCard
                  className={cn("h-full overflow-hidden", className)}
                  hoverEffect="subtle"
                  transitionPreset="gentle"
                >
                  {cardContent}
                </MotionCard>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    );

    // On desktop with navigation allowed, we need to prevent the Link from capturing all interactions
    if (allowNavigation) {
      if (!isTouchDevice) {
        // For desktop: combine the functionality by using onClick directly
        return (
          <button
            type="button"
            onClick={(_e) => {
              // Only navigate if we're not actively swiping
              if (!isSwiping) {
                router.push(`/report/${report.id}`);
              }
            }}
            onKeyDown={(e) => {
              // Navigate on Enter or Space key
              if ((e.key === "Enter" || e.key === " ") && !isSwiping) {
                e.preventDefault();
                router.push(`/report/${report.id}`);
              }
            }}
            tabIndex={0}
            aria-label={`Report: ${report.title}`}
            className="block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          >
            {cardElement}
          </button>
        );
      }
      // For touch devices: use Link as before
      return (
        <Link
          href={`/report/${report.id}`}
          onClick={handleNavigate}
          className="block focus-visible:outline-none"
        >
          {cardElement}
        </Link>
      );
    }

    // Otherwise return just the card element
    return cardElement;
  }

  // Standard link version
  return (
    <Link
      href={`/report/${report.id}`}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      aria-label={`Report: ${report.title}`}
    >
      <MotionCard
        className={cn("h-full", className)}
        hoverEffect="subtle"
        transitionPreset="gentle"
      >
        {cardContent}
      </MotionCard>
    </Link>
  );
}

// Helper component
function MetadataItem({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center text-xs text-muted-foreground",
        className
      )}
    >
      {icon}
      {children}
    </div>
  );
}

/**
 * Skeleton loader with improved visual appearance
 */
export function ReportCardSkeleton({
  variant = "default",
}: {
  variant?: ReportCardVariant;
}) {
  // Apply different skeleton styles based on variant
  const styles = useMemo(() => {
    switch (variant) {
      case "compact":
        return {
          container: "sm:h-24",
          imageWidth: "sm:w-1/4",
          contentWidth: "sm:w-3/4",
          padding: "p-3",
        };
      case "featured":
        return {
          container: "sm:h-40",
          imageWidth: "sm:w-2/5",
          contentWidth: "sm:w-3/5",
          padding: "p-5",
        };
      default:
        return {
          container: "sm:h-32",
          imageWidth: "sm:w-1/3",
          contentWidth: "sm:w-2/3",
          padding: "p-4",
        };
    }
  }, [variant]);

  return (
    <Card className="overflow-hidden">
      <div className={cn("flex flex-col sm:flex-row", styles.container)}>
        {/* Image skeleton with pulse animation */}
        <div
          className={cn(
            "w-full h-48 sm:h-full relative overflow-hidden",
            styles.imageWidth
          )}
        >
          <Skeleton className="h-full w-full absolute animate-pulse" />
        </div>

        {/* Content skeleton with more realistic structure */}
        <div
          className={cn(
            "w-full flex flex-col justify-between",
            styles.contentWidth,
            styles.padding
          )}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Arrow icon */}
            </div>
            <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
            {variant !== "compact" && <Skeleton className="h-4 w-5/6" />}{" "}
            {/* Description line 2 */}
          </div>

          <div className="mt-auto pt-3">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Skeleton className="h-4 w-24" /> {/* Location */}
                <Skeleton className="h-4 w-20" /> {/* Date */}
              </div>
              <Skeleton className="h-5 w-10 rounded-full" />{" "}
              {/* Status badge */}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface NoReportsProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Enhanced empty state component with optional action button
 */
export function NoReports({
  message = "Tidak ada laporan yang ditemukan",
  description = "Coba buat laporan baru atau periksa kembali nanti.",
  icon = <FileX className="h-8 w-8 text-muted-foreground/70" />,
  action,
}: NoReportsProps) {
  return (
    <motion.div
      className="text-center py-12 px-6 border rounded-xl bg-muted/5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
        <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-medium text-lg">{message}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>

        {action && <div className="mt-2">{action}</div>}
      </div>
    </motion.div>
  );
}
