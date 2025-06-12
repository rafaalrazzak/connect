"use client";

import { Button } from "@/components/ui/button";
import { useReportDrawer } from "@/contexts/report-drawer-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Home, MapPin, Menu, Plus, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	type ComponentProps,
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

// Types
interface NavItemProps {
	href: string;
	icon: React.ElementType;
	label: string;
	isActive: boolean;
	onClick?: () => void;
}

interface BottomNavigationProps extends ComponentProps<"div"> {
	hideOnDesktop?: boolean;
}

// Navigation items config - defined once outside components
const navigationItems = [
	{ label: "Home", href: "/", icon: Home },
	{ label: "Map", href: "/map", icon: MapPin },
	{ label: "Notifications", href: "/notifications", icon: Bell },
	{ label: "Profile", href: "/profile", icon: User },
];

/**
 * Desktop navigation item with animated indicator
 */
const DesktopNavItem = memo(
	({ href, label, isActive }: Omit<NavItemProps, "icon" | "onClick">) => (
		<Link
			href={href}
			className={cn(
				"relative px-4 py-2 text-sm font-medium transition-all",
				"hover:text-primary focus-visible:text-primary focus-visible:outline-none",
				isActive ? "text-primary" : "text-muted-foreground",
			)}
			aria-current={isActive ? "page" : undefined}
		>
			{label}
			{isActive && (
				<motion.span
					layoutId="navIndicator"
					className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/70"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
				/>
			)}
		</Link>
	),
);
DesktopNavItem.displayName = "DesktopNavItem";

/**
 * Mobile navigation item with improved tap target
 */
const MobileNavItem = memo(
	({ href, icon: Icon, label, isActive, onClick }: NavItemProps) => (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-3 px-5 py-4 rounded-xl",
				"transition-all duration-200",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
				isActive
					? "bg-primary/10 text-primary font-medium"
					: "text-foreground/70 hover:bg-muted/50",
			)}
			onClick={onClick}
			aria-current={isActive ? "page" : undefined}
		>
			<Icon className="w-5 h-5" />
			<span>{label}</span>
		</Link>
	),
);
MobileNavItem.displayName = "MobileNavItem";

/**
 * Bottom navigation item component
 */
const BottomNavItem = memo(
	({ href, icon: Icon, label, isActive }: NavItemProps) => (
		<Link
			href={href}
			className={cn(
				"group flex flex-col items-center py-2 flex-1",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-md",
			)}
			aria-current={isActive ? "page" : undefined}
		>
			<span
				className={cn(
					"p-1.5 rounded-full transition-all duration-200",
					isActive
						? "bg-primary/10 text-primary"
						: "text-muted-foreground group-hover:text-foreground",
				)}
			>
				<Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
			</span>
			<span
				className={cn(
					"text-xs mt-1 transition-colors",
					isActive
						? "text-primary font-medium"
						: "text-muted-foreground group-hover:text-foreground",
				)}
			>
				{label}
			</span>
		</Link>
	),
);
BottomNavItem.displayName = "BottomNavItem";

/**
 * Floating action button component
 */
const ActionButton = memo(
	({
		onClick,
		className,
		variant = "primary",
	}: {
		onClick: () => void;
		className?: string;
		variant?: "primary" | "minimal";
	}) => (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex items-center justify-center rounded-full",
				"transition-all duration-200 shadow-lg",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
				"active:scale-95",
				variant === "primary"
					? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
					: "bg-foreground text-background",
				className,
			)}
			aria-label="Create new report"
		>
			<Plus className={cn(variant === "primary" ? "w-6 h-6" : "w-5 h-5")} />
		</button>
	),
);
ActionButton.displayName = "ActionButton";

/**
 * Main header navbar component with responsive design
 */
