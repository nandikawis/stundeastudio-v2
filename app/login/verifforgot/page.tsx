"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const fieldClass =
  "w-full rounded-xl border border-primary/10 bg-white px-4 py-3.5 text-[15px] text-primary outline-none transition-[border-color] duration-200 placeholder:text-primary/35 focus:border-primary/35";

function Logo() {
  return (
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
  );
}

function VerifForgotForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCode(searchParams.get("code"));
    setReady(true);
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Password tidak cocok" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password minimal 8 karakter",
      });
      return;
    }

    if (!code) {
      setMessage({ type: "error", text: "Tautan reset tidak valid" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, new_password: newPassword }),
      });
      const data = await response.json().catch(() => ({}));

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Password berhasil diubah. Mengalihkan…",
        });
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage({
          type: "error",
          text:
            data.error ||
            "Gagal mengubah password. Minta tautan baru.",
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

  if (!ready) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <p className="text-sm text-primary/45">Memuat…</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="flex min-h-full items-center justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex w-full max-w-lg flex-col py-8 sm:py-12">
          <Logo />
          <h2
            className="text-center text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-[-0.03em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Tautan tidak valid
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-primary/50">
            Tautan reset hilang atau sudah kedaluwarsa. Minta yang baru.
          </p>
          <div className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3">
            <Link
              href="/login/forgotpassword"
              className="landing-btn landing-btn-primary w-full text-center"
            >
              Minta tautan baru
            </Link>
            <Link
              href="/login"
              className="landing-btn landing-btn-ghost w-full text-center"
            >
              Kembali ke masuk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center p-6 sm:p-8 lg:p-10">
      <div className="flex w-full max-w-lg flex-col py-8 sm:py-12">
        <Logo />

        <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
          Password
        </p>
        <h2
          className="mt-3 text-center text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-[-0.03em] text-primary"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Atur password baru
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-primary/50">
          Masukkan password baru untuk akun Anda.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 w-full max-w-md space-y-4"
        >
          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setMessage(null);
            }}
            placeholder="Password baru"
            required
            minLength={8}
            autoComplete="new-password"
            className={fieldClass}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setMessage(null);
            }}
            placeholder="Ulangi password"
            required
            minLength={8}
            autoComplete="new-password"
            className={fieldClass}
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
            {isLoading ? "Menyimpan…" : "Simpan password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-primary/50">
          <Link
            href="/login"
            className="text-primary transition-colors duration-200 hover:text-primary/70"
          >
            Kembali ke masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifForgotPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center p-6">
          <p className="text-sm text-primary/45">Memuat…</p>
        </div>
      }
    >
      <VerifForgotForm />
    </Suspense>
  );
}
