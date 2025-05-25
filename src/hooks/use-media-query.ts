"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		// Check if window is defined (client-side)
		if (typeof window !== "undefined") {
			const media = window.matchMedia(query);

			// Set initial value
			setMatches(media.matches);

			// Define callback for media query change
			const listener = (e: MediaQueryListEvent) => {
				setMatches(e.matches);
			};

			// Add event listener
			media.addEventListener("change", listener);

			// Clean up
			return () => {
				media.removeEventListener("change", listener);
			};
		}

		// Default to false on server-side
		return () => {};
	}, [query]);

	return matches;
}
