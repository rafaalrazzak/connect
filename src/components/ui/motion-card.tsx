"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
	type AnimationControls,
	type TargetAndTransition,
	type VariantLabels,
	motion,
} from "framer-motion";
import * as React from "react";

/**
 * Animation presets with proper typing
 */
export const MOTION_PRESETS = {
	hover: {
		subtle: { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
		lift: { y: -5, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
		scale: { scale: 1.01 },
	} as const,
	transition: {
		default: { type: "spring", stiffness: 500, damping: 30 },
		gentle: { type: "spring", stiffness: 300, damping: 25 },
		bounce: { type: "spring", stiffness: 500, damping: 10 },
	} as const,
};

// Type definitions
export type HoverEffectType = keyof typeof MOTION_PRESETS.hover | false;
export type TransitionPresetType = keyof typeof MOTION_PRESETS.transition;

/**
 * Props for MotionCard component
 */
export interface MotionCardProps
	extends React.ComponentPropsWithoutRef<typeof Card> {
	/** Animation effect on hover */
	hoverEffect?: HoverEffectType;
	/** Animation transition preset */
	transitionPreset?: TransitionPresetType;
	/** Additional hover properties to merge with preset */
	whileHoverProps?: TargetAndTransition;
	/** Additional motion props */
	initial?: boolean | VariantLabels | TargetAndTransition;
	animate?: boolean | VariantLabels | TargetAndTransition | AnimationControls;
	exit?: VariantLabels | TargetAndTransition;
}

/**
 * Card component with motion animations
 */
export const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
	(
		{
			className,
			hoverEffect = "subtle",
			transitionPreset = "default",
			whileHoverProps,
			initial,
			animate,
			exit,
			...props
		},
		ref,
	) => {
		// Memoize hover animation to prevent recalculations
		const hoverAnimation = React.useMemo(() => {
			if (!hoverEffect) return whileHoverProps;

			return {
				...MOTION_PRESETS.hover[hoverEffect],
				...whileHoverProps,
			};
		}, [hoverEffect, whileHoverProps]);

		// Memoize transition to prevent recalculations
		const transition = React.useMemo(
			() => MOTION_PRESETS.transition[transitionPreset],
			[transitionPreset],
		);

		return (
			<motion.div
				ref={ref}
				className={cn("group", className)}
				whileHover={hoverAnimation}
				transition={transition}
				initial={initial}
				animate={animate}
				exit={exit}
			>
				<Card
					className={cn(
						"overflow-hidden transition-all duration-200",
						hoverEffect && "group-hover:border-muted",
					)}
					{...props}
				>
					{props.children}
				</Card>
			</motion.div>
		);
	},
);

MotionCard.displayName = "MotionCard";
