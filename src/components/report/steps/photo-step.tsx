"use client";

import { memo, useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Camera, Image, Upload, X } from "lucide-react";
import type { PreviewImage } from "@/types/report";

interface PhotoStepProps {
  images: PreviewImage[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

export const PhotoStep = memo(function PhotoStep({
  images,
  onAddImages,
  onRemoveImage,
  maxImages = 3,
}: PhotoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onAddImages(e.target.files);
        // Clear the input value to allow selecting the same file again
        e.target.value = "";
      }
    },
    [onAddImages]
  );

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onAddImages(e.dataTransfer.files);
      }
    },
    [onAddImages]
  );

  return (
    <div className="space-y-4">
      {/* Image previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={`${index}-${image.preview}`}
            className="relative aspect-square rounded-md overflow-hidden border group"
          >
            <img
              src={image.preview}
              alt={`Foto laporan ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white 
                         flex items-center justify-center opacity-0 group-hover:opacity-100 
                         transition-opacity"
                aria-label="Hapus foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload button */}
        {images.length < maxImages && (
          <div
            className={cn(
              "aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2",
              "text-muted-foreground hover:text-primary hover:border-primary transition-colors",
              dragging && "border-primary bg-primary/5"
            )}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <button
              type="button"
              onClick={handleButtonClick}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                {dragging ? (
                  <Camera className="w-6 h-6 text-primary animate-pulse" />
                ) : (
                  <Image className="w-6 h-6" />
                )}
              </div>
              <span className="text-sm font-medium">Unggah foto</span>
              <span className="text-xs text-center px-4 mt-1">
                {dragging
                  ? "Lepas file di sini"
                  : "Klik atau seret foto ke sini"}
              </span>
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={images.length < maxImages - 1}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Info text */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex gap-2">
          <Camera className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Tips foto yang baik:</span>
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
              <li>Pastikan foto terlihat jelas dan tidak buram</li>
              <li>
                Ambil dari beberapa sudut untuk menunjukkan masalah dengan lebih
                detail
              </li>
              <li>
                Sertakan landmark atau tanda pengenal lokasi jika memungkinkan
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
