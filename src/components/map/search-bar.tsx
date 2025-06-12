import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	searchLocation: () => Promise<void>;
	isSearching: boolean;
	onClose: () => void;
}

export function SearchBar({
	searchQuery,
	setSearchQuery,
	searchLocation,
	isSearching,
	onClose,
}: SearchBarProps) {
	return (
		<div className="relative w-full">
			<Input
				placeholder="Cari lokasi..."
				className="h-10 bg-background/95 backdrop-blur-sm shadow-md rounded-full border-muted"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && searchLocation()}
				aria-label="Cari lokasi"
				autoFocus
			/>
			{isSearching ? (
				<div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
			) : (
				<Search
					className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
					onClick={searchLocation}
				/>
			)}
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted/80"
				onClick={onClose}
				aria-label="Tutup pencarian"
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}
