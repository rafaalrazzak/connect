"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Map } from "lucide-react";

export function MapView() {
	return (
		<motion.div
			className="rounded-xl overflow-hidden bg-gradient-to-b from-muted/30 to-muted/5 border"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="h-[500px] p-8 flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<div className="mx-auto w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center">
						<MapPin className="h-7 w-7 text-muted-foreground/60" />
					</div>
					<h3 className="text-xl font-semibold">Peta Laporan</h3>
					<p className="text-muted-foreground">
						Fitur ini masih dalam pengembangan. Kami akan segera menampilkan
						semua laporan dalam bentuk peta yang interaktif.
					</p>
					<Button variant="outline" className="mt-2" disabled>
						<Map className="mr-2 h-4 w-4" />
						Lihat Laporan di Peta
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
