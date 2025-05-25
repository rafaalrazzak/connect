"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isResent, setIsResent] = useState(false);

	// In a real app, this would come from the registration process or URL params
	const userEmail = "user@example.com";

	const handleResendEmail = async () => {
		setIsLoading(true);
		setError(null);
		setIsResent(false);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Simulate successful resend
			setIsResent(true);
		} catch (err) {
			setError("Failed to resend verification email. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// This would be called when the user clicks on the verification link in their email
	const handleVerify = async () => {
		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Redirect to login page after successful verification
			router.push("/login");
		} catch (err) {
			setError("Failed to verify email. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md border-muted/80 shadow-lg">
			<CardHeader className="space-y-1">
				<div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
					<Mail className="h-8 w-8 text-primary" />
				</div>
				<CardTitle className="text-2xl font-bold text-center">
					Verify Your Email
				</CardTitle>
				<CardDescription className="text-center">
					We&apos;ve sent a verification email to{" "}
					<span className="font-medium">{userEmail}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{isResent && (
					<Alert className="bg-green-50 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
						<AlertDescription className="text-green-800">
							Verification email has been resent successfully.
						</AlertDescription>
					</Alert>
				)}

				<div className="bg-muted/50 rounded-lg p-4 text-sm">
					<p>
						Please check your email and click on the verification link to
						complete your registration.
					</p>
					<p className="mt-2">
						If you don&apos;t see the email, check your spam folder.
					</p>
				</div>

				{/* For demo purposes, adding a button to simulate clicking the verification link */}
				<Button
					variant="outline"
					className="w-full"
					onClick={handleVerify}
					disabled={isLoading}
				>
					{isLoading ? "Verifying..." : "Simulate Email Verification"}
				</Button>
			</CardContent>
			<CardFooter className="flex flex-col space-y-4">
				<div className="text-center text-sm">
					Didn&apos;t receive the email?{" "}
					<Button
						variant="link"
						className="p-0 h-auto text-primary"
						onClick={handleResendEmail}
						disabled={isLoading}
					>
						{isLoading ? "Sending..." : "Resend verification email"}
					</Button>
				</div>
				<div className="text-center text-sm">
					<Link href="/login" className="text-primary hover:underline">
						Back to login
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
