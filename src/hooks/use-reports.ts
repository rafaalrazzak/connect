import { reports } from "@/lib/mock-data";
import { useEffect, useState } from "react";

export function useReports() {
	const [isLoading, setIsLoading] = useState(true);
	const [loadedReports, setLoadedReports] = useState<typeof reports>([]);

	useEffect(() => {
		const fetchReports = async () => {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setLoadedReports(reports.slice(0, 3));
			setIsLoading(false);
		};

		fetchReports();
	}, []);

	return {
		isLoading,
		reports: loadedReports,
	};
}
