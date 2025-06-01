import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
	return format(new Date(date), "dd MMM yyyy", { locale: id });
}

export function formatRelativeTime(date: Date | string): string {
	return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
}
