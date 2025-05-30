import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/report";
import React from "react";

interface CategoryStepProps {
	selectedCategory: Pick<Category, "id" | "name"> | null;
	onSelect: (category: Pick<Category, "id" | "name"> | null) => void;
}

export function CategoryStep({
	selectedCategory,
	onSelect,
}: CategoryStepProps) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{categories.map((category: Category) => (
				<button
					type="button"
					onClick={() => onSelect(category)}
					key={category.id}
				>
					<Card
						key={category.id}
						className={cn(
							"cursor-pointer transition-all duration-300 hover:shadow-md border-muted/80",
							selectedCategory?.id === category.id
								? "ring-2 ring-primary/50 shadow-md transform scale-[1.02]"
								: "hover:scale-[1.02]",
						)}
						onClick={() =>
							onSelect({
								...category,
							})
						}
					>
						<CardContent className="p-4 flex flex-col items-center justify-center text-center">
							<div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3">
								<category.icon className="h-7 w-7 text-primary" />
							</div>
							<span className="font-medium">{category.name}</span>
						</CardContent>
					</Card>
				</button>
			))}
		</div>
	);
}
