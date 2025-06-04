"use server";

import { reports } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas for server actions
const categorySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
});

const validationParamsSchema = z.object({
	stepNumber: z.number().int().min(1).max(5),
	formData: z.record(z.union([z.string(), z.boolean()])),
	selectedCategory: z.union([categorySchema, z.null()]),
	hasImages: z.boolean(),
});

const submitReportSchema = z.object({
	categoryId: z.string(),
	title: z.string().min(5, "Judul minimal 5 karakter"),
	description: z.string().min(20, "Deskripsi minimal 20 karakter"),
	location: z.string().min(3, "Lokasi harus diisi"),
	imageUrls: z.array(z.string().url()),
	anonymous: z.boolean(),
	contact: z.string().optional(),
});

const geocodeParamsSchema = z.object({
	lat: z.number(),
	lng: z.number(),
});

// Type-safe validation function
export async function validateStepData(params: unknown) {
	try {
		// Validate input parameters
		const { stepNumber, formData, selectedCategory, hasImages } =
			validationParamsSchema.parse(params);

		// Different validation logic for each step
		switch (stepNumber) {
			case 1:
				// Validate category selection
				if (!selectedCategory) {
					return { success: false, error: "Pilih kategori terlebih dahulu" };
				}
				break;

			case 2: {
				// Validate form details
				const title = formData.title as string;
				const description = formData.description as string;

				if (!title) {
					return { success: false, error: "Judul laporan tidak boleh kosong" };
				}

				if (!description) {
					return {
						success: false,
						error: "Deskripsi laporan tidak boleh kosong",
					};
				}

				if (title.length < 5) {
					return {
						success: false,
						error: "Judul terlalu pendek (min. 5 karakter)",
					};
				}

				if (description.length < 20) {
					return {
						success: false,
						error: "Deskripsi terlalu pendek (min. 20 karakter)",
					};
				}
				break;
			}

			case 3:
				// Validate images
				if (!hasImages) {
					return { success: false, error: "Tambahkan minimal 1 foto" };
				}
				break;

			case 4: {
				// Validate location
				const location = formData.location as string;
				if (!location) {
					return { success: false, error: "Lokasi tidak boleh kosong" };
				}
				break;
			}
		}

		// Validation passed
		return { success: true };
	} catch (error) {
		console.error("Validation error:", error);
		return {
			success: false,
			error: "Terjadi kesalahan saat validasi. Silakan coba lagi.",
		};
	}
}

/**
 * Upload images to storage and return URLs
 */
export async function uploadImages(files: File[]) {
	try {
		if (!files.length) {
			return { success: true, urls: [] };
		}

		// Validate all files are images and not too large
		for (const file of files) {
			if (!file.type.startsWith("image/")) {
				return {
					success: false,
					error: `File "${file.name}" bukan gambar valid`,
				};
			}

			if (file.size > 10 * 1024 * 1024) {
				// 10MB limit
				return {
					success: false,
					error: `File "${file.name}" terlalu besar (max: 10MB)`,
				};
			}
		}

		// This would typically upload to your storage service
		// For this example, we're simulating successful uploads

		// In a real implementation, you'd upload each file to a storage service
		// and return the URLs.

		// Simulated upload response with unique timestamps
		const uploadedUrls = files.map(
			(file, index) =>
				`https://storage.example.com/reports/${Date.now()}-${index}-${encodeURIComponent(
					file.name,
				)}`,
		);

		return { success: true, urls: uploadedUrls };
	} catch (error) {
		console.error("Image upload error:", error);
		return {
			success: false,
			error: "Gagal mengunggah gambar. Silakan coba lagi.",
		};
	}
}

/**
 * Submit report to the database
 */
export async function submitReport(params: unknown) {
	try {

		console.log({
			params,
			submitReportSchema,
		})
		// Validate input with zod
		const validatedData = submitReportSchema.parse(params);

		// In a real implementation, you'd save to your database
		// For this example, we're simulating a successful submission

		// Example database insertion code:
		// const result = await db.reports.create({
		//   data: {
		//     categoryId: validatedData.categoryId,
		//     title: validatedData.title,
		//     description: validatedData.description,
		//     location: validatedData.location,
		//     imageUrls: validatedData.imageUrls,
		//     anonymous: validatedData.anonymous,
		//     contact: validatedData.contact || null,
		//     status: "pending",
		//     userId: session?.user?.id || null, // If using authentication
		//   },
		// });

		// Wait a bit to simulate network latency
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Revalidate relevant paths to update UI
		revalidatePath("/reports");
		revalidatePath("/");

		return {
			success: true,
			report: reports[Math.floor(Math.random() * reports.length)],
		};
	} catch (error) {
		console.error("Report submission error:", error);

		// Handle Zod validation errors specifically
		if (error instanceof z.ZodError) {
			const firstError = error.errors[0];
			return {
				success: false,
				error: firstError.message,
			};
		}

		return {
			success: false,
			error: "Gagal menyimpan laporan. Silakan coba lagi.",
		};
	}
}

/**
 * Server-side geocoding function
 */
export async function reverseGeocode(lat: number, lng: number) {
	try {
		const params = geocodeParamsSchema.parse({ lat, lng });

		// Call external geocoding API with error handling
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${params.lat}&lon=${params.lng}&zoom=18&addressdetails=1`,
			{ next: { revalidate: 60 } }, // Cache for 60 seconds
		);

		if (!response.ok) {
			throw new Error(`Geocoding API error: ${response.status}`);
		}

		const data = await response.json();

		if (data?.display_name) {
			return {
				success: true,
				address: data.display_name,
			};
		}
		return {
			success: false,
			error: "No address found for these coordinates",
		};
	} catch (error) {
		console.error("Geocoding error:", error);
		return {
			success: false,
			error: "Failed to geocode location",
		};
	}
}
