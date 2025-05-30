"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

import type { Category, PreviewImage, ReportFormData } from "@/types/report";

// Form state
interface FormState {
	step: number;
	isPending: boolean;
	error: string | null;
	showConfirmDialog: boolean;
	selectedCategory: Pick<Category, "id" | "name"> | null;
	previewImages: PreviewImage[];
}

// Server actions
interface ServerActions {
	validateStepData: (
		params: any,
	) => Promise<{ success: boolean; error?: string }>;
	uploadImages: (
		files: File[],
	) => Promise<{ success: boolean; urls?: string[]; error?: string }>;
	submitReport: (
		params: any,
	) => Promise<{ success: boolean; reportId?: string; error?: string }>;
	reverseGeocode: (
		lat: number,
		lng: number,
	) => Promise<{ success: boolean; address?: string; error?: string }>;
}

// Props for the hook
interface UseReportFormProps {
	defaultData: ReportFormData;
	onSubmitSuccess?: () => void;
	serverActions: ServerActions;
}

// Validation schemas
const reportFormSchema = z.object({
	title: z.string().min(5, "Judul minimal 5 karakter"),
	description: z.string().min(20, "Deskripsi minimal 20 karakter"),
	location: z.string().min(3, "Lokasi harus diisi"),
	anonymous: z.boolean(),
	contact: z.string().optional(),
});

/**
 * Custom hook for managing report form state and logic
 */
