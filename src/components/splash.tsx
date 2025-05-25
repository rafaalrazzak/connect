"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashProps {
	duration?: number;
	onComplete?: () => void;
	showLogo?: boolean;
}

export function Splash({
	duration = 2500,
	onComplete,
	showLogo = true,
}: SplashProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			if (onComplete) {
				onComplete();
			}
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onComplete]);

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
							<motion.div
								className="absolute h-full bg-primary"
								initial={{ width: "0%" }}
								animate={{ width: "100%" }}
								transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
							/>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
