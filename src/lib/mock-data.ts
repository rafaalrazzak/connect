import { faker } from "@faker-js/faker";

import type { Category, Report, ReportStatus } from "@/types/report";

export const categories: Category[] = [
	{
		id: "1",
		name: "Kerusakan Jalan",
		iconName: "Construction",
		description: "Laporkan masalah pada jalan",
	},
	{
		id: "2",
		name: "Lampu Jalan",
		iconName: "Lightbulb",
		description: "Laporkan masalah pada lampu jalan",
	},
	{
		id: "3",
		name: "Masalah Sampah",
		iconName: "Trash2",
		description: "Laporkan masalah sampah",
	},
	{
		id: "4",
		name: "Ketertiban Umum",
		iconName: "Shield",
		description: "Laporkan masalah ketertiban umum",
	},
	{
		id: "5",
		name: "Fasilitas Umum",
		iconName: "Building",
		description: "Laporkan kerusakan fasilitas umum",
	},
	{
		id: "6",
		name: "Lalu Lintas",
		iconName: "Car",
		description: "Laporkan masalah lalu lintas",
	},
	{
		id: "7",
		name: "Lingkungan",
		iconName: "Trees",
		description: "Laporkan masalah lingkungan",
	},
	{
		id: "8",
		name: "Utilitas",
		iconName: "Wifi",
		description: "Laporkan masalah utilitas",
	},
];

// Create a category map for easy lookup
const categoryMap = Object.fromEntries(
	categories.map((category) => [category.id, category]),
);

/**
 * Generate a realistic report based on its category
 */
const generateReportForCategory = (
	id: string,
	categoryId: string,
	status: ReportStatus,
): Report => {
	const category = categoryMap[categoryId];

	// Generate relevant titles based on category
	const titlePrefixes: Record<string, string[]> = {
		"road-damage": ["Jalan Berlubang di", "Aspal Rusak di", "Jalan Retak di"],
		"street-lights": [
			"Lampu Jalan Mati di",
			"Penerangan Jalan Rusak di",
			"Tiang Lampu Roboh di",
		],
		"waste-issues": [
			"Sampah Menumpuk di",
			"Tempat Sampah Rusak di",
			"Pembuangan Sampah Ilegal di",
		],
		"public-order": ["Keributan di", "Parkir Liar di", "Vandalisme di"],
		"public-facilities": [
			"Bangku Taman Rusak di",
			"Fasilitas Umum Rusak di",
			"Papan Petunjuk Hilang di",
		],
		traffic: [
			"Kemacetan Parah di",
			"Lampu Merah Rusak di",
			"Marka Jalan Pudar di",
		],
		environment: ["Banjir di", "Pohon Tumbang di", "Polusi Udara di"],
		utilities: [
			"Pipa Air Bocor di",
			"Listrik Padam di",
			"Jaringan Internet Terputus di",
		],
	};

	// Select random prefix for the title
	const prefixes = titlePrefixes[categoryId] || ["Masalah di"];
	const titlePrefix = faker.helpers.arrayElement(prefixes);

	// Generate a place name
	const placeName = faker.location.street();

	return {
		id,
		title: `${titlePrefix} ${placeName}`,
		description: faker.lorem.paragraph(),
		location: faker.location.streetAddress(true),
		imageUrls: [
			faker.image.url({ width: 640, height: 480 }),
			// Add second image with 40% probability
			...(faker.number.int(100) < 40
				? [faker.image.url({ width: 640, height: 480 })]
				: []),
		],
		coordinates: {
			latitude: faker.location.latitude(),
			longitude: faker.location.longitude(),
		},
		category,
		status,
		date: faker.date.recent({ days: 30 }),
		anonymous: faker.datatype.boolean(),
		userId: faker.string.uuid(),
		upvotes: faker.number.int({ min: 0, max: 100 }),
	};
};

/**
 * Generate static report data to ensure consistent behavior
 * while still having realistic variety
 */
export const generateStaticReports = (count = 20): Report[] => {
	// Set a fixed seed for reproducible "random" data
	faker.seed(123);

	const reports: Report[] = [];
	const statuses: ReportStatus[] = [
		"pending",
		"in_progress",
		"completed",
		"rejected",
	];

	// Generate a specified number of reports
	for (let i = 0; i < count; i++) {
		// Select a random category and status
		const categoryId = faker.helpers.arrayElement(categories).id;
		const status = faker.helpers.arrayElement(statuses);

		reports.push(generateReportForCategory(`r${i + 1}`, categoryId, status));
	}

	return reports;
};

// Generate 20 static reports
export const reports: Report[] = generateStaticReports(20);

// Special function to generate dynamic data (for development)
export const generateDynamicReport = (): Report => {
	const categoryId = faker.helpers.arrayElement(categories).id;
	const status = faker.helpers.arrayElement([
		"pending",
		"in_progress",
		"completed",
		"rejected",
	]) as ReportStatus;
	return generateReportForCategory(
		`r-${faker.string.nanoid(10)}`,
		categoryId,
		status,
	);
};

// For development: Generate a specific number of new reports
export const generateDynamicReports = (count: number): Report[] => {
	return Array.from({ length: count }, () => generateDynamicReport());
};
