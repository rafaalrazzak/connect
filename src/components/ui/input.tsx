import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	iconClassName?: string;
	startIconClassName?: string;
	endIconClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			startIcon,
			endIcon,
			iconClassName,
			startIconClassName,
			endIconClassName,
			...props
		},
		ref,
	) => {
		// Generate classes for the wrapper div based on whether we have icons
		const wrapperClassName = cn(
			"relative flex items-center w-full",
			startIcon && "has-start-icon",
			endIcon && "has-end-icon",
		);

		// Generate input classes, adjusting padding when icons are present
		const inputClassName = cn(
			"flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-base ring-offset-background",
			"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
			"placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ",
			"disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			startIcon && "pl-10", // Add padding when start icon exists
			endIcon && "pr-10", // Add padding when end icon exists
			className,
		);

		// Classes for the icons
		const iconBaseClass = cn(
			"absolute top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none",
			iconClassName,
		);

		const startIconClass = cn(iconBaseClass, "left-3", startIconClassName);

		const endIconClass = cn(iconBaseClass, "right-3", endIconClassName);

		return (
			<div className={wrapperClassName}>
				{startIcon && <div className={startIconClass}>{startIcon}</div>}

				<input type={type} className={inputClassName} ref={ref} {...props} />

				{endIcon && <div className={endIconClass}>{endIcon}</div>}
			</div>
		);
	},
);

Input.displayName = "Input";

export { Input };
