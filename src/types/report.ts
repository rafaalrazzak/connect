import type { IconName } from "@/components/icons";
import type { LucideIcon } from "lucide-react";

export type ReportStatus = "pending" | "in_progress" | "completed" | "rejected";
export enum ReportStatusEnum {
	Pending = "pending",
	InProgress = "in_progress",
	Completed = "completed",
	Rejected = "rejected",
}

export interface StepConfig {
	id: number;
	title: string;
	icon: LucideIcon;
	description: string;
	tip: string;
}

export interface Category {
	id: string;
	name: string;
	description?: string;
	iconName: IconName;
}

export interface ReportFormData {
	title: string;
	description: string;
	location: string;
	anonymous: boolean;
	contact?: string;
	urgency?: string;
	[key: string]: string | boolean | undefined;
}

export interface PreviewImage {
	file: File;
	preview: string;
}

export interface Report {
	id: string;
	title: string;
	description: string;
	location: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	imageUrls?: string[];
	category: Category;
	status: ReportStatus;
	date: Date;
	upvotes?: number;
	userId?: string;
	anonymous: boolean;
	urgency?: string;
	contact?: string;
}

export interface ValidationResult {
	success: boolean;
	error?: string;
}
