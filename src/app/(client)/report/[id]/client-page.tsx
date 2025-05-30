"use client";

import { reports } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";

// Components
import ReportStatusBadge from "@/components/report-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
	AlertCircle,
	Building2,
	Calendar,
	ChevronLeft,
	Clock,
	ExternalLink,
	Flag,
	Heart,
	HelpCircle,
	Image as ImageIcon,
	MapPin,
	MessageSquare,
	Pencil,
	Send,
	Share2,
	ThumbsDown,
	ThumbsUp,
	User,
} from "lucide-react";

// Types
interface TimelineItem {
	title: string;
	date: Date;
	description: string;
}

interface Comment {
	user: string;
	date: string;
	text: string;
	avatar?: string;
	isOfficial?: boolean;
}

interface ReportDetailProps {
	id: string;
}

// Lazy load the map component to improve initial load time
const LocationMap = dynamic(() => import("@/components/location-map"), {
	loading: () => (
		<div className="h-[240px] bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
			<div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
				<MapPin className="h-8 w-8 animate-pulse opacity-70" />
				<p className="text-sm">Loading map...</p>
			</div>
		</div>
	),
	ssr: false,
});

// Memoized components for better performance
const TimelineProgress = memo(function TimelineProgress({
	timeline,
	currentStep,
}: {
	timeline: TimelineItem[];
	currentStep: number;
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

const CommentItem = memo(function CommentItem({
	comment,
	index,
}: {
	comment: Comment;
	index: number;
}) {
	return (
		<motion.div
			className="flex gap-3"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Avatar className="h-9 w-9 flex-shrink-0 mt-1 border">
				{comment.avatar ? (
					<AvatarImage src={comment.avatar} alt={comment.user} />
				) : (
					<AvatarFallback
						className={`${
							comment.isOfficial
								? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
								: "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"
						}`}
					>
						{comment.user.charAt(0).toUpperCase()}
					</AvatarFallback>
				)}
			</Avatar>
			<div className="flex-1 space-y-1.5">
				<div className="flex flex-wrap gap-2 justify-between items-center">
					<div className="flex items-center gap-2">
						<p className="font-medium">{comment.user}</p>
						{comment.isOfficial && (
							<Badge
								variant="outline"
								className="py-0 h-5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
							>
								<Building2 className="h-3 w-3 mr-1" />
								Official
							</Badge>
						)}
					</div>
					<p className="text-xs text-muted-foreground">{comment.date}</p>
				</div>
				<div className="bg-muted/40 dark:bg-muted/10 p-3 rounded-lg border border-border/50">
					<p className="text-sm">{comment.text}</p>
				</div>
				<div className="flex items-center gap-4 pt-0.5">
					<button
						type="button"
						className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
						aria-label="Like comment"
					>
						<Heart className="h-3 w-3" />
						<span>Like</span>
					</button>
					<button
						type="button"
						className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
						aria-label="Reply to comment"
					>
						<MessageSquare className="h-3 w-3" />
						<span>Reply</span>
					</button>
				</div>
			</div>
		</motion.div>
	);
});

const DataPoint = memo(function DataPoint({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="flex flex-col space-y-1">
			<p className="text-xs font-medium text-muted-foreground">{label}</p>
			<div className="text-sm">{value}</div>
		</div>
	);
});

export default function ReportDetail({ id }: ReportDetailProps) {
	const report = reports.find((r) => r.id === id);

	// Handle case when report is not found
	if (!report) {
		return (
			<div className="container max-w-md h-[70vh] flex flex-col items-center justify-center">
				<AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
				<h2 className="text-xl font-semibold mb-2">Laporan Tidak Ditemukan</h2>
				<p className="text-muted-foreground text-center mb-6">
					Maaf, laporan yang Anda cari tidak dapat ditemukan.
				</p>
				<Link href="/reports">
					<Button>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Kembali ke Daftar Laporan
					</Button>
				</Link>
			</div>
		);
	}

	// State management
	const [activeTab, setActiveTab] = useState("details");
	const [comment, setComment] = useState("");
	const [feedback, setFeedback] = useState<"satisfied" | "unsatisfied" | null>(
		null,
	);
	const [isShareSupported, setIsShareSupported] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showFullImage, setShowFullImage] = useState(false);

	// Check if Web Share API is supported
	useEffect(() => {
		setIsShareSupported(!!navigator.share);
	}, []);

	// Generate timeline based on report status
	const timeline: TimelineItem[] = [
		{
			title: "Laporan Diterima",
			date: report.date,
			description: "Laporan telah diterima dan sedang dalam proses verifikasi.",
		},
		{
			title: "Verifikasi",
			date: new Date(new Date(report.date).getTime() + 2 * 24 * 60 * 60 * 1000),
			description:
				"Laporan telah diverifikasi dan diteruskan ke departemen terkait.",
		},
		{
			title: "Dalam Penanganan",
			date: new Date(new Date(report.date).getTime() + 3 * 24 * 60 * 60 * 1000),
			description: "Tim lapangan sedang menangani masalah ini.",
		},
		{
			title: "Selesai",
			date: new Date(
				new Date(report.date).getTime() + 10 * 24 * 60 * 60 * 1000,
			),
			description: "Masalah telah diselesaikan dan laporan ditutup.",
		},
	];

	// Comments data
	const comments: Comment[] = [
		{
			user: "Ahmad Rizki",
			date: new Date(
				new Date(report.date).getTime() + 3 * 24 * 60 * 60 * 1000,
			).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			text: "Saya melihat petugas sudah mulai memperbaiki jalan ini kemarin sore. Semoga segera selesai.",
		},
		{
			user: "Dinas PU",
			date: new Date(
				new Date(report.date).getTime() + 4 * 24 * 60 * 60 * 1000,
			).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			text: "Terima kasih atas laporannya. Perbaikan akan selesai dalam 3 hari kerja sesuai jadwal.",
			isOfficial: true,
		},
	];

	// Define the current step for the timeline progress indicator
	const currentStep =
		report.status === "completed"
			? timeline.length - 1
			: report.status === "in_progress"
				? 2
				: report.status === "rejected"
					? -1
					: 1;

	// Progress percentage based on status
	const getProgressPercentage = () => {
		switch (report.status) {
			case "completed":
				return 100;
			case "in_progress":
				return 66;
			case "pending":
				return 33;
			case "rejected":
				return 0;
			default:
				return 0;
		}
	};

	// Event handlers
	const handleCommentSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		// In a real app, we would submit the comment to an API
		setComment("");
		alert("Komentar telah terkirim!");
	}, []);

	const handleShare = useCallback(async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: `Citizen Connect: ${report.title}`,
					text: `Laporan tentang ${report.title}`,
					url: window.location.href,
				});
			} catch (err) {
				console.error("Error sharing:", err);
			}
		} else {
			// Fallback for browsers that don't support sharing
			navigator.clipboard.writeText(window.location.href);
			alert("Link berhasil disalin ke clipboard!");
		}
	}, [report.title]);

	// Helper functions for category display
	const getCategoryName = () => {
		if (typeof report.category === "string") return report.category;
		if (typeof report.category === "object" && report.category?.name)
			return report.category.name;
		return "Umum";
	};

	const getCategoryIcon = () => {
		if (typeof report.category === "object" && report.category?.icon) {
			const CategoryIcon = report.category.icon;
			return <CategoryIcon className="h-5 w-5" />;
		}
		return <HelpCircle className="h-5 w-5" />;
	};

	return (
		<motion.div
			className="container max-w-screen-md px-4 pb-12 space-y-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			{/* Improved sticky header with better truncation */}
			<div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-4 -mx-4 py-3 border-b shadow-sm">
				<div className="flex items-center justify-between max-w-screen-md mx-auto">
					<div className="flex items-center gap-3 min-w-0">
						<Link href="/reports">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-full hover:bg-muted/80 shrink-0"
								aria-label="Back to reports"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
						</Link>
						<h1 className="font-semibold text-base sm:text-lg truncate max-w-[220px] sm:max-w-sm md:max-w-md">
							{report.title}
						</h1>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full"
										onClick={handleShare}
										aria-label="Share report"
									>
										<Share2 className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{isShareSupported ? "Bagikan" : "Salin link"}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full"
										aria-label="Flag report"
									>
										<Flag className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Laporkan masalah</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
			</div>

			<div className="space-y-5">
				{/* Image Gallery */}
				{report.imageUrls && report.imageUrls.length > 0 ? (
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
				) : (
					<Card className="border bg-muted/20 overflow-hidden">
						<CardContent className="p-0">
							<div className="relative aspect-video flex items-center justify-center">
								<div className="flex flex-col items-center gap-2">
									<ImageIcon className="h-12 w-12 text-muted-foreground/50" />
									<p className="text-muted-foreground">No images available</p>
								</div>
								<div className="absolute top-3 right-3">
									<ReportStatusBadge status={report.status} size="md" />
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Progress bar */}
				<div className="space-y-2">
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground">Status: </span>
						<span className="font-medium">
							{report.status === "completed" && "Selesai"}
							{report.status === "in_progress" && "Dalam Proses"}
							{report.status === "pending" && "Menunggu"}
							{report.status === "rejected" && "Ditolak"}
						</span>
					</div>
					<Progress value={getProgressPercentage()} className="h-2" />
				</div>

				{/* Quick Info */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<DataPoint
						label="Lokasi"
						value={
							<div className="flex items-center gap-1">
								<MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
								<span className="line-clamp-1">{report.location || "N/A"}</span>
							</div>
						}
					/>
					<DataPoint
						label="Tanggal"
						value={
							<div className="flex items-center gap-1">
								<Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
								<span>
									{new Date(report.date).toLocaleDateString("id-ID", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</span>
							</div>
						}
					/>
					<DataPoint
						label="Kategori"
						value={
							<Badge variant="outline" className="bg-muted/40 font-normal">
								{getCategoryName()}
							</Badge>
						}
					/>
					<DataPoint
						label="Pelapor"
						value={
							<div className="flex items-center gap-1">
								<User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
								<span>{report.anonymous ? "Anonim" : "Pengguna"}</span>
							</div>
						}
					/>
				</div>

				{/* Main content tabs */}
				<Card className="border">
					<Tabs
						defaultValue="details"
						value={activeTab}
						onValueChange={setActiveTab}
					>
						<CardHeader className="border-b">
							<TabsList className="w-full grid grid-cols-3">
								<TabsTrigger value="details">Detail</TabsTrigger>
								<TabsTrigger value="updates">Progress</TabsTrigger>
								<TabsTrigger value="comments">
									Komentar
									<span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
										{comments.length}
									</span>
								</TabsTrigger>
							</TabsList>
						</CardHeader>
						<CardContent className="pt-6 px-4 sm:px-6">
							<TabsContent value="details" className="space-y-6 mt-0">
								{/* Description */}
								<div className="space-y-2">
									<h3 className="text-base font-semibold">Deskripsi</h3>
									<p className="text-muted-foreground whitespace-pre-line leading-relaxed">
										{report.description ||
											"Tidak ada deskripsi yang ditambahkan."}
									</p>
								</div>

								<Separator />

								{/* Location map */}
								<div className="space-y-3">
									<h3 className="text-base font-semibold">Lokasi</h3>
									<div className="rounded-lg overflow-hidden h-[240px] relative border">
										{report.coordinates ? (
											<LocationMap
												position={[
													report.coordinates.latitude,
													report.coordinates.longitude,
												]}
												popupText={report.location || ""}
												zoom={15}
											/>
										) : (
											<div className="h-full flex items-center justify-center bg-muted/50">
												<div className="flex flex-col items-center gap-2 text-muted-foreground">
													<MapPin className="h-8 w-8" />
													<p className="text-sm">Lokasi tidak tersedia</p>
												</div>
											</div>
										)}

										{report.coordinates && (
											<Button
												size="sm"
												variant="secondary"
												className="absolute bottom-3 right-3 gap-1 rounded-full text-xs h-8 bg-background/90 backdrop-blur-sm shadow-md"
												onClick={() => {
													window.open(
														`https://www.google.com/maps?q=${report.coordinates.latitude},${report.coordinates.longitude}`,
														"_blank",
													);
												}}
											>
												<ExternalLink className="h-3 w-3" />
												Google Maps
											</Button>
										)}
									</div>
								</div>

								<Separator />

								{/* Additional details */}
								<div className="space-y-3">
									<h3 className="text-base font-semibold">Ditangani oleh</h3>
									<div className="flex items-center p-3 bg-muted/30 rounded-lg">
										<Avatar className="h-10 w-10 mr-3">
											<AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
												PU
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">Dinas Pekerjaan Umum</p>
											<p className="text-sm text-muted-foreground">
												Bertanggung jawab untuk pemeliharaan infrastruktur jalan
											</p>
										</div>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="updates" className="space-y-6 mt-0">
								<TimelineProgress
									timeline={timeline}
									currentStep={currentStep}
								/>

								<Separator />

								{report.status === "completed" && (
									<div className="space-y-4">
										<h3 className="text-base font-semibold">Beri Penilaian</h3>
										<p className="text-sm text-muted-foreground">
											Seberapa puas Anda dengan penyelesaian laporan ini?
										</p>
										<div className="flex gap-3">
											<Button
												variant={
													feedback === "satisfied" ? "default" : "outline"
												}
												className={`flex-1 rounded-lg py-6 ${
													feedback === "satisfied"
														? "bg-green-600 hover:bg-green-700 text-white"
														: ""
												}`}
												onClick={() => setFeedback("satisfied")}
											>
												<div className="flex flex-col items-center">
													<ThumbsUp className="mb-2 h-6 w-6" />
													<span>Puas</span>
												</div>
											</Button>
											<Button
												variant={
													feedback === "unsatisfied" ? "default" : "outline"
												}
												className={`flex-1 rounded-lg py-6 ${
													feedback === "unsatisfied"
														? "bg-red-600 hover:bg-red-700 text-white"
														: ""
												}`}
												onClick={() => setFeedback("unsatisfied")}
											>
												<div className="flex flex-col items-center">
													<ThumbsDown className="mb-2 h-6 w-6" />
													<span>Tidak Puas</span>
												</div>
											</Button>
										</div>
										<AnimatePresence>
											{feedback && (
												<motion.div
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													className="overflow-hidden"
												>
													<Textarea
														placeholder="Berikan komentar tambahan tentang penilaian Anda (opsional)"
														className="resize-none mb-3"
														rows={3}
													/>
													<Button className="w-full rounded-lg">
														Kirim Penilaian
													</Button>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}
							</TabsContent>

							<TabsContent value="comments" className="mt-0 space-y-5">
								{comments.length > 0 ? (
									<div className="space-y-5 mb-6">
										{comments.map((comment, index) => (
											<CommentItem
												key={index}
												comment={comment}
												index={index}
											/>
										))}
									</div>
								) : (
									<div className="text-center py-8">
										<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
										<p className="text-muted-foreground">Belum ada komentar</p>
										<p className="text-sm text-muted-foreground/70 mt-1">
											Jadilah yang pertama memberikan komentar
										</p>
									</div>
								)}

								<Separator className="my-6" />

								<form onSubmit={handleCommentSubmit} className="space-y-4">
									<div className="flex items-start gap-3">
										<Avatar className="h-9 w-9 mt-1 border">
											<AvatarFallback className="bg-primary/10 text-primary">
												U
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 space-y-3">
											<div className="relative">
												<Textarea
													placeholder="Tulis komentar Anda..."
													value={comment}
													onChange={(e) => setComment(e.target.value)}
													className="resize-none pr-12 min-h-24 bg-muted/30"
												/>
												<Button
													type="submit"
													size="icon"
													disabled={!comment.trim()}
													className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
												>
													<Send className="h-4 w-4" />
												</Button>
											</div>
											<p className="text-xs text-muted-foreground">
												Komentar akan terlihat oleh semua orang. Harap jaga
												kesopanan.
											</p>
										</div>
									</div>
								</form>
							</TabsContent>
						</CardContent>
					</Tabs>
				</Card>
			</div>
		</motion.div>
	);
}
