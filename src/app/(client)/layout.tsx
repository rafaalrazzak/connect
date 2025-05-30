import { BottomNavigation, Navbar } from "@/components/navbar";
import { ReportDrawerProvider } from "@/contexts/report-drawer-context";
import CreateReportDrawer from "@/components/report/create-report-drawer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      {/* <Navbar /> */}
      <main className="max-w-screen-sm mx-auto min-h-screen">{children}</main>
      <BottomNavigation />
    </div>
  );
}
