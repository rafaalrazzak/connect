"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useReportDrawer } from "@/contexts/report-drawer-context";
import { categories } from "@/lib/mock-data";

export default function CategoryCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { openDrawer } = useReportDrawer();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -200 : 200;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="snap-start flex-shrink-0 first:pl-0 last:pr-0"
            style={{ width: "120px" }}
          >
            <Card
              className="w-full h-full hover:shadow-md transition-all duration-300 border-muted/80 cursor-pointer"
              onClick={() =>
                openDrawer({
                  prefillData: { category: category.id },
                })
              }
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Scroll buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background shadow-md rounded-full h-8 w-8 hidden md:flex border-muted/80"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background shadow-md rounded-full h-8 w-8 hidden md:flex border-muted/80"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
