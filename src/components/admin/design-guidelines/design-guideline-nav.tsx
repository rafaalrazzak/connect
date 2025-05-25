"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavItem {
	title: string;
	href: string;
	children?: NavItem[];
}

const navItems: NavItem[] = [
	{ title: "Pengantar", href: "#pengantar" },
	{ title: "Palet Warna", href: "#warna" },
	{ title: "Tipografi", href: "#tipografi" },
	{ title: "Panduan Spasi", href: "#spasi" },
	{
		title: "Komponen UI",
		href: "#komponen",
		children: [
			{ title: "Button", href: "#button" },
			{ title: "Card", href: "#card" },
			{ title: "Badge", href: "#badge" },
			{ title: "Avatar", href: "#avatar" },
			{ title: "Alert", href: "#alert" },
			{ title: "Input", href: "#input" },
			{ title: "Table", href: "#table" },
			{ title: "Tabs", href: "#tabs" },
		],
	},
	{ title: "Aksesibilitas", href: "#aksesibilitas" },
	{ title: "File Figma", href: "#figma" },
];

export default function DesignGuidelineNav() {
	const [activeSection, setActiveSection] = useState<string>("");

	useEffect(() => {
		const handleScroll = () => {
			const sections = document.querySelectorAll("section[id]");
			const scrollPosition = window.scrollY + 100;

			for (const section of Array.from(sections)) {
				const sectionTop = (section as HTMLElement).offsetTop;
				const sectionId = section.getAttribute("id");

				if (sectionTop <= scrollPosition) {
					setActiveSection(`#${sectionId}`);
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Call once on mount

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<nav className="space-y-1">
			<div className="font-medium text-sm text-muted-foreground mb-2 px-2">
				Navigasi
			</div>
			{navItems.map((item) => (
				<div key={item.href} className="space-y-1">
					<Link
						href={item.href}
						className={cn(
							"block px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors",
							activeSection === item.href
								? "bg-muted font-medium text-foreground"
								: "text-muted-foreground",
						)}
					>
						{item.title}
					</Link>

					{item.children && activeSection.startsWith(item.href) && (
						<div className="ml-4 border-l pl-2 space-y-1">
							{item.children.map((child) => (
								<Link
									key={child.href}
									href={child.href}
									className={cn(
										"block px-2 py-1 text-xs rounded-md hover:bg-muted transition-colors",
										activeSection === child.href
											? "bg-muted font-medium text-foreground"
											: "text-muted-foreground",
									)}
								>
									{child.title}
								</Link>
							))}
						</div>
					)}
				</div>
			))}
		</nav>
	);
}
