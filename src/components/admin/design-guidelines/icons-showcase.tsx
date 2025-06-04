"use client";
import { Icon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Group icons by category for better organization
const iconCategories = {
  Navigation: [
    "chevronDown",
    "chevronLeft",
    "chevronRight",
    "chevronUp",
    "home",
    "menu",
  ],
  Actions: [
    "edit",
    "plus",
    "search",
    "send",
    "settings",
    "logOut",
    "trash2",
    "refreshCcw",
    "filter",
  ],
  Status: [
    "alertTriangle",
    "checkCircle",
    "info",
    "xCircle",
    "loader",
    "clock",
  ],
  Content: ["fileText", "image", "messageCircle", "thumbsUp", "moreHorizontal"],
  Categories: [
    "building",
    "car",
    "construction",
    "lightbulb",
    "shield",
    "trees",
    "wifi",
  ],
  Other: ["helpCircle", "mapPin", "user", "x"],
} as const;

export default function IconsShowcase() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter icons based on search term
  const filteredCategories = Object.entries(iconCategories)
    .map(([category, icons]) => {
      const filteredIcons = icons.filter((icon) =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { category, icons: filteredIcons };
    })
    .filter(({ icons }) => icons.length > 0);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Input
          placeholder="Cari icon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredCategories.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          Tidak ada icon yang cocok dengan pencarian.
        </div>
      )}

      {filteredCategories.map(({ category, icons }) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-medium">{category}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {icons.map((iconName) => {
              return (
                <div
                  key={iconName}
                  className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-md border hover:bg-muted transition-colors"
                >
                  <div className="bg-background p-2 rounded-md mb-2">
                    <Icon name={iconName} className="h-6 w-6" />
                  </div>
                  <span className="text-sm text-center truncate w-full">
                    {iconName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium mb-2">Penggunaan Icon</h4>
        <pre
          className={cn(
            "p-4 rounded-md bg-muted font-mono text-sm overflow-auto",
            "max-w-full"
          )}
        >
          {`// Import dari 'icons.tsx'
import { Icon } from "@/components/icons";

// Gunakan component Icon dengan nama
<Icon name="checkCircle" className="h-4 w-4" />
`}
        </pre>
      </div>
    </div>
  );
}
