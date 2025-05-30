"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	onSubmit: (query: string) => void;
}

export function SearchBar({
	searchQuery,
	setSearchQuery,
	onSubmit,
}: SearchBarProps) {
	// Local state to avoid too many rerenders
	const [inputValue, setInputValue] = useState(searchQuery);

	// Update local state when prop changes
	useEffect(() => {
		setInputValue(searchQuery);
	}, [searchQuery]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(inputValue);
	};

	const handleClear = () => {
		setInputValue("");
		setSearchQuery("");
		onSubmit("");
	};

	return (
		<form onSubmit={handleSubmit} className="relative">
			<div className="relative flex-1">
				<div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
					<Search className="h-4 w-4" />
				</div>
				<Input
					type="search"
					placeholder="Cari laporan, lokasi, atau masalah..."
					className="pl-10 pr-12 h-11 rounded-xl border-muted/60 bg-background/80 focus-visible:ring-offset-0"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				{inputValue && (
					<button
						type="button"
						className="absolute right-3.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted/70 inline-flex items-center justify-center transition-colors"
						onClick={handleClear}
					>
						<X className="h-3.5 w-3.5" />
					</button>
				)}
			</div>
		</form>
	);
}
