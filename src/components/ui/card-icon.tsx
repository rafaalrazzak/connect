"use client";

import { Icon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

// Unified props type with discriminated union for icon type
type CardIconProps = {
	label: string;
	description?: string;
	iconClassName?: string;
	labelClassName?: string;
	descriptionClassName?: string;
	iconContainerClassName?: string;
	active?: boolean;
	variant?: "default" | "outline" | "ghost";
	className?: string;
} & (
	| { iconName: string; icon?: never }
	| { icon: React.ReactNode; iconName?: never }
) &
	(
		| { asLink: true; href: string; onClick?: never }
		| { asLink?: false; href?: never; onClick?: () => void }
	) &
	Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">;

export function CardIcon({
	icon,
	iconName,
	label,
	description,
	onClick,
	className,
	iconClassName,
	labelClassName,
	descriptionClassName,
	iconContainerClassName,
	active = false,
	variant = "default",
	asLink = false,
	href,
	...props
}: CardIconProps) {
	// Card styling
	const cardStyles = cn(
		"transition-all duration-200",
		active && "ring-1 ring-primary/20 bg-primary/5",
		variant === "outline"
			? "border border-muted/80 hover:border-muted"
			: variant === "ghost"
				? "bg-transparent shadow-none hover:bg-muted/10"
				: // Default uses Card's built-in styling
					"",
		className,
	);

	// Determine which icon to render
	const iconElement = iconName ? (
		<Icon name={iconName} className={cn("w-6 h-6", iconClassName)} />
	) : (
		icon
	);

	// Content component with animations - simplified for better performance
	const CardIconContent = () => (
		<motion.div
			className="h-full w-full"
			whileHover={{ scale: 0.98 }}
			transition={{ type: "spring", damping: 17 }}
		>
			<CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
				<motion.div
					className={cn(
						"rounded-full flex items-center justify-center mb-3",
						"w-14 h-14 transition-colors",
						active
							? "bg-primary text-primary-foreground"
							: "bg-primary/10 text-primary",
						iconContainerClassName,
					)}
					whileHover={{ scale: 1.05 }}
					transition={{ type: "spring", damping: 10 }}
				>
					{iconElement}
				</motion.div>

				<span
					className={cn(
						"font-medium",
						active ? "text-primary" : "text-card-foreground",
						labelClassName,
					)}
				>
					{label}
				</span>

				{description && (
					<p
						className={cn(
							"text-sm text-muted-foreground mt-1.5",
							descriptionClassName,
						)}
					>
						{description}
					</p>
				)}
			</CardContent>
		</motion.div>
	);

	// Render as Link if asLink is true
	if (asLink && href) {
		return (
			<Link href={href} className="block h-full">
				<Card className={cardStyles} {...props}>
					<CardIconContent />
				</Card>
			</Link>
		);
	}

	// Otherwise render as a regular Card with onClick handler
	return (
		<Card
			className={cn(cardStyles, onClick && "cursor-pointer w-full h-full")}
			onClick={onClick}
			{...props}
		>
			<CardIconContent />
		</Card>
	);
}
