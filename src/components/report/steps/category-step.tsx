import { Card, CardContent } from "@/components/ui/card";
import { reportCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import React from "react";

interface CategoryStepProps {
	selectedCategory: string | null;
	onSelect: (categoryId: string) => void;
}

export function CategoryStep({
	selectedCategory,
	onSelect,
}: CategoryStepProps) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{reportCategories.map((category) => (
				<Card
					key={category.id}
					className={cn(
						"cursor-pointer transition-all duration-300 hover:shadow-md border-muted/80",
						selectedCategory === category.id
							? "ring-2 ring-primary/50 shadow-md transform scale-[1.02]"
							: "hover:scale-[1.02]",
					)}
					onClick={() => onSelect(category.id)}
				>
					<CardContent className="p-4 flex flex-col items-center justify-center text-center">
						<div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3">
							<category.icon className="h-7 w-7 text-primary" />
						</div>
						<span className="font-medium">{category.name}</span>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
