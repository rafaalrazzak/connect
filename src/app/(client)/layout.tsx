import { BottomNavigation, NavigationLayout } from "@/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <NavigationLayout>
        {children}

        {/* <main className="max-w-screen-sm mx-auto min-h-screen">{children}</main>
			<BottomNavigation /> */}
      </NavigationLayout>
    </div>
  );
}
