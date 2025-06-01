"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchBarProps {
	query?: string;
	onQueryChange: (query: string) => void;
	onSubmit?: (query: string) => void;
	placeholder?: string;
	debounceMs?: number;
}

export function SearchBar({
	query = "",
	onQueryChange,
	onSubmit,
	placeholder = "Cari laporan, lokasi, atau masalah...",
	debounceMs = 300,
}: SearchBarProps) {
	// Local state for controlled input
	const [inputValue, setInputValue] = useState(query);

	// Create a debounced version of onQueryChange
	const debouncedOnQueryChange = useDebounce(onQueryChange, debounceMs);

	// Track if the value was changed locally or externally
	const isLocalChange = useRef(false);

	// Input reference to focus after clearing
	const inputRef = useRef<HTMLInputElement>(null);

	// Handle input changes
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setInputValue(newValue);
			isLocalChange.current = true;
			debouncedOnQueryChange(newValue);
		},
		[debouncedOnQueryChange],
	);

	// Sync with external query changes (only if not a local change)
	useEffect(() => {
		if (!isLocalChange.current && query !== inputValue) {
			setInputValue(query);
		}
		isLocalChange.current = false;
	}, [query, inputValue]);

	// Form submission handler
	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			onSubmit?.(inputValue);
			// Force immediate query update instead of waiting for debounce
			onQueryChange(inputValue);
			// Dismiss mobile keyboard
			(document.activeElement as HTMLElement)?.blur();
		},
		[inputValue, onQueryChange, onSubmit],
	);

	return (
		<form onSubmit={handleSubmit} className="relative group flex-1">
			<Input
				ref={inputRef}
				type="search"
				placeholder={placeholder}
				value={inputValue}
				onChange={handleInputChange}
				aria-label="Cari laporan"
				startIcon={<Search className="h-4 w-4" />}
			/>
		</form>
	);
}
