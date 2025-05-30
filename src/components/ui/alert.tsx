import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"text-destructive dark:border-destructive [&>svg]:text-destructive",
				success: "text-green-800 dark:text-green-400 [&>svg]:text-green-500",
				info: "text-blue-800 dark:text-blue-400 [&>svg]:text-blue-500",
				warning: "text-yellow-800 dark:text-yellow-400 [&>svg]:text-yellow-500",
				secondary: "text-secondary-foreground [&>svg]:text-secondary",
			},
			style: {
				solid: "border-transparent", // Just for consistent spacing
				subtle: "", // Will be filled with compound variants
				outlined: "", // Will be filled with compound variants
				ghost: "border-transparent bg-transparent", // No background, no border
			},
			border: {
				default: "border",
				thick: "border-2",
				none: "border-0",
			},
			shadow: {
				default: "shadow-none",
				sm: "shadow-sm",
				md: "shadow",
				lg: "shadow-md",
			},
		},
		compoundVariants: [
			// Default variant styles
			{ variant: "default", style: "solid", class: "bg-background" },
			{ variant: "default", style: "subtle", class: "bg-muted/40" },
			{ variant: "default", style: "outlined", class: "border-border" },

			// Destructive variant
			{
				variant: "destructive",
				style: "solid",
				class:
					"bg-destructive text-destructive-foreground [&>svg]:text-destructive-foreground",
			},
			{
				variant: "destructive",
				style: "subtle",
				class: "bg-destructive/10 border-destructive/30",
			},
			{
				variant: "destructive",
				style: "outlined",
				class: "border-destructive/50",
			},

			// Success variant
			{
				variant: "success",
				style: "solid",
				class: "bg-green-600 text-white [&>svg]:text-white",
			},
			{
				variant: "success",
				style: "subtle",
				class:
					"bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-900",
			},
			{ variant: "success", style: "outlined", class: "border-green-500/50" },

			// Info variant
			{
				variant: "info",
				style: "solid",
				class: "bg-blue-600 text-white [&>svg]:text-white",
			},
			{
				variant: "info",
				style: "subtle",
				class:
					"bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-900",
			},
			{ variant: "info", style: "outlined", class: "border-blue-500/50" },

			// Warning variant
			{
				variant: "warning",
				style: "solid",
				class: "bg-yellow-600 text-white [&>svg]:text-white",
			},
			{
				variant: "warning",
				style: "subtle",
				class:
					"bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-900",
			},
			{ variant: "warning", style: "outlined", class: "border-yellow-500/50" },

			// Secondary variant
			{
				variant: "secondary",
				style: "solid",
				class: "bg-secondary text-secondary-foreground",
			},
			{
				variant: "secondary",
				style: "subtle",
				class: "bg-secondary/20 border-secondary/30",
			},
			{ variant: "secondary", style: "outlined", class: "border-secondary/50" },

			// Thick border styles
			{
				variant: "destructive",
				style: "outlined",
				border: "thick",
				class: "border-destructive/80",
			},
			{
				variant: "success",
				style: "outlined",
				border: "thick",
				class: "border-green-500/80",
			},
			{
				variant: "info",
				style: "outlined",
				border: "thick",
				class: "border-blue-500/80",
			},
			{
				variant: "warning",
				style: "outlined",
				border: "thick",
				class: "border-yellow-500/80",
			},
			{
				variant: "secondary",
				style: "outlined",
				border: "thick",
				class: "border-secondary/80",
			},
		],
		defaultVariants: {
			variant: "default",
			style: "subtle",
			border: "default",
			shadow: "default",
		},
	},
);

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, style, border, shadow, ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(alertVariants({ variant, style, border, shadow }), className)}
		{...props}
	/>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("text-sm [&_p]:leading-relaxed", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
