"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TwoFactorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle input change for verification code
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle key down for backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newCode = [...code];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setCode(newCode);

    // Focus the next empty input or the last input
    for (let i = digits.length; i < 6; i++) {
      const nextInput = document.getElementById(`code-${i}`);
      if (nextInput) {
        nextInput.focus();
        break;
      }
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset timer
      setTimeLeft(30);
    } catch (err) {
      setError("Gagal mengirim ulang kode. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check if code is complete
      if (code.some((digit) => !digit)) {
        throw new Error("Silakan masukkan kode verifikasi lengkap");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful verification
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kode verifikasi tidak valid"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-muted/80 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Autentikasi Dua Faktor
        </CardTitle>
        <CardDescription className="text-center">
          Masukkan kode verifikasi yang dikirim ke perangkat Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 flex flex-col justify-center items-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Kode dikirim ke +62 (***) ***-1234
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="size-10 text-center text-lg font-semibold"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground mt-2">
              {timeLeft > 0 ? (
                <p>Kode kedaluwarsa dalam {formatTime(timeLeft)}</p>
              ) : (
                <p>Kode sudah kedaluwarsa</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.some((digit) => !digit)}
          >
            {isLoading ? "Memverifikasi..." : "Verifikasi"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Tidak menerima kode?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={handleResendCode}
            disabled={isLoading || timeLeft > 0}
          >
            {timeLeft > 0
              ? `Kirim ulang dalam ${timeLeft}d`
              : "Kirim ulang kode"}
          </Button>
        </div>
        <div className="text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Kembali ke login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
