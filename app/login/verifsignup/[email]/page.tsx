"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";

export default function VerifSignupPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const theemail = decodeURIComponent(
    Array.isArray(params?.email) ? params.email[0] : (params?.email ?? "")
  ).replace("%40", "@");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState<number>(120);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const resendVerificationEmail = async () => {
    try {
      console.log("DEBUG theemail:", theemail);
      await fetch(`${API_URL}/api/auth/send-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: theemail }),
      });
      setIsResendDisabled(true);
      setCountdown(120);
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };

  const handleSubmit = async (verificationCode: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: theemail, token: verificationCode }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        setShowSuccessModal(true);
      } else {
        console.error("Verification failed:", await response.text());
      }
    } catch (error) {
      console.error("Error verifying signup:", error);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Backspace" && index > 0) {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const modalContent = showSuccessModal && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-primary/40 px-5">
      <div className="w-full max-w-sm rounded-2xl border border-primary/10 bg-white px-8 py-10 text-center shadow-[0_24px_64px_rgba(45,45,45,0.12)]">
        <h3
          className="text-2xl font-medium tracking-[-0.02em] text-primary"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Akun siap
        </h3>
        <p className="mt-3 text-[15px] text-primary/50">
          Registrasi berhasil. Silakan masuk untuk melanjutkan.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="landing-btn landing-btn-primary mt-8 w-full"
        >
          Ke halaman masuk
        </button>
      </div>
    </div>
  );

  return (
    <>
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
            Verifikasi
          </p>
          <h2
            className="mt-3 text-center text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-[-0.03em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Konfirmasi email
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-primary/50">
            Masukkan kode 6 digit yang kami kirim ke email Anda.
          </p>

          <form className="mx-auto mt-10 w-full max-w-md space-y-8">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="h-12 w-10 rounded-xl border border-primary/10 bg-white text-center text-lg text-primary outline-none transition-[border-color] duration-200 focus:border-primary/35 sm:h-14 sm:w-12"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(code.join(""));
              }}
              className="landing-btn landing-btn-primary mx-auto block w-full max-w-xs"
            >
              Verifikasi
            </button>

            <div className="text-center">
              {isResendDisabled ? (
                <span className="text-sm text-primary/45">
                  Kode baru dalam{" "}
                  <span className="font-medium text-primary/65">
                    {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                    {String(countdown % 60).padStart(2, "0")}
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendVerificationEmail}
                  className="text-sm text-primary/50 transition-colors duration-200 hover:text-primary"
                >
                  Kirim ulang kode
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
