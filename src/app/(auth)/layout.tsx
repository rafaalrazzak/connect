import AuthContainer from "@/components/auth/auth-container";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="bg-background">
			<main className="max-w-screen-sm mx-auto min-h-screen">
				<AuthContainer>{children}</AuthContainer>
			</main>
		</div>
	);
}
