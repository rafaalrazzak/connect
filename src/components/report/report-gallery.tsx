"use client";

import { Icon } from "@/components/icons";
import ReportStatusBadge from "@/components/report-status-badge";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { Report } from "@/types/report";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ReportGallery({ report }: { report: Report }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showFullImage, setShowFullImage] = useState(false);

	// Helper functions for category display
	const getCategoryName = () => {
		if (typeof report.category === "string") return report.category;
		if (typeof report.category === "object" && report.category?.name)
			return report.category.name;
		return "Umum";
	};

	const getCategoryIcon = () => {
		if (typeof report.category.iconName === "string") {
			return <Icon name={report.category.iconName} className="h-4 w-4" />;
		}
		return <HelpCircle className="h-5 w-5" />;
	};

	if (!report.imageUrls || report.imageUrls.length === 0) {
		return (
			<Card className="border bg-muted/20 overflow-hidden">
				<CardContent className="p-0">
					<div className="relative aspect-video flex items-center justify-center">
						<div className="flex flex-col items-center gap-2">
							<ImageIcon className="h-12 w-12 text-muted-foreground/50" />
							<p className="text-muted-foreground">No images available</p>
						</div>
						<div className="absolute top-3 right-3">
							<StatusBadge status={report.status} size="md" />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden border-none shadow-sm bg-transparent">
			<CardContent className="p-0">
				<div className="relative rounded-xl overflow-hidden">
					<Carousel
						className="w-full"
						onSelect={(e) =>
							setCurrentImageIndex(
								Number(e.currentTarget.getAttribute("data-index") || 0),
							)
						}
					>
						<CarouselContent>
							{report.imageUrls.map((url, idx) => (
								<CarouselItem key={idx}>
									<div
										className="relative aspect-video md:aspect-[16/9] w-full cursor-pointer"
										onClick={() => setShowFullImage(true)}
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												setShowFullImage(true);
										}}
										aria-label="Open full image view"
									>
										<Image
											src={url}
											alt={`${report.title} - image ${idx + 1}`}
											fill
											priority={idx === 0}
											className="object-cover rounded-lg"
											sizes="(max-width: 768px) 100vw, 768px"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{report.imageUrls.length > 1 && (
							<>
								<CarouselPrevious className="left-2 h-8 w-8 opacity-80 hover:opacity-100" />
								<CarouselNext className="right-2 h-8 w-8 opacity-80 hover:opacity-100" />
							</>
						)}
					</Carousel>

					{/* Overlay elements */}
					<div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10">
						<div className="text-white pr-2 max-w-[70%]">
							<Badge className="mb-2 bg-white/20 backdrop-blur-sm text-white border-0 flex gap-1 items-center w-fit">
								{getCategoryIcon()}
								{getCategoryName()}
							</Badge>
							<h2 className="text-lg font-semibold line-clamp-2">
								{report.title}
							</h2>
						</div>
						<div>
							<ReportStatusBadge status={report.status} size="md" />
						</div>
					</div>

					{/* Image counter */}
					{report.imageUrls.length > 1 && (
						<div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs backdrop-blur-sm">
							{currentImageIndex + 1}/{report.imageUrls.length}
						</div>
					)}

					{/* Fullscreen image modal */}
					<AnimatePresence>
						{showFullImage && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
								onClick={() => setShowFullImage(false)}
							>
								<Button
									className="absolute top-4 right-4 rounded-full"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										setShowFullImage(false);
									}}
									aria-label="Close image view"
								>
									✕
								</Button>
								<div className="relative w-full h-full max-w-4xl max-h-screen p-4">
									<Image
										src={report.imageUrls[currentImageIndex]}
										alt={report.title}
										fill
										className="object-contain"
										sizes="(max-width: 1200px) 100vw, 1200px"
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</CardContent>
		</Card>
	);
}
