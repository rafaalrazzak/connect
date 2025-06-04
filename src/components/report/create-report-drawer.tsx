"use client";

import { Slot } from "@radix-ui/react-slot";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, memo, useCallback, useEffect } from "react";

// UI Components
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

// Icons
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Plus,
  X,
} from "lucide-react";

// Form Steps
import { CategoryStep } from "./steps/category-step";
import { DetailsStep } from "./steps/details-step";
import { LocationStep } from "./steps/location-step";
import { PhotoStep } from "./steps/photo-step";
import { ReviewStep } from "./steps/review-step";

import { useReportForm } from "@/hooks/use-report-form";
// Utils & Hooks
import { cn } from "@/lib/utils";

// Server actions
import {
  reverseGeocode,
  submitReport,
  uploadImages,
  validateStepData,
} from "@/actions/report-actions";

import { STEPS } from "@/config/report-steps";
import { useReportDrawer } from "@/contexts/report-drawer-context";
import { categories } from "@/lib/mock-data";
// Types & Config
import type {
  Category,
  PreviewImage,
  ReportFormData,
  StepConfig,
} from "@/types/report";

// Default form data
const DEFAULT_FORM_DATA: ReportFormData = {
  title: "",
  description: "",
  location: "",
  anonymous: false,
  contact: "",
};

// Props interfaces
interface CreateReportDrawerProps {
  children?: React.ReactNode;
  className?: string;
  prefillData?: Partial<ReportFormData>;
  onSuccess?: () => void;
  isOpen?: boolean; // Add this prop
  setIsOpen?: (open: boolean) => void; // Add this prop
}

interface DrawerContentProps extends Omit<CreateReportDrawerProps, "children"> {
  onClose: () => void;
  open: boolean;
}

/**
 * CreateReportDrawer component with Next.js server action integration
 */
export default function CreateReportDrawer() {
  const { isOpen, closeDrawer, prefillData, onSuccess } = useReportDrawer();

  // Close handler with state reset
  const handleClose = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <Suspense>
        <DrawerContentWrapper
          open={isOpen}
          onClose={handleClose}
          className=""
          prefillData={prefillData}
          onSuccess={onSuccess}
        />
      </Suspense>
    </Drawer>
  );
}

/**
 * Drawer Content Wrapper component
 * Separate component to prevent unnecessary re-renders of the main drawer
 */
const DrawerContentWrapper = memo(function DrawerContentWrapper({
  open,
  onClose,
  prefillData,
  className,
  onSuccess,
}: DrawerContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // // Handle form state and logic
  const {
    form,
    formState: {
      step,
      isPending,
      error,
      showConfirmDialog,
      selectedCategory,
      previewImages,
    },
    contentRef,
    handlers: {
      setStep,
      setShowConfirmDialog,
      setSelectedCategory,
      handleInputChange,
      handleCheckboxChange,
      handleNextStep,
      handlePrevStep,
      handleSubmit,
      handleImageUpload,
      removeImage,
      resetForm,
      handleUseCurrentLocation,
    },
  } = useReportForm({
    defaultData: DEFAULT_FORM_DATA,
    onSubmitSuccess: ({ report }) => {
      const reportType = selectedCategory?.name || "Laporan";

      console.log(report);

      // Call any provided success callback
      onSuccess?.();

      // Close the drawer
      onClose();

      // Navigate to success page with the actual report ID and type
      router.push(`/report/success/?id=${report.id}&type=${reportType}`, {
        scroll: false, // Prevent scroll restoration
      });
    },
    serverActions: {
      validateStepData,
      uploadImages,
      submitReport,
      reverseGeocode,
    },
  });

  // // Initialize with URL params or prefill data when opening
  useEffect(() => {
    if (!open) return;

    let initialData = { ...DEFAULT_FORM_DATA };
    let startStep = 1;

    // Check URL params first
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const location = searchParams.get("location");
    const categoryId = searchParams.get("categoryId") || prefillData?.category;
    const anonymous = searchParams.get("anonymous") === "true";

    // Override with URL params if present
    if (title) {
      initialData.title = title;
      startStep = Math.max(startStep, 2);
    }

    if (description) {
      initialData.description = description;
      startStep = Math.max(startStep, 2);
    }

    if (location) {
      initialData.location = location;
      startStep = Math.max(startStep, 4);
    }

    if (anonymous !== undefined) {
      initialData.anonymous = anonymous;
    }

    // Then override with prefill data if provided
    if (prefillData) {
      // Filter out undefined values from prefillData before merging
      const filteredPrefillData = Object.fromEntries(
        Object.entries(prefillData).filter(([_, value]) => value !== undefined)
      ) as Partial<ReportFormData>;

      // Ensure the merged data has only string or boolean values
      initialData = {
        ...initialData,
        ...filteredPrefillData,
      };

      if (prefillData.title || prefillData.description)
        startStep = Math.max(startStep, 2);
      if (prefillData.location) startStep = Math.max(startStep, 4);
    }

    // Apply the initial data
    const hasFormChanges = Object.entries(initialData).some(([key, value]) => {
      const defaultValue =
        DEFAULT_FORM_DATA[key as keyof typeof DEFAULT_FORM_DATA];
      return value !== defaultValue;
    });

    if (hasFormChanges) {
      // Update each field individually
      for (const [key, value] of Object.entries(initialData)) {
        if (key && value !== undefined) {
          handleInputChange({
            target: { name: key, value },
          } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
        }
      }
    }

    // Handle category prefill
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        setSelectedCategory({
          ...category,
        });
        // Skip to step 2 if a category was selected
        startStep = Math.max(startStep, 2);
      }
    }

    // Apply the calculated start step
    if (startStep > 1) {
      setStep(startStep);
    }
  }, [
    open,
    searchParams,
    prefillData,
    handleInputChange,
    setSelectedCategory,
    setStep,
  ]);

  // // Current step info
  const currentStep = STEPS[step - 1];

  return (
    <>
      <DrawerContent
        className={cn("max-h-screen max-w-screen-md mx-auto", className)}
      >
        <div className="mx-auto w-full">
          <DrawerHeader className="px-5 pt-5 pb-3 sm:px-6">
            {/* Progress Steps */}
            <StepIndicator
              steps={STEPS}
              currentStep={step}
              setStep={step > 1 ? setStep : undefined}
            />

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
              {currentStep.tip}
            </div>
          </div>

          {/* Content Area */}
          <div
            ref={contentRef}
            className="px-5 sm:px-6 overflow-y-auto max-h-[calc(85vh-300px)] py-5 space-y-6"
          >
            {/* Error message */}
            {error && (
              <Alert variant="destructive" style="solid">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading overlay */}
            {isPending && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[999] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Memproses...</p>
                </div>
              </div>
            )}

            {/* Step Components */}
            <StepContent
              step={step}
              formData={form}
              selectedCategory={selectedCategory}
              previewImages={previewImages}
              setSelectedCategory={setSelectedCategory}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleUseCurrentLocation={handleUseCurrentLocation}
              setStep={setStep}
            />
          </div>

          {/* Footer Buttons */}
          <DrawerFooter className="px-5 py-4 sm:px-6 border-t">
            <div className="flex gap-3">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex-1 gap-2"
                  disabled={isPending}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </Button>
              ) : (
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={isPending}
                    onClick={resetForm}
                  >
                    Batal
                  </Button>
                </DrawerClose>
              )}

              {step < STEPS.length ? (
                <Button
                  onClick={handleNextStep}
                  className="flex-1 gap-2"
                  disabled={isPending}
                >
                  Lanjut
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    <>
                      Kirim Laporan
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batal membuat laporan?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua data yang telah diisi akan hilang. Apakah Anda yakin ingin
              membatalkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali ke Form</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm();
                onClose();
                setShowConfirmDialog(false);
              }}
            >
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

