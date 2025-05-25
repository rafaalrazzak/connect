import { cn } from "@/lib/utils";

interface ColorSwatch {
	name: string;
	value: string;
	textColor: string;
	description: string;
}

const colors: ColorSwatch[] = [
	{
		name: "primary",
		value: "hsl(var(--primary))",
		textColor: "text-primary-foreground",
		description: "Warna utama untuk tombol dan elemen interaktif penting",
	},
	{
		name: "secondary",
		value: "hsl(var(--secondary))",
		textColor: "text-secondary-foreground",
		description: "Warna sekunder untuk elemen yang kurang menonjol",
	},
	{
		name: "accent",
		value: "hsl(var(--accent))",
		textColor: "text-accent-foreground",
		description: "Warna aksen untuk menyoroti elemen tertentu",
	},
	{
		name: "muted",
		value: "hsl(var(--muted))",
		textColor: "text-muted-foreground",
		description: "Warna redup untuk latar belakang dan elemen sekunder",
	},
	{
		name: "destructive",
		value: "hsl(var(--destructive))",
		textColor: "text-destructive-foreground",
		description: "Warna untuk tindakan berbahaya atau peringatan",
	},
	{
		name: "background",
		value: "hsl(var(--background))",
		textColor: "text-foreground",
		description: "Warna latar belakang utama",
	},
	{
		name: "card",
		value: "hsl(var(--card))",
		textColor: "text-card-foreground",
		description: "Warna latar belakang untuk kartu dan panel",
	},
	{
		name: "popover",
		value: "hsl(var(--popover))",
		textColor: "text-popover-foreground",
		description: "Warna latar belakang untuk popover dan dropdown",
	},
	{
		name: "border",
		value: "hsl(var(--border))",
		textColor: "text-foreground",
		description: "Warna untuk border dan pemisah",
	},
];

export default function ColorPalette() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{colors.map((color) => (
				<div key={color.name} className="border rounded-lg overflow-hidden">
					<div
						className={cn("h-24 flex items-end p-4", color.textColor)}
						style={{ backgroundColor: color.value }}
					>
						<div>
							<div className="font-medium">{color.name}</div>
							<div className="text-xs opacity-90">var(--{color.name})</div>
						</div>
					</div>
					<div className="p-4 text-sm">
						<p>{color.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
