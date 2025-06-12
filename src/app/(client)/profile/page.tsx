"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Feature Components
import { PageHeader } from "@/components/page-header";
import { ReportCard } from "@/components/report-card";
import { EmptyState } from "@/components/reports/empty-state";

// Data & Types
import { reports } from "@/lib/mock-data";
import { ReportStatusEnum } from "@/types/report";

// Icons
import {
  AlertCircle,
  Award,
  BarChart3,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit,
  HelpCircle,
  LogOut,
  Settings,
  Star,
  TrendingUp,
  User,
} from "lucide-react";

// Constants
const USER_DATA = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "Jakarta, Indonesia",
  level: 3,
  experience: 75,
  badges: [
    { label: "Pelapor Aktif", icon: Award, color: "amber" },
    { label: "Level 3", icon: Star, color: "blue" },
    { label: "Terverifikasi", icon: CheckCircle, color: "green" },
  ],
};

const STATS_DATA = [
  {
    label: "Total Laporan",
    value: reports.length,
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Diselesaikan",
    value: reports.filter((r) => r.status === ReportStatusEnum.Completed)
      .length,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Kontribusi",
    value: "75%",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const SETTINGS_ITEMS = [
  {
    title: "Pengaturan Akun",
    description: "Email, password, dan informasi profil",
    icon: User,
    href: "/profile/account",
  },
  {
    title: "Bantuan & Dukungan",
    description: "Dapatkan bantuan untuk masalah yang kamu alami",
    icon: HelpCircle,
    href: "/help",
  },
];

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Profile Header Component
const ProfileHeader = memo(() => (
  <Card className="overflow-hidden border-0 shadow-sm">
    {/* Cover Image */}
    <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </div>

    <CardContent className="p-6 -mt-16 relative">
      <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-6">
        {/* Avatar */}
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-2 ring-primary/10">
            <AvatarImage src="/placeholder-user.jpg" alt={USER_DATA.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
              {USER_DATA.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {USER_DATA.name}
              </h1>
              <p className="text-muted-foreground">{USER_DATA.email}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {USER_DATA.badges.map((badge) => (
              <Badge
                key={badge.label}
                variant="secondary"
                className={`
                  ${
                    badge.color === "amber"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : ""
                  }
                  ${
                    badge.color === "blue"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : ""
                  }
                  ${
                    badge.color === "green"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : ""
                  }
                `}
              >
                <badge.icon className="h-3 w-3 mr-1" />
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS_DATA.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={slideUp}
            transition={{ delay: index * 0.1 }}
            className={`text-center p-4 rounded-xl ${stat.bgColor} border border-border/50`}
          >
            <div className="flex items-center justify-center mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-lg font-semibold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Progress Level</span>
          </div>
          <span className="text-sm font-medium text-primary">75/100 XP</span>
        </div>
        <Progress value={USER_DATA.experience} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Level {USER_DATA.level}</span>
          <span>Level {USER_DATA.level + 1}</span>
        </div>
      </div>
    </CardContent>
  </Card>
));

ProfileHeader.displayName = "ProfileHeader";

// Reports Tab Component
const ReportsTab = memo(() => {
  const [activeFilter, setActiveFilter] = useState("all");

  const reportCategories = {
    all: { reports, label: "Semua", count: reports.length },
    pending: {
      reports: reports.filter((r) => r.status === ReportStatusEnum.Pending),
      label: "Menunggu",
      count: reports.filter((r) => r.status === ReportStatusEnum.Pending)
        .length,
    },
    progress: {
      reports: reports.filter((r) => r.status === ReportStatusEnum.InProgress),
      label: "Diproses",
      count: reports.filter((r) => r.status === ReportStatusEnum.InProgress)
        .length,
    },
    completed: {
      reports: reports.filter((r) => r.status === ReportStatusEnum.Completed),
      label: "Selesai",
      count: reports.filter((r) => r.status === ReportStatusEnum.Completed)
        .length,
    },
  };

  const StatusBadge = ({
    count,
    variant,
  }: {
    count: number;
    variant: string;
  }) => {
    if (count === 0) return null;
    const colors = {
      all: "bg-primary",
      pending: "bg-amber-500",
      progress: "bg-blue-500",
      completed: "bg-green-500",
    };
    return (
      <Badge
        className={`size-5  flex items-center justify-center p-0 text-white text-xs ${
          colors[variant as keyof typeof colors]
        }`}
      >
        {count}
      </Badge>
    );
  };

  const EmptyStateComponent = ({ status }: { status: string }) => {
    const states = {
      pending: { icon: Clock, message: "Tidak ada laporan yang menunggu" },
      progress: {
        icon: AlertCircle,
        message: "Tidak ada laporan yang diproses",
      },
      completed: {
        icon: CheckCircle,
        message: "Tidak ada laporan yang selesai",
      },
    };
    const state = states[status as keyof typeof states];
    return state ? (
      <EmptyState icon={state.icon} message={state.message} />
    ) : null;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="size-full justify-normal overflow-x-auto">
          {Object.entries(reportCategories).map(([key, { label, count }]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-1 w-full"
            >
              {label}
              <StatusBadge count={count} variant={key} />
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(reportCategories).map(
          ([key, { reports: categoryReports }]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {categoryReports.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  animate="animate"
                  className="space-y-4"
                >
                  {categoryReports.slice(0, 5).map((report) => (
                    <motion.div key={report.id} variants={slideUp}>
                      <ReportCard report={report} />
                    </motion.div>
                  ))}
                  {categoryReports.length > 5 && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        Lihat Semua Laporan
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <EmptyStateComponent status={key} />
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
});

ReportsTab.displayName = "ReportsTab";

// Settings Tab Component
const SettingsTab = memo(() => {
  const handleLogout = useCallback(() => {
    console.log("Logout clicked");
  }, []);

  return (
    <div className="space-y-6">
      {/* Settings Sections */}
      <div className="space-y-4">
        {SETTINGS_ITEMS.map((item, index) => (
          <motion.div
            key={item.title}
            variants={slideUp}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <Link href={item.href}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator />

      {/* Logout Button */}
      <motion.div variants={slideUp} transition={{ delay: 0.4 }}>
        <Button
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar dari Akun
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={slideUp}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground space-y-1 pt-4"
      >
        <p className="font-medium">Citizen Connect v1.0.0</p>
        <p>© 2025 Citizen Connect. All rights reserved.</p>
      </motion.div>
    </div>
  );
});

SettingsTab.displayName = "SettingsTab";

// Main Profile Component
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <>
      <PageHeader title="Profil Saya" />

      {/* Profile Header */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <ProfileHeader />
      </motion.div>

      {/* Main Tabs */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="w-full">
            <TabsTrigger value="reports" className="w-full">
              Laporan Saya
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full">
              Pengaturan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="focus-visible:outline-none">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="settings" className="focus-visible:outline-none">
            <motion.div variants={staggerContainer} animate="animate">
              <SettingsTab />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
}
