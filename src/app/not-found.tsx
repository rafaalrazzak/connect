"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Home, MapPin } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<>
			<Navbar />
			<div className="fixed inset-0 flex flex-col items-center justify-center px-4 bg-background">
				{/* Animation container */}
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* 404 Display */}
					<div className="relative">
						<motion.div
							className="text-8xl sm:text-9xl font-bold text-primary/10"
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{
								type: "spring",
								stiffness: 200,
								damping: 10,
							}}
						>
							404
						</motion.div>
						<motion.div
							className="absolute inset-0 flex flex-col items-center justify-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<MapPin
								className="h-12 w-12 text-muted-foreground mb-2"
								strokeWidth={1.5}
							/>
							<h1 className="text-2xl font-semibold">
								Halaman Tidak Ditemukan
							</h1>
						</motion.div>
					</div>

					{/* Description */}
					<motion.p
						className="mt-16 text-muted-foreground max-w-md mx-auto"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					>
						Kami tidak dapat menemukan halaman yang Anda cari. Halaman mungkin
						telah dipindahkan atau URL yang dimasukkan salah.
					</motion.p>

					{/* Action buttons */}
					<motion.div
						className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
					>
						<Button asChild variant="default" size="lg" className="gap-2">
							<Link href="/">
								<Home className="h-4 w-4" />
								<span>Kembali ke Beranda</span>
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="gap-2">
							<Link href="javascript:history.back()">
								<ArrowLeft className="h-4 w-4" />
								<span>Halaman Sebelumnya</span>
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</>
	);
}
