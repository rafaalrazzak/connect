import Link from "next/link";

export default function ReportButton() {
	return (
		<Link href="/report/new">
			<div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
				<div className="flex items-center space-x-4">
					<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-6 h-6"
						>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
					</div>
					<div>
						<h3 className="font-bold text-lg">Report an Issue</h3>
						<p className="text-sm text-white/80">Quick and easy reporting</p>
					</div>
				</div>
			</div>
		</Link>
	);
}
