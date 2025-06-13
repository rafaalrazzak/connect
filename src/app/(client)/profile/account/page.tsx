"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PageHeader } from "@/components/page-header";

// Icons
import {
  ArrowLeft,
  Camera,
  Eye,
  EyeOff,
  Key,
  Loader2,
  MapPin,
  Save,
  Shield,
  User,
  Lock,
  Bell,
  Check,
  X,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ==================== TYPES ====================
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  coverImage?: string;
  dateOfBirth?: string;
  gender?: string;
  publicProfile: boolean;
  showEmail: boolean;
  showPhone: boolean;
  twoFactorEnabled: boolean;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UploadState {
  avatar: boolean;
  cover: boolean;
}

interface PasswordStrength {
  score: number;
  percentage: number;
  label: string;
  color: string;
  textColor: string;
  checks: Record<string, boolean>;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// ==================== CONSTANTS ====================
const INITIAL_USER_DATA: UserProfile = {
  id: "usr_123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+62 812-3456-7890",
  location: "Jakarta, Indonesia",
  avatar: "https://v0.dev/placeholder.svg",
  coverImage: "https://v0.dev/placeholder.svg",
  dateOfBirth: "1990-05-15",
  gender: "male",
  publicProfile: true,
  showEmail: false,
  showPhone: false,
  twoFactorEnabled: true,
};

const FILE_VALIDATION = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ] as const,
} as const;

const ANIMATION_CONFIG = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  uploadDelay: 1500,
} as const;

const PASSWORD_STRENGTH_LABELS = {
  0: { label: "Sangat Lemah", color: "bg-red-500", textColor: "text-red-600" },
  1: { label: "Sangat Lemah", color: "bg-red-500", textColor: "text-red-600" },
  2: { label: "Lemah", color: "bg-orange-500", textColor: "text-orange-600" },
  3: { label: "Sedang", color: "bg-yellow-500", textColor: "text-yellow-600" },
  4: { label: "Kuat", color: "bg-blue-500", textColor: "text-blue-600" },
  5: {
    label: "Sangat Kuat",
    color: "bg-green-500",
    textColor: "text-green-600",
  },
} as const;

// ==================== UTILITY FUNCTIONS ====================
const validateFile = (file: File): FileValidationResult => {
  if (
    !FILE_VALIDATION.ALLOWED_TYPES.includes(
      file.type as (typeof FILE_VALIDATION.ALLOWED_TYPES)[number]
    )
  ) {
    return {
      isValid: false,
      error: "Hanya file gambar (JPG, PNG, WebP, GIF) yang diperbolehkan",
    };
  }

  if (file.size > FILE_VALIDATION.MAX_SIZE) {
    return {
      isValid: false,
      error: "Ukuran file maksimal 5MB",
    };
  }

  return { isValid: true };
};

const getPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const percentage = (score / 5) * 100;
  const config =
    PASSWORD_STRENGTH_LABELS[score as keyof typeof PASSWORD_STRENGTH_LABELS];

  return {
    score,
    percentage,
    ...config,
    checks,
  };
};

const createPreviewUrl = (file: File): string => URL.createObjectURL(file);

const simulateUpload = (
  delay: number = ANIMATION_CONFIG.uploadDelay
): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay));

// ==================== HOOK: useImageUpload ====================
const useImageUpload = () => {
  const [uploading, setUploading] = useState<UploadState>({
    avatar: false,
    cover: false,
  });
  const [previewUrls, setPreviewUrls] = useState<Set<string>>(new Set());
  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [previewUrls]);

  const handleUpload = useCallback(
    async (
      file: File,
      type: keyof UploadState,
      onSuccess: (previewUrl: string) => void
    ): Promise<void> => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      setUploading((prev) => ({ ...prev, [type]: true }));

      try {
        const previewUrl = createPreviewUrl(file);
        setPreviewUrls((prev) => new Set(prev).add(previewUrl));

        await simulateUpload();
        onSuccess(previewUrl);

        toast.success(
          `${
            type === "avatar" ? "Foto profil" : "Foto sampul"
          } berhasil diperbarui`
        );
      } catch (error) {
        toast.error(
          `Gagal mengunggah ${
            type === "avatar" ? "foto profil" : "foto sampul"
          }`
        );
      } finally {
        setUploading((prev) => ({ ...prev, [type]: false }));
      }
    },
    []
  );

  return { uploading, handleUpload };
};

