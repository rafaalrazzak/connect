interface SpacingItem {
	name: string;
	value: string;
	description: string;
}

const spacingItems: SpacingItem[] = [
	{
		name: "xs",
		value: "0.25rem (4px)",
		description:
			"Digunakan untuk spasi minimal antara elemen yang sangat dekat",
	},
	{
		name: "sm",
		value: "0.5rem (8px)",
		description: "Digunakan untuk spasi kecil antara elemen terkait",
	},
	{
		name: "md",
		value: "1rem (16px)",
		description: "Spasi standar antara elemen",
	},
	{
		name: "lg",
		value: "1.5rem (24px)",
		description: "Digunakan untuk memisahkan bagian terkait",
	},
	{
		name: "xl",
		value: "2rem (32px)",
		description: "Digunakan untuk memisahkan bagian utama",
	},
	{
		name: "2xl",
		value: "3rem (48px)",
		description: "Digunakan untuk pemisahan bagian yang signifikan",
	},
];

export default function SpacingGuide() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{spacingItems.map((item) => (
					<div key={item.name} className="border rounded-lg p-4">
						<div className="flex items-start gap-4">
							<div
								className="bg-primary/10 rounded"
								style={{
									width:
										item.name === "xs"
											? "4px"
											: item.name === "sm"
												? "8px"
												: item.name === "md"
													? "16px"
													: item.name === "lg"
														? "24px"
														: item.name === "xl"
															? "32px"
															: "48px",
									height:
										item.name === "xs"
											? "4px"
											: item.name === "sm"
												? "8px"
												: item.name === "md"
													? "16px"
													: item.name === "lg"
														? "24px"
														: item.name === "xl"
															? "32px"
															: "48px",
								}}
							></div>
							<div>
								<h3 className="font-medium text-sm">{item.name}</h3>
								<p className="text-xs text-muted-foreground">{item.value}</p>
								<p className="text-sm mt-2">{item.description}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="border rounded-lg p-6 mt-8">
				<h3 className="font-medium mb-4">Contoh Penggunaan Spasi</h3>
				<div className="bg-muted/30 p-4 rounded-lg">
					<div className="flex flex-col gap-2">
						<div className="p-2 bg-primary/10 rounded text-center text-sm">
							Elemen 1
						</div>
						<div className="h-4 border-l border-dashed border-primary/40 ml-4"></div>
						<div className="p-2 bg-primary/10 rounded text-center text-sm">
							Elemen 2
						</div>
						<div className="h-8 border-l border-dashed border-primary/40 ml-4"></div>
						<div className="p-2 bg-primary/10 rounded text-center text-sm">
							Elemen 3
						</div>
						<div className="h-16 border-l border-dashed border-primary/40 ml-4"></div>
						<div className="p-2 bg-primary/10 rounded text-center text-sm">
							Elemen 4
						</div>
					</div>
					<div className="mt-4 text-xs text-muted-foreground">
						<p>• gap-2 (0.5rem) antara elemen terkait erat</p>
						<p>• gap-4 (1rem) antara elemen yang berhubungan</p>
						<p>• gap-8 (2rem) antara kelompok elemen</p>
						<p>• gap-16 (4rem) antara bagian utama</p>
					</div>
				</div>
			</div>
		</div>
	);
}
