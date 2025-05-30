import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/mock-data";
import Link from "next/link";

export default function CategoryGrid() {
  // Only show the first 4 categories for simplicity
  const displayCategories = categories.slice(0, 4);

  return (
    <div className="grid grid-cols-4 gap-3">
      {displayCategories.map((category) => (
        <Link
          key={category.id}
          href={`/report/new?category=${category.id}`}
          className="block"
        >
          <Card className="hover:shadow-md transition-shadow duration-200 h-full">
            <CardContent className="p-2 flex flex-col items-center justify-center text-center h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <category.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium line-clamp-1">
                {category.name}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