// ==================== HOOK: usePasswordForm ====================
const usePasswordForm = () => {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordForm.newPassword),
    [passwordForm.newPassword]
  );

  const resetForm = useCallback(() => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, []);

  const togglePasswordVisibility = useCallback(
    (field: keyof typeof showPasswords) => {
      setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    },
    []
  );

  const isFormValid = useMemo(() => {
    return (
      passwordForm.currentPassword.length > 0 &&
      passwordForm.newPassword.length > 0 &&
      passwordForm.confirmPassword.length > 0 &&
      passwordForm.newPassword === passwordForm.confirmPassword &&
      passwordStrength.score >= 3
    );
  }, [passwordForm, passwordStrength.score]);

  return {
    passwordForm,
    setPasswordForm,
    showPasswords,
    togglePasswordVisibility,
    passwordStrength,
    resetForm,
    isFormValid,
  };
};

// ==================== COMPONENT: ImagePreviewDialog ====================
interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ImagePreviewDialog = ({
  open,
  onOpenChange,
  imageUrl,
  title,
  onConfirm,
  onCancel,
}: ImagePreviewDialogProps) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Preview {title}</DialogTitle>
          <DialogDescription>
            Pastikan gambar terlihat baik sebelum menyimpan
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Ukuran maksimal: 5MB</p>
            <p>• Format: JPG, PNG, WebP, GIF</p>
            <p>
              • Resolusi optimal:{" "}
              {title === "Avatar" ? "400x400px" : "1200x400px"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button onClick={onConfirm}>Gunakan Gambar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==================== COMPONENT: DragOverlay ====================
interface DragOverlayProps {
  visible: boolean;
  children: React.ReactNode;
}

const DragOverlay = ({ visible, children }: DragOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary rounded-lg">
      <div className="bg-primary text-primary-foreground rounded-lg p-3 flex items-center gap-2 shadow-lg">
        <Upload className="h-4 w-4" />
        <span className="text-sm font-medium">{children}</span>
      </div>
    </div>
  );
};

// ==================== COMPONENT: UploadOverlay ====================
interface UploadOverlayProps {
  visible: boolean;
  children: React.ReactNode;
}

const UploadOverlay = ({ visible, children }: UploadOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
      <div className="bg-white/90 rounded-lg p-3 flex items-center gap-2 shadow-lg">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">{children}</span>
      </div>
    </div>
  );
};

// ==================== COMPONENT: ProfileHeader ====================
interface ProfileHeaderProps {
  user: UserProfile;
  onAvatarChange: (file: File) => void;
  onCoverChange: (file: File) => void;
  uploading: UploadState;
}

