import CategoryCarousel from "@/components/category-carousel";
import ReportStatusBadge from "@/components/report-status-badge";
import CreateReportDrawer from "@/components/report/create-report-drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { reports } from "@/lib/data";
import { ChevronRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="px-4 py-6 space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">Citizen Connect</h1>
					<p className="text-muted-foreground">
						Laporkan masalah di lingkungan kamu
					</p>
				</div>
				<Avatar className="h-10 w-10 border-2 border-primary/10">
					<AvatarFallback className="bg-primary/10 text-primary font-medium">
						JD
					</AvatarFallback>
				</Avatar>
			</div>

			{/* Report Button - Now using the drawer */}
			<CreateReportDrawer>
				<div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="w-6 h-6"
							>
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
								<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
							</svg>
						</div>
						<div>
							<h3 className="font-bold text-lg">Laporkan Masalah</h3>
							<p className="text-sm text-white/80">
								Pelaporan yang mudah dan cepat
							</p>
						</div>
					</div>
				</div>
			</CreateReportDrawer>

			{/* Categories */}
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">Kategori</h2>
					<Link
						href="/categories"
						className="text-primary text-sm flex items-center group"
					>
						Lihat semua{" "}
						<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>
				<CategoryCarousel />
			</div>

			{/* Recent Reports */}
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">Laporan Terbaru</h2>
					<Link
						href="/map"
						className="text-primary text-sm flex items-center group"
					>
						Lihat peta{" "}
						<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>

				<div className="grid gap-4">
					{reports.slice(0, 3).map((report) => (
						<Link href={`/report/${report.id}`} key={report.id}>
							<Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-muted/80">
								<CardContent className="p-0">
									<div className="flex h-28">
										<div className="w-1/3 relative">
											<img
												src={report.imageUrl || "/placeholder.svg"}
												alt={report.title}
												className="h-full w-full object-cover"
											/>
											<div className="absolute bottom-2 left-2">
												<ReportStatusBadge status={report.status} />
											</div>
										</div>
										<div className="w-2/3 p-4 flex flex-col justify-between">
											<div>
												<h3 className="font-medium line-clamp-1">
													{report.title}
												</h3>
												<p className="text-sm text-muted-foreground line-clamp-2 mt-1">
													{report.description}
												</p>
											</div>
											<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
												<div className="flex items-center">
													<MapPin className="h-3 w-3 mr-1" />
													<span className="truncate max-w-[100px]">
														{report.location}
													</span>
												</div>
												<div className="flex items-center">
													<Clock className="h-3 w-3 mr-1" />
													<span>{report.date}</span>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				<div className="text-center pt-2">
					<Link href="/reports">
						<Button variant="outline" size="sm" className="rounded-full px-6">
							Lihat semua laporan
						</Button>
					</Link>
				</div>
			</div>

			{/* Floating Report Button - Using the drawer */}
			<CreateReportDrawer />
		</div>
	);
}
