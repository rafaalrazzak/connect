"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { reportCategories } from "@/lib/data";
import { AlertTriangle, Camera, ChevronLeft, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewReport() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialCategory = searchParams.get("category");

	const [step, setStep] = useState(1);
	const [progress, setProgress] = useState(25);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		initialCategory,
	);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		// Update progress based on step
		setProgress(step * 25);
	}, [step]);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			router.push("/report/success");
		}, 1500);
	};

	const nextStep = () => {
		if (step < 4) {
			setStep(step + 1);
			window.scrollTo(0, 0);
		}
	};

	const prevStep = () => {
		if (step > 1) {
			setStep(step - 1);
			window.scrollTo(0, 0);
		} else {
			router.push("/");
		}
	};

	return (
		<div className="container px-4 py-6 space-y-6">
			<div className="flex items-center space-x-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={prevStep}
					className="rounded-full"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-xl font-bold">Buat Laporan</h1>
			</div>

			<div className="space-y-2">
				<Progress value={progress} className="h-2 rounded-full" />
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>Langkah {step} dari 4</span>
					<span>{progress}% Selesai</span>
				</div>
			</div>

			{step === 1 && (
				<div className="space-y-6">
					<div>
						<h2 className="text-lg font-medium">Pilih Kategori Laporan</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Pilih kategori yang paling sesuai dengan masalah yang ingin kamu
							laporkan.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{reportCategories.map((category) => (
							<Card
								key={category.id}
								className={`cursor-pointer transition-all duration-300 hover:shadow-md border-muted/80 ${
									selectedCategory === category.id
										? "ring-2 ring-primary/50 shadow-md transform scale-[1.02]"
										: "hover:scale-[1.02]"
								}`}
								onClick={() => setSelectedCategory(category.id)}
							>
								<CardContent className="p-4 flex flex-col items-center justify-center text-center">
									<div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3">
										<category.icon className="h-7 w-7 text-primary" />
									</div>
									<span className="font-medium">{category.name}</span>
								</CardContent>
							</Card>
						))}
					</div>

					<Button
						className="w-full rounded-full"
						disabled={!selectedCategory}
						onClick={nextStep}
					>
						Lanjutkan
					</Button>
				</div>
			)}

			{step === 2 && (
				<div className="space-y-6">
					<div>
						<h2 className="text-lg font-medium">Detail Laporan</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Ceritakan detail masalah yang ingin kamu laporkan.
						</p>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Judul</Label>
							<Input
								id="title"
								name="title"
								placeholder="Deskripsi singkat masalah"
								value={formData.title}
								onChange={handleInputChange}
								required
								className="rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Deskripsi</Label>
							<Textarea
								id="description"
								name="description"
								placeholder="Jelaskan detail masalah yang kamu temui"
								className="min-h-[120px] rounded-lg"
								value={formData.description}
								onChange={handleInputChange}
								required
							/>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1 rounded-full"
							onClick={prevStep}
						>
							Kembali
						</Button>
						<Button
							className="flex-1 rounded-full"
							disabled={!formData.title || !formData.description}
							onClick={nextStep}
						>
							Lanjutkan
						</Button>
					</div>
				</div>
			)}

			{step === 3 && (
				<div className="space-y-6">
					<div>
						<h2 className="text-lg font-medium">Tambah Foto</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Upload foto masalah untuk membantu petugas memahami situasi dengan
							lebih baik.
						</p>
					</div>

					<div className="border-2 border-dashed rounded-lg p-4 text-center border-muted">
						{previewImage ? (
							<div className="space-y-3">
								<img
									src={previewImage || "/placeholder.svg"}
									alt="Preview"
									className="mx-auto max-h-[200px] rounded-lg shadow-md"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="rounded-full"
									onClick={() => setPreviewImage(null)}
								>
									Change Photo
								</Button>
							</div>
						) : (
							<div className="py-8">
								<Camera className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
								<p className="text-sm text-muted-foreground mb-4">
									Upload a photo of the issue
								</p>
								<div className="flex justify-center">
									<Label
										htmlFor="photo-upload"
										className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full text-sm font-medium transition-colors"
									>
										Pilih Foto
									</Label>
									<Input
										id="photo-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleImageUpload}
									/>
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1 rounded-full"
							onClick={prevStep}
						>
							Kembali
						</Button>
						<Button className="flex-1 rounded-full" onClick={nextStep}>
							{previewImage ? "Lanjutkan" : "Lewati dulu"}
						</Button>
					</div>
				</div>
			)}

			{step === 4 && (
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<h2 className="text-lg font-medium">Lokasi</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Tentukan di mana lokasi masalah ini terjadi.
						</p>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="location">Alamat</Label>
							<div className="relative">
								<Input
									id="location"
									name="location"
									placeholder="Masukkan alamat lokasi"
									value={formData.location}
									onChange={handleInputChange}
									required
									className="rounded-lg pl-10"
								/>
								<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							</div>
						</div>

						<div className="h-[200px] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
							<MapPin className="h-6 w-6 text-muted-foreground" />
							<span className="text-sm text-muted-foreground ml-2">
								Lokasi di peta
							</span>
						</div>

						<div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-lg">
							<AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
							<p className="text-sm">
								Pastikan lokasi yang kamu berikan akurat agar petugas bisa
								merespons dengan tepat.
							</p>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							type="button"
							variant="outline"
							className="flex-1 rounded-full"
							onClick={prevStep}
						>
							Kembali
						</Button>
						<Button
							type="submit"
							className="flex-1 rounded-full"
							disabled={!formData.location || isSubmitting}
						>
							{isSubmitting ? "Mengirim..." : "Kirim Laporan"}
						</Button>
					</div>
				</form>
			)}
		</div>
	);
}
