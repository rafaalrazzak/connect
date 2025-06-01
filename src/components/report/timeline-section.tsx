import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { memo } from "react";

export const TimelineSection = memo(function TimelineSection({
	timeline,
	currentStep,
}) {
	return (
		<div className="space-y-6">
			{timeline.map((item, index) => (
				<motion.div
					key={index}
					className="relative pl-8"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					{/* Timeline line */}
					<div className="absolute left-[6px] top-0 bottom-0 w-[2px] bg-muted">
						<motion.div
							className="absolute top-0 w-[2px] bg-gradient-to-b from-primary to-primary/60"
							initial={{ height: 0 }}
							animate={{
								height: `${Math.min(
									100,
									((index + 1) / timeline.length) * 100,
								)}%`,
								opacity: index <= currentStep ? 1 : 0.3,
							}}
							transition={{ duration: 0.8, delay: index * 0.2 }}
						/>
					</div>

					{/* Step marker */}
					<motion.div
						className={`absolute left-0 top-0 w-[14px] h-[14px] rounded-full border-[2px] ${
							index <= currentStep
								? "bg-primary border-primary/30 shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
								: "bg-background border-muted"
						}`}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: index * 0.2, type: "spring" }}
					/>

					{/* Content */}
					<div className="space-y-1 pb-8">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
							<p
								className={`font-medium text-base ${
									index <= currentStep ? "" : "text-muted-foreground"
								}`}
							>
								{item.title}
							</p>
							<p className="text-xs text-muted-foreground flex items-center">
								<Clock className="h-3 w-3 mr-1 inline-flex" />
								{formatDate(item.date)}
							</p>
						</div>
						<p
							className={`text-sm ${
								index <= currentStep
									? "text-muted-foreground"
									: "text-muted-foreground/70"
							}`}
						>
							{item.description}
						</p>
					</div>
				</motion.div>
			))}
		</div>
	);
});