const ProfileHeader = ({
  user,
  onAvatarChange,
  onCoverChange,
  uploading,
}: ProfileHeaderProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<"avatar" | "cover" | null>(null);

  // Drag and drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent, type: "avatar" | "cover") => {
      e.preventDefault();
      setDragOver(type);
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "avatar" | "cover") => {
      e.preventDefault();
      setDragOver(null);

      const file = e.dataTransfer.files[0];
      if (file) {
        if (type === "avatar") {
          onAvatarChange(file);
        } else {
          onCoverChange(file);
        }
      }
    },
    [onAvatarChange, onCoverChange]
  );

  const handleFileChange = useCallback(
    (type: "avatar" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (type === "avatar") {
          onAvatarChange(file);
        } else {
          onCoverChange(file);
        }
      }
      // Reset input value to allow re-selecting the same file
      e.target.value = "";
    },
    [onAvatarChange, onCoverChange]
  );

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      {/* Cover Image Section */}
      <div
        className={cn(
          "relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent transition-all duration-200",
          dragOver === "cover" && "ring-2 ring-primary ring-offset-2"
        )}
        onDragOver={(e) => handleDragOver(e, "cover")}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, "cover")}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Image
          src={user.coverImage || "/placeholder.svg"}
          alt="Cover"
          fill
          className={cn(
            "object-cover transition-all duration-300",
            uploading.cover ? "opacity-50 scale-105" : "opacity-100"
          )}
        />

        <DragOverlay visible={dragOver === "cover"}>
          Lepas untuk mengunggah foto sampul
        </DragOverlay>

        <UploadOverlay visible={uploading.cover}>
          Mengunggah foto sampul...
        </UploadOverlay>

        <Button
          size="sm"
          disabled={uploading.cover}
          className="absolute top-4 right-4 h-8 w-8 rounded-full shadow-sm opacity-80 hover:opacity-100 transition-opacity"
          onClick={() => coverInputRef.current?.click()}
          aria-label="Ubah foto sampul"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept={FILE_VALIDATION.ALLOWED_TYPES.join(",")}
          onChange={handleFileChange("cover")}
        />
      </div>

      {/* Profile Content */}
      <CardContent className="p-6 -mt-16 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          {/* Avatar Section */}
          <div
            className={cn(
              "relative w-fit flex items-center justify-center group rounded-full cursor-pointer",
              dragOver === "avatar" && "ring-2 ring-primary ring-offset-2"
            )}
            onDragOver={(e) => handleDragOver(e, "avatar")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "avatar")}
          >
            <Avatar
              className={cn(
                "h-24 w-24 border-4 border-background shadow-lg ring-2 transition-all duration-200",
                dragOver === "avatar" ? "ring-primary" : "ring-primary/10"
              )}
            >
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className={cn(
                  "transition-all duration-300",
                  uploading.avatar ? "opacity-50 scale-105" : "opacity-100"
                )}
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <DragOverlay visible={dragOver === "avatar"}>
              <Upload className="h-6 w-6" />
            </DragOverlay>

            <UploadOverlay visible={uploading.avatar}>
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </UploadOverlay>

            <Button
              size="sm"
              disabled={uploading.avatar}
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Ubah foto profil"
            >
              <Camera className="h-3 w-3" />
            </Button>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept={FILE_VALIDATION.ALLOWED_TYPES.join(",")}
              onChange={handleFileChange("avatar")}
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== COMPONENT: SettingsSection ====================
interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
}: SettingsSectionProps) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="pb-4">
      <CardTitle className="flex flex-col md:flex-row md:items-center gap-3 text-lg">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          {title}
          <CardDescription>{description}</CardDescription>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 mt-4">{children}</CardContent>
  </Card>
);

// ==================== COMPONENT: FormField ====================
interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
}

