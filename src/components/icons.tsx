"use client";

import {
	AlertTriangle,
	Building,
	Car,
	CheckCircle,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Construction,
	Edit,
	FileText,
	Filter,
	HelpCircle,
	Home,
	Image,
	Info,
	Lightbulb,
	Loader,
	LogOut,
	type LucideIcon,
	type LucideProps,
	MapPin,
	Menu,
	MessageCircle,
	MoreHorizontal,
	Plus,
	RefreshCcw,
	Search,
	Send,
	Settings,
	Shield,
	ThumbsUp,
	Trash2,
	Trees,
	User,
	Wifi,
	X,
	XCircle,
} from "lucide-react";

// Icon map for dynamic lookups
export const Icons = {
	// Lucide Icons
	alertTriangle: AlertTriangle,
	building: Building,
	car: Car,
	clock: Clock,
	checkCircle: CheckCircle,
	chevronDown: ChevronDown,
	chevronLeft: ChevronLeft,
	chevronRight: ChevronRight,
	chevronUp: ChevronUp,
	construction: Construction,
	edit: Edit,
	fileText: FileText,
	filter: Filter,
	helpCircle: HelpCircle,
	home: Home,
	image: Image,
	info: Info,
	lightbulb: Lightbulb,
	loader: Loader,
	logOut: LogOut,
	mapPin: MapPin,
	menu: Menu,
	messageCircle: MessageCircle,
	moreHorizontal: MoreHorizontal,
	plus: Plus,
	refreshCcw: RefreshCcw,
	search: Search,
	send: Send,
	settings: Settings,
	shield: Shield,
	thumbsUp: ThumbsUp,
	trash2: Trash2,
	trees: Trees,
	user: User,
	wifi: Wifi,
	x: X,
	xCircle: XCircle,

	// Category specific aliases to ensure case-insensitivity
	Construction: Construction,
	Lightbulb: Lightbulb,
	Trash2: Trash2,
	Shield: Shield,
	Building: Building,
	Car: Car,
	Trees: Trees,
	Wifi: Wifi,
};

export type IconName = keyof typeof Icons;

/**
 * Get an icon component by name
 */
export function getIconByName(
	name: string,
	fallback: LucideIcon = HelpCircle,
): LucideIcon {
	// Try direct lookup
	if (name in Icons) {
		return Icons[name as IconName];
	}

	// Try case-insensitive lookup with proper casing
	const normalizedName =
		name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	if (normalizedName in Icons) {
		return Icons[normalizedName as IconName];
	}

	// Return fallback if icon not found
	return fallback;
}

/**
 * Renders an icon by name with fallback
 */
export function Icon({
	name,
	className,
	fallback = HelpCircle,
	...props
}: { name: string; fallback?: LucideIcon } & LucideProps) {
	const IconComponent = getIconByName(name, fallback);
	return <IconComponent className={className} {...props} />;
}

/**
 * CategoryIcon component specifically for category displays
 */
export function CategoryIcon({
	iconName,
	className,
	size = 20,
	...props
}: {
	iconName: string;
	size?: number;
} & LucideProps) {
	return <Icon name={iconName} className={className} size={size} {...props} />;
}

export default Icons;
