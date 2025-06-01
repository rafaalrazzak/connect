"use client";

import LoadingSpinner from "@/components/admin/loading-spinner";
import PageHeader from "@/components/admin/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
	AlertTriangle,
	CheckCircle2,
	RefreshCw,
	Save,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminSettings() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	// Simulate data loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleSave = () => {
		setIsSaving(true);
		setSaveSuccess(false);

		// Simulate API call
		setTimeout(() => {
			setIsSaving(false);
			setSaveSuccess(true);

			toast({
				title: "Pengaturan Tersimpan",
				description: "Pengaturan kamu sudah berhasil disimpan.",
			});

			// Hide success message after 3 seconds
			setTimeout(() => {
				setSaveSuccess(false);
			}, 3000);
		}, 1500);
	};

	if (isLoading) {
		return (
			<div className="h-[calc(100vh-120px)] flex items-center justify-center">
				<LoadingSpinner size="lg" text="Loading settings..." />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Pengaturan"
				description="Kelola pengaturan dan konfigurasi sistem"
			>
				<Button onClick={handleSave} disabled={isSaving}>
					{isSaving ? (
						<>
							<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
							Menyimpan...
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" />
							Simpan Perubahan
						</>
					)}
				</Button>
			</PageHeader>

			{saveSuccess && (
				<Alert className="bg-green-50 border-green-200">
					<CheckCircle2 className="h-4 w-4 text-green-600" />
					<AlertDescription className="text-green-800">
						Pengaturan berhasil disimpan!
					</AlertDescription>
				</Alert>
			)}

			<Tabs defaultValue="general" className="w-full">
				<TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
					<TabsTrigger value="general">Umum</TabsTrigger>
					<TabsTrigger value="notifications">Notifikasi</TabsTrigger>
					<TabsTrigger value="reports">Laporan</TabsTrigger>
					<TabsTrigger value="advanced">Lanjutan</TabsTrigger>
				</TabsList>

				<TabsContent value="general" className="space-y-4 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Pengaturan Umum</CardTitle>
							<CardDescription>Kelola pengaturan aplikasi kamu</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="app-name">Nama Aplikasi</Label>
								<Input id="app-name" defaultValue="Citizen Connect" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="app-description">Deskripsi Aplikasi</Label>
								<Textarea
									id="app-description"
									defaultValue="Platform komunitas untuk melaporkan dan melacak masalah publik."
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="contact-email">Email Kontak</Label>
								<Input
									id="contact-email"
									type="email"
									defaultValue="support@citizenconnect.com"
								/>
							</div>

							<Separator />

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="maintenance-mode">Mode Pemeliharaan</Label>
									<Switch id="maintenance-mode" />
								</div>
								<p className="text-sm text-muted-foreground">
									Ketika diaktifkan, situs akan menampilkan pesan pemeliharaan
									ke semua pengguna.
								</p>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="user-registration">Registrasi Pengguna</Label>
									<Switch id="user-registration" defaultChecked />
								</div>
								<p className="text-sm text-muted-foreground">
									Izinkan pengguna baru mendaftar akun.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Lokalisasi</CardTitle>
							<CardDescription>Konfigurasi pengaturan regional</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="default-language">Bahasa Default</Label>
								<Select defaultValue="en">
									<SelectTrigger id="default-language">
										<SelectValue placeholder="Pilih bahasa" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="es">Spanish</SelectItem>
										<SelectItem value="fr">French</SelectItem>
										<SelectItem value="de">German</SelectItem>
										<SelectItem value="zh">Chinese</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="timezone">Zona Waktu Default</Label>
								<Select defaultValue="utc">
									<SelectTrigger id="timezone">
										<SelectValue placeholder="Pilih zona waktu" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="utc">UTC</SelectItem>
										<SelectItem value="est">Eastern Time (EST)</SelectItem>
										<SelectItem value="cst">Central Time (CST)</SelectItem>
										<SelectItem value="mst">Mountain Time (MST)</SelectItem>
										<SelectItem value="pst">Pacific Time (PST)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="date-format">Format Tanggal</Label>
								<Select defaultValue="mdy">
									<SelectTrigger id="date-format">
										<SelectValue placeholder="Pilih format tanggal" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="mdy">MM/DD/YYYY</SelectItem>
										<SelectItem value="dmy">DD/MM/YYYY</SelectItem>
										<SelectItem value="ymd">YYYY/MM/DD</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="notifications" className="space-y-4 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Notifikasi Email</CardTitle>
							<CardDescription>
								Konfigurasi pengaturan notifikasi email
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="email-notifications">
										Aktifkan Notifikasi Email
									</Label>
									<Switch id="email-notifications" defaultChecked />
								</div>
								<p className="text-sm text-muted-foreground">
									Kirim notifikasi email ke pengguna untuk update penting.
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email-sender">Email Pengirim</Label>
								<Input
									id="email-sender"
									defaultValue="notifications@citizenconnect.com"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email-template">Template Email</Label>
								<Select defaultValue="default">
									<SelectTrigger id="email-template">
										<SelectValue placeholder="Pilih template" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="default">Template Default</SelectItem>
										<SelectItem value="minimal">Template Minimal</SelectItem>
										<SelectItem value="branded">Template Bermerek</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-sm font-medium">Jenis Notifikasi</h3>
								<div className="grid gap-3">
									<div className="flex items-center justify-between">
										<Label htmlFor="notify-report-status">
											Update Status Laporan
										</Label>
										<Switch id="notify-report-status" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="notify-comments">Komentar Baru</Label>
										<Switch id="notify-comments" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="notify-assignments">
											Perubahan Penugasan
										</Label>
										<Switch id="notify-assignments" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="notify-system">Pengumuman Sistem</Label>
										<Switch id="notify-system" defaultChecked />
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Notifikasi Push</CardTitle>
							<CardDescription>
								Konfigurasi pengaturan notifikasi push
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="push-notifications">
										Aktifkan Notifikasi Push
									</Label>
									<Switch id="push-notifications" defaultChecked />
								</div>
								<p className="text-sm text-muted-foreground">
									Kirim notifikasi push ke perangkat mobile.
								</p>
							</div>

							<div className="space-y-4">
								<h3 className="text-sm font-medium">Jenis Notifikasi</h3>
								<div className="grid gap-3">
									<div className="flex items-center justify-between">
										<Label htmlFor="push-report-status">
											Update Status Laporan
										</Label>
										<Switch id="push-report-status" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="push-comments">Komentar Baru</Label>
										<Switch id="push-comments" defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor="push-urgent">Notifikasi Mendesak</Label>
										<Switch id="push-urgent" defaultChecked />
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="reports" className="space-y-4 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Pengaturan Laporan</CardTitle>
							<CardDescription>
								Konfigurasi pengaturan pengiriman dan pengelolaan laporan
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="max-images">Maksimal Foto per Laporan</Label>
								<Select defaultValue="3">
									<SelectTrigger id="max-images">
										<SelectValue placeholder="Pilih maksimal" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">1 Foto</SelectItem>
										<SelectItem value="3">3 Foto</SelectItem>
										<SelectItem value="5">5 Foto</SelectItem>
										<SelectItem value="10">10 Foto</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="max-description">
									Panjang Deskripsi Maksimal
								</Label>
								<Select defaultValue="1000">
									<SelectTrigger id="max-description">
										<SelectValue placeholder="Pilih maksimal" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="500">500 Karakter</SelectItem>
										<SelectItem value="1000">1000 Karakter</SelectItem>
										<SelectItem value="2000">2000 Karakter</SelectItem>
										<SelectItem value="5000">5000 Karakter</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="require-location">Wajib Lokasi</Label>
									<Switch id="require-location" defaultChecked />
								</div>
								<p className="text-sm text-muted-foreground">
									Wajibkan pengguna memberikan lokasi saat mengirim laporan.
								</p>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="allow-anonymous">
										Izinkan Laporan Anonim
									</Label>
									<Switch id="allow-anonymous" defaultChecked />
								</div>
								<p className="text-sm text-muted-foreground">
									Izinkan pengguna mengirim laporan secara anonim.
								</p>
							</div>

							<Separator />

							<div className="space-y-2">
								<Label htmlFor="auto-assign">Penugasan Otomatis</Label>
								<Select defaultValue="category">
									<SelectTrigger id="auto-assign">
										<SelectValue placeholder="Pilih metode penugasan" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">
											Tanpa Penugasan Otomatis
										</SelectItem>
										<SelectItem value="category">
											Berdasarkan Kategori
										</SelectItem>
										<SelectItem value="location">Berdasarkan Lokasi</SelectItem>
										<SelectItem value="round-robin">Bergiliran</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Kategori</CardTitle>
							<CardDescription>Kelola kategori laporan</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-medium">Kategori Aktif</h3>
									<Button variant="outline" size="sm">
										Tambah Kategori
									</Button>
								</div>
								<div className="border rounded-md">
									<div className="p-3 flex items-center justify-between border-b">
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 rounded-full bg-red-500" />
											<span>Road Damage</span>
										</div>
										<Button variant="ghost" size="sm">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
									<div className="p-3 flex items-center justify-between border-b">
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 rounded-full bg-yellow-500" />
											<span>Street Lights</span>
										</div>
										<Button variant="ghost" size="sm">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
									<div className="p-3 flex items-center justify-between border-b">
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 rounded-full bg-green-500" />
											<span>Waste Issues</span>
										</div>
										<Button variant="ghost" size="sm">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
									<div className="p-3 flex items-center justify-between border-b">
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 rounded-full bg-blue-500" />
											<span>Public Order</span>
										</div>
										<Button variant="ghost" size="sm">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
									<div className="p-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 rounded-full bg-purple-500" />
											<span>Public Facilities</span>
										</div>
										<Button variant="ghost" size="sm">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="advanced" className="space-y-4 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Pengaturan Lanjutan</CardTitle>
							<CardDescription>
								Konfigurasi pengaturan sistem lanjutan
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="api-key">Kunci API</Label>
								<div className="flex gap-2">
									<Input
										id="api-key"
										defaultValue="sk_live_51NzUBTGQOF8zXd6H..."
										type="password"
									/>
									<Button variant="outline">Buat Ulang</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="webhook-url">URL Webhook</Label>
								<Input
									id="webhook-url"
									placeholder="https://example.com/webhook"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="debug-mode">Mode Debug</Label>
									<Switch id="debug-mode" />
								</div>
								<p className="text-sm text-muted-foreground">
									Aktifkan logging detail untuk keperluan debugging.
								</p>
							</div>

							<Separator />

							<div className="space-y-2">
								<h3 className="text-sm font-medium">Zona Berbahaya</h3>
								<Alert variant="destructive">
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										Tindakan ini bersifat merusak dan tidak bisa dibatalkan.
										Harap lanjutkan dengan hati-hati.
									</AlertDescription>
								</Alert>
								<div className="flex flex-wrap gap-2 mt-4">
									<Button
										variant="outline"
										className="text-red-500 border-red-200 hover:bg-red-50"
									>
										Reset Sistem
									</Button>
									<Button
										variant="outline"
										className="text-red-500 border-red-200 hover:bg-red-50"
									>
										Hapus Semua Data
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Informasi Sistem</CardTitle>
							<CardDescription>
								Lihat informasi dan status sistem
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">Versi</p>
										<p className="font-medium">1.5.2</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Terakhir Diperbarui
										</p>
										<p className="font-medium">May 15, 2025</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Status Database
										</p>
										<p className="font-medium text-green-600">Terhubung</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Penyimpanan</p>
										<p className="font-medium">45.2 GB / 100 GB</p>
									</div>
								</div>
								<Button variant="outline" className="w-full">
									<RefreshCw className="mr-2 h-4 w-4" />
									Periksa Update
								</Button>
							</div>
						</CardContent>
						<CardFooter className="border-t px-6 py-4">
							<p className="text-xs text-muted-foreground">
								© 2025 Citizen Connect. All rights reserved.
							</p>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
