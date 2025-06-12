"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Validate email
			if (!email) {
				throw new Error("Email is required");
			}

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Simulate successful submission
			setIsSubmitted(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full border-muted/80 shadow-lg">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center">
					Reset Password
				</CardTitle>
				<CardDescription className="text-center">
					Enter your email address and we&apos;ll send you a link to reset your
					password
				</CardDescription>
			</CardHeader>
			<CardContent>
				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{isSubmitted ? (
					<div className="space-y-4">
						<Alert className="bg-green-50 border-green-200">
							<AlertDescription className="text-green-800">
								If an account exists with the email{" "}
								<span className="font-medium">{email}</span>, you will receive
								password reset instructions.
							</AlertDescription>
						</Alert>
						<div className="text-center text-sm text-muted-foreground">
							Didn&apos;t receive the email? Check your spam folder or{" "}
							<Button
								variant="link"
								className="p-0 h-auto text-primary"
								onClick={() => setIsSubmitted(false)}
								disabled={isLoading}
							>
								try again
							</Button>
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
								/>
							</div>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Sending..." : "Send Reset Link"}
						</Button>
					</form>
				)}
			</CardContent>
			<CardFooter className="flex justify-center">
				<Link href="/login" className="text-sm text-primary hover:underline">
					Back to login
				</Link>
			</CardFooter>
		</Card>
	);
}
