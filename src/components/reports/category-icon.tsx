"use client";

import type { Category } from "@/types/report";

interface CategoryIconProps {
  category: Category;
  className?: string;
}

export function CategoryIcon({ category, className = "" }: CategoryIconProps) {
  if (category.icon) {
    const Icon = category.icon;
    return <Icon className={className} />;
  }
  return null;
}