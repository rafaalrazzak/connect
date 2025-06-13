import CategoryCarousel from "@/components/category-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export function CategoriesSection() {
  return (
    <Card>
      <SectionHeader title="Kategori Laporan" />
      <CardContent>
        <CategoryCarousel />
      </CardContent>
    </Card>
  );
}
