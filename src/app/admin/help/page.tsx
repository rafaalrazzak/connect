"use client";

import PageHeader from "@/components/admin/page-header";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	FileText,
	HelpCircle,
	Mail,
	MessageSquare,
	Search,
} from "lucide-react";
import { useState } from "react";

export default function AdminHelp() {
	const [searchQuery, setSearchQuery] = useState("");

	const faqs = [
		{
			question: "Bagaimana cara menugaskan laporan ke dinas?",
			answer:
				"Untuk menugaskan laporan ke dinas, buka halaman detail laporan dengan mengklik laporan di bagian Laporan. Di halaman detail laporan, kamu akan menemukan tombol 'Tugaskan' di pojok kanan atas. Klik tombol ini dan pilih dinas yang sesuai dari menu dropdown.",
		},
		{
			question: "Bagaimana cara mengubah status laporan?",
			answer:
				"Kamu bisa mengubah status laporan dengan dua cara: 1) Dari daftar Laporan, klik menu tiga titik di sisi kanan laporan mana pun dan pilih opsi perubahan status yang diinginkan. 2) Dari halaman detail laporan, gunakan dropdown status di pojok kanan atas untuk memilih status baru.",
		},
		{
			question: "Bagaimana cara menambah pengguna baru ke sistem?",
			answer:
				"Untuk menambah pengguna baru, buka bagian Pengguna dan klik tombol 'Tambah Pengguna' di pojok kanan atas. Isi informasi yang diperlukan dalam formulir yang muncul, termasuk nama, email, peran, dan kata sandi awal. Klik 'Simpan' untuk membuat akun pengguna baru.",
		},
		{
			question: "Bisakah saya menyesuaikan kategori untuk laporan?",
			answer:
				"Ya, kamu bisa menyesuaikan kategori laporan di bagian Pengaturan. Buka Pengaturan, pilih tab 'Laporan', dan gulir ke bawah ke kartu 'Kategori'. Di sini kamu bisa menambah kategori baru, mengedit yang sudah ada, atau menghapus kategori yang tidak lagi diperlukan.",
		},
		{
			question: "Bagaimana cara mengekspor data laporan?",
			answer:
				"Untuk mengekspor data laporan, buka bagian Laporan dan klik tombol 'Ekspor' di pojok kanan atas. Kamu bisa memilih untuk mengekspor semua laporan atau hanya hasil yang difilter. Sistem mendukung ekspor ke format CSV, Excel, dan PDF.",
		},
		{
			question: "Bagaimana cara mereset kata sandi pengguna?",
			answer:
				"Untuk mereset kata sandi pengguna, buka bagian Pengguna, temukan pengguna dalam daftar, dan klik menu tiga titik di sebelah kanan. Pilih 'Reset Kata Sandi' dari dropdown. Kamu bisa mengatur kata sandi baru secara manual atau mengirim link reset kata sandi ke pengguna melalui email.",
		},
	];

	const filteredFaqs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Bantuan & Dukungan"
				description="Temukan jawaban dan dapatkan bantuan"
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Pertanyaan yang Sering Diajukan</CardTitle>
							<CardDescription>
								Temukan jawaban untuk pertanyaan umum tentang dasbor admin
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Cari FAQ..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							{filteredFaqs.length > 0 ? (
								<Accordion type="single" collapsible className="w-full">
									{filteredFaqs.map((faq, index) => (
										<AccordionItem key={index} value={`item-${index}`}>
											<AccordionTrigger className="text-left">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent>
												<p className="text-muted-foreground">{faq.answer}</p>
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							) : (
								<div className="text-center py-8">
									<HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
									<p className="font-medium">Tidak ada FAQ yang cocok</p>
									<p className="text-sm text-muted-foreground mt-1">
										Coba kata kunci lain atau hubungi dukungan
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Dokumentasi</CardTitle>
							<CardDescription>
								Panduan detail dan dokumentasi untuk dasbor admin
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Card className="bg-muted/50">
									<CardContent className="p-4 flex items-start space-x-4">
										<FileText className="h-6 w-6 text-primary mt-1" />
										<div>
											<h3 className="font-medium">
												Panduan Manajemen Pengguna
											</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Pelajari cara mengelola pengguna, peran, dan izin
											</p>
											<Button variant="link" className="px-0 h-auto mt-1">
												Baca Panduan
											</Button>
										</div>
									</CardContent>
								</Card>
								<Card className="bg-muted/50">
									<CardContent className="p-4 flex items-start space-x-4">
										<FileText className="h-6 w-6 text-primary mt-1" />
										<div>
											<h3 className="font-medium">Manajemen Laporan</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Pelajari cara memproses dan mengelola laporan warga
											</p>
											<Button variant="link" className="px-0 h-auto mt-1">
												Baca Panduan
											</Button>
										</div>
									</CardContent>
								</Card>
								<Card className="bg-muted/50">
									<CardContent className="p-4 flex items-start space-x-4">
										<FileText className="h-6 w-6 text-primary mt-1" />
										<div>
											<h3 className="font-medium">Konfigurasi Sistem</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Pelajari cara mengkonfigurasi pengaturan dan preferensi
												sistem
											</p>
											<Button variant="link" className="px-0 h-auto mt-1">
												Baca Panduan
											</Button>
										</div>
									</CardContent>
								</Card>
								<Card className="bg-muted/50">
									<CardContent className="p-4 flex items-start space-x-4">
										<FileText className="h-6 w-6 text-primary mt-1" />
										<div>
											<h3 className="font-medium">Analitik & Pelaporan</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Pelajari cara menggunakan analitik dasbor dan membuat
												laporan
											</p>
											<Button variant="link" className="px-0 h-auto mt-1">
												Baca Panduan
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Hubungi Dukungan</CardTitle>
							<CardDescription>
								Dapatkan bantuan dari tim dukungan kami
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
								<Mail className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">Dukungan Email</p>
									<p className="text-sm text-muted-foreground">
										support@citizenconnect.com
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
								<MessageSquare className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">Chat Langsung</p>
									<p className="text-sm text-muted-foreground">
										Tersedia 09:00-17:00, Senin-Jumat
									</p>
								</div>
							</div>
							<Button className="w-full">Hubungi Dukungan</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Tutorial Video</CardTitle>
							<CardDescription>
								Belajar melalui panduan video langkah demi langkah
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								<div className="rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-muted-foreground"
									>
										<polygon points="5 3 19 12 5 21 5 3" />
									</svg>
								</div>
								<h3 className="font-medium">Memulai dengan Dasbor Admin</h3>
								<p className="text-sm text-muted-foreground">
									Ringkasan komprehensif fitur dan navigasi dasbor admin.
								</p>
							</div>
							<div className="pt-2">
								<Button variant="outline" className="w-full">
									Lihat Semua Tutorial
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
