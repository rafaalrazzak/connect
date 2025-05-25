"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { reportCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	Camera,
	Check,
	ChevronLeft,
	Info,
	MapPin,
	Upload,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateReportPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [progress, setProgress] = useState(20);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		anonymous: false,
		urgency: "medium",
	});

	// Update progress based on step
	useEffect(() => {
		setProgress(step * 20);
	}, [step]);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		// Limit to 3 images
		if (previewImages.length + files.length > 3) {
			setError("You can upload a maximum of 3 images");
			return;
		}

		setError(null);

		Array.from(files).forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImages((prev) => [...prev, reader.result as string]);
			};
			reader.readAsDataURL(file);
		});

		// Reset the input value to allow uploading the same file again
		e.target.value = "";
	};

	const removeImage = (index: number) => {
		setPreviewImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError(null);
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setFormData((prev) => ({ ...prev, [name]: checked }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			// Validate form
			if (!selectedCategory) {
				throw new Error("Please select a category");
			}
			if (!formData.title) {
				throw new Error("Please enter a title");
			}
			if (!formData.description) {
				throw new Error("Please enter a description");
			}
			if (!formData.location) {
				throw new Error("Please enter a location");
			}
			if (previewImages.length === 0) {
				throw new Error("Please upload at least one image");
			}

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Simulate successful submission
			router.push("/report/success");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			setIsSubmitting(false);
		}
	};

	const nextStep = () => {
		// Validate current step
		if (step === 1 && !selectedCategory) {
			setError("Please select a category");
			return;
		}
		if (step === 2 && (!formData.title || !formData.description)) {
			setError("Please fill in all required fields");
			return;
		}
		if (step === 3 && previewImages.length === 0) {
			setError("Please upload at least one image");
			return;
		}
		if (step === 4 && !formData.location) {
			setError("Please enter a location");
			return;
		}

		setError(null);
		if (step < 5) {
			setStep(step + 1);
			window.scrollTo(0, 0);
		}
	};

	const prevStep = () => {
		setError(null);
		if (step > 1) {
			setStep(step - 1);
			window.scrollTo(0, 0);
		} else {
			router.push("/");
		}
	};

	const getStepTitle = () => {
		switch (step) {
			case 1:
				return "Select Category";
			case 2:
				return "Report Details";
			case 3:
				return "Add Photos";
			case 4:
				return "Location";
			case 5:
				return "Review & Submit";
			default:
				return "Create Report";
		}
	};

	return (
		<div className="container px-4 py-6 space-y-6 pb-20">
			<div className="flex items-center space-x-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={prevStep}
					className="rounded-full"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-xl font-bold">{getStepTitle()}</h1>
			</div>

			<div className="space-y-2">
				<Progress value={progress} className="h-2 rounded-full" />
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>Step {step} of 5</span>
					<span>{progress}% Complete</span>
				</div>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Step 1: Category Selection */}
			{step === 1 && (
				<div className="space-y-6">
					<p className="text-muted-foreground">
						Choose the category that best describes the issue you're reporting.
					</p>

					<div className="grid grid-cols-2 gap-4">
						{reportCategories.map((category) => (
							<Card
								key={category.id}
								className={cn(
									"cursor-pointer transition-all duration-300 hover:shadow-md border-muted/80",
									selectedCategory === category.id
										? "ring-2 ring-primary/50 shadow-md transform scale-[1.02]"
										: "hover:scale-[1.02]",
								)}
								onClick={() => setSelectedCategory(category.id)}
							>
								<CardContent className="p-4 flex flex-col items-center justify-center text-center">
									<div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3">
										<category.icon className="h-7 w-7 text-primary" />
									</div>
									<span className="font-medium">{category.name}</span>
								</CardContent>
							</Card>
						))}
					</div>

					<Button
						className="w-full rounded-full"
						onClick={nextStep}
						disabled={!selectedCategory}
					>
						Continue
					</Button>
				</div>
			)}

			{/* Step 2: Report Details */}
			{step === 2 && (
				<div className="space-y-6">
					<p className="text-muted-foreground">
						Provide information about the issue you're reporting.
					</p>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">
								Title <span className="text-red-500">*</span>
							</Label>
							<Input
								id="title"
								name="title"
								placeholder="Brief description of the issue"
								value={formData.title}
								onChange={handleInputChange}
								className="rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">
								Description <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="description"
								name="description"
								placeholder="Provide details about the issue"
								className="min-h-[150px] rounded-lg"
								value={formData.description}
								onChange={handleInputChange}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="urgency">Urgency Level</Label>
							<Tabs
								defaultValue={formData.urgency}
								className="w-full"
								onValueChange={(v) =>
									setFormData((prev) => ({ ...prev, urgency: v }))
								}
							>
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="low" className="rounded-l-lg">
										Low
									</TabsTrigger>
									<TabsTrigger value="medium">Medium</TabsTrigger>
									<TabsTrigger value="high" className="rounded-r-lg">
										High
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="anonymous"
								name="anonymous"
								checked={formData.anonymous}
								onChange={handleCheckboxChange}
								className="rounded border-gray-300 text-primary focus:ring-primary"
							/>
							<Label
								htmlFor="anonymous"
								className="text-sm font-normal cursor-pointer"
							>
								Submit anonymously (your identity will not be shared publicly)
							</Label>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1 rounded-full"
							onClick={prevStep}
						>
							Back
						</Button>
						<Button
							className="flex-1 rounded-full"
							onClick={nextStep}
							disabled={!formData.title || !formData.description}
						>
							Continue
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Photo Upload */}
			{step === 3 && (
				<div className="space-y-6">
					<p className="text-muted-foreground">
						Upload photos of the issue to help authorities better understand the
						problem.
					</p>

					<div className="space-y-4">
						<div className="grid grid-cols-3 gap-3">
							{previewImages.map((image, index) => (
								<div
									key={index}
									className="relative aspect-square rounded-lg overflow-hidden border border-muted"
								>
									<img
										src={image || "/placeholder.svg"}
										alt={`Preview ${index + 1}`}
										className="w-full h-full object-cover"
									/>
									<Button
										variant="destructive"
										size="icon"
										className="absolute top-1 right-1 h-6 w-6 rounded-full"
										onClick={() => removeImage(index)}
									>
										<X className="h-3 w-3" />
									</Button>
								</div>
							))}

							{previewImages.length < 3 && (
								<Label
									htmlFor="photo-upload"
									className="border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:border-primary/50 transition-colors aspect-square"
								>
									<Camera className="h-8 w-8 text-muted-foreground mb-2" />
									<span className="text-sm text-center text-muted-foreground">
										Add Photo
									</span>
									<Input
										id="photo-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleImageUpload}
										multiple
									/>
								</Label>
							)}
						</div>

						<Alert className="bg-blue-50 border-blue-200">
							<Info className="h-4 w-4 text-blue-600" />
							<AlertDescription className="text-blue-800 text-sm">
								You can upload up to 3 photos. Clear images help authorities
								respond more effectively.
							</AlertDescription>
						</Alert>
					</div>

					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1 rounded-full"
							onClick={prevStep}
						>
							Back
						</Button>
						<Button
							className="flex-1 rounded-full"
							onClick={nextStep}
							disabled={previewImages.length === 0}
						>
							Continue
						</Button>
					</div>
				</div>
			)}

			{/* Step 4: Location */}
			{step === 4 && (
				<div className="space-y-6">
					<p className="text-muted-foreground">
						Specify where the issue is located.
					</p>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="location">
								Address <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="location"
									name="location"
									placeholder="Enter the location address"
									value={formData.location}
									onChange={handleInputChange}
									className="rounded-lg pl-10"
								/>
							</div>
							<Button variant="outline" size="sm" className="mt-2">
								<MapPin className="h-4 w-4 mr-2" />
								Use Current Location
							</Button>
						</div>

						<div className="h-[200px] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
							<MapPin className="h-6 w-6 text-muted-foreground" />
							<span className="text-sm text-muted-foreground ml-2">
								Map location
							</span>
						</div>

						<Alert className="bg-amber-50 border-amber-200">
							<AlertTriangle className="h-4 w-4 text-amber-600" />
							<AlertDescription className="text-amber-800 text-sm">
								Please ensure the location is accurate to help authorities
								respond effectively.
							</AlertDescription>
						</Alert>
					</div>

					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1 rounded-full"
							onClick={prevStep}
						>
							Back
						</Button>
						<Button
							className="flex-1 rounded-full"
							onClick={nextStep}
							disabled={!formData.location}
						>
							Continue
						</Button>
					</div>
				</div>
			)}

			{/* Step 5: Review & Submit */}
			{step === 5 && (
				<form onSubmit={handleSubmit} className="space-y-6">
					<p className="text-muted-foreground">
						Review your report details before submitting.
					</p>

					<div className="space-y-4">
						<Card className="border-muted/80">
							<CardContent className="p-4 space-y-4">
								<div className="flex justify-between items-center">
									<h3 className="font-semibold">Report Summary</h3>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setStep(1)}
										className="h-8"
									>
										Edit
									</Button>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<p className="text-sm text-muted-foreground">Category</p>
										<p className="font-medium">
											{reportCategories.find((c) => c.id === selectedCategory)
												?.name || "Not selected"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Urgency</p>
										<p className="font-medium capitalize">{formData.urgency}</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">Title</p>
										<p className="font-medium">{formData.title}</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">Description</p>
										<p className="text-sm">{formData.description}</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">Location</p>
										<p className="font-medium">{formData.location}</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">
											Reporting as
										</p>
										<p className="font-medium">
											{formData.anonymous ? "Anonymous" : "John Doe (You)"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="space-y-2">
							<p className="font-medium">Photos</p>
							<div className="flex gap-2 overflow-x-auto pb-2">
								{previewImages.map((image, index) => (
									<div
										key={index}
										className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-muted"
									>
										<img
											src={image || "/placeholder.svg"}
											alt={`Preview ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</div>
								))}
								<Button
									variant="outline"
									onClick={() => setStep(3)}
									className="w-24 h-24 flex-shrink-0 rounded-lg flex flex-col items-center justify-center gap-1"
								>
									<Upload className="h-5 w-5" />
									<span className="text-xs">Edit</span>
								</Button>
							</div>
						</div>

						<Alert className="bg-green-50 border-green-200">
							<Check className="h-4 w-4 text-green-600" />
							<AlertDescription className="text-green-800 text-sm">
								Your report will be sent to the relevant authorities for review
								and action.
							</AlertDescription>
						</Alert>
					</div>

					<div className="flex gap-3">
						<Button
							type="button"
							variant="outline"
							className="flex-1 rounded-full"
							onClick={prevStep}
						>
							Back
						</Button>
						<Button
							type="submit"
							className="flex-1 rounded-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Submit Report"}
						</Button>
					</div>
				</form>
			)}
		</div>
	);
}
