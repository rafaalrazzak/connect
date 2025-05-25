import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Image, Upload, X } from "lucide-react";
import { useRef } from "react";

interface PhotoStepProps {
	images: string[];
	onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveImage: (index: number) => void;
}

export function PhotoStep({
	images,
	onAddImages,
	onRemoveImage,
}: PhotoStepProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-4">
				{images.map((image, index) => (
					<div
						key={image}
						className="relative w-32 h-32 rounded-md overflow-hidden border"
					>
						<img
							src={image}
							alt={`Foto laporan ${index + 1}`}
							className="w-full h-full object-cover"
						/>
						<button
							type="button"
							onClick={() => onRemoveImage(index)}
							className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"
							aria-label="Hapus foto"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				))}

				{images.length < 3 && (
					<button
						type="button"
						onClick={handleButtonClick}
						className={cn(
							"w-32 h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2",
							"text-muted-foreground hover:text-primary hover:border-primary transition-colors",
						)}
					>
						<Upload className="w-8 h-8" />
						<span className="text-xs">Unggah foto</span>
					</button>
				)}
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple={images.length < 2}
				onChange={onAddImages}
				className="hidden"
			/>

			<p className="text-xs text-muted-foreground">
				Kamu bisa unggah sampai 3 foto. Setiap foto sebaiknya kurang dari 5MB.
				Format yang didukung: JPG, PNG, GIF.
			</p>
		</div>
	);
}
