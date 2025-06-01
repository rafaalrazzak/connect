"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
	return (
		<div className="space-y-6">
			{/* Loading skeleton for filter results info */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-5 w-48" />
				<Skeleton className="h-5 w-20" />
			</div>

			{/* Loading skeletons for report cards */}
			{Array.from({ length: 5 }).map((_, index) => (
				<div
					key={`skeleton-${index}`}
					className="border rounded-xl p-5 space-y-4"
				>
					{/* Header */}
					<div className="flex items-start justify-between">
						<div className="space-y-3 flex-1">
							<Skeleton className="h-6 w-3/4" />
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-4 rounded-full" />
								<Skeleton className="h-4 w-32" />
							</div>
						</div>
						<Skeleton className="h-9 w-9 rounded-full" />
					</div>

					{/* Content */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/6" />
					</div>

					{/* Image placeholder */}
					<Skeleton className="h-48 w-full rounded-lg" />

					{/* Footer */}
					<div className="flex items-center justify-between pt-3">
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-20 rounded-full" />
							<Skeleton className="h-8 w-24 rounded-full" />
						</div>
						<Skeleton className="h-8 w-16 rounded-full" />
					</div>
				</div>
			))}

			{/* Pagination skeleton */}
			<div className="flex justify-center items-center gap-2 mt-4">
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-9 w-28 rounded-md" />
			</div>
		</div>
	);
}
