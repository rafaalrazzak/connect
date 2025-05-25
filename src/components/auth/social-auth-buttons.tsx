"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SocialAuthButtonsProps {
	isLoading?: boolean;
	onSocialAuth: (provider: string) => void;
	mode?: "login" | "register";
}

export default function SocialAuthButtons({
	isLoading,
	onSocialAuth,
	mode = "login",
}: SocialAuthButtonsProps) {
	const buttonText = mode === "login" ? "Sign in with" : "Sign up with";

	return (
		<div className="grid grid-cols-2 gap-3">
			<Button
				variant="outline"
				className="w-full"
				disabled={isLoading}
				onClick={() => onSocialAuth("google")}
			>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
				)}
				{buttonText} Google
			</Button>

			<Button
				variant="outline"
				className="w-full"
				disabled={isLoading}
				onClick={() => onSocialAuth("facebook")}
			>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
						<path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
					</svg>
				)}
				{buttonText} Facebook
			</Button>

			<Button
				variant="outline"
				className="w-full"
				disabled={isLoading}
				onClick={() => onSocialAuth("apple")}
			>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M16.7023 0C15.0734 0.0936 13.2312 1.0535 12.1205 2.36C11.1205 3.54 10.2932 5.2465 10.5932 6.9C12.3796 6.9666 14.2312 5.9733 15.3046 4.6333C16.3046 3.3733 17.0734 1.6933 16.7023 0Z" />
						<path d="M21.8096 8.1C20.6096 6.6 18.8823 5.7 17.2232 5.7C15.0232 5.7 14.0232 6.6 12.5823 6.6C11.0823 6.6 9.75504 5.7 7.88686 5.7C6.02777 5.7 4.09595 6.8 2.89595 8.7C1.15504 11.4 1.42232 16.5 4.22232 20.7C5.22232 22.2 6.55504 23.9 8.28686 24C9.88686 24.1 10.2869 23.1 12.5869 23.1C14.8869 23.1 15.2232 24.1 16.8232 24C18.5551 23.9 19.8869 22.2 20.8869 20.7C21.6232 19.6 21.8869 19.1 22.4232 17.8C18.0869 16.2 17.4232 10.1 21.8096 8.1Z" />
					</svg>
				)}
				{buttonText} Apple
			</Button>

			<Button
				variant="outline"
				className="w-full"
				disabled={isLoading}
				onClick={() => onSocialAuth("twitter")}
			>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
				)}
				{buttonText} X
			</Button>
		</div>
	);
}
