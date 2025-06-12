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
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Validate form
			if (!formData.password) {
				throw new Error("Password is required");
			}
			if (formData.password !== formData.confirmPassword) {
				throw new Error("Passwords do not match");
			}
			if (passwordStrength < 50) {
				throw new Error("Please use a stronger password");
			}

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Simulate successful password reset
			router.push("/login?reset=success");
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
					Reset Your Password
				</CardTitle>
				<CardDescription className="text-center">
					Create a new password for your Citizen Connect account
				</CardDescription>
			</CardHeader>
			<CardContent>
				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">New Password</Label>
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
							/>
						</div>
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Resetting..." : "Reset Password"}
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-muted-foreground">
					After resetting your password, you will be redirected to the login
					page.
				</p>
			</CardFooter>
		</Card>
	);
}
