"use client";

import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  Book,
  FileText,
  HelpCircle,
  Info,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Send,
  Video,
} from "lucide-react";
import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: "all", label: "Semua" },
    { id: "reports", label: "Laporan" },
    { id: "account", label: "Akun" },
    { id: "notifications", label: "Notifikasi" },
    { id: "privacy", label: "Privasi" },
    { id: "technical", label: "Teknis" },
  ];

  const faqs: FAQ[] = [
    {
      question: "Bagaimana cara membuat laporan baru?",
      answer:
        "Untuk membuat laporan baru, klik tombol '+' di pojok kanan bawah layar atau gunakan tombol 'Buat Laporan' di beranda. Pilih kategori yang sesuai, isi detail laporan, tambahkan foto jika perlu, dan tentukan lokasi kejadian. Setelah semua informasi lengkap, klik 'Kirim Laporan'.",
      category: "reports",
    },
    {
      question: "Bagaimana cara melacak status laporan saya?",
      answer:
        "Anda dapat melacak status laporan melalui halaman 'Laporan Saya' di profil. Setiap laporan akan menampilkan status terkini seperti 'Diterima', 'Sedang Diproses', 'Selesai', atau 'Ditolak'. Anda juga akan menerima notifikasi saat ada perubahan status.",
      category: "reports",
    },
    {
      question: "Apa saja jenis laporan yang dapat dibuat?",
      answer:
        "Anda dapat membuat laporan untuk berbagai kategori seperti: Infrastruktur (jalan rusak, lampu mati), Lingkungan (sampah, pencemaran), Keamanan (tindak kriminal, gangguan), Fasilitas Umum (kerusakan taman, toilet umum), dan kategori lainnya sesuai kebutuhan masyarakat.",
      category: "reports",
    },
    {
      question: "Bagaimana cara mengubah kata sandi akun?",
      answer:
        "Buka halaman Profil, pilih 'Pengaturan Akun', lalu pilih 'Ubah Kata Sandi'. Masukkan kata sandi lama, kemudian kata sandi baru yang ingin Anda gunakan. Pastikan kata sandi baru memiliki minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.",
      category: "account",
    },
    {
      question: "Bagaimana cara mengatur notifikasi?",
      answer:
        "Buka halaman Profil, pilih 'Preferensi Notifikasi'. Di sana Anda dapat mengatur jenis notifikasi yang ingin diterima (email, push notification), frekuensi notifikasi, dan jam tenang. Anda juga dapat mematikan notifikasi tertentu jika tidak diperlukan.",
      category: "notifications",
    },
    {
      question: "Apakah data pribadi saya aman?",
      answer:
        "Ya, kami sangat menjaga keamanan data pribadi Anda. Data dienkripsi dan disimpan dengan standar keamanan tinggi. Anda dapat mengatur tingkat privasi profil di pengaturan privasi, termasuk siapa yang dapat melihat laporan dan informasi profil Anda.",
      category: "privacy",
    },
    {
      question: "Mengapa aplikasi berjalan lambat?",
      answer:
        "Aplikasi lambat bisa disebabkan oleh koneksi internet yang tidak stabil, cache yang penuh, atau versi aplikasi yang perlu diperbarui. Coba tutup dan buka kembali aplikasi, pastikan koneksi internet stabil, atau perbarui aplikasi ke versi terbaru.",
      category: "technical",
    },
    {
      question: "Bagaimana cara melaporkan bug atau masalah teknis?",
      answer:
        "Anda dapat melaporkan bug melalui formulir kontak di halaman ini dengan memilih kategori 'Masalah Teknis'. Sertakan detail masalah, langkah-langkah yang menyebabkan bug, dan screenshot jika memungkinkan. Tim teknis kami akan segera menindaklanjuti.",
      category: "technical",
    },
    {
      question: "Bisakah saya mengedit laporan yang sudah dikirim?",
      answer:
        "Laporan yang sudah dikirim dan belum diproses masih dapat diedit dalam waktu 24 jam setelah pengiriman. Buka 'Laporan Saya', pilih laporan yang ingin diedit, dan klik tombol 'Edit'. Setelah laporan mulai diproses, editing tidak dapat dilakukan.",
      category: "reports",
    },
    {
      question: "Bagaimana cara menghapus akun saya?",
      answer:
        "Untuk menghapus akun, buka Profile, pilih 'Keamanan', lalu scroll ke bagian bawah dan pilih 'Hapus Akun'. Proses ini akan menghapus semua data Anda secara permanen dan tidak dapat dikembalikan. Pastikan Anda benar-benar ingin menghapus akun sebelum melanjutkan.",
      category: "account",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      toast({
        title: "Formulir Tidak Lengkap",
        description: "Mohon isi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Pesan Terkirim",
        description: "Tim support akan menghubungi Anda dalam 1-2 hari kerja.",
      });
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      });
    } catch (error) {
      toast({
        title: "Gagal Mengirim",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 pb-12">
      <PageHeader title="Bantuan & Dukungan" />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Tutorial Video</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pelajari cara menggunakan aplikasi melalui video panduan
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Lihat Tutorial
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <Book className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Panduan Pengguna</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Dokumentasi lengkap untuk semua fitur aplikasi
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Baca Panduan
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Chat Langsung</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Hubungi support untuk bantuan real-time
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Mulai Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Pertanyaan yang Sering Diajukan
              </CardTitle>
              <CardDescription>
                Temukan jawaban untuk pertanyaan umum tentang Citizen Connect
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* FAQ List */}{" "}
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem
                      key={`faq-${faq.category}-${index}`}
                      value={`item-${faq.category}-${index}`}
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-start gap-3">
                          <Info className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-7">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">
                    Tidak ada FAQ yang cocok
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Coba kata kunci lain atau hubungi support kami
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Common Issues Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Masalah Umum</AlertTitle>
            <AlertDescription>
              Jika mengalami masalah login, pastikan email dan kata sandi benar.
              Untuk masalah teknis, coba refresh halaman atau update aplikasi ke
              versi terbaru.
            </AlertDescription>
          </Alert>
        </div>

        {/* Contact and Support Section */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Hubungi Kami</CardTitle>
              <CardDescription>Tim support siap membantu Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">
                    support@kita.blue
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Telepon</p>
                  <p className="text-sm text-muted-foreground">
                    (021) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Chat Support</p>
                  <p className="text-sm text-muted-foreground">
                    Senin-Jumat, 09:00-17:00
                  </p>
                </div>
              </div>

              <Separator />

              <Button className="w-full" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mulai Chat Sekarang
              </Button>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Kirim Pesan</CardTitle>
              <CardDescription>
                Kirimkan pertanyaan atau masalah Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subjek</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    placeholder="Ringkasan masalah atau pertanyaan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    placeholder="Jelaskan pertanyaan atau masalah Anda secara detail..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Pesan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Sumber Daya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
              >
                <FileText className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Panduan Lengkap</p>
                  <p className="text-sm text-muted-foreground">
                    Dokumentasi penggunaan aplikasi
                  </p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
              >
                <Video className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Tutorial Video</p>
                  <p className="text-sm text-muted-foreground">
                    Pelajari fitur melalui video
                  </p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
              >
                <AlertCircle className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Status Sistem</p>
                  <p className="text-sm text-muted-foreground">
                    Cek status server dan layanan
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
