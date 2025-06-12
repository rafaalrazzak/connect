"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeTerms: false,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError(null);

		// Calculate password strength when password changes
		if (name === "password") {
			calculatePasswordStrength(value);
		}
	};

	const calculatePasswordStrength = (password: string) => {
		if (!password) {
			setPasswordStrength(0);
			return;
		}

		let strength = 0;
		// Length check
		if (password.length >= 8) strength += 25;
		// Contains lowercase
		if (/[a-z]/.test(password)) strength += 25;
		// Contains uppercase
		if (/[A-Z]/.test(password)) strength += 25;
		// Contains number or special char
		if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

		setPasswordStrength(strength);
	};

	const getPasswordStrengthText = () => {
		if (passwordStrength === 0) return "";
		if (passwordStrength <= 25) return "Weak";
		if (passwordStrength <= 75) return "Medium";
		return "Strong";
	};

	const getPasswordStrengthColor = () => {
		if (passwordStrength <= 25) return "bg-red-500";
		if (passwordStrength <= 75) return "bg-amber-500";
		return "bg-green-500";
	};

	const handleCheckboxChange = (checked: boolean) => {
		setFormData((prev) => ({ ...prev, agreeTerms: checked }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Validate form
			if (!formData.name) {
				throw new Error("Name is required");
			}
			if (!formData.email) {
				throw new Error("Email is required");
			}
			if (!formData.password) {
				throw new Error("Password is required");
			}
			if (formData.password !== formData.confirmPassword) {
				throw new Error("Passwords do not match");
			}
			if (!formData.agreeTerms) {
				throw new Error("You must agree to the terms and conditions");
			}
			if (passwordStrength < 50) {
				throw new Error("Please use a stronger password");
			}

			// Simulate successful registration
			router.push("/verify-email");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred during registration",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignup = async () => {
		setIsGoogleLoading(true);
		setError(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Simulate successful Google registration
			router.push("/");
		} catch (err) {
			setError("Failed to register with Google. Please try again.");
		} finally {
			setIsGoogleLoading(false);
		}
	};

	return (
		<>
			<div className="mb-8">
				<Link href="/" className="inline-block">
					<h1 className="text-2xl font-bold text-primary">Citizen Connect</h1>
				</Link>
			</div>

			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-2xl font-bold tracking-tight">
						Create an account
					</h1>
					<p className="text-muted-foreground">
						Join Citizen Connect to report issues in your community
					</p>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Button
					variant="outline"
					className="w-full h-12 relative"
					onClick={handleGoogleSignup}
					disabled={isGoogleLoading || isLoading}
				>
					{isGoogleLoading ? (
						<Loader2 className="h-5 w-5 animate-spin" />
					) : (
						<>
							<svg className="absolute left-4 h-5 w-5" viewBox="0 0 24 24">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							<span>Sign up with Google</span>
						</>
					)}
				</Button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-muted" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with email
						</span>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="name"
								name="name"
								placeholder="John Doe"
								value={formData.name}
								onChange={handleInputChange}
								disabled={isLoading}
								autoComplete="name"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="name@example.com"
								value={formData.email}
								onChange={handleInputChange}
								disabled={isLoading}
								autoComplete="email"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={formData.password}
								onChange={handleInputChange}
								disabled={isLoading}
								autoComplete="new-password"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
								tabIndex={-1}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
								<span className="sr-only">
									{showPassword ? "Hide password" : "Show password"}
								</span>
							</Button>
						</div>
						{formData.password && (
							<div className="space-y-1 mt-1">
								<div className="flex justify-between items-center">
									<Progress
										value={passwordStrength}
										className={`h-1 ${getPasswordStrengthColor()}`}
									/>
									<span className="text-xs text-muted-foreground ml-2">
										{getPasswordStrengthText()}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									Use 8+ characters with a mix of letters, numbers & symbols
								</p>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<div className="relative">
							<KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={formData.confirmPassword}
								onChange={handleInputChange}
								disabled={isLoading}
								autoComplete="new-password"
							/>
						</div>
					</div>

					<div className="flex items-start space-x-2 pt-2">
						<Checkbox
							id="terms"
							checked={formData.agreeTerms}
							onCheckedChange={handleCheckboxChange}
							disabled={isLoading}
							className="mt-1"
						/>
						<Label
							htmlFor="terms"
							className="text-sm font-normal cursor-pointer"
						>
							I agree to the{" "}
							<Link href="/terms" className="text-primary hover:underline">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link href="/privacy" className="text-primary hover:underline">
								Privacy Policy
							</Link>
						</Label>
					</div>

					<Button type="submit" className="w-full h-12" disabled={isLoading}>
						{isLoading ? (
							<Loader2 className="h-5 w-5 animate-spin mr-2" />
						) : null}
						{isLoading ? "Creating account..." : "Create Account"}
					</Button>
				</form>

				<div className="text-center text-sm">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-primary font-medium hover:underline"
					>
						Sign in
					</Link>
				</div>
			</div>
		</>
	);
}
