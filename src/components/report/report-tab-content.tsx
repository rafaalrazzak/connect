"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ExternalLink,
  MapPin,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import { type Dispatch, useMemo, useState } from "react";
import { CommentSection } from "./comment-section";
import { TimelineSection } from "./timeline-section";
import type { Report } from "@/types/report";

// Lazy load the map component
const LocationMap = dynamic(() => import("@/components/location-map"), {
  loading: () => (
    <div className="h-[240px] bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <MapPin className="h-8 w-8 animate-pulse opacity-70" />
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export function ReportTabContent({
  report,
  activeTab,
  setActiveTab,
}: {
  report: Report;
  activeTab: string;
  setActiveTab: any;
}) {
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState(null);

  // Generate timeline data
  const timeline = useMemo(
    () => [
      {
        title: "Laporan Diterima",
        date: report.date,
        description:
          "Laporan telah diterima dan sedang dalam proses verifikasi.",
      },
      {
        title: "Verifikasi",
        date: new Date(
          new Date(report.date).getTime() + 2 * 24 * 60 * 60 * 1000
        ),
        description:
          "Laporan telah diverifikasi dan diteruskan ke departemen terkait.",
      },
      {
        title: "Dalam Penanganan",
        date: new Date(
          new Date(report.date).getTime() + 3 * 24 * 60 * 60 * 1000
        ),
        description: "Tim lapangan sedang menangani masalah ini.",
      },
      {
        title: "Selesai",
        date: new Date(
          new Date(report.date).getTime() + 10 * 24 * 60 * 60 * 1000
        ),
        description: "Masalah telah diselesaikan dan laporan ditutup.",
      },
    ],
    [report.date]
  );

  // Define the current step for the timeline
  const currentStep = useMemo(() => {
    return report.status === "completed"
      ? timeline.length - 1
      : report.status === "in_progress"
      ? 2
      : report.status === "rejected"
      ? -1
      : 1;
  }, [report.status, timeline]);

  // Mock comments data
  const comments = useMemo(
    () => [
      {
        user: "Ahmad Rizki",
        date: new Date(
          new Date(report.date).getTime() + 3 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        text: "Saya melihat petugas sudah mulai memperbaiki jalan ini kemarin sore. Semoga segera selesai.",
      },
      {
        user: "Dinas PU",
        date: new Date(
          new Date(report.date).getTime() + 4 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        text: "Terima kasih atas laporannya. Perbaikan akan selesai dalam 3 hari kerja sesuai jadwal.",
        isOfficial: true,
      },
    ],
    [report.date]
  );

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would submit the comment to an API
    setComment("");
    alert("Komentar telah terkirim!");
  };

  return (
    <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
      <CardHeader className="border-b">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="details">Detail</TabsTrigger>
          <TabsTrigger value="updates">Progress</TabsTrigger>
          <TabsTrigger value="comments">
            Komentar
            <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
              {comments.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent className="pt-6 px-4 sm:px-6">
        <TabsContent value="details" className="space-y-6 mt-0">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Deskripsi</h3>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {report.description || "Tidak ada deskripsi yang ditambahkan."}
            </p>
          </div>

          <Separator />

          {/* Location map */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Lokasi</h3>
            <div className="rounded-lg overflow-hidden h-[240px] relative border">
              {report.coordinates ? (
                <LocationMap
                  position={[
                    report.coordinates.latitude,
                    report.coordinates.longitude,
                  ]}
                  popupText={report.location || ""}
                  zoom={15}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/50">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MapPin className="h-8 w-8" />
                    <p className="text-sm">Lokasi tidak tersedia</p>
                  </div>
                </div>
              )}

              {report.coordinates && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-6 right-2 "
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps?q=${report.coordinates.latitude},${report.coordinates.longitude}`,
                      "_blank"
                    );
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                  Google Maps
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional details */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Ditangani oleh</h3>
            <div className="flex items-center p-3 bg-muted/30 rounded-lg">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  PU
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Dinas Pekerjaan Umum</p>
                <p className="text-sm text-muted-foreground">
                  Bertanggung jawab untuk pemeliharaan infrastruktur jalan
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="updates" className="space-y-6 mt-0">
          <TimelineSection timeline={timeline} currentStep={currentStep} />

          <Separator />

          {report.status === "completed" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Beri Penilaian</h3>
              <p className="text-sm text-muted-foreground">
                Seberapa puas Anda dengan penyelesaian laporan ini?
              </p>
              <div className="flex gap-3">
                <Button
                  variant={feedback === "satisfied" ? "default" : "outline"}
                  className={`flex-1 rounded-lg py-6 ${
                    feedback === "satisfied"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }`}
                  onClick={() => setFeedback("satisfied")}
                >
                  <div className="flex flex-col items-center">
                    <ThumbsUp className="mb-2 h-6 w-6" />
                    <span>Puas</span>
                  </div>
                </Button>
                <Button
                  variant={feedback === "unsatisfied" ? "default" : "outline"}
                  className={`flex-1 rounded-lg py-6 ${
                    feedback === "unsatisfied"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : ""
                  }`}
                  onClick={() => setFeedback("unsatisfied")}
                >
                  <div className="flex flex-col items-center">
                    <ThumbsDown className="mb-2 h-6 w-6" />
                    <span>Tidak Puas</span>
                  </div>
                </Button>
              </div>
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Textarea
                      placeholder="Berikan komentar tambahan tentang penilaian Anda (opsional)"
                      className="resize-none mb-3"
                      rows={3}
                    />
                    <Button className="w-full rounded-lg">
                      Kirim Penilaian
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments" className="mt-0">
          <CommentSection
            comments={comments}
            comment={comment}
            setComment={setComment}
            onSubmit={handleCommentSubmit}
          />
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
