"use client";

import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ReportFormData } from "@/types/report";

type UrgencyLevel = "low" | "medium" | "high";

interface DetailsStepProps {
  formData: ReportFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange?: (name: string, value: string) => void;
}

export const DetailsStep = memo(function DetailsStep({
  formData,
  onChange,
  onCheckboxChange,
  onSelectChange,
}: DetailsStepProps) {
  // Handle select change with type safety
  const handleSelectChange = (value: UrgencyLevel) => {
    if (onSelectChange) {
      onSelectChange("urgency", value);
    } else {
      // Fallback if onSelectChange not provided
      onChange({
        target: { name: "urgency", value },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium">
          Judul Laporan <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Judul singkat yang menggambarkan masalahnya"
          value={formData.title || ""}
          onChange={onChange}
          required
          maxLength={100}
          className="transition-colors focus-visible:ring-1"
        />
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>Buat judul yang singkat dan jelas</span>
          <span>{formData.title?.length || 0}/100</span>
        </div>
      </div>

      {/* Description field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">
          Deskripsi <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Ceritakan dengan detail masalah yang kamu temukan"
          value={formData.description || ""}
          onChange={onChange}
          required
          rows={5}
          maxLength={1000}
          className="resize-none transition-colors focus-visible:ring-1"
        />
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>
            Jelaskan dengan detail agar petugas dapat memahami masalahnya
          </span>
          <span>{formData.description?.length || 0}/1000</span>
        </div>
      </div>

      {/* Urgency select */}
      <div className="space-y-2">
        <Label htmlFor="urgency" className="font-medium">
          Tingkat Urgensi
        </Label>
        <Select
          value={(formData.urgency as string) || "medium"}
          onValueChange={handleSelectChange as (value: string) => void}
        >
          <SelectTrigger id="urgency" className="w-full">
            <SelectValue placeholder="Pilih tingkat urgensi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              Rendah - Bisa ditangani kapan saja
            </SelectItem>
            <SelectItem value="medium">
              Sedang - Sebaiknya segera diperbaiki
            </SelectItem>
            <SelectItem value="high">
              Tinggi - Perlu penanganan segera
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact field */}
      <div className="space-y-2">
        <Label htmlFor="contact" className="font-medium">
          Kontak (opsional)
        </Label>
        <Input
          id="contact"
          name="contact"
          placeholder="Email atau nomor telepon untuk tindak lanjut"
          value={formData.contact || ""}
          onChange={onChange}
          className="transition-colors focus-visible:ring-1"
          disabled={formData.anonymous}
        />
        <p className="text-xs text-muted-foreground">
          Hanya akan digunakan jika petugas perlu informasi tambahan
        </p>
      </div>

      {/* Anonymous checkbox */}
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="anonymous"
          name="anonymous"
          checked={!!formData.anonymous}
          onCheckedChange={(checked) => {
            onCheckboxChange({
              target: { name: "anonymous", checked: !!checked },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          className="mt-1"
        />
        <div>
          <Label
            htmlFor="anonymous"
            className="text-sm font-medium cursor-pointer"
          >
            Kirim laporan secara anonim
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identitas Anda tidak akan ditampilkan pada laporan publik
          </p>
        </div>
      </div>
    </div>
  );
});