export function useReportForm({
	defaultData,
	onSubmitSuccess,
	serverActions,
}: UseReportFormProps) {
	// Form data state
	const [form, setForm] = useState<ReportFormData>(defaultData);

	// Form UI state
	const [formState, setFormState] = useState<FormState>({
		step: 1,
		isPending: false,
		error: null,
		showConfirmDialog: false,
		selectedCategory: null,
		previewImages: [],
	});

	// Content ref for scrolling
	const contentRef = useRef<HTMLDivElement>(null);

	// React useTransition for server actions
	const [isPending, startTransition] = useTransition();

	// Update UI isPending state when transition state changes
	useEffect(() => {
		setFormState((prev) => ({ ...prev, isPending }));
	}, [isPending]);

	/**
	 * Initialize form with data and step
	 */
	const initializeForm = useCallback(
		(data: Partial<ReportFormData>, step = 1) => {
			setForm((prev) => ({ ...prev, ...data }));
			setFormState((prev) => ({ ...prev, step }));
		},
		[],
	);

	/**
	 * Reset all form data
	 */
	const resetForm = useCallback(() => {
		setForm(defaultData);
		setFormState({
			step: 1,
			isPending: false,
			error: null,
			showConfirmDialog: false,
			selectedCategory: null,
			previewImages: [],
		});
	}, [defaultData]);

	/**
	 * Set step number
	 */
	const setStep = useCallback((step: number) => {
		setFormState((prev) => ({ ...prev, step, error: null }));

		// Scroll to top of content
		setTimeout(() => {
			contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
		}, 100);
	}, []);

	/**
	 * Set selected category
	 */
	const setSelectedCategory = useCallback(
		(category: Pick<Category, "id" | "name"> | null) => {
			setFormState((prev) => ({ ...prev, selectedCategory: category }));
		},
		[],
	);

	/**
	 * Set error message
	 */
	const setError = useCallback((error: string | null) => {
		toast.error(error || "Terjadi kesalahan, silakan coba lagi");
		setFormState((prev) => ({ ...prev, error }));
	}, []);

	/**
	 * Set show confirm dialog
	 */
	const setShowConfirmDialog = useCallback((show: boolean) => {
		setFormState((prev) => ({ ...prev, showConfirmDialog: show }));
	}, []);

	/**
	 * Handle form input changes
	 */
	const handleInputChange = useCallback(
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) => {
			const { name, value } = e.target;
			setForm((prev) => ({ ...prev, [name]: value }));
		},
		[],
	);

	/**
	 * Handle checkbox changes
	 */
	const handleCheckboxChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, checked } = e.target;
			setForm((prev) => ({ ...prev, [name]: checked }));
		},
		[],
	);

	/**
	 * Move to the next step with validation
	 */
	const handleNextStep = useCallback(() => {
		const { step, selectedCategory, previewImages } = formState;

		// Start server-side validation
		startTransition(async () => {
			try {
				// Client-side validation for faster feedback
				let errorMessage: string | null = null;

				switch (step) {
					case 1:
						if (!selectedCategory) {
							errorMessage = "Pilih kategori terlebih dahulu";
						}
						break;
					case 2:
						try {
							reportFormSchema
								.pick({ title: true, description: true })
								.parse(form);
						} catch (e) {
							if (e instanceof z.ZodError) {
								errorMessage = e.errors[0].message;
							}
						}
						break;
					case 3:
						if (previewImages.length === 0) {
							errorMessage = "Tambahkan minimal 1 foto";
						}
						break;
					case 4:
						try {
							reportFormSchema.pick({ location: true }).parse(form);
						} catch (e) {
							if (e instanceof z.ZodError) {
								errorMessage = e.errors[0].message;
							}
						}
						break;
				}

				// If client validation fails, show error
				if (errorMessage) {
					toast.error(errorMessage);
					setFormState((prev) => ({ ...prev, error: errorMessage }));
					return;
				}

				// Server-side validation
				const validationResult = await serverActions.validateStepData({
					stepNumber: step,
					formData: form,
					selectedCategory,
					hasImages: previewImages.length > 0,
				});

				if (!validationResult.success) {
					setFormState((prev) => ({
						...prev,
						error: validationResult.error || "Validasi gagal",
					}));
					return;
				}

				// Clear any previous error and move to next step
				setFormState((prev) => ({
					...prev,
					error: null,
					step: Math.min(prev.step + 1, 5),
				}));

				// Scroll to top of content
				setTimeout(() => {
					contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
				}, 100);
			} catch (error) {
				console.error("Validation error:", error);
				setFormState((prev) => ({
					...prev,
					error: "Terjadi kesalahan. Silakan coba lagi.",
				}));
			}
		});
	}, [form, formState, serverActions]);

	/**
	 * Move to the previous step
	 */
	const handlePrevStep = useCallback(() => {
		setFormState((prev) => ({
			...prev,
			step: Math.max(prev.step - 1, 1),
			error: null,
		}));

		// Scroll to top of content
		setTimeout(() => {
			contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
		}, 100);
	}, []);

	/**
	 * Handle image upload with improved error handling
	 */
	const handleImageUpload = useCallback(
		(files: FileList) => {
			const { previewImages } = formState;

			startTransition(async () => {
				try {
					// Max 5 images
					if (previewImages.length + files.length > 5) {
						setFormState((prev) => ({ ...prev, error: "Maksimal 5 foto" }));
						return;
					}

					// Process each file with input validation
					const validFiles: File[] = [];
					for (const file of Array.from(files)) {
						// Validate file type
						if (!file.type.startsWith("image/")) {
							toast.error(`File "${file.name}" bukan gambar`);
							continue;
						}

						// Validate file size (max 5MB)
						if (file.size > 5 * 1024 * 1024) {
							toast.error(`File "${file.name}" terlalu besar (max: 5MB)`);
							continue;
						}

						validFiles.push(file);
					}

					if (validFiles.length === 0) return;

					// Use a better pattern for reading files
					const newImages = await Promise.all(
						validFiles.map(
							(file) =>
								new Promise<PreviewImage>((resolve, reject) => {
									const reader = new FileReader();

									reader.onload = (e) => {
										if (e.target?.result) {
											resolve({
												file,
												preview: e.target.result as string,
											});
										} else {
											reject(new Error(`Failed to read file: ${file.name}`));
										}
									};

									reader.onerror = () =>
										reject(new Error(`Error reading file: ${file.name}`));
									reader.readAsDataURL(file);
								}),
						),
					);

					// Update state with new images
					setFormState((prev) => ({
						...prev,
						previewImages: [...prev.previewImages, ...newImages],
						error: null,
					}));
				} catch (error) {
					console.error("Error uploading images:", error);
					setFormState((prev) => ({
						...prev,
						error: "Gagal mengunggah gambar. Silakan coba lagi.",
					}));
				}
			});
		},
		[formState],
	);

	/**
	 * Remove image
	 */
	const removeImage = useCallback((index: number) => {
		setFormState((prev) => ({
			...prev,
			previewImages: prev.previewImages.filter((_, i) => i !== index),
		}));
	}, []);

	/**
	 * Use current location with geocoding
	 */
	const handleUseCurrentLocation = useCallback(() => {
		if (!navigator.geolocation) {
			toast.error("Geolocation tidak didukung oleh browser ini");
			return;
		}

		toast.info("Mencari lokasi anda...");

		navigator.geolocation.getCurrentPosition(
			// Success handler
			(position) => {
				const { latitude, longitude } = position.coords;

				// Start reverse geocoding using server action
				startTransition(async () => {
					try {
						// Initially set the coordinates
						const tempLocation = `${latitude}, ${longitude}`;
						setForm((prev) => ({ ...prev, location: tempLocation }));

						// Use server action for geocoding
						const addressResult = await serverActions.reverseGeocode(
							latitude,
							longitude,
						);

						if (addressResult.success && addressResult.address) {
							setForm((prev) => ({
								...prev,
								location: addressResult.address || "",
							}));
						}
					} catch (error) {
						console.error("Error getting address:", error);
						// Keep coordinate format if geocoding fails
						setForm((prev) => ({
							...prev,
							location: `${latitude}, ${longitude}`,
						}));
					}
				});
			},
			// Error handler
			(error) => {
				console.error("Error getting location:", error);
				toast.error("Tidak dapat mengakses lokasi. Periksa izin lokasi.");
			},
			// Options
			{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
		);
	}, [serverActions]);

	/**
	 * Submit the report form
	 */
	const handleSubmit = useCallback(() => {
		const { selectedCategory, previewImages } = formState;

		startTransition(async () => {
			try {
				// Final validation
				try {
					reportFormSchema.parse(form);
				} catch (e) {
					if (e instanceof z.ZodError) {
						const firstError = e.errors[0];
						setFormState((prev) => ({ ...prev, error: firstError.message }));

						// Set step based on the error field
						const field = firstError.path[0] as string;
						if (field === "title" || field === "description") {
							setFormState((prev) => ({ ...prev, step: 2 }));
						} else if (field === "location") {
							setFormState((prev) => ({ ...prev, step: 4 }));
						}
						return;
					}
				}

				if (!selectedCategory) {
					setFormState((prev) => ({
						...prev,
						error: "Pilih kategori terlebih dahulu",
						step: 1,
					}));
					return;
				}

				if (previewImages.length === 0) {
					setFormState((prev) => ({
						...prev,
						error: "Tambahkan minimal 1 foto",
						step: 3,
					}));
					return;
				}

				// First, upload images
				const imageFiles = previewImages.map((img) => img.file);
				const uploadResult = await serverActions.uploadImages(imageFiles);

				if (!uploadResult.success) {
					setFormState((prev) => ({
						...prev,
						error: uploadResult.error || "Gagal mengunggah foto",
					}));
					return;
				}

				// Then submit the report with image URLs
				const result = await serverActions.submitReport({
					categoryId: selectedCategory.id,
					title: form.title,
					description: form.description,
					location: form.location,
					imageUrls: uploadResult.urls || [],
					anonymous: form.anonymous,
					contact: form.contact,
				});

				if (result.success) {
					toast.success("Laporan berhasil dikirim!");
					resetForm();
					onSubmitSuccess?.();
				} else {
					setFormState((prev) => ({
						...prev,
						error: result.error || "Gagal mengirim laporan. Silakan coba lagi.",
					}));
				}
			} catch (error) {
				console.error("Error submitting report:", error);
				setFormState((prev) => ({
					...prev,
					error: "Terjadi kesalahan. Silakan coba lagi.",
				}));
			}
		});
	}, [form, formState, resetForm, serverActions, onSubmitSuccess]);

	return {
		form,
		formState,
		contentRef,
		handlers: {
			setStep,
			setSelectedCategory,
			setError,
			setShowConfirmDialog,
			handleInputChange,
			handleCheckboxChange,
			handleNextStep,
			handlePrevStep,
			handleSubmit,
			handleImageUpload,
			removeImage,
			handleUseCurrentLocation,
			resetForm,
			initializeForm,
		},
	};
}
