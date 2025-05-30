"use client";

import { useReportDrawer } from "@/contexts/report-drawer-context";
import { cn } from "@/lib/utils";
import { Bell, Home, MapPin, Plus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  return (
    <div className="w-full py-4 px-6 lg:px-24 z-[999] sticky top-0 left-0 right-0 border-b bg-background/95 backdrop-blur-md mx-auto">
      <nav className="flex w-full">
        <Link href="/" className="text-primary flex w-full">
          <Image
            src="/logo.png"
            alt="Logo"
            width={300}
            height={100}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </nav>
    </div>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  const { openDrawer } = useReportDrawer();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Map",
      href: "/map",
      icon: MapPin,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="sticky max-w-screen-sm bottom-0 left-0 right-0 z-[999] border-t bg-background/95 backdrop-blur-md mx-auto">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
        <button
          type="button"
          onClick={() => openDrawer()}
          className="flex items-center justify-center w-14 h-14 rounded-full gradient-primary text-white shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Create new report"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
