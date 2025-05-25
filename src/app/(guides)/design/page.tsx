import ColorPalette from "@/components/admin/design-guidelines/color-palette";
import ComponentExample from "@/components/admin/design-guidelines/component-example";
import DesignGuidelineNav from "@/components/admin/design-guidelines/design-guideline-nav";
import SpacingGuide from "@/components/admin/design-guidelines/spacing-guide";
import TypographyShowcase from "@/components/admin/design-guidelines/typography-showcase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Panduan Desain | Citizen Connect Admin",
	description: "Panduan desain komprehensif untuk Citizen Connect",
};

export default function DesignGuidelinesPage() {
	return (
		<div className="container mx-auto space-y-8 pb-10">
			<div className="flex flex-col md:flex-row gap-6">
				<div className="md:w-64 lg:w-72 shrink-0">
					<div className="sticky top-24">
						<DesignGuidelineNav />
					</div>
				</div>

				<div className="flex-1 space-y-10">
					<section id="pengantar">
						<h1 className="text-3xl font-bold tracking-tight mb-2">
							Panduan Desain
						</h1>
						<p className="text-muted-foreground mb-6">
							Dokumentasi komprehensif untuk memastikan konsistensi desain di
							seluruh platform Citizen Connect.
						</p>

						<Alert>
							<InfoIcon className="h-4 w-4" />
							<AlertTitle>Hai, Selamat Datang!</AlertTitle>
							<AlertDescription>
								Panduan ini akan membantu kamu memahami prinsip desain dan
								komponen UI yang digunakan di Citizen Connect. Gunakan panduan
								ini sebagai referensi saat mengembangkan fitur baru.
							</AlertDescription>
						</Alert>
					</section>

					<section id="warna" className="scroll-mt-6">
						<h2 className="text-2xl font-bold tracking-tight mb-4">
							Palet Warna
						</h2>
						<p className="text-muted-foreground mb-6">
							Warna-warna berikut digunakan di seluruh aplikasi untuk
							menciptakan pengalaman yang konsisten dan menarik.
						</p>
						<ColorPalette />
					</section>

					<section id="tipografi" className="scroll-mt-6">
						<h2 className="text-2xl font-bold tracking-tight mb-4">
							Tipografi
						</h2>
						<p className="text-muted-foreground mb-6">
							Tipografi yang konsisten membantu menciptakan hierarki visual dan
							meningkatkan keterbacaan.
						</p>
						<TypographyShowcase />
					</section>

					<section id="spasi" className="scroll-mt-6">
						<h2 className="text-2xl font-bold tracking-tight mb-4">
							Panduan Spasi
						</h2>
						<p className="text-muted-foreground mb-6">
							Spasi yang konsisten membantu menciptakan tata letak yang seimbang
							dan mudah dibaca.
						</p>
						<SpacingGuide />
					</section>

					<section id="komponen" className="scroll-mt-6">
						<h2 className="text-2xl font-bold tracking-tight mb-4">
							Komponen UI
						</h2>
						<p className="text-muted-foreground mb-6">
							Komponen berikut digunakan di seluruh aplikasi untuk menciptakan
							pengalaman yang konsisten.
						</p>

						<Tabs defaultValue="dasar">
							<TabsList className="mb-6">
								<TabsTrigger value="dasar">Komponen Dasar</TabsTrigger>
								<TabsTrigger value="formulir">Komponen Formulir</TabsTrigger>
								<TabsTrigger value="data">Tampilan Data</TabsTrigger>
								<TabsTrigger value="navigasi">Navigasi</TabsTrigger>
							</TabsList>

							<TabsContent value="dasar" className="space-y-8">
								<ComponentExample
									id="button"
									title="Button"
									description="Tombol digunakan untuk memicu tindakan atau navigasi."
								>
									<div className="flex flex-wrap gap-4">
										<Button variant="default">Default</Button>
										<Button variant="secondary">Secondary</Button>
										<Button variant="outline">Outline</Button>
										<Button variant="ghost">Ghost</Button>
										<Button variant="link">Link</Button>
										<Button variant="destructive">Destructive</Button>
									</div>

									<div className="mt-4 flex flex-wrap gap-4">
										<Button size="sm">Small</Button>
										<Button>Default</Button>
										<Button size="lg">Large</Button>
										<Button size="icon">
											<InfoIcon className="h-4 w-4" />
										</Button>
									</div>
								</ComponentExample>

								<ComponentExample
									id="card"
									title="Card"
									description="Card digunakan untuk mengelompokkan konten terkait."
								>
									<Card>
										<CardHeader>
											<CardTitle>Judul Card</CardTitle>
											<CardDescription>
												Deskripsi singkat tentang card ini.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<p>
												Ini adalah konten card. Card dapat berisi teks, gambar,
												atau komponen lainnya.
											</p>
										</CardContent>
									</Card>
								</ComponentExample>

								<ComponentExample
									id="badge"
									title="Badge"
									description="Badge digunakan untuk menampilkan status atau label."
								>
									<div className="flex flex-wrap gap-2">
										<Badge>Default</Badge>
										<Badge variant="secondary">Secondary</Badge>
										<Badge variant="outline">Outline</Badge>
										<Badge variant="destructive">Destructive</Badge>
									</div>
								</ComponentExample>

								<ComponentExample
									id="avatar"
									title="Avatar"
									description="Avatar digunakan untuk menampilkan gambar profil pengguna."
								>
									<div className="flex flex-wrap gap-4 items-center">
										<Avatar>
											<AvatarImage
												src="/placeholder.svg?height=40&width=40"
												alt="Avatar"
											/>
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<Avatar className="h-10 w-10">
											<AvatarImage
												src="/placeholder.svg?height=40&width=40"
												alt="Avatar"
											/>
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<Avatar className="h-12 w-12">
											<AvatarImage
												src="/placeholder.svg?height=48&width=48"
												alt="Avatar"
											/>
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
									</div>
								</ComponentExample>

								<ComponentExample
									id="alert"
									title="Alert"
									description="Alert digunakan untuk menampilkan pesan penting kepada pengguna."
								>
									<Alert>
										<InfoIcon className="h-4 w-4" />
										<AlertTitle>Informasi Penting</AlertTitle>
										<AlertDescription>
											Ini adalah contoh pesan alert yang menampilkan informasi
											penting kepada pengguna.
										</AlertDescription>
									</Alert>
								</ComponentExample>
							</TabsContent>

							<TabsContent value="formulir" className="space-y-8">
								<ComponentExample
									id="input"
									title="Input"
									description="Input digunakan untuk mengumpulkan data dari pengguna."
								>
									<div className="grid gap-4 max-w-sm">
										<Input placeholder="Masukkan teks di sini..." />
										<Input placeholder="Input yang dinonaktifkan" disabled />
										<div className="grid grid-cols-2 gap-4">
											<Input placeholder="Nama depan" />
											<Input placeholder="Nama belakang" />
										</div>
									</div>
								</ComponentExample>

								{/* More form components would go here */}
							</TabsContent>

							<TabsContent value="data" className="space-y-8">
								<ComponentExample
									id="table"
									title="Table"
									description="Tabel digunakan untuk menampilkan data dalam format baris dan kolom."
								>
									<div className="rounded-md border">
										<table className="w-full caption-bottom text-sm">
											<thead className="[&_tr]:border-b">
												<tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
													<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
														ID
													</th>
													<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
														Nama
													</th>
													<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
														Status
													</th>
												</tr>
											</thead>
											<tbody className="[&_tr:last-child]:border-0">
												<tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
													<td className="p-4 align-middle">001</td>
													<td className="p-4 align-middle">Budi Santoso</td>
													<td className="p-4 align-middle">
														<Badge>Aktif</Badge>
													</td>
												</tr>
												<tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
													<td className="p-4 align-middle">002</td>
													<td className="p-4 align-middle">Siti Rahayu</td>
													<td className="p-4 align-middle">
														<Badge variant="outline">Pending</Badge>
													</td>
												</tr>
												<tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
													<td className="p-4 align-middle">003</td>
													<td className="p-4 align-middle">Ahmad Hidayat</td>
													<td className="p-4 align-middle">
														<Badge variant="destructive">Nonaktif</Badge>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</ComponentExample>

								{/* More data display components would go here */}
							</TabsContent>

							<TabsContent value="navigasi" className="space-y-8">
								<ComponentExample
									id="tabs"
									title="Tabs"
									description="Tabs digunakan untuk beralih antara tampilan yang berbeda dalam konteks yang sama."
								>
									<Tabs defaultValue="tab1" className="w-full max-w-md">
										<TabsList className="grid w-full grid-cols-3">
											<TabsTrigger value="tab1">Tab 1</TabsTrigger>
											<TabsTrigger value="tab2">Tab 2</TabsTrigger>
											<TabsTrigger value="tab3">Tab 3</TabsTrigger>
										</TabsList>
										<TabsContent
											value="tab1"
											className="p-4 border rounded-md mt-2"
										>
											Konten untuk Tab 1
										</TabsContent>
										<TabsContent
											value="tab2"
											className="p-4 border rounded-md mt-2"
										>
											Konten untuk Tab 2
										</TabsContent>
										<TabsContent
											value="tab3"
											className="p-4 border rounded-md mt-2"
										>
											Konten untuk Tab 3
										</TabsContent>
									</Tabs>
								</ComponentExample>

								{/* More navigation components would go here */}
							</TabsContent>
						</Tabs>
					</section>

					<section id="aksesibilitas" className="scroll-mt-6">
						<h2 className="text-2xl font-bold tracking-tight mb-4">
							Aksesibilitas
						</h2>
						<p className="text-muted-foreground mb-6">
							Aksesibilitas sangat penting untuk memastikan aplikasi dapat
							digunakan oleh semua orang.
						</p>
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div>
										<h3 className="text-lg font-medium mb-2">Kontras Warna</h3>
										<p>
											Pastikan semua teks memiliki rasio kontras minimal 4.5:1
											untuk teks normal dan 3:1 untuk teks besar.
										</p>
									</div>
									<Separator />
									<div>
										<h3 className="text-lg font-medium mb-2">
											Navigasi Keyboard
										</h3>
										<p>
											Semua interaksi harus dapat diakses menggunakan keyboard
											saja.
										</p>
									</div>
									<Separator />
									<div>
										<h3 className="text-lg font-medium mb-2">
											Teks Alternatif
										</h3>
										<p>
											Semua gambar harus memiliki teks alternatif yang
											deskriptif.
										</p>
									</div>
									<Separator />
									<div>
										<h3 className="text-lg font-medium mb-2">
											Struktur Semantik
										</h3>
										<p>
											Gunakan elemen HTML yang sesuai dengan makna kontennya.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>

					<section id="figma" className="scroll-mt-6">
						<h2 className="text-2xl font-bold tracking-tight mb-4">
							File Figma
						</h2>
						<p className="text-muted-foreground mb-6">
							Berikut adalah file Figma yang berisi semua komponen dan pola
							desain yang digunakan di Citizen Connect.
						</p>
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div className="border rounded-lg p-6 bg-muted/30 text-center">
										<h3 className="text-lg font-medium mb-4">
											Citizen Connect Design System
										</h3>
										<p className="mb-4">
											File Figma berisi semua komponen, palet warna, dan panduan
											tipografi.
										</p>
										<Button>Unduh File Figma</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>
				</div>
			</div>
		</div>
	);
}