export const Navbar = memo(
	forwardRef<HTMLDivElement, ComponentProps<"div">>(
		({ className, ...props }, ref) => {
			const pathname = usePathname();
			const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
			const isDesktop = useMediaQuery("(min-width: 768px)");
			const { openDrawer } = useReportDrawer();
			const mobileMenuRef = useRef<HTMLDivElement>(null);

			// Close mobile menu when switching to desktop or navigating
			useEffect(() => {
				setMobileMenuOpen(false);
			}, [isDesktop, pathname]);

			// Handle escape key press
			useEffect(() => {
				const handleEscape = (e: KeyboardEvent) => {
					if (e.key === "Escape" && mobileMenuOpen) {
						setMobileMenuOpen(false);
					}
				};

				document.addEventListener("keydown", handleEscape);
				return () => document.removeEventListener("keydown", handleEscape);
			}, [mobileMenuOpen]);

			// Focus trap for mobile menu
			useEffect(() => {
				if (mobileMenuOpen && mobileMenuRef.current) {
					const focusableElements = mobileMenuRef.current.querySelectorAll(
						"a[href], button:not([disabled])",
					);

					if (focusableElements.length > 0) {
						(focusableElements[0] as HTMLElement).focus();
					}
				}
			}, [mobileMenuOpen]);

			// Memoized toggle handler
			const toggleMobileMenu = useCallback(() => {
				setMobileMenuOpen((prev) => !prev);
			}, []);

			return (
				<header
					ref={ref}
					className={cn(
						"w-full py-3 px-4 sm:px-6 lg:px-8 z-50",
						"sticky top-0 left-0 right-0",
						"border-b bg-background/95 backdrop-blur-md",
						"transition-all duration-200",
						className,
					)}
					{...props}
				>
					<div className="flex items-center justify-between max-w-7xl mx-auto">
						{/* Logo */}
						<Link
							href="/"
							className="relative z-20 text-primary flex items-center"
							aria-label="Citizen Connect home"
						>
							<Image
								src="/logo.png"
								alt="Citizen Connect Logo"
								width={300}
								height={100}
								className="h-8 w-auto"
								priority
							/>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center">
							<nav
								className="flex items-center space-x-1 mr-6"
								aria-label="Main Navigation"
							>
								{navigationItems.map((item) => (
									<DesktopNavItem
										key={item.href}
										href={item.href}
										label={item.label}
										isActive={pathname === item.href}
									/>
								))}
							</nav>

							<ActionButton onClick={openDrawer} className="w-10 h-10" />
						</div>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
							aria-expanded={mobileMenuOpen}
							aria-controls="mobile-menu"
							onClick={toggleMobileMenu}
							className="md:hidden relative z-20 rounded-full"
						>
							<AnimatePresence mode="wait">
								{mobileMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<X className="h-5 w-5" />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<Menu className="h-5 w-5" />
									</motion.div>
								)}
							</AnimatePresence>
						</Button>

						{/* Mobile Menu Overlay */}
						<AnimatePresence>
							{mobileMenuOpen && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="fixed inset-0 bg-background/80 backdrop-blur-md z-10 md:hidden"
									onClick={toggleMobileMenu}
									aria-hidden="true"
								/>
							)}
						</AnimatePresence>

						{/* Mobile Menu Drawer */}
						<AnimatePresence>
							{mobileMenuOpen && (
								<motion.div
									id="mobile-menu"
									ref={mobileMenuRef}
									initial={{ x: "100%" }}
									animate={{ x: 0 }}
									exit={{ x: "100%" }}
									transition={{
										type: "spring",
										damping: 25,
										stiffness: 300,
									}}
									className="fixed top-16 bottom-0 right-0 w-[85%] max-w-sm bg-background/95 backdrop-blur-md z-10 border-l shadow-2xl md:hidden overflow-y-auto"
									aria-label="Mobile Navigation"
								>
									<div className="flex flex-col h-full pb-safe">
										<div className="p-4 border-b">
											<h2 className="font-semibold">Menu</h2>
										</div>

										<nav className="flex flex-col p-3 gap-1 flex-1">
											{navigationItems.map((item) => (
												<MobileNavItem
													key={item.href}
													href={item.href}
													icon={item.icon}
													label={item.label}
													isActive={pathname === item.href}
													onClick={toggleMobileMenu}
												/>
											))}
										</nav>

										{/* Report button for mobile drawer */}
										<div className="p-5 border-t mt-auto">
											<Button
												onClick={() => {
													openDrawer();
													setMobileMenuOpen(false);
												}}
												className="w-full gap-2 py-6"
												size="lg"
											>
												<Plus className="w-4 h-4" />
												<span>Create Report</span>
											</Button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</header>
			);
		},
	),
);
Navbar.displayName = "Navbar";

/**
 * Bottom navigation component with action button
 */
export const BottomNavigation = memo(
	forwardRef<HTMLDivElement, BottomNavigationProps>(
		({ className, hideOnDesktop = true, ...props }, ref) => {
			const pathname = usePathname();
			const { openDrawer } = useReportDrawer();

			return (
				<div
					ref={ref}
					className={cn(
						"sticky bottom-0 left-0 right-0 z-50",
						"border-t bg-background/90 backdrop-blur-md shadow-lg",
						"pb-safe transition-all duration-200",
						// hideOnDesktop && "md:hidden",
						className,
					)}
					{...props}
				>
					<div className="max-w-lg mx-auto px-2">
						<nav
							className="flex items-center h-16 relative"
							aria-label="Bottom Navigation"
						>
							{navigationItems.map((item, index) => {
								return (
									<BottomNavItem
										key={item.href}
										href={item.href}
										icon={item.icon}
										label={item.label}
										isActive={pathname === item.href}
									/>
								);
							})}

							{/* Center action button */}
							<div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
								<ActionButton onClick={openDrawer} className="w-12 h-12" />
							</div>
						</nav>
					</div>
				</div>
			);
		},
	),
);
BottomNavigation.displayName = "BottomNavigation";

/**
 * Combined navigation layout component
 */
export function NavigationLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">{children}</main>
			<BottomNavigation />
		</>
	);
}