/**
 * Step indicator component
 */
const StepIndicator = memo(function StepIndicator({
  steps,
  currentStep,
  setStep,
}: {
  steps: StepConfig[];
  currentStep: number;
  setStep?: (step: number) => void;
}) {
  return (
    <div className="flex justify-between mb-5 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
      {steps.map((s, i) => {
        const isClickable = !!setStep && currentStep > i + 1;

        return (
          <button
            key={s.id}
            type="button"
            className={cn(
              "relative bg-transparent border-0 p-0 outline-none transition-transform",
              isClickable
                ? "hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary"
                : "cursor-default"
            )}
            onClick={() => isClickable && setStep(i + 1)}
            disabled={!isClickable}
            tabIndex={isClickable ? 0 : -1}
            aria-label={`Go to step ${i + 1}: ${s.title}`}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                i + 1 < currentStep
                  ? "bg-primary text-white"
                  : i + 1 === currentStep
                  ? "bg-primary/90 text-white ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1 < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">{i + 1}</span>
              )}
            </div>

            {/* Step title tooltip on hover */}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
              {s.title}
            </span>
          </button>
        );
      })}
    </div>
  );
});

/**
 * Step content component
 */
const StepContent = memo(function StepContent({
  step,
  formData,
  selectedCategory,
  previewImages,
  setSelectedCategory,
  handleInputChange,
  handleCheckboxChange,
  handleImageUpload,
  removeImage,
  handleUseCurrentLocation,
  setStep,
}: {
  step: number;
  formData: ReportFormData;
  selectedCategory: Category | null;
  previewImages: PreviewImage[];
  setSelectedCategory: (category: Category | null) => void;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (files: FileList) => void;
  removeImage: (index: number) => void;
  handleUseCurrentLocation: () => void;
  setStep: (step: number) => void;
}) {
  switch (step) {
    case 1:
      return (
        <CategoryStep
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      );
    case 2:
      return (
        <DetailsStep
          formData={formData}
          onChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />
      );
    case 3:
      return (
        <PhotoStep
          images={previewImages}
          onAddImages={handleImageUpload}
          onRemoveImage={removeImage}
        />
      );
    case 4:
      return (
        <LocationStep
          location={formData.location}
          onChange={handleInputChange}
          onUseCurrentLocation={handleUseCurrentLocation}
        />
      );
    case 5:
      return (
        <ReviewStep
          formData={formData}
          selectedCategory={selectedCategory}
          previewImages={previewImages}
          onEditStep={setStep}
        />
      );
    default:
      return null;
  }
});

/**
 * Add this export for convenience
 */
export function ReportButton({
  children,
  className,
  onClick,
  prefillData,
  asChild = false,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  prefillData?: Partial<ReportFormData>;
  asChild?: boolean;
}) {
  const { openDrawer } = useReportDrawer();

  const handleClick = () => {
    openDrawer({
      prefillData,
    });
    onClick?.();
  };

  const defaultContent = (
    <>
      <Plus className="mr-2 h-4 w-4" /> Buat Laporan
    </>
  );

  if (asChild) {
    return (
      <button type="button" onClick={handleClick} className={className}>
        {children || defaultContent}
      </button>
    );
  }

  return (
    <Button onClick={handleClick} className={className}>
      {children || defaultContent}
    </Button>
  );
}
