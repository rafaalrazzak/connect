import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ReportSuccess() {
	// Generate a random report ID
	const reportId = `CC${Math.floor(Math.random() * 10000000)
		.toString()
		.padStart(7, "0")}`;

	return (
		<div className="container flex flex-col items-center justify-center px-4 py-12 text-center space-y-8">
			<div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
				<CheckCircle2 className="h-10 w-10 text-green-600" />
			</div>

			<div className="space-y-2 max-w-md">
				<h1 className="text-2xl font-bold">Laporan Berhasil Dikirim!</h1>
				<p className="text-muted-foreground">
					Terima kasih atas kontribusimu! Laporan kamu sudah diteruskan ke pihak
					yang berwenang.
				</p>
			</div>

			<Card className="w-full max-w-md p-6 border-green-200 bg-green-50/50 shadow-sm">
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold">Detail Laporan</h2>
						<Badge
							variant="outline"
							className="bg-green-100 text-green-800 border-green-200 shadow-sm"
						>
							Terkirim
						</Badge>
					</div>

					<div className="space-y-3 text-left">
						<div className="flex justify-between border-b border-green-100 pb-2">
							<span className="text-muted-foreground">ID Laporan:</span>
							<span className="font-medium">{reportId}</span>
						</div>
						<div className="flex justify-between border-b border-green-100 pb-2">
							<span className="text-muted-foreground">Dikirim pada:</span>
							<span>{new Date().toLocaleDateString()}</span>
						</div>
						<div className="flex justify-between border-b border-green-100 pb-2">
							<span className="text-muted-foreground">Estimasi respons:</span>
							<span>24-48 jam</span>
						</div>
					</div>

					<div className="text-sm bg-white p-4 rounded-lg border border-green-200 shadow-sm">
						<p className="text-green-800">
							Kamu akan mendapat notifikasi seiring perkembangan laporan ini.
						</p>
					</div>
				</div>
			</Card>

			<div className="flex flex-col w-full max-w-md space-y-3">
				<Link href={`/report/${reportId}`}>
					<Button className="w-full rounded-full">
						Lihat Detail Laporan
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</Link>
				<Link href="/">
					<Button variant="outline" className="w-full rounded-full">
						Kembali ke Beranda
					</Button>
				</Link>
			</div>
		</div>
	);
}
