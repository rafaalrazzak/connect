"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children?: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex items-center justify-center min-h-screen p-4">
					<Card className="max-w-md w-full">
						<CardHeader>
							<div className="flex items-center gap-2 text-destructive">
								<AlertTriangle className="h-5 w-5" />
								<CardTitle>Something went wrong</CardTitle>
							</div>
							<CardDescription>
								An error occurred while rendering this page. Please try
								refreshing or contact support if the problem persists.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{this.state.error && (
								<div className="bg-muted p-3 rounded-md overflow-auto text-sm">
									<p className="font-mono">{this.state.error.toString()}</p>
								</div>
							)}
						</CardContent>
						<CardFooter className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
							>
								Refresh Page
							</Button>
							<Button onClick={() => (window.location.href = "/")}>
								Go to Home
							</Button>
						</CardFooter>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
