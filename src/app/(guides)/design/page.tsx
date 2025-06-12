import { Metadata } from "next";
import { Suspense } from "react";

// Import components efficiently
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import specialized components
import ColorPalette from "@/components/admin/design-guidelines/color-palette";
import ComponentExample from "@/components/admin/design-guidelines/component-example";
import DesignGuidelineNav from "@/components/admin/design-guidelines/design-guideline-nav";
import IconsShowcase from "@/components/admin/design-guidelines/icons-showcase";
import SpacingGuide from "@/components/admin/design-guidelines/spacing-guide";
import TypographyShowcase from "@/components/admin/design-guidelines/typography-showcase";

// Import icons efficiently
import { InfoIcon, DownloadIcon, FileText } from "lucide-react";

// Constants
const METADATA = {
  title: "Panduan Desain | Citizen Connect Admin",
  description: "Panduan desain komprehensif untuk Citizen Connect",
} as const;

const SECTIONS = [
  {
    id: "warna",
    title: "Palet Warna",
    description:
      "Warna-warna berikut digunakan di seluruh aplikasi untuk menciptakan pengalaman yang konsisten dan menarik.",
    component: ColorPalette,
  },
  {
    id: "tipografi",
    title: "Tipografi",
    description:
      "Tipografi yang konsisten membantu menciptakan hierarki visual dan meningkatkan keterbacaan.",
    component: TypographyShowcase,
  },
  {
    id: "spasi",
    title: "Panduan Spasi",
    description:
      "Spasi yang konsisten membantu menciptakan tata letak yang seimbang dan mudah dibaca.",
    component: SpacingGuide,
  },
  {
    id: "icon",
    title: "Icon",
    description:
      "Icon berikut tersedia untuk digunakan di seluruh aplikasi. Menggunakan icon yang konsisten membantu pengguna dalam mengenali aksi dan fitur.",
    component: IconsShowcase,
  },
] as const;

const TAB_CONFIG = [
  { value: "dasar", label: "Dasar" },
  { value: "formulir", label: "Formulir" },
  { value: "data", label: "Data" },
  { value: "overlay", label: "Overlay" },
  { value: "peta", label: "Peta & Lokasi" },
  { value: "navigasi", label: "Navigasi" },
] as const;

// Metadata
export const metadata: Metadata = METADATA;

// Components
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="w-1.5 h-6 bg-primary rounded-full" />
    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
  </div>
);

const IntroSection = () => (
  <section
    id="pengantar"
    className="bg-gradient-to-r from-primary/10 to-background rounded-lg p-6 md:p-8"
  >
    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
      Panduan Desain
    </h1>
    <p className="text-muted-foreground mb-6 max-w-3xl">
      Dokumentasi komprehensif untuk memastikan konsistensi desain di seluruh
      platform Citizen Connect.
    </p>

    <Alert className="max-w-3xl bg-background/80 backdrop-blur-sm">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Hai, Selamat Datang!</AlertTitle>
      <AlertDescription>
        Panduan ini akan membantu kamu memahami prinsip desain dan komponen UI
        yang digunakan di Citizen Connect. Gunakan panduan ini sebagai referensi
        saat mengembangkan fitur baru.
      </AlertDescription>
    </Alert>
  </section>
);

const GuidelineSection = ({
  section,
}: {
  section: (typeof SECTIONS)[number];
}) => (
  <section id={section.id} className="scroll-mt-16">
    <SectionHeader title={section.title} />
    <p className="text-muted-foreground mb-6 max-w-3xl">
      {section.description}
    </p>
    <Suspense fallback={<div>Loading...</div>}>
      <section.component />
    </Suspense>
  </section>
);

const ComponentsSection = () => (
  <section id="komponen" className="scroll-mt-16">
    <SectionHeader title="Komponen UI" />
    <p className="text-muted-foreground mb-6 max-w-3xl">
      Komponen berikut digunakan di seluruh aplikasi untuk menciptakan
      pengalaman yang konsisten.
    </p>

    <Tabs defaultValue="dasar" className="space-y-6">
      <div className="relative rounded-lg overflow-x-auto pb-1">
        <TabsList className="w-max min-w-full px-1 inline-flex">
          {TAB_CONFIG.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="dasar" className="space-y-8 mt-6">
        {/* Basic components examples */}
      </TabsContent>

      <TabsContent value="formulir" className="space-y-8 mt-6">
        {/* Form components examples */}
      </TabsContent>

      {/* Other tab contents... */}
    </Tabs>
  </section>
);

const AccessibilitySection = () => {
  const accessibilityCards = [
    {
      title: "Kontras Warna",
      content:
        "Pastikan semua teks memiliki rasio kontras minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar.",
    },
    {
      title: "Navigasi Keyboard",
      content: "Semua interaksi harus dapat diakses menggunakan keyboard saja.",
    },
    {
      title: "Teks Alternatif",
      content: "Semua gambar harus memiliki teks alternatif yang deskriptif.",
    },
    {
      title: "Struktur Semantik",
      content: "Gunakan elemen HTML yang sesuai dengan makna kontennya.",
    },
  ];

  return (
    <section id="aksesibilitas" className="scroll-mt-16">
      <SectionHeader title="Aksesibilitas" />
      <p className="text-muted-foreground mb-6 max-w-3xl">
        Aksesibilitas sangat penting untuk memastikan aplikasi dapat digunakan
        oleh semua orang.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {accessibilityCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{card.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const FigmaSection = () => (
  <section id="figma" className="scroll-mt-16">
    <SectionHeader title="File Figma" />
    <p className="text-muted-foreground mb-6 max-w-3xl">
      Berikut adalah file Figma yang berisi semua komponen dan pola desain yang
      digunakan di Citizen Connect.
    </p>

    <Card className="bg-gradient-to-br from-background to-muted/50">
      <CardContent className="p-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <FileText className="h-10 w-10" />
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
);

// Main component
export default function DesignGuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8 pb-10 max-w-7xl">
      <IntroSection />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation */}
        <div className="lg:w-64 xl:w-72 shrink-0">
          <div className="lg:sticky lg:top-24">
            <Suspense fallback={<div>Loading navigation...</div>}>
              <DesignGuidelineNav />
            </Suspense>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-12">
          {/* Render guideline sections */}
          {SECTIONS.map((section) => (
            <GuidelineSection key={section.id} section={section} />
          ))}

          <ComponentsSection />
          <AccessibilitySection />
          <FigmaSection />
        </div>
      </div>
    </div>
  );
}
