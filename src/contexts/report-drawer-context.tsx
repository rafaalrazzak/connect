"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ReportFormData } from "@/types/report";

interface DrawerOptions {
  prefillData?: Partial<ReportFormData>;
  onSuccess?: () => void;
}

interface ReportDrawerContextType {
  isOpen: boolean;
  prefillData?: Partial<ReportFormData>;
  onSuccess?: () => void;
  openDrawer: (options?: DrawerOptions) => void;
  closeDrawer: () => void;
}

const ReportDrawerContext = createContext<ReportDrawerContextType | undefined>(
  undefined
);

export function ReportDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<
    Partial<ReportFormData> | undefined
  >();
  const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>();

  const openDrawer = useCallback((options: DrawerOptions = {}) => {
    setPrefillData(options.prefillData);
    setOnSuccess(() => options.onSuccess);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ReportDrawerContext.Provider
      value={{
        isOpen,
        prefillData,
        onSuccess,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </ReportDrawerContext.Provider>
  );
}

export function useReportDrawer() {
  const context = useContext(ReportDrawerContext);
  if (!context) {
    throw new Error(
      "useReportDrawer must be used within a ReportDrawerProvider"
    );
  }
  return context;
}
