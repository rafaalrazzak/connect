import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface ComponentExampleProps {
	id: string;
	title: string;
	description: string;
	children: ReactNode;
	code?: string;
}

export default function ComponentExample({
	id,
	title,
	description,
	children,
	code,
}: ComponentExampleProps) {
	return (
		<Card id={id} className="scroll-mt-6">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="preview">
					<TabsList className="mb-4">
						<TabsTrigger value="preview">Preview</TabsTrigger>
						<TabsTrigger value="usage">Panduan Penggunaan</TabsTrigger>
						{code && <TabsTrigger value="code">Kode</TabsTrigger>}
					</TabsList>

					<TabsContent value="preview" className="p-4 border rounded-md">
						{children}
					</TabsContent>

					<TabsContent value="usage">
						<div className="p-4 border rounded-md space-y-4">
							<h4 className="font-medium">Kapan menggunakan {title}?</h4>
							<ul className="list-disc pl-5 space-y-2 text-sm">
								<li>
									Gunakan {title.toLowerCase()} untuk menampilkan informasi yang{" "}
									{title === "Button"
										? "memerlukan tindakan"
										: "perlu dikelompokkan"}
									.
								</li>
								<li>
									Pastikan untuk memberikan label yang jelas dan deskriptif.
								</li>
								<li>
									Gunakan varian yang sesuai dengan tingkat kepentingan dan
									konteks.
								</li>
							</ul>

							<h4 className="font-medium mt-6">Praktik Terbaik</h4>
							<ul className="list-disc pl-5 space-y-2 text-sm">
								<li>
									Jaga konsistensi dalam penggunaan {title.toLowerCase()} di
									seluruh aplikasi.
								</li>
								<li>
									Pastikan {title.toLowerCase()} mudah diakses dengan keyboard
									dan pembaca layar.
								</li>
								<li>
									Gunakan warna yang kontras untuk memastikan keterbacaan.
								</li>
							</ul>
						</div>
					</TabsContent>

					{code && (
						<TabsContent value="code">
							<div className="p-4 border rounded-md">
								<pre className="text-sm overflow-x-auto p-4 bg-muted rounded-md">
									<code>{code}</code>
								</pre>
							</div>
						</TabsContent>
					)}
				</Tabs>
			</CardContent>
		</Card>
	);
}
