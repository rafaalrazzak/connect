"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { useReportDrawer } from "@/contexts/report-drawer-context";
import { categories } from "@/lib/mock-data";
import { useState } from "react";
import { CardIcon } from "./ui/card-icon";

export default function CategoryCarousel() {
	const { openDrawer } = useReportDrawer();
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const handleCategoryClick = (categoryId: string) => {
		setActiveCategory(categoryId);
		openDrawer({
			prefillData: { category: categoryId },
		});
	};

	return (
		<Carousel
			opts={{
				align: "start",
				loop: false,
				dragFree: true,
			}}
			className="w-full"
		>
			<CarouselContent className="-ml-4">
				{categories.map((category) => (
					<CarouselItem
						key={category.id}
						className="pl-4 basis-1/2 md:basis-1/3"
					>
						<div className="p-1 size-full">
							<CardIcon
								iconName={category.iconName}
								label={category.name}
								onClick={() => handleCategoryClick(category.id)}
								active={activeCategory === category.id}
								variant="outline"
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
