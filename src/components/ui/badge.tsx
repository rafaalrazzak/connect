import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

/**
 * Available badge size types
 */
export type BadgeSize = "sm" | "default" | "md" | "lg";

/**
 * Available report status types
 */
export type ReportStatus = "pending" | "in_progress" | "completed" | "rejected";

/**
 * Badge variant style definitions
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-1.5",
  {
    variants: {
      variant: {
        // Base variants
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",

        // Color variants
        warning:
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",

        // Subtle variants
        "subtle-default":
          "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/60",
        "subtle-primary":
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        "subtle-secondary":
          "border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20",
        "subtle-destructive":
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        "subtle-warning":
          "border-transparent bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
        "subtle-success":
          "border-transparent bg-green-500/10 text-green-600 hover:bg-green-500/20",
        "subtle-info":
          "border-transparent bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
      },
      size: {
        sm: "h-5 px-2 py-0 text-[0.625rem]",
        default: "h-6 px-2.5 py-0.5",
        md: "h-7 px-3 py-1",
        lg: "h-8 px-3.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Badge component props interface
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof badgeVariants>, "size"> {
  /** Badge size variant */
  size?: BadgeSize;
  /** Optional icon name to display */
  iconName?: string;
  /** Position of the icon relative to content */
  iconPosition?: "left" | "right";
  /** Additional class name for the icon */
  iconClassName?: string;
}

/**
 * Badge component for displaying short status or category information
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size = "default",
      iconName,
      iconPosition = "left",
      iconClassName,
      children,
      ...props
    },
    ref
  ) => {
    // Map sizes to icon sizes - no need to recompute this on every render
    const iconSize =
      size === "sm" ? 12 : size === "lg" ? 18 : size === "md" ? 16 : 14;

    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          iconPosition === "right" && "flex-row-reverse",
          className
        )}
        {...props}
      >
        {iconName && (
          <Icon
            name={iconName}
            className={cn("flex-shrink-0", iconClassName)}
            size={iconSize}
          />
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

/**
 * Status badge configuration mapping
 */
const STATUS_CONFIG: Record<
  ReportStatus,
  {
    label: string;
    variant: VariantProps<typeof badgeVariants>["variant"];
    iconName: IconName;
  }
> = {
  pending: {
    label: "Menunggu",
    variant: "warning",
    iconName: "clock",
  },
  in_progress: {
    label: "Diproses",
    variant: "info",
    iconName: "loader",
  },
  completed: {
    label: "Selesai",
    variant: "success",
    iconName: "checkCircle",
  },
  rejected: {
    label: "Ditolak",
    variant: "destructive",
    iconName: "xCircle",
  },
};

/**
 * Status badge props interface
 */
export interface StatusBadgeProps {
  /** Report status */
  status: ReportStatus;
  /** Badge size variant */
  size?: BadgeSize;
  /** Additional class name */
  className?: string;
  children?: React.ReactNode;
}

/**
 * Pre-configured badge for displaying report statuses
 */
export const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, size = "default", className, children }, ref) => {
    const config = STATUS_CONFIG[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        size={size}
        iconName={config.iconName}
        className={className}
      >
        <div className={cn("flex items-center gap-1")}>
          {config.label}
          <div>{children}</div>
        </div>
      </Badge>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { badgeVariants };
