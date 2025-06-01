"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function AppHeader() {
	const [showSearch, setShowSearch] = useState(false);

	return (
		<header className="relative bg-gradient-to-br from-primary to-secondary pt-safe z-20 rounded-b-xl">
			<div className="absolute inset-0 bg-[url('/dots.svg')] opacity-10" />

			<div className="relative max-w-lg mx-auto px-5 pt-6 pb-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="bg-white rounded-full p-1.5 shadow-md">
							<Image
								src="/logo.png"
								alt="Citizen Connect"
								width={28}
								height={28}
								className="h-7 w-7"
							/>
						</div>
						<div>
							<h1 className="font-bold text-white text-lg">Citizen Connect</h1>
							<p className="text-white/70 text-xs">
								Solusi untuk lingkungan lebih baik
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							size="icon"
							variant="ghost"
							className="text-white hover:bg-white/20 rounded-full"
							aria-label="Notifications"
						>
							<Bell size={18} />
						</Button>

						<Avatar className="h-9 w-9 border border-white/30">
							<AvatarImage
								src="https://cdn.kita.blue/rafaar/me.jpg"
								alt="Profile"
							/>
							<AvatarFallback className="bg-primary-foreground/20 text-white">
								K
							</AvatarFallback>
						</Avatar>
					</div>
				</div>

				<AnimatePresence mode="wait">
					{showSearch ? (
						<motion.div
							className="relative"
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 5 }}
							transition={{ duration: 0.2 }}
						>
							<Input
								startIcon={<Search className="h-5 w-5 text-primary/70" />}
								autoFocus
								placeholder="Cari laporan atau lokasi..."
							/>
							<button
								type="button"
								onClick={() => setShowSearch(false)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
							>
								<X size={18} />
							</button>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<h2 className="text-xl text-white mb-4">
								Apa yang ingin dilaporkan hari ini?
							</h2>
							<Button
								onClick={() => setShowSearch(true)}
								variant="secondary"
								className="w-full bg-white/10 backdrop-blur-sm border-white/10 text-white hover:bg-white/20 h-12 rounded-xl justify-start pl-4"
							>
								<Search className="mr-3 h-4 w-4 text-white/70" />
								<span className="text-white/90">
									Cari laporan atau lokasi...
								</span>
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
}
