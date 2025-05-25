"use client";

import { PageHeader } from "@/components/page-header";
import ReportStatusBadge from "@/components/report-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reports } from "@/lib/data";
import { motion } from "framer-motion";
import {
	AlertCircle,
	Award,
	BarChart,
	Bell,
	Camera,
	CheckCircle,
	ChevronRight,
	Clock,
	Edit,
	FileText,
	HelpCircle,
	LogOut,
	MapPin,
	Settings,
	Shield,
	Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Profile() {
	const [activeTab, setActiveTab] = useState("reports");

	// Filter reports by status
	const waitingReports = reports.filter((r) => r.status === "waiting");
	const processingReports = reports.filter((r) => r.status === "processing");
	const completedReports = reports.filter((r) => r.status === "completed");

	// User stats to display
	const userStats = [
		{ label: "Laporan", value: reports.length },
		{ label: "Selesai", value: completedReports.length },
		{ label: "Kontribusi", value: "75%" },
	];

	return (
		<div className="container max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-6 space-y-8">
			{/* Profile Header */}
			<PageHeader
				title="Profil Saya"
				description="Kelola akun, laporan, dan preferensi kamu"
			/>

			{/* User Profile Card */}
			<Card className="overflow-hidden border-muted/60 shadow-sm">
				<div className="bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 h-28 md:h-32 relative">
					<Button
						size="icon"
						variant="secondary"
						className="absolute right-4 top-4 rounded-full shadow-sm bg-background/80 backdrop-blur-sm"
					>
						<Camera className="h-4 w-4" />
						<span className="sr-only">Change cover</span>
					</Button>
				</div>
				<CardContent className="p-0">
					<div className="px-6 pb-6 pt-0 -mt-12">
						<div className="flex flex-col md:flex-row md:items-end gap-5">
							<div className="relative group">
								<Avatar className="h-24 w-24 border-4 border-background shadow-md">
									<AvatarImage
										src="/placeholder.svg?height=96&width=96"
										alt="John Doe"
									/>
									<AvatarFallback className="text-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
										JD
									</AvatarFallback>
								</Avatar>
								<Button
									size="icon"
									variant="secondary"
									className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<Edit className="h-3.5 w-3.5" />
									<span className="sr-only">Edit avatar</span>
								</Button>
							</div>
							<div className="flex-1 space-y-1 mt-3 md:mt-0">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div>
										<h2 className="text-xl font-bold">John Doe</h2>
										<p className="text-muted-foreground">
											john.doe@example.com
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="rounded-full inline-flex items-center gap-1.5 w-fit"
									>
										<Edit className="h-3.5 w-3.5" />
										Edit Profil
									</Button>
								</div>

								<div className="flex flex-wrap items-center gap-2 mt-2">
									<Badge variant="outlineInfo">
										<Award className="h-3 w-3 mr-1.5" />
										Pelapor Aktif
									</Badge>
									<Badge variant="outlineSuccess">
										<Star className="h-3 w-3 mr-1.5" />
										Level 3
									</Badge>
									<Badge variant="outlineWarning">
										<CheckCircle className="h-3 w-3 mr-1.5" />
										Terverifikasi
									</Badge>
								</div>
							</div>
						</div>

						{/* User Stats */}
						<div className="mt-6 grid grid-cols-3 gap-4 text-center">
							{userStats.map((stat) => (
								<div
									key={stat.label}
									className="p-3 rounded-xl bg-muted/40 flex flex-col"
								>
									<span className="text-lg font-semibold">{stat.value}</span>
									<span className="text-xs text-muted-foreground">
										{stat.label}
									</span>
								</div>
							))}
						</div>

						{/* Progress Level */}
						<div className="mt-6 space-y-3">
							<div className="flex justify-between text-sm">
								<div className="flex items-center gap-1.5">
									<BarChart className="h-4 w-4 text-primary" />
									<span className="font-medium">Level Kontribusi</span>
								</div>
								<span className="text-primary font-medium">75/100 XP</span>
							</div>
							<Progress value={75} className="h-2.5 rounded-full bg-muted/70" />
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>Level 3</span>
								<span>Level 4</span>
							</div>
							<p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 flex items-center gap-1.5">
								<AlertCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
								<span>
									Kirim 5 laporan lagi untuk mencapai Level 4 dan dapatkan badge
									ekslusif
								</span>
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Main Tabs */}
			<Tabs
				defaultValue="reports"
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid grid-cols-2 w-full  p-1 bg-muted/60">
					<TabsTrigger
						value="reports"
						className=" data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						Laporan Saya
					</TabsTrigger>
					<TabsTrigger
						value="settings"
						className=" data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						Pengaturan
					</TabsTrigger>
				</TabsList>

				{/* Reports Tab */}
				<TabsContent
					value="reports"
					className="space-y-6 mt-4 focus-visible:outline-none"
				>
					<Tabs defaultValue="all" className="w-full">
						<div className="overflow-x-auto pb-2">
							<TabsList className=" p-1 bg-muted/60 w-fit">
								<TabsTrigger
									value="all"
									className=" data-[state=active]:bg-background data-[state=active]:shadow-sm"
								>
									Semua
								</TabsTrigger>
								<TabsTrigger
									value="waiting"
									className=" data-[state=active]:bg-background data-[state=active]:shadow-sm flex gap-1.5 items-center"
								>
									Menunggu
									{waitingReports.length > 0 && (
										<Badge className="h-5 w-5 p-0 flex items-center justify-center bg-amber-500 text-white  text-[10px]">
											{waitingReports.length}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger
									value="processing"
									className=" data-[state=active]:bg-background data-[state=active]:shadow-sm flex gap-1.5 items-center"
								>
									Diproses
									{processingReports.length > 0 && (
										<Badge className="h-5 w-5 p-0 flex rounded-full items-center justify-center bg-blue-500 text-white  text-[10px]">
											{processingReports.length}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger
									value="completed"
									className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex gap-1.5 items-center"
								>
									Selesai
									{completedReports.length > 0 && (
										<Badge className="h-5 w-5 p-0 flex items-center justify-center bg-green-500 text-whiteounded-full text-[10px]">
											{completedReports.length}
										</Badge>
									)}
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent
							value="all"
							className="mt-4 space-y-4 focus-visible:outline-none"
						>
							{reports.slice(0, 3).map((report) => (
								<ReportCard key={report.id} report={report} />
							))}
						</TabsContent>

						<TabsContent
							value="waiting"
							className="mt-4 space-y-4 focus-visible:outline-none"
						>
							{waitingReports.length > 0 ? (
								waitingReports.map((report) => (
									<ReportCard key={report.id} report={report} />
								))
							) : (
								<EmptyState
									icon={AlertCircle}
									message="Tidak ada laporan yang menunggu"
									description="Semua laporan kamu sudah dalam proses atau selesai ditangani"
								/>
							)}
						</TabsContent>

						<TabsContent
							value="processing"
							className="mt-4 space-y-4 focus-visible:outline-none"
						>
							{processingReports.length > 0 ? (
								processingReports.map((report) => (
									<ReportCard key={report.id} report={report} />
								))
							) : (
								<EmptyState
									icon={Clock}
									message="Tidak ada laporan yang sedang diproses"
									description="Saat ini tidak ada laporan yang sedang ditangani"
								/>
							)}
						</TabsContent>

						<TabsContent
							value="completed"
							className="mt-4 space-y-4 focus-visible:outline-none"
						>
							{completedReports.length > 0 ? (
								completedReports.map((report) => (
									<ReportCard key={report.id} report={report} />
								))
							) : (
								<EmptyState
									icon={CheckCircle}
									message="Tidak ada laporan yang selesai"
									description="Laporan yang sudah diselesaikan akan muncul di sini"
								/>
							)}
						</TabsContent>
					</Tabs>
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent
					value="settings"
					className="space-y-6 mt-4 focus-visible:outline-none"
				>
					<Card className="border-muted/60 shadow-sm">
						<CardHeader className="pb-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Akun & Preferensi
							</h3>
						</CardHeader>
						<CardContent className="p-0">
							<Link href="/profile/account">
								<div className="flex items-center justify-between p-4 hover:bg-muted/40 cursor-pointer transition-colors">
									<div className="flex items-center">
										<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
											<Settings className="h-4 w-4 text-primary" />
										</div>
										<div>
											<span className="font-medium">Pengaturan Akun</span>
											<p className="text-xs text-muted-foreground mt-0.5">
												Email, password, dan informasi profil
											</p>
										</div>
									</div>
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								</div>
							</Link>
							<Separator />
							<Link href="/notifications/settings">
								<div className="flex items-center justify-between p-4 hover:bg-muted/40 cursor-pointer transition-colors">
									<div className="flex items-center">
										<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
											<Bell className="h-4 w-4 text-primary" />
										</div>
										<div>
											<span className="font-medium">Preferensi Notifikasi</span>
											<p className="text-xs text-muted-foreground mt-0.5">
												Atur jenis notifikasi yang ingin kamu terima
											</p>
										</div>
									</div>
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								</div>
							</Link>
						</CardContent>
					</Card>

					<Card className="border-muted/60 shadow-sm">
						<CardHeader className="pb-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Privasi & Bantuan
							</h3>
						</CardHeader>
						<CardContent className="p-0">
							<Link href="/profile/privacy">
								<div className="flex items-center justify-between p-4 hover:bg-muted/40 cursor-pointer transition-colors">
									<div className="flex items-center">
										<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
											<Shield className="h-4 w-4 text-primary" />
										</div>
										<div>
											<span className="font-medium">Privasi & Keamanan</span>
											<p className="text-xs text-muted-foreground mt-0.5">
												Kelola data dan keamanan akun kamu
											</p>
										</div>
									</div>
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								</div>
							</Link>
							<Separator />
							<Link href="/help">
								<div className="flex items-center justify-between p-4 hover:bg-muted/40 cursor-pointer transition-colors">
									<div className="flex items-center">
										<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
											<HelpCircle className="h-4 w-4 text-primary" />
										</div>
										<div>
											<span className="font-medium">Bantuan & Dukungan</span>
											<p className="text-xs text-muted-foreground mt-0.5">
												Dapatkan bantuan untuk masalah yang kamu alami
											</p>
										</div>
									</div>
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								</div>
							</Link>
						</CardContent>
					</Card>

					<Button
						variant="outline"
						className="w-full border-destructive/30 hover:bg-destructive/5 text-destructive hover:text-destructive rounded-xl py-6"
					>
						<LogOut className="h-4 w-4 mr-2" />
						Keluar dari Akun
					</Button>

					<div className="text-center text-sm text-muted-foreground pt-4">
						<p>Citizen Connect v1.0.0</p>
						<p className="mt-1">© 2025 Citizen Connect. All rights reserved.</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ReportCard({ report }: { report: any }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Link href={`/report/${report.id}`}>
				<Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-muted/60">
					<div className="flex flex-col sm:flex-row">
						<div className="w-full sm:w-1/4 h-40 sm:h-auto relative">
							<img
								src={report.imageUrl || "/placeholder.svg"}
								alt={report.title}
								className="h-full w-full object-cover"
							/>
							<div className="absolute top-2 left-2 sm:hidden">
								<ReportStatusBadge status={report.status} />
							</div>
						</div>
						<div className="w-full sm:w-3/4 p-4 flex flex-col justify-between">
							<div>
								<div className="flex justify-between items-start">
									<h3 className="font-medium line-clamp-1">{report.title}</h3>
									<div className="hidden sm:block">
										<ReportStatusBadge status={report.status} />
									</div>
								</div>
								<p className="text-sm text-muted-foreground line-clamp-2 mt-1">
									{report.description || "Deskripsi laporan tidak tersedia."}
								</p>
							</div>
							<div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-3">
								<div className="flex items-center">
									<MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
									<span className="truncate max-w-[150px]">
										{report.location}
									</span>
								</div>
								<div className="flex items-center">
									<Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
									<span>{report.date}</span>
								</div>
								<div className="flex-1 text-right hidden sm:block">
									<span className="inline-flex items-center text-primary underline-offset-2 hover:underline">
										Lihat Detail
										<ChevronRight className="h-3.5 w-3.5 ml-1" />
									</span>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</Link>
		</motion.div>
	);
}

function EmptyState({
	icon: Icon,
	message,
	description,
}: {
	icon: any;
	message: string;
	description?: string;
}) {
	return (
		<div className="text-center py-12 px-4 rounded-2xl bg-muted/30 border border-dashed border-muted">
			<div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
				<Icon className="h-6 w-6 text-muted-foreground" />
			</div>
			<h3 className="font-medium text-base">{message}</h3>
			{description && (
				<p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
					{description}
				</p>
			)}
		</div>
	);
}
