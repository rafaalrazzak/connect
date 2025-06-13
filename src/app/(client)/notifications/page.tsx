"use client";

import { format, isToday, isYesterday } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PageHeader } from "@/components/page-header";
// Icons
import {
  AlertCircle,
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  Clock,
  MessageSquare,
  MoreVertical,
  Trash2,
} from "lucide-react";

// Types
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  timestamp?: Date; // For sorting and grouping
  type: "processing" | "completed" | "comment" | "reminder";
  reportId: string;
  read: boolean;
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Laporan kamu sedang diproses",
      description:
        "Laporan kerusakan jalan di Jalan Utama sekarang sedang ditangani oleh Dinas Pekerjaan Umum.",
      time: "Baru saja",
      timestamp: new Date(),
      type: "processing",
      reportId: "LP12345678",
      read: false,
    },
    {
      id: "2",
      title: "Laporan selesai",
      description: "Perbaikan lampu jalan di Jalan Oak sudah selesai.",
      time: "2 jam yang lalu",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "completed",
      reportId: "LP87654321",
      read: false,
    },
    {
      id: "3",
      title: "Komentar baru di laporan kamu",
      description:
        "Dinas Kebersihan: 'Kami akan mengirim tim untuk membersihkan sampah besok pagi.'",
      time: "Kemarin, 15:30",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: "comment",
      reportId: "LP23456789",
      read: true,
    },
    {
      id: "4",
      title: "Diminta feedback",
      description:
        "Laporan kamu sudah diselesaikan. Mohon berikan feedback tentang penyelesaiannya.",
      time: "2 hari yang lalu",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: "reminder",
      reportId: "LP34567890",
      read: true,
    },
  ]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const getFilteredNotifications = (tab: string) => {
    switch (tab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "read":
        return notifications.filter((n) => n.read);
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifikasi"
        titleComponent={
          unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount} baru
            </Badge>
          )
        }
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllAsRead}
          className="text-sm rounded-full hover:bg-muted/80 flex items-center gap-1.5"
          disabled={unreadCount === 0}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Tandai dibaca</span>
        </Button>
      </PageHeader>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="size-full px-4 gap-4"
      >
        <TabsList className="flex size-full overflow-auto justify-start">
          <TabsTrigger value="all" className="w-full">
            Semua
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex gap-2 w-full">
            Belum Dibaca
            {unreadCount > 0 && (
              <Badge
                variant="default"
                className="shrink-0 bg-primary h-5 w-5 p-0 flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read" className="w-full">
            Sudah Dibaca
          </TabsTrigger>
        </TabsList>

        {["all", "unread", "read"].map((tab) => {
          const filteredNotifications = getFilteredNotifications(tab);

          return (
            <TabsContent key={tab} value={tab} className="mt-6">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-6">
                  <NotificationGroup
                    notifications={filteredNotifications}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <BellOff className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      Tidak ada notifikasi
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {tab === "unread"
                        ? "Semua notifikasi sudah dibaca"
                        : "Notifikasi akan muncul di sini"}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}

function formatNotificationDate(date: Date) {
  if (isToday(date)) {
    return "Hari Ini";
  }
  if (isYesterday(date)) {
    return "Kemarin";
  }
  return format(date, "d MMMM yyyy", { locale: id });
}

function NotificationGroup({
  notifications,
  onMarkAsRead,
  onDelete,
}: {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  // Group notifications by date
  const notificationsByDate: Record<string, Notification[]> = {};

  for (const notification of notifications) {
    const date = notification.timestamp || new Date();
    const dateKey = formatNotificationDate(date);

    if (!notificationsByDate[dateKey]) {
      notificationsByDate[dateKey] = [];
    }
    notificationsByDate[dateKey].push(notification);
  }

  return (
    <>
      {Object.entries(notificationsByDate).map(([date, notifications]) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {date}
            </h3>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "processing":
        return "bg-blue-500/10 text-blue-600";
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "comment":
        return "bg-amber-500/10 text-amber-600";
      case "reminder":
        return "bg-purple-500/10 text-purple-600";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "processing":
        return <Clock className="h-5 w-5" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5" />;
      case "comment":
        return <MessageSquare className="h-5 w-5" />;
      case "reminder":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case "processing":
        return "Diproses";
      case "completed":
        return "Selesai";
      case "comment":
        return "Komentar";
      case "reminder":
        return "Pengingat";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/report/${notification.reportId}`}>
        <Card
          className={`transition-all hover:shadow-md ${
            notification.read
              ? "bg-background"
              : "bg-background shadow-sm border-l-4"
          } ${
            !notification.read
              ? `border-l-${
                  notification.type === "processing"
                    ? "blue"
                    : notification.type === "completed"
                    ? "green"
                    : notification.type === "comment"
                    ? "amber"
                    : "purple"
                }-500`
              : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                  notification.type
                )}`}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`px-2 py-0 text-xs font-normal ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationTitle(notification.type)}
                      </Badge>
                      {!notification.read && (
                        <Badge
                          className="bg-primary h-2 w-2 p-0 rounded-full"
                          aria-label="Belum dibaca"
                        />
                      )}
                    </div>
                    <h3 className="font-medium mt-1.5">{notification.title}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <div
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                  }
                }}
                className="self-start mt-1"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8 hover:bg-muted/80"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu notifikasi</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {!notification.read && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          onMarkAsRead(notification.id);
                        }}
                        className="cursor-pointer"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        <span>Tandai sudah dibaca</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(notification.id);
                      }}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Hapus notifikasi</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
