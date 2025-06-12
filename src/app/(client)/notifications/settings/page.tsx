"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

import { ArrowLeft, Bell, Mail, Smartphone, Info, ExternalLink } from "lucide-react";

export default function NotificationsSettingsPage() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/profile/account?tab=notifications");
		}, 2000);
		return () => clearTimeout(timer);
	}, [router]);

	return (		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
			<PageHeader
				title="Pengaturan Notifikasi"
				description="Dialihkan ke pengaturan akun terpadu"
			>
				<Button variant="ghost" size="sm" asChild>
					<Link href="/profile" className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Kembali
					</Link>
				</Button>
			</PageHeader>

			<div className="container max-w-2xl mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<Card className="border-blue-200 bg-blue-50/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-blue-700">
								<Info className="h-5 w-5" />
								Halaman Dipindahkan
							</CardTitle>
							<CardDescription>
								Pengaturan notifikasi kini terintegrasi dalam halaman Pengaturan Akun untuk pengalaman yang lebih baik.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="flex items-center gap-2 text-sm">
									<Bell className="h-4 w-4 text-blue-600" />
									<span>Push</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Mail className="h-4 w-4 text-green-600" />
									<span>Email</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Smartphone className="h-4 w-4 text-purple-600" />
									<span>In-App</span>
								</div>
							</div>
							
							<div className="flex flex-col sm:flex-row gap-3 pt-2">
								<Button 
									onClick={() => router.push("/profile/account?tab=notifications")}
									className="flex items-center gap-2"
								>
									<Bell className="h-4 w-4" />
									Buka Pengaturan Notifikasi
								</Button>
								<Button 
									variant="outline"
									onClick={() => router.push("/profile/account")}
									className="flex items-center gap-2"
								>
									<ExternalLink className="h-4 w-4" />
									Lihat Semua
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
