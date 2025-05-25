import { cn } from "@/lib/utils";

interface TypographyItem {
	name: string;
	className: string;
	description: string;
}

const typographyItems: TypographyItem[] = [
	{
		name: "Heading 1",
		className: "text-4xl font-extrabold tracking-tight",
		description: "Digunakan untuk judul utama halaman",
	},
	{
		name: "Heading 2",
		className: "text-3xl font-bold tracking-tight",
		description: "Digunakan untuk judul bagian utama",
	},
	{
		name: "Heading 3",
		className: "text-2xl font-bold tracking-tight",
		description: "Digunakan untuk sub-bagian",
	},
	{
		name: "Heading 4",
		className: "text-xl font-semibold",
		description: "Digunakan untuk judul komponen",
	},
	{
		name: "Large Text",
		className: "text-lg",
		description: "Digunakan untuk teks yang perlu ditonjolkan",
	},
	{
		name: "Body Text",
		className: "text-base",
		description: "Digunakan untuk teks konten utama",
	},
	{
		name: "Small Text",
		className: "text-sm",
		description: "Digunakan untuk teks sekunder atau keterangan",
	},
	{
		name: "Muted Text",
		className: "text-sm text-muted-foreground",
		description: "Digunakan untuk teks yang kurang penting",
	},
	{
		name: "Lead Text",
		className: "text-xl text-muted-foreground",
		description: "Digunakan untuk paragraf pembuka atau ringkasan",
	},
];

export default function TypographyShowcase() {
	return (
		<div className="space-y-8">
			{typographyItems.map((item) => (
				<div key={item.name} className="border rounded-lg p-6">
					<div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
						<div className="md:w-1/3">
							<h3 className="font-medium text-sm mb-1">{item.name}</h3>
							<p className="text-xs text-muted-foreground">{item.className}</p>
						</div>
						<div className="md:w-2/3">
							<p className={cn(item.className)}>
								Ini adalah contoh {item.name.toLowerCase()}
							</p>
							<p className="text-sm text-muted-foreground mt-2">
								{item.description}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
