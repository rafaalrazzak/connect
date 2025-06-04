import ColorPalette from "@/components/admin/design-guidelines/color-palette";
import ComponentExample from "@/components/admin/design-guidelines/component-example";
import DesignGuidelineNav from "@/components/admin/design-guidelines/design-guideline-nav";
import IconsShowcase from "@/components/admin/design-guidelines/icons-showcase";
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
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import LocationMap from "@/components/location-map";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { InfoIcon, ChevronRight, MoveRight, DownloadIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panduan Desain | Citizen Connect Admin",
  description: "Panduan desain komprehensif untuk Citizen Connect",
};

export default function DesignGuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8 pb-10 max-w-7xl">
      {/* Header - Full width on all screens */}
      <section
        id="pengantar"
        className="bg-gradient-to-r from-primary/10 to-background rounded-lg p-6 md:p-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Panduan Desain
        </h1>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Dokumentasi komprehensif untuk memastikan konsistensi desain di
          seluruh platform Citizen Connect.
        </p>

        <Alert className="max-w-3xl bg-background/80 backdrop-blur-sm">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Hai, Selamat Datang!</AlertTitle>
          <AlertDescription>
            Panduan ini akan membantu kamu memahami prinsip desain dan komponen
            UI yang digunakan di Citizen Connect. Gunakan panduan ini sebagai
            referensi saat mengembangkan fitur baru.
          </AlertDescription>
        </Alert>
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation - Side on desktop, top on mobile */}
        <div className="lg:w-64 xl:w-72 shrink-0">
          <div className="lg:sticky lg:top-24">
            <DesignGuidelineNav />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-12">
          <section id="warna" className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">Palet Warna</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Warna-warna berikut digunakan di seluruh aplikasi untuk
              menciptakan pengalaman yang konsisten dan menarik.
            </p>
            <ColorPalette />
          </section>

          <section id="tipografi" className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">Tipografi</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Tipografi yang konsisten membantu menciptakan hierarki visual dan
              meningkatkan keterbacaan.
            </p>
            <TypographyShowcase />
          </section>

          <section id="spasi" className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">
                Panduan Spasi
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Spasi yang konsisten membantu menciptakan tata letak yang seimbang
              dan mudah dibaca.
            </p>
            <SpacingGuide />
          </section>

          {/* Icons section */}
          <section id="icon" className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">Icon</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Icon berikut tersedia untuk digunakan di seluruh aplikasi.
              Menggunakan icon yang konsisten membantu pengguna dalam mengenali
              aksi dan fitur.
            </p>
            <IconsShowcase />
          </section>

          <section id="komponen" className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">Komponen UI</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Komponen berikut digunakan di seluruh aplikasi untuk menciptakan
              pengalaman yang konsisten.
            </p>

            <Tabs defaultValue="dasar" className="space-y-6">
              <div className="relative rounded-lg overflow-x-auto pb-1">
                <TabsList className="w-max min-w-full px-1 inline-flex">
                  <TabsTrigger value="dasar">Dasar</TabsTrigger>
                  <TabsTrigger value="formulir">Formulir</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="peta">Peta & Lokasi</TabsTrigger>
                  <TabsTrigger value="navigasi">Navigasi</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="dasar" className="space-y-8 mt-6">
                <ComponentExample
                  id="button"
                  title="Button"
                  description="Tombol digunakan untuk memicu tindakan atau navigasi."
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-4">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 items-center">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 max-w-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button className="w-full">Full Width</Button>
                      <Button className="gap-2">
                        With Icon <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ComponentExample>

                <ComponentExample
                  id="card"
                  title="Card"
                  description="Card digunakan untuk mengelompokkan konten terkait."
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Judul Card</CardTitle>
                        <CardDescription>
                          Deskripsi singkat tentang card ini.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Ini adalah konten card. Card dapat berisi teks,
                          gambar, atau komponen lainnya.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Card Dengan Footer</CardTitle>
                        <CardDescription>
                          Contoh card dengan bagian footer untuk aksi
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Konten utama dari card dapat ditempatkan di sini.</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">Batal</Button>
                        <Button>Simpan</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </ComponentExample>

                <ComponentExample
                  id="badge"
                  title="Badge"
                  description="Badge digunakan untuk menampilkan status atau label."
                >
                  <div className="grid gap-6">
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Contoh Penggunaan:</p>
                      <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                          <Badge>Baru</Badge>
                          <span>Produk baru</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Populer</Badge>
                          <span>Paling banyak dibaca</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Urgent</Badge>
                          <span>Perlu perhatian segera</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentExample>

                <ComponentExample
                  id="avatar"
                  title="Avatar"
                  description="Avatar digunakan untuk menampilkan gambar profil pengguna."
                >
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-6 items-center">
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
                      <Avatar className="h-14 w-14">
                        <AvatarImage
                          src="/placeholder.svg?height=56&width=56"
                          alt="Avatar"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-background">
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-background">
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-background">
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Contoh grup avatar yang bertumpuk
                      </span>
                    </div>
                  </div>
                </ComponentExample>

                <ComponentExample
                  id="alert"
                  title="Alert"
                  description="Alert digunakan untuk menampilkan pesan penting kepada pengguna."
                >
                  <div className="space-y-4">
                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Informasi Penting</AlertTitle>
                      <AlertDescription>
                        Ini adalah contoh pesan alert yang menampilkan informasi
                        penting kepada pengguna.
                      </AlertDescription>
                    </Alert>

                    <Alert variant="destructive">
                      <AlertTitle>Peringatan</AlertTitle>
                      <AlertDescription>
                        Contoh alert untuk pesan peringatan atau kesalahan yang
                        perlu perhatian.
                      </AlertDescription>
                    </Alert>
                  </div>
                </ComponentExample>
              </TabsContent>

              <TabsContent value="formulir" className="space-y-8 mt-6">
                <ComponentExample
                  id="input"
                  title="Input"
                  description="Input digunakan untuk mengumpulkan data dari pengguna."
                >
                  <div className="grid gap-6">
                    <div className="grid gap-4 max-w-sm">
                      <Input placeholder="Masukkan teks di sini..." />
                      <Input placeholder="Input yang dinonaktifkan" disabled />
                    </div>

                    <div className="grid gap-4 max-w-sm">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" placeholder="Masukkan nama lengkap" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nama Depan</Label>
                          <Input id="firstName" placeholder="Nama depan" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nama Belakang</Label>
                          <Input id="lastName" placeholder="Nama belakang" />
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentExample>

                <ComponentExample
                  id="select"
                  title="Select"
                  description="Select memungkinkan pengguna memilih satu opsi dari daftar pilihan."
                >
                  <div className="grid gap-6 max-w-sm">
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select defaultValue="infrastruktur">
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infrastruktur">
                            Infrastruktur
                          </SelectItem>
                          <SelectItem value="lingkungan">Lingkungan</SelectItem>
                          <SelectItem value="keamanan">Keamanan</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioritas</Label>
                      <Select disabled defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih prioritas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Tinggi</SelectItem>
                          <SelectItem value="medium">Sedang</SelectItem>
                          <SelectItem value="low">Rendah</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ComponentExample>

                <ComponentExample
                  id="checkbox"
                  title="Checkbox"
                  description="Checkbox memungkinkan pengguna untuk memilih beberapa opsi."
                >
                  <div className="space-y-4 max-w-sm">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">
                        Saya menyetujui syarat dan ketentuan
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Pilih kategori laporan:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category1" defaultChecked />
                          <Label htmlFor="category1">
                            Jalan dan infrastruktur
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category2" />
                          <Label htmlFor="category2">
                            Lingkungan dan kebersihan
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category3" />
                          <Label htmlFor="category3">
                            Keamanan dan ketertiban
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="disabled" disabled />
                      <Label
                        className="text-muted-foreground"
                        htmlFor="disabled"
                      >
                        Opsi yang dinonaktifkan
                      </Label>
                    </div>
                  </div>
                </ComponentExample>
              </TabsContent>

              <TabsContent value="data" className="space-y-8 mt-6">
                <ComponentExample
                  id="table"
                  title="Table"
                  description="Tabel digunakan untuk menampilkan data dalam format baris dan kolom."
                >
                  <div className="overflow-auto">
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
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">LP-001</td>
                            <td className="p-4 align-middle">Budi Santoso</td>
                            <td className="p-4 align-middle">
                              <Badge>Aktif</Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Button variant="outline" size="sm">
                                Detail
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">LP-002</td>
                            <td className="p-4 align-middle">Siti Rahayu</td>
                            <td className="p-4 align-middle">
                              <Badge variant="outline">Pending</Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Button variant="outline" size="sm">
                                Detail
                              </Button>
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">LP-003</td>
                            <td className="p-4 align-middle">Ahmad Hidayat</td>
                            <td className="p-4 align-middle">
                              <Badge variant="destructive">Nonaktif</Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Button variant="outline" size="sm">
                                Detail
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ComponentExample>

                {/* Add a card list example */}
                <ComponentExample
                  id="card-list"
                  title="Card List"
                  description="Alternatif untuk tabel yang lebih visual dan mobile-friendly."
                >
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between">
                          <span>LP-001</span>
                          <Badge>Aktif</Badge>
                        </CardTitle>
                        <CardDescription>Budi Santoso</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Laporan jalan rusak di Jl. Merdeka
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" size="sm">
                          Lihat Detail <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between">
                          <span>LP-002</span>
                          <Badge variant="outline">Pending</Badge>
                        </CardTitle>
                        <CardDescription>Siti Rahayu</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Lampu jalan mati di Jl. Sudirman
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" size="sm">
                          Lihat Detail <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between">
                          <span>LP-003</span>
                          <Badge variant="destructive">Nonaktif</Badge>
                        </CardTitle>
                        <CardDescription>Ahmad Hidayat</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Sampah menumpuk di Taman Kota</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" size="sm">
                          Lihat Detail <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </ComponentExample>
              </TabsContent>

              <TabsContent value="peta" className="space-y-8 mt-6">
                <ComponentExample
                  id="location-map"
                  title="Location Map"
                  description="Komponen peta interaktif untuk menampilkan lokasi dan memungkinkan interaksi pengguna."
                >
                  <div className="grid gap-6">
                    <div className="h-[400px] border rounded-lg overflow-hidden">
                      <LocationMap
                        popupText="Kantor Citizen Connect"
                        position={[-6.2088, 106.8456]}
                        zoom={13}
                        showZoomControls={true}
                        markers={[
                          {
                            position: [-6.2108, 106.8476],
                            text: "Laporan #001: Jalan Rusak",
                            id: "report-1",
                            status: "in_progress",
                          },
                          {
                            position: [-6.2058, 106.8426],
                            text: "Laporan #002: Lampu Jalan Mati",
                            id: "report-2",
                            status: "completed",
                          },
                          {
                            position: [-6.2148, 106.8506],
                            text: "Laporan #003: Sampah Menumpuk",
                            id: "report-3",
                            status: "rejected",
                          },
                        ]}
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <h4 className="text-base font-medium mb-3">
                        Contoh Penggunaan
                      </h4>
                      <pre className="p-4 rounded-md bg-muted font-mono text-sm overflow-auto max-w-full">
                        {`// Import komponen
import LocationMap from "@/components/location-map";

// Contoh penggunaan dasar
<LocationMap 
  position={[-6.2088, 106.8456]} 
  popupText="Lokasi Saya"
  zoom={13} 
/>

// Dengan marker tambahan
<LocationMap
  position={[-6.2088, 106.8456]}
  markers={[
    { 
      position: [-6.2108, 106.8476],
      text: "Laporan #001", 
      id: "report-1",
      status: "in_progress"
    }
  ]}
  onMarkerClick={(id) => console.log("Marker clicked:", id)}
/>`}
                      </pre>
                    </div>
                  </div>
                </ComponentExample>

                <ComponentExample
                  id="location-map-drawer"
                  title="Location Map dengan Drawer"
                  description="Peta dengan panel informasi yang dapat digeser untuk menampilkan detail."
                >
                  <div className="h-[400px] border rounded-lg overflow-hidden">
                    <LocationMap
                      position={[-6.2088, 106.8456]}
                      zoom={13}
                      bottomDrawer={
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            Detail Laporan
                          </h3>
                          <div className="grid gap-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">ID:</span>
                              <span className="font-medium">LP-2023-001</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              <Badge>Dalam Proses</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Dilaporkan:
                              </span>
                              <span>20 Mei 2023</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Kategori:
                              </span>
                              <span>Infrastruktur</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Prioritas:
                              </span>
                              <Badge variant="secondary">Medium</Badge>
                            </div>
                          </div>
                          <p className="text-sm mt-2">
                            Jalan rusak dengan beberapa lubang besar yang
                            membahayakan pengguna jalan. Sudah ada beberapa
                            kecelakaan kecil di lokasi ini.
                          </p>
                        </div>
                      }
                      drawerTitle="Detail Laporan #001"
                    />
                  </div>
                </ComponentExample>
              </TabsContent>

              <TabsContent value="navigasi" className="space-y-8 mt-6">
                <ComponentExample
                  id="tabs"
                  title="Tabs"
                  description="Tabs digunakan untuk beralih antara tampilan yang berbeda dalam konteks yang sama."
                >
                  <Tabs defaultValue="tab1" className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tab1">Ringkasan</TabsTrigger>
                      <TabsTrigger value="tab2">Aktivitas</TabsTrigger>
                      <TabsTrigger value="tab3">Pengaturan</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="tab1"
                      className="p-4 border rounded-md mt-2"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium">Ringkasan Laporan</h4>
                        <p className="text-sm text-muted-foreground">
                          Menampilkan statistik dan data ringkasan laporan
                          warga.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="tab2"
                      className="p-4 border rounded-md mt-2"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium">Aktivitas Terbaru</h4>
                        <p className="text-sm text-muted-foreground">
                          Daftar aktivitas terbaru dari pengguna dan
                          administrator.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="tab3"
                      className="p-4 border rounded-md mt-2"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium">Pengaturan Aplikasi</h4>
                        <p className="text-sm text-muted-foreground">
                          Konfigurasi dasar dan preferensi pengguna.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ComponentExample>
              </TabsContent>
            </Tabs>
          </section>

          <section id="aksesibilitas" className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">
                Aksesibilitas
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Aksesibilitas sangat penting untuk memastikan aplikasi dapat
              digunakan oleh semua orang.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Kontras Warna</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pastikan semua teks memiliki rasio kontras minimal 4.5:1
                    untuk teks normal dan 3:1 untuk teks besar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navigasi Keyboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Semua interaksi harus dapat diakses menggunakan keyboard
                    saja.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teks Alternatif</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Semua gambar harus memiliki teks alternatif yang deskriptif.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Struktur Semantik</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Gunakan elemen HTML yang sesuai dengan makna kontennya.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="figma" className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">File Figma</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Berikut adalah file Figma yang berisi semua komponen dan pola
              desain yang digunakan di Citizen Connect.
            </p>

            <Card className="bg-gradient-to-br from-background to-muted/50">
              <CardContent className="p-8">
                <div className="max-w-md mx-auto text-center space-y-6">
                  <div className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 5.5C5 4.11929 6.11929 3 7.5 3H12V9H7.5C6.11929 9 5 7.88071 5 6.5V5.5Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 3H16.5C17.8807 3 19 4.11929 19 5.5V6.5C19 7.88071 17.8807 9 16.5 9H12V3Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 9H16.5C17.8807 9 19 10.1193 19 11.5V12.5C19 13.8807 17.8807 15 16.5 15H12V9Z"
                        fill="currentColor"
                      />
                      <path
                        d="M5 17.5C5 16.1193 6.11929 15 7.5 15H12V21H7.5C6.11929 21 5 19.8807 5 18.5V17.5Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 15H16.5C17.8807 15 19 16.1193 19 17.5V18.5C19 19.8807 17.8807 21 16.5 21H12V15Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Citizen Connect Design System
                    </h3>
                    <p className="mb-6 text-muted-foreground">
                      File Figma berisi semua komponen, palet warna, dan panduan
                      tipografi untuk memastikan konsistensi desain.
                    </p>

                    <Button className="gap-2">
                      Unduh File Figma <DownloadIcon className="h-4 w-4" />
                    </Button>
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
