import {
	Building,
	Car,
	Construction,
	Lightbulb,
	Shield,
	Trash2,
	Trees,
	Wifi,
} from "lucide-react";

export const reportCategories = [
	{
		id: "road-damage",
		name: "Kerusakan Jalan",
		icon: Construction,
		color: "#ef4444",
	},
	{
		id: "street-lights",
		name: "Lampu Jalan",
		icon: Lightbulb,
		color: "#f59e0b",
	},
	{
		id: "waste-issues",
		name: "Masalah Sampah",
		icon: Trash2,
		color: "#10b981",
	},
	{
		id: "public-order",
		name: "Ketertiban Umum",
		icon: Shield,
		color: "#3b82f6",
	},
	{
		id: "public-facilities",
		name: "Fasilitas Umum",
		icon: Building,
		color: "#8b5cf6",
	},
	{
		id: "traffic",
		name: "Lalu Lintas",
		icon: Car,
		color: "#f97316",
	},
	{
		id: "environment",
		name: "Lingkungan",
		icon: Trees,
		color: "#22c55e",
	},
	{
		id: "utilities",
		name: "Utilitas",
		icon: Wifi,
		color: "#06b6d4",
	},
];

export const reports = [
	{
		id: "LP12345678",
		title: "Jalan berlubang di depan sekolah",
		description:
			"Ada lubang besar di jalan yang sangat berbahaya untuk kendaraan dan pejalan kaki, terutama anak-anak sekolah.",
		location: "Jl. Pendidikan No. 15, Jakarta Selatan",
		date: "15 Mei 2025",
		status: "waiting",
		category: "Kerusakan Jalan",
		reporter: "Ahmad Rizki",
		imageUrl: "/placeholder.svg?height=200&width=300",
		timeline: [
			{
				title: "Laporan diterima",
				description: "Laporan kamu sudah masuk ke sistem kami",
				date: "15 Mei 2025, 09:30",
			},
			{
				title: "Sedang ditinjau",
				description: "Tim kami sedang meninjau laporan kamu",
				date: "15 Mei 2025, 14:20",
			},
			{
				title: "Diteruskan ke dinas terkait",
				description: "Laporan diteruskan ke Dinas Pekerjaan Umum",
				date: "16 Mei 2025, 08:15",
			},
			{
				title: "Tim lapangan ditugaskan",
				description: "Tim perbaikan jalan sudah ditugaskan",
				date: "",
			},
			{
				title: "Perbaikan selesai",
				description: "Masalah sudah diperbaiki dan diselesaikan",
				date: "",
			},
		],
		currentStep: 2,
		comments: [
			{
				user: "Dinas PU Jakarta Selatan",
				text: "Terima kasih atas laporannya. Tim kami akan segera meninjau lokasi dan melakukan perbaikan dalam 3-5 hari kerja.",
				date: "16 Mei 2025, 10:30",
			},
		],
	},
	{
		id: "LP87654321",
		title: "Lampu jalan mati total",
		description:
			"Lampu jalan di area ini sudah mati sejak seminggu yang lalu, membuat jalan sangat gelap di malam hari.",
		location: "Jl. Mawar Raya, Depok",
		date: "14 Mei 2025",
		status: "processing",
		category: "Lampu Jalan",
		reporter: "Siti Nurhaliza",
		imageUrl: "/placeholder.svg?height=200&width=300",
		timeline: [
			{
				title: "Laporan diterima",
				description: "Laporan kamu sudah masuk ke sistem kami",
				date: "14 Mei 2025, 19:45",
			},
			{
				title: "Sedang ditinjau",
				description: "Tim kami sedang meninjau laporan kamu",
				date: "15 Mei 2025, 08:00",
			},
			{
				title: "Diteruskan ke dinas terkait",
				description: "Laporan diteruskan ke PLN Wilayah Depok",
				date: "15 Mei 2025, 11:30",
			},
			{
				title: "Tim lapangan ditugaskan",
				description: "Teknisi PLN sedang menuju lokasi",
				date: "16 Mei 2025, 07:00",
			},
			{
				title: "Perbaikan selesai",
				description: "Lampu jalan sudah diperbaiki dan menyala normal",
				date: "",
			},
		],
		currentStep: 3,
		comments: [
			{
				user: "PLN Depok",
				text: "Kami sudah menerima laporan dan akan mengirim teknisi untuk memperbaiki lampu jalan tersebut hari ini.",
				date: "16 Mei 2025, 07:15",
			},
		],
	},
	{
		id: "LP23456789",
		title: "Tumpukan sampah tidak diangkut",
		description:
			"Sampah di TPS ini sudah menumpuk tinggi dan mulai menimbulkan bau tidak sedap serta mengundang lalat.",
		location: "TPS Jl. Melati, Bandung",
		date: "13 Mei 2025",
		status: "completed",
		category: "Masalah Sampah",
		reporter: "Budi Santoso",
		imageUrl: "/placeholder.svg?height=200&width=300",
		timeline: [
			{
				title: "Laporan diterima",
				description: "Laporan kamu sudah masuk ke sistem kami",
				date: "13 Mei 2025, 16:20",
			},
			{
				title: "Sedang ditinjau",
				description: "Tim kami sedang meninjau laporan kamu",
				date: "14 Mei 2025, 07:30",
			},
			{
				title: "Diteruskan ke dinas terkait",
				description: "Laporan diteruskan ke Dinas Kebersihan Bandung",
				date: "14 Mei 2025, 09:45",
			},
			{
				title: "Tim lapangan ditugaskan",
				description: "Truk sampah sudah dikirim ke lokasi",
				date: "14 Mei 2025, 13:00",
			},
			{
				title: "Perbaikan selesai",
				description: "Sampah sudah diangkut dan area sudah bersih",
				date: "14 Mei 2025, 16:30",
			},
		],
		currentStep: 4,
		comments: [
			{
				user: "Dinas Kebersihan Bandung",
				text: "Sampah sudah berhasil diangkut. Terima kasih atas laporannya yang membantu menjaga kebersihan kota.",
				date: "14 Mei 2025, 17:00",
			},
			{
				user: "Budi Santoso",
				text: "Terima kasih, sekarang area sudah bersih dan tidak bau lagi!",
				date: "14 Mei 2025, 18:15",
			},
		],
	},
];