const FormField = ({
  label,
  children,
  required = false,
  error,
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label}
      {required && (
        <span className="text-red-500 ml-1" aria-label="required">
          *
        </span>
      )}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

// ==================== COMPONENT: PrivacyToggle ====================
interface PrivacyToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const PrivacyToggle = ({
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: PrivacyToggleProps) => (
  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-all duration-200 group">
    <div className="flex-1">
      <Label className="text-sm font-medium cursor-pointer group-hover:text-foreground transition-colors">
        {title}
      </Label>
      <p className="text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
        {description}
      </p>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={title}
    />
  </div>
);

// ==================== COMPONENT: PasswordStrengthIndicator ====================
interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  const checkLabels = {
    length: "Min 8 karakter",
    lowercase: "Huruf kecil",
    uppercase: "Huruf besar",
    number: "Angka",
    special: "Karakter khusus",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span>Kekuatan Password:</span>
        <span className={cn("font-medium", strength.textColor)}>
          {strength.label}
        </span>
      </div>
      <Progress value={strength.percentage} className="h-2" />
      <div className="grid grid-cols-2 gap-2 text-xs">
        {Object.entries(strength.checks).map(([key, passed]) => (
          <div
            key={key}
            className={cn(
              "flex items-center gap-1",
              passed ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>{checkLabels[key as keyof typeof checkLabels]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== COMPONENT: DeleteAccountDialog ====================
interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteAccountDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const CONFIRMATION_TEXT = "HAPUS AKUN SAYA";

  const handleDelete = async () => {
    if (confirmText !== CONFIRMATION_TEXT) {
      toast.error("Teks konfirmasi tidak sesuai");
      return;
    }

    setIsDeleting(true);
    try {
      // Simulate delete process
      await simulateUpload(2000);
      onConfirm();
      toast.success("Akun berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus akun");
    } finally {
      setIsDeleting(false);
    }
  };
  const resetDialog = useCallback(() => {
    setConfirmText("");
    setIsDeleting(false);
  }, []);

  useEffect(() => {
    if (!open) {
      resetDialog();
    }
  }, [open, resetDialog]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-600">Hapus Akun</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">
              Peringatan: Data yang akan dihapus
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Semua data profil pribadi</li>
              <li>• Laporan yang pernah dibuat</li>
              <li>• Riwayat aktivitas</li>
              <li>• Komentar dan interaksi</li>
              <li>• Pengaturan notifikasi</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-red-600">
              Ketik "{CONFIRMATION_TEXT}" untuk konfirmasi:
            </Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRMATION_TEXT}
              className="border-red-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <p>
              <strong>Catatan:</strong> Setelah akun dihapus, Anda tidak akan
              dapat mengakses layanan dengan email yang sama. Data backup tidak
              tersedia setelah penghapusan.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== CONFIRMATION_TEXT || isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Akun Permanen
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==================== MAIN COMPONENT ====================
export default function AccountSettingsPage() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<{
    url: string;
    type: "avatar" | "cover";
    file: File;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { uploading, handleUpload } = useImageUpload();
  const {
    passwordForm,
    setPasswordForm,
    showPasswords,
    togglePasswordVisibility,
    passwordStrength,
    resetForm,
    isFormValid,
  } = usePasswordForm();

  // ==================== HANDLERS ====================
  const handleSave = useCallback(async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      await simulateUpload(1000);
      setUser((prev) => ({ ...prev, ...data }));
      toast.success("Pengaturan berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePasswordChange = useCallback(async () => {
    if (!isFormValid) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("Konfirmasi password tidak cocok");
      } else if (passwordStrength.score < 3) {
        toast.error("Password terlalu lemah");
      }
      return;
    }

    setIsLoading(true);
    try {
      await simulateUpload(1000);
      resetForm();
      toast.success("Password berhasil diubah");
    } catch (error) {
      toast.error("Gagal mengubah password");
    } finally {
      setIsLoading(false);
    }
  }, [isFormValid, passwordForm, passwordStrength.score, resetForm]);

  const handleAvatarChange = useCallback(
    (file: File) => {
      handleUpload(file, "avatar", (previewUrl) => {
        setUser((prev) => ({ ...prev, avatar: previewUrl }));
      });
    },
    [handleUpload]
  );

  const handleCoverChange = useCallback(
    (file: File) => {
      handleUpload(file, "cover", (previewUrl) => {
        setUser((prev) => ({ ...prev, coverImage: previewUrl }));
      });
    },
    [handleUpload]
  );

  const handleTwoFactorToggle = useCallback(() => {
    const newState = !user.twoFactorEnabled;
    setUser((prev) => ({ ...prev, twoFactorEnabled: newState }));
    setTwoFactorOpen(false);
    toast.success(
      newState
        ? "Autentikasi dua faktor diaktifkan"
        : "Autentikasi dua faktor dinonaktifkan"
    );
  }, [user.twoFactorEnabled]);

  // ==================== RENDER ====================
  return (
    <>
      <PageHeader title="Pengaturan Akun" />

      <motion.div {...ANIMATION_CONFIG.fadeIn} className="space-y-8">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onAvatarChange={handleAvatarChange}
          onCoverChange={handleCoverChange}
          uploading={uploading}
        />
        <div className="px-4">
          {/* Main Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="overflow-x-auto size-full justify-start">
              <TabsTrigger value="profile" className="size-full flex gap-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="size-full flex gap-2">
                <Shield className="h-4 w-4" />
                <span>Keamanan</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="size-full flex gap-2">
                <Lock className="h-4 w-4" />
                <span>Privasi</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="size-full flex gap-2"
              >
                <Bell className="h-4 w-4" />
                <span>Notifikasi</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <SettingsSection
                title="Informasi Dasar"
                description="Informasi pribadi yang ditampilkan di profil Anda"
                icon={User}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField label="Nama Lengkap" required>
                    <Input
                      value={user.name}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Masukkan nama lengkap"
                    />
                  </FormField>
                  <FormField label="Email" required>
                    <Input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Masukkan email"
                    />
                  </FormField>
                  <FormField label="Nomor Telepon">
                    <Input
                      type="tel"
                      value={user.phone || ""}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Masukkan nomor telepon"
                    />
                  </FormField>
                  <FormField label="Lokasi">
                    <Input
                      value={user.location || ""}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Masukkan lokasi"
                    />
                  </FormField>
                </div>
                <Button
                  onClick={() => handleSave(user)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Simpan Perubahan
                </Button>
              </SettingsSection>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <SettingsSection
                title="Ubah Password"
                description="Perbarui password untuk menjaga keamanan akun"
                icon={Key}
              >
                <div className="space-y-6">
                  <FormField label="Password Saat Ini" required>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="Masukkan password saat ini"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => togglePasswordVisibility("current")}
                        aria-label="Toggle password visibility"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormField>

                  <FormField label="Password Baru" required>
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Masukkan password baru"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          onClick={() => togglePasswordVisibility("new")}
                          aria-label="Toggle password visibility"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <PasswordStrengthIndicator
                        password={passwordForm.newPassword}
                      />
                    </div>
                  </FormField>

                  <FormField label="Konfirmasi Password Baru" required>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Konfirmasi password baru"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => togglePasswordVisibility("confirm")}
                        aria-label="Toggle password visibility"
                      >
                        {" "}
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormField>

                  <Button
                    onClick={handlePasswordChange}
                    disabled={isLoading || !isFormValid}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Key className="h-4 w-4 mr-2" />
                    )}
                    Ubah Password
                  </Button>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Autentikasi Dua Faktor"
                description="Tambahan lapisan keamanan untuk akun Anda"
                icon={Shield}
              >
                <div className="flex items-center justify-between p-6 rounded-xl border bg-muted/20 gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium">Status 2FA</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.twoFactorEnabled
                        ? "Aktif - Akun Anda terlindungi"
                        : "Nonaktif - Disarankan untuk mengaktifkan"}
                    </p>
                  </div>
                  <Dialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant={user.twoFactorEnabled ? "outline" : "default"}
                      >
                        {user.twoFactorEnabled ? "Kelola" : "Aktifkan"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Autentikasi Dua Faktor</DialogTitle>
                        <DialogDescription>
                          {user.twoFactorEnabled
                            ? "Kelola pengaturan autentikasi dua faktor Anda"
                            : "Scan QR code dengan aplikasi authenticator"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center p-6">
                        <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center">
                          <span className="text-muted-foreground">QR Code</span>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setTwoFactorOpen(false)}
                        >
                          Batal
                        </Button>
                        <Button onClick={handleTwoFactorToggle}>
                          {user.twoFactorEnabled ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>{" "}
                  </Dialog>
                </div>
              </SettingsSection>

              {/* Delete Account Section */}
              <SettingsSection
                title="Zona Bahaya"
                description="Tindakan permanen yang tidak dapat dibatalkan"
                icon={AlertTriangle}
              >
                <div className="p-6 rounded-xl border border-red-200 bg-red-50/50">
                  <div className="flex flex-col items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 mb-2">
                        Hapus Akun Permanen
                      </h4>
                      <p className="text-sm text-red-700 mb-4">
                        Menghapus akun akan menghilangkan semua data Anda secara
                        permanen, termasuk profil, laporan, dan riwayat
                        aktivitas. Tindakan ini tidak dapat dibatalkan.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(true)}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus Akun
                      </Button>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <SettingsSection
                title="Visibilitas Profil"
                description="Kontrol informasi yang dapat dilihat orang lain"
                icon={Lock}
              >
                <div className="space-y-4">
                  <PrivacyToggle
                    title="Profil Publik"
                    description="Profil dapat dilihat oleh semua pengguna"
                    checked={user.publicProfile}
                    onCheckedChange={(checked) => {
                      setUser((prev) => ({ ...prev, publicProfile: checked }));
                      handleSave({ publicProfile: checked });
                    }}
                  />
                  <PrivacyToggle
                    title="Tampilkan Email"
                    description="Alamat email ditampilkan di profil publik"
                    checked={user.showEmail}
                    onCheckedChange={(checked) => {
                      setUser((prev) => ({ ...prev, showEmail: checked }));
                      handleSave({ showEmail: checked });
                    }}
                  />
                  <PrivacyToggle
                    title="Tampilkan Nomor Telepon"
                    description="Nomor telepon ditampilkan di profil publik"
                    checked={user.showPhone}
                    onCheckedChange={(checked) => {
                      setUser((prev) => ({ ...prev, showPhone: checked }));
                      handleSave({ showPhone: checked });
                    }}
                  />
                </div>
              </SettingsSection>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <SettingsSection
                title="Preferensi Notifikasi"
                description="Atur bagaimana Anda ingin menerima notifikasi"
                icon={Bell}
              >
                <div className="space-y-4">
                  <PrivacyToggle
                    title="Notifikasi Email"
                    description="Terima notifikasi melalui email"
                    checked={true}
                    onCheckedChange={(checked) =>
                      console.log("Email notifications:", checked)
                    }
                  />
                  <PrivacyToggle
                    title="Notifikasi Push"
                    description="Terima notifikasi push di perangkat"
                    checked={true}
                    onCheckedChange={(checked) =>
                      console.log("Push notifications:", checked)
                    }
                  />
                  <PrivacyToggle
                    title="Update Laporan"
                    description="Notifikasi ketika laporan Anda diperbarui"
                    checked={true}
                    onCheckedChange={(checked) =>
                      console.log("Report updates:", checked)
                    }
                  />
                  <PrivacyToggle
                    title="Komentar Baru"
                    description="Notifikasi ketika ada komentar pada laporan Anda"
                    checked={true}
                    onCheckedChange={(checked) =>
                      console.log("New comments:", checked)
                    }
                  />
                </div>
              </SettingsSection>
            </TabsContent>
          </Tabs>

          {/* Image Preview Dialog */}
          <ImagePreviewDialog
            open={!!imagePreview}
            onOpenChange={() => setImagePreview(null)}
            imageUrl={imagePreview?.url || null}
            title={imagePreview?.type === "avatar" ? "Avatar" : "Cover Image"}
            onConfirm={() => setImagePreview(null)}
            onCancel={() => setImagePreview(null)}
          />

          {/* Delete Account Dialog */}
          <DeleteAccountDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={() => {
              setDeleteDialogOpen(false);
              // Handle account deletion logic here
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
