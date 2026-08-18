"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!email.trim()) {
      setMessage({ type: "error", text: "Email wajib diisi" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login/verifforgot`
          : undefined;

      const response = await fetch(`${API_URL}/api/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          ...(redirectTo ? { redirectTo } : {}),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (data.success) {
        setMessage({
          type: "success",
          text:
            data.message ||
            "Cek email Anda untuk tautan reset password.",
        });
        setEmail("");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal mengirim tautan. Coba lagi.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan. Coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center p-6 sm:p-8 lg:p-10">
      <div className="flex w-full max-w-lg flex-col py-8 sm:py-12">
        <Link href="/" className="mx-auto mb-12 block">
          <div className="mx-auto h-[28px] w-[120px] overflow-hidden rounded-md sm:h-[32px] sm:w-[140px]">
            <Image
              src="/11.png"
              alt="Stundea Studio"
              width={280}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </Link>

        <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
          Password
        </p>
        <h2
          className="mt-3 text-center text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-[-0.03em] text-primary"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Lupa password?
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-primary/50">
          Masukkan email akun Anda. Kami akan kirim tautan reset.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 w-full max-w-md space-y-5"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage(null);
            }}
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3.5 text-[15px] text-primary outline-none transition-[border-color] duration-200 placeholder:text-primary/35 focus:border-primary/35"
          />

          {message && (
            <p
              className={`text-sm leading-relaxed ${
                message.type === "success"
                  ? "text-primary/70"
                  : "text-red-600/90"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="landing-btn landing-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Mengirim…" : "Kirim tautan reset"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-primary/50">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary transition-colors duration-200 hover:text-primary/70"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
