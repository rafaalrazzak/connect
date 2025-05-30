import type { StepConfig } from "@/types/report";
import {
	CheckCircle2,
	ClipboardList,
	ImagePlus,
	MapPin,
	Tag,
} from "lucide-react";

/**
 * Step configuration for report creation process
 */
export const STEPS: StepConfig[] = [
	{
		id: 1,
		title: "Kategori",
		icon: Tag,
		description: "Pilih jenis masalahnya",
		tip: "Kategori yang tepat membantu penanganan lebih cepat",
	},
	{
		id: 2,
		title: "Detail",
		icon: ClipboardList,
		description: "Ceritakan masalahnya",
		tip: "Detail jelas memudahkan petugas mengatasi masalah",
	},
	{
		id: 3,
		title: "Foto",
		icon: ImagePlus,
		description: "Tambahkan foto",
		tip: "Foto membantu petugas memahami situasi di lapangan",
	},
	{
		id: 4,
		title: "Lokasi",
		icon: MapPin,
		description: "Tentukan lokasinya",
		tip: "Lokasi akurat membantu petugas menemukan masalah",
	},
	{
		id: 5,
		title: "Kirim",
		icon: CheckCircle2,
		description: "Tinjau & kirim",
		tip: "Pastikan informasi sudah benar sebelum mengirim",
	},
];
