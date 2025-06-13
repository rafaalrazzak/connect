"use client";

import { useReportDrawer } from "@/contexts/report-drawer-context";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { ActionCards } from "@/components/app/action-cards";
// Components
import { AppHeader } from "@/components/app/app-header";
import { CategoriesSection } from "@/components/app/categories-section";
import { ReportsTabs } from "@/components/app/reports-tabs";

function HomeContent() {
  const searchParams = useSearchParams();
  const { openDrawer } = useReportDrawer();

  // Auto-open drawer if query parameter is present
  useEffect(() => {
    if (searchParams.has("report")) {
      openDrawer();
    }
  }, [searchParams, openDrawer]);

  return (
    <>
      <AppHeader />

      <main className="space-y-6 mx-auto p-4">
        <ActionCards />
        <CategoriesSection />
        <ReportsTabs />
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
