import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	AlertTriangle,
	Camera,
	CheckCircle,
	Clock,
	FileText,
	MapPin,
	Pencil,
} from "lucide-react";

interface ReviewStepProps {
	formData: {
		title: string;
		description: string;
		location: string;
		anonymous: boolean;
		urgency: string;
	};
	selectedCategory: string | null;
	previewImages: string[];
	onEditStep: (step: number) => void;
}

export function ReviewStep({
	formData,
	selectedCategory,
	previewImages,
	onEditStep,
}: ReviewStepProps) {
	// Map kategori ID ke nama yang mudah dibaca
	const getCategoryName = (id: string | null) => {
		const categories: Record<string, string> = {
			road: "Masalah Jalan",
			trash: "Sampah & Puing",
			lighting: "Penerangan Jalan",
			graffiti: "Vandalisme",
		};
		return id ? categories[id] || id : "Tidak Diketahui";
	};

	// Map urgency ke badge styling
	const getUrgencyBadge = (urgency: string) => {
		switch (urgency) {
			case "low":
				return {
					label: "Prioritas Rendah",
					className:
						"bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-500/30",
				};
			case "medium":
				return {
					label: "Prioritas Sedang",
					className:
						"bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-500/30",
				};
			case "high":
				return {
					label: "Prioritas Tinggi",
					className:
						"bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-500/30",
				};
			default:
				return {
					label: "Prioritas Sedang",
					className:
						"bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-500/30",
				};
		}
	};

	const urgencyBadge = getUrgencyBadge(formData.urgency);

	return (
		<div className="space-y-8">
			{/* Status header */}
			<div className="bg-card rounded-lg px-5 py-4 border border-emerald-200 dark:border-emerald-900/50 shadow-sm flex items-center gap-3">
				<div className="bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-full">
					<CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
				</div>
				<div>
					<h3 className="font-medium text-card-foreground">Siap Dikirim</h3>
					<p className="text-sm text-muted-foreground">
						Silakan tinjau detail laporan kamu
					</p>
				</div>
			</div>

			{/* Main content */}
			<div className="space-y-6">
				{/* Report header */}
				<div className="space-y-4">
					<div className="flex justify-between items-start">
						<h2 className="text-xl font-semibold text-foreground">
							{formData.title}
						</h2>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onEditStep(2)}
							className="h-8 w-8 rounded-full p-0 hover:bg-muted"
						>
							<Pencil className="h-4 w-4 text-muted-foreground" />
							<span className="sr-only">Edit judul</span>
						</Button>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-500/30">
							{getCategoryName(selectedCategory)}
						</span>
						<span
							className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${urgencyBadge.className}`}
						>
							{urgencyBadge.label}
						</span>
						{formData.anonymous && (
							<span className="inline-flex items-center rounded-md bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/10 dark:ring-slate-700/30">
								Anonim
							</span>
						)}
					</div>
				</div>

				{/* Description */}
				<div className="bg-card rounded-lg overflow-hidden border border-border">
					<div className="px-5 py-3 bg-muted flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FileText className="w-4 h-4 text-muted-foreground" />
							<h4 className="font-medium text-sm text-foreground">Deskripsi</h4>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onEditStep(2)}
							className="h-7 px-2 text-xs hover:bg-background/80"
						>
							<Pencil className="h-3 w-3 mr-1" />
							Ubah
						</Button>
					</div>
					<div className="p-5 bg-card">
						<p className="text-card-foreground leading-relaxed">
							{formData.description}
						</p>
					</div>
				</div>

				{/* Photos */}
				{previewImages.length > 0 && (
					<div className="bg-card rounded-lg overflow-hidden border border-border">
						<div className="px-5 py-3 bg-muted flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Camera className="w-4 h-4 text-muted-foreground" />
								<h4 className="font-medium text-sm text-foreground">Foto</h4>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onEditStep(3)}
								className="h-7 px-2 text-xs hover:bg-background/80"
							>
								<Pencil className="h-3 w-3 mr-1" />
								Ubah
							</Button>
						</div>
						<div className="p-5 bg-card">
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
								{previewImages.map((image, index) => (
									<div
										key={`img-${image}`}
										className="aspect-square rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
									>
										<img
											src={image}
											alt={`Foto laporan ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Location */}
				<div className="bg-card rounded-lg overflow-hidden border border-border">
					<div className="px-5 py-3 bg-muted flex items-center justify-between">
						<div className="flex items-center gap-2">
							<MapPin className="w-4 h-4 text-muted-foreground" />
							<h4 className="font-medium text-sm text-foreground">Lokasi</h4>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onEditStep(4)}
							className="h-7 px-2 text-xs hover:bg-background/80"
						>
							<Pencil className="h-3 w-3 mr-1" />
							Ubah
						</Button>
					</div>
					<div className="p-5 bg-card">
						<p className="text-card-foreground">{formData.location}</p>
					</div>
				</div>

				{/* Response time indicator */}
				<div className="px-5 py-4 rounded-lg bg-muted border border-border flex items-center gap-3">
					<div className="bg-card p-1.5 rounded-full shadow-sm">
						<Clock className="w-4 h-4 text-muted-foreground" />
					</div>
					<span className="text-sm text-muted-foreground">
						Estimasi waktu tanggapan:{" "}
						<span className="font-medium text-foreground">2-3 hari kerja</span>
					</span>
				</div>

				{/* Warning note */}
				<div className="rounded-lg border border-dashed border-amber-300 dark:border-amber-700/50 bg-gradient-to-r from-amber-50/80 to-amber-50/30 dark:from-amber-950/20 dark:to-background/20 p-4">
					<div className="flex gap-3">
						<div className="mt-1 flex-shrink-0">
							<AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
						</div>
						<div>
							<h5 className="text-sm font-medium text-amber-800 dark:text-amber-300">
								Pemberitahuan penting
							</h5>
							<p className="text-sm mt-1 text-amber-700 dark:text-amber-400/90">
								Laporan ini akan dikirim ke Dinas terkait. Untuk keadaan darurat
								yang membutuhkan bantuan segera, silakan hubungi 112.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
