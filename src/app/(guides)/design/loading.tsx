import { Skeleton } from "@/components/ui/skeleton";

export default function DesignGuidelinesLoading() {
	return (
		<div className="container mx-auto space-y-8 pb-10">
			<div className="flex flex-col md:flex-row gap-6">
				<div className="md:w-64 lg:w-72 shrink-0">
					<div className="space-y-2">
						<Skeleton className="h-6 w-32" />
						<div className="space-y-1">
							{Array.from({ length: 7 }).map((_, i) => (
								<Skeleton key={i} className="h-8 w-full" />
							))}
						</div>
					</div>
				</div>

				<div className="flex-1 space-y-10">
					<section>
						<Skeleton className="h-10 w-64 mb-4" />
						<Skeleton className="h-6 w-full max-w-2xl mb-6" />
						<Skeleton className="h-24 w-full rounded-lg" />
					</section>

					<section>
						<Skeleton className="h-8 w-48 mb-4" />
						<Skeleton className="h-6 w-full max-w-xl mb-6" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton key={i} className="h-40 w-full rounded-lg" />
							))}
						</div>
					</section>

					<section>
						<Skeleton className="h-8 w-48 mb-4" />
						<Skeleton className="h-6 w-full max-w-xl mb-6" />
						<div className="space-y-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-24 w-full rounded-lg" />
							))}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
