"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReportForm } from "@/hooks/use-report-form";
import { cn } from "@/lib/utils";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	CheckCircle2,
	ClipboardList,
	ImagePlus,
	MapPin,
	Plus,
	Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CategoryStep } from "./steps/category-step";
import { DetailsStep } from "./steps/details-step";
import { LocationStep } from "./steps/location-step";
import { PhotoStep } from "./steps/photo-step";
import { ReviewStep } from "./steps/review-step";

interface CreateReportDrawerProps {
	children?: React.ReactNode;
	className?: string;
}

export default function CreateReportDrawer({
	children,
	className,
}: CreateReportDrawerProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const contentRef = useRef<HTMLDivElement>(
		null,
	) as React.RefObject<HTMLDivElement>;

	const {
		step,
		progress,
		formData,
		selectedCategory,
		previewImages,
		error,
		isSubmitting,
		setStep,
		setSelectedCategory,
		handleNextStep,
		handlePrevStep,
		handleSubmit,
		handleImageUpload,
		removeImage,
		handleInputChange,
		handleCheckboxChange,
		handleUseCurrentLocation,
		resetForm,
		setError,
	} = useReportForm({
		onSubmitSuccess: () => {
			setOpen(false);
			router.push("/report/success");
		},
		contentRef,
	});

	// Step data with icons and descriptions
	const steps = [
		{
			title: "Kategori",
			icon: Tag,
			description: "Pilih jenis masalahnya",
		},
		{
			title: "Detail",
			icon: ClipboardList,
			description: "Ceritakan masalahnya",
		},
		{
			title: "Foto",
			icon: ImagePlus,
			description: "Tambahkan foto",
		},
		{
			title: "Lokasi",
			icon: MapPin,
			description: "Tentukan lokasinya",
		},
		{
			title: "Kirim",
			icon: CheckCircle2,
			description: "Tinjau & kirim",
		},
	];

	// Helper messages for each step
	const tipMessages = [
		"Kategori yang tepat membantu penanganan lebih cepat",
		"Detail jelas memudahkan petugas mengatasi masalah",
		"Foto membantu petugas memahami situasi di lapangan",
		"Lokasi akurat membantu petugas menemukan masalah",
		"Pastikan informasi sudah benar sebelum mengirim",
	];

	const currentStep = steps[step - 1];

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent
				className={cn(
					"max-h-screen",
					isDesktop ? "max-w-screen-sm mx-auto rounded-t-xl shadow-xl" : "",
				)}
			>
				<div className="mx-auto w-full">
					<DrawerHeader className="px-5 pt-5 pb-3 sm:px-6">
						{/* Progress Steps */}
						<div className="flex justify-between mb-5 relative">
							<div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
							{steps.map((s, i) => (
								<button
									key={s.title}
									type="button"
									className="relative bg-transparent border-0 p-0"
									onClick={() => step > i + 1 && setStep(i + 1)}
									disabled={step <= i + 1}
									aria-label={`Go to step ${i + 1}: ${s.title}`}
								>
									<div
										className={cn(
											"w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
											i + 1 < step
												? "bg-primary text-white"
												: i + 1 === step
													? "bg-primary/90 text-white ring-4 ring-primary/20"
													: "bg-muted text-muted-foreground",
										)}
									>
										{i + 1 < step ? (
											<CheckCircle className="w-4 h-4" />
										) : (
											<span className="text-xs font-medium">{i + 1}</span>
										)}
									</div>
								</button>
							))}
						</div>

						{/* Title and Description */}
						<div className="flex gap-3">
							<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
								<currentStep.icon className="w-5 h-5" />
							</div>
							<div>
								<DrawerTitle className="text-xl font-semibold text-start">
									{currentStep.title}
								</DrawerTitle>
								<DrawerDescription>{currentStep.description}</DrawerDescription>
							</div>
						</div>
					</DrawerHeader>

					{/* Tip Message */}
					<div className="px-5 sm:px-6">
						<div className="bg-muted/40 rounded-lg px-4 py-3 text-sm text-muted-foreground">
							<span className="font-medium">Tips: </span>
							{tipMessages[step - 1]}
						</div>
					</div>

					{/* Content Area */}
					<div
						ref={contentRef}
						className="px-5 sm:px-6 overflow-y-auto max-h-[calc(85vh-220px)] py-5 space-y-6"
					>
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{/* Step Components */}
						{step === 1 && (
							<CategoryStep
								selectedCategory={selectedCategory}
								onSelect={setSelectedCategory}
							/>
						)}

						{step === 2 && (
							<DetailsStep
								formData={formData}
								onChange={handleInputChange}
								onCheckboxChange={handleCheckboxChange}
							/>
						)}

						{step === 3 && (
							<PhotoStep
								images={previewImages}
								onAddImages={handleImageUpload}
								onRemoveImage={removeImage}
							/>
						)}

						{step === 4 && (
							<LocationStep
								location={formData.location}
								onChange={handleInputChange}
								onUseCurrentLocation={handleUseCurrentLocation}
							/>
						)}

						{step === 5 && (
							<ReviewStep
								formData={formData}
								selectedCategory={selectedCategory}
								previewImages={previewImages}
								onEditStep={setStep}
							/>
						)}
					</div>

					{/* Footer Buttons */}
					<DrawerFooter className="px-5 py-4 sm:px-6 border-t">
						<div className="flex gap-3">
							{step > 1 ? (
								<Button
									variant="outline"
									onClick={handlePrevStep}
									className="flex-1 gap-2"
									disabled={isSubmitting}
								>
									<ArrowLeft className="w-4 h-4" />
									Kembali
								</Button>
							) : (
								<DrawerClose asChild>
									<Button
										variant="outline"
										className="flex-1"
										disabled={isSubmitting}
									>
										Batal
									</Button>
								</DrawerClose>
							)}

							{step < steps.length ? (
								<Button
									onClick={handleNextStep}
									className="flex-1 gap-2"
									disabled={isSubmitting}
								>
									Lanjut
									<ArrowRight className="w-4 h-4" />
								</Button>
							) : (
								<Button
									onClick={handleSubmit}
									className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										"Mengirim..."
									) : (
										<>
											Kirim
											<CheckCircle className="w-4 h-4" />
										</>
									)}
								</Button>
							)}
						</div>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
