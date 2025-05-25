"use client";

import { type RefObject, useEffect, useState } from "react";
import { toast } from "sonner";

interface FormData {
	title: string;
	description: string;
	location: string;
	anonymous: boolean;
	urgency: "low" | "medium" | "high";
}

interface UseReportFormProps {
	onSubmitSuccess: () => void;
	contentRef: RefObject<HTMLDivElement>;
}

export function useReportForm({
	onSubmitSuccess,
	contentRef,
}: UseReportFormProps) {
	// State dasar form
	const [step, setStep] = useState(1);
	const [progress, setProgress] = useState(20);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		title: "",
		description: "",
		location: "",
		anonymous: false,
		urgency: "medium",
	});

	// Perbarui progress berdasarkan langkah
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const newProgress = step * 20;
		if (progress !== newProgress) {
			setProgress(newProgress);
		}

		// Scroll ke atas saat pindah langkah
		if (contentRef.current) {
			const scrollTimeout = requestAnimationFrame(() => {
				if (contentRef.current) {
					contentRef.current.scrollTo({
						top: 0,
						behavior: "smooth",
					});
				}
			});

			return () => cancelAnimationFrame(scrollTimeout);
		}
	}, [step, progress]); // Remove contentRef from dependencies to prevent loops

	const resetForm = () => {
		setStep(1);
		setSelectedCategory(null);
		setPreviewImages([]);
		setError(null);
		setFormData({
			title: "",
			description: "",
			location: "",
			anonymous: false,
			urgency: "medium",
		});
	};

	// Helper untuk menampilkan toast error
	const showErrorToast = (message: string) => {
		toast.error(message, {
			description: "Silakan coba lagi",
		});

		setError(message); // Tetap simpan di state untuk keperluan UI lainnya
	};

	// Helper untuk menampilkan toast info
	const showInfoToast = (title: string, message: string) => {
		toast.info(message, {
			description: title,
		});
	};

	// Validasi sesuai langkah
	const validateStep = (): boolean => {
		switch (step) {
			case 1:
				if (!selectedCategory) {
					showErrorToast("Silakan pilih kategori untuk laporanmu");
					return false;
				}
				break;
			case 2:
				if (!formData.title.trim()) {
					showErrorToast("Tolong masukkan judul laporan");
					return false;
				}
				if (!formData.description.trim()) {
					showErrorToast("Tolong berikan deskripsi masalahnya");
					return false;
				}
				if (formData.description.trim().length < 10) {
					showErrorToast("Deskripsi harus lebih detail (minimal 10 karakter)");
					return false;
				}
				break;
			case 3:
				if (previewImages.length === 0) {
					showErrorToast("Silakan unggah minimal satu foto masalah");
					return false;
				}
				break;
			case 4:
				if (!formData.location.trim()) {
					showErrorToast("Tolong masukkan lokasi kejadian");
					return false;
				}
				break;
		}
		return true;
	};

	// Navigasi langkah
	const handleNextStep = () => {
		if (!validateStep()) return;

		setError(null);
		if (step < 5) {
			setStep(step + 1);
			showInfoToast("Langkah Berikutnya", `Langkah ${step + 1} dari 5`);
		}
	};

	const handlePrevStep = () => {
		setError(null);
		if (step > 1) {
			setStep(step - 1);
		}
	};

	// Penanganan unggah gambar
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		// Validasi jumlah file
		if (previewImages.length + files.length > 3) {
			showErrorToast("Kamu hanya bisa mengunggah maksimal 3 foto");
			return;
		}

		setError(null);
		let uploadCount = 0;

		// Proses setiap file
		for (const file of Array.from(files)) {
			// Cek ukuran file (batas 5MB)
			if (file.size > 5 * 1024 * 1024) {
				showErrorToast(`Foto ${file.name} melebihi batas ukuran 5MB`);
				continue;
			}

			// Cek tipe file
			if (!file.type.startsWith("image/")) {
				showErrorToast(`File ${file.name} bukan format gambar yang valid`);
				continue;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImages((prev) => [...prev, reader.result as string]);
				uploadCount++;

				// Tampilkan toast setelah semua foto berhasil diunggah
				if (uploadCount === files.length) {
					showInfoToast(
						"Foto Berhasil Diunggah",
						`${uploadCount} foto berhasil ditambahkan`,
					);
				}
			};
			reader.onerror = () => {
				showErrorToast(`Gagal membaca file ${file.name}`);
			};
			reader.readAsDataURL(file);
		}

		// Reset input agar bisa memilih file yang sama lagi
		e.target.value = "";
	};

	const removeImage = (index: number) => {
		setPreviewImages((prev) => {
			const newImages = prev.filter((_, i) => i !== index);
			showInfoToast("Foto Dihapus", "Foto berhasil dihapus");
			return newImages;
		});
	};

	// Penanganan perubahan input
	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError(null);
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setFormData((prev) => ({ ...prev, [name]: checked }));
	};

	// Gunakan lokasi saat ini
	const handleUseCurrentLocation = () => {
		if (!navigator.geolocation) {
			showErrorToast("Browser kamu tidak mendukung fitur lokasi");
			return;
		}

		showInfoToast("Mencari Lokasi", "Sedang mendeteksi lokasi kamu...");

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;

				try {
					// Reverse geocoding untuk mendapatkan alamat dari koordinat
					const response = await fetch(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
					);

					if (!response.ok) throw new Error("Gagal mendapatkan alamat");

					const data = await response.json();
					const address =
						data.display_name ||
						`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

					setFormData((prev) => ({ ...prev, location: address }));
					showInfoToast("Lokasi Ditemukan", "Lokasi kamu berhasil terdeteksi");
					setError(null);
				} catch (err) {
					setFormData((prev) => ({
						...prev,
						location: `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(
							6,
						)}`,
					}));
					showInfoToast(
						"Lokasi Ditemukan",
						"Koordinat lokasi berhasil terdeteksi",
					);
					setError(null);
				}
			},
			(err) => {
				showErrorToast(
					`Error lokasi: ${err.message || "Tidak dapat menemukan lokasi kamu"}`,
				);
			},
			{ timeout: 10000 },
		);
	};

	// Kirim laporan
	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();

		if (!validateStep()) return;

		setIsSubmitting(true);
		setError(null);
		showInfoToast("Mengirim Laporan", "Mohon tunggu sebentar...");

		try {
			// Persiapan data untuk API
			const reportData = {
				categoryId: selectedCategory,
				...formData,
				images: previewImages,
				submittedAt: new Date().toISOString(),
			};

			// Simulasi panggilan API - ganti dengan implementasi sebenarnya
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log("Mengirim laporan:", reportData);

			showInfoToast("Berhasil!", "Laporan kamu berhasil dikirim");
			onSubmitSuccess();
		} catch (err) {
			console.error("Error mengirim laporan:", err);
			showErrorToast(
				err instanceof Error
					? err.message
					: "Gagal mengirim laporan, silakan coba lagi",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		step,
		progress,
		formData,
		selectedCategory,
		previewImages,
		error,
		isSubmitting,
		setStep,
		setSelectedCategory,
		setFormData,
		handleNextStep,
		handlePrevStep,
		handleImageUpload,
		removeImage,
		handleInputChange,
		handleCheckboxChange,
		handleUseCurrentLocation,
		handleSubmit,
		resetForm,
		setError,
	};
}
