"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPortal } from "react-dom";
import { setCachedAuth } from "../lib/auth";

type LoginFormData = {
  email: string;
  password: string;
};

type SignupFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  retryPassword: string;
  termsAccepted: boolean;
  countryCode: string;
};

const countries = [
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
];

type Regislogin = {
  login: boolean;
  signup: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fieldClass =
  "w-full rounded-xl border border-primary/10 bg-white px-4 py-3.5 text-[15px] text-primary outline-none transition-[border-color] duration-200 placeholder:text-primary/35 focus:border-primary/35";

const fieldClassCompact =
  "w-full rounded-xl border border-primary/10 bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition-[border-color] duration-200 placeholder:text-primary/35 focus:border-primary/35";

export default function Login() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailLogin, setShowFailLogin] = useState(false);
  const [regislogin, setRegislogin] = useState<Regislogin>({
    login: true,
    signup: false,
  });
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    retryPassword: "",
    termsAccepted: false,
    countryCode: "+62",
  });

  useEffect(() => {
    document.body.classList.add("__noscroll");
    return () => {
      document.body.classList.remove("__noscroll");
    };
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleLogin = async (values: typeof loginFormData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const loginData = await response.json();

      if (response.status === 401) {
        setShowFailLogin(true);
        return;
      }

      if (!response.ok) {
        setShowFailLogin(true);
        return;
      }

      if (loginData.success) {
        const token = loginData.data?.session?.access_token as string | undefined;
        const authUser = loginData.data?.user;
        const profileId =
          (authUser?.id as string | undefined) ||
          (loginData.data?.session?.user?.id as string | undefined);

        if (token && profileId) {
          setCachedAuth(
            {
              id: profileId,
              email: (authUser?.email as string | undefined) || loginData.data?.session?.user?.email,
              full_name: authUser?.user_metadata?.full_name as string | undefined,
              role: undefined,
            },
            token
          );
        }

        // Refresh profile (role, full_name) into cache when available
        try {
          const profileRes = await fetch(
            `${API_URL}/api/auth/profile`,
            {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }
          );
          const profileJson = await profileRes.json().catch(() => null);
          if (profileJson?.success && profileJson?.data?.id) {
            setCachedAuth(profileJson.data, token);
          }
        } catch {
          // ignore — token cache is enough to stay logged in
        }

        setShowSuccessModal(true);
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          const r = params.get("redirect");
          const next =
            r && r.startsWith("/") && !r.startsWith("//") ? r : "/";
          router.push(next);
        }, 1200);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Login error:", error);
      }
      setShowFailLogin(true);
    }
  };

  const handleSignup = async (values: typeof formData) => {
    try {
      const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          full_name: values.name,
          phone: `${values.countryCode}${values.phoneNumber}`,
          address: values.address,
          password: values.password,
        }),
      });

      const signupData = await signupResponse.json();
      if (!signupData.success) {
        throw new Error(signupData.message);
      }

      if (signupData.success) {
        router.push(`/login/verifsignup/${formData.email}`);
      } else {
        alert(signupData.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const modalContent = showSuccessModal && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-primary/40 px-5">
      <div className="w-full max-w-sm rounded-2xl border border-primary/10 bg-white px-8 py-10 text-center shadow-[0_24px_64px_rgba(45,45,45,0.12)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
          <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2
          className="text-2xl font-medium tracking-[-0.02em] text-primary"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Berhasil masuk
        </h2>
        <p className="mt-3 text-[15px] text-primary/50">
          Mengarahkan ke dashboard…
        </p>
      </div>
    </div>
  );

  const modalContentFailLogin = showFailLogin && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-primary/40 px-5">
      <div className="relative w-full max-w-sm rounded-2xl border border-primary/10 bg-white px-8 py-10 text-center shadow-[0_24px_64px_rgba(45,45,45,0.12)]">
        <button
          type="button"
          onClick={() => setShowFailLogin(false)}
          className="absolute right-4 top-4 text-primary/35 transition-colors duration-200 hover:text-primary"
          aria-label="Tutup"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2
          className="text-2xl font-medium tracking-[-0.02em] text-primary"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Gagal masuk
        </h2>
        <p className="mt-3 text-[15px] text-primary/50">
          Periksa email dan password Anda, lalu coba lagi.
        </p>
        <button
          type="button"
          onClick={() => setShowFailLogin(false)}
          className="landing-btn landing-btn-primary mt-8 w-full"
        >
          Coba lagi
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
            {regislogin.login ? "Masuk" : "Daftar"}
          </p>
          <h2
            className="mt-3 text-center text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-[-0.03em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {regislogin.login ? "Selamat datang kembali" : "Buat akun Anda"}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-primary/50">
            {regislogin.login
              ? "Masuk untuk mengelola undangan dan tamu."
              : "Daftar sekali—lalu mulai dari template yang cocok."}
          </p>

          {/* Toggle Login / Signup — layout preserved */}
          <div className="mt-10 flex justify-center">
            <div className="relative flex h-11 w-[220px] items-center rounded-full border border-primary/10 bg-white p-1">
              <div
                className="absolute h-9 w-[104px] rounded-full bg-primary transition-[left] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                  left: regislogin.login ? "0.25rem" : "calc(100% - 104px - 0.25rem)",
                }}
              />
              <button
                type="button"
                onClick={() => setRegislogin({ login: true, signup: false })}
                className={`relative z-10 flex-1 rounded-full py-1.5 text-sm font-medium transition-colors duration-200 ${
                  regislogin.login ? "text-white" : "text-primary/55"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setRegislogin({ login: false, signup: true })}
                className={`relative z-10 flex-1 rounded-full py-1.5 text-sm font-medium transition-colors duration-200 ${
                  regislogin.signup ? "text-white" : "text-primary/55"
                }`}
              >
                Signup
              </button>
            </div>
          </div>

          {/* Forms */}
          <div className="relative mt-10 min-h-[320px]">
            <div
              className={`absolute w-full transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                regislogin.login
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-4 opacity-0"
              }`}
            >
              {regislogin.login && (
                <div className="mx-auto max-w-md space-y-5">
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={loginFormData.email}
                      onChange={(e) =>
                        setLoginFormData({ ...loginFormData, email: e.target.value })
                      }
                      placeholder="Email"
                      className={fieldClass}
                      autoComplete="email"
                    />
                    <input
                      type="password"
                      value={loginFormData.password}
                      onChange={(e) =>
                        setLoginFormData({
                          ...loginFormData,
                          password: e.target.value,
                        })
                      }
                      placeholder="Password"
                      className={fieldClass}
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLogin(loginFormData)}
                    className="landing-btn landing-btn-primary w-full"
                  >
                    Masuk
                  </button>

                  <div className="text-center">
                    <Link
                      href="/login/forgotpassword"
                      className="text-sm text-primary/50 transition-colors duration-200 hover:text-primary"
                    >
                      Lupa password?
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`absolute w-full transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                regislogin.signup
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-4 opacity-0"
              }`}
            >
              {regislogin.signup && (
                <div className="mx-auto max-w-md space-y-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nama lengkap"
                    className={fieldClassCompact}
                    autoComplete="name"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Email"
                      className={fieldClassCompact}
                      autoComplete="email"
                    />
                    <div className="relative flex">
                      <select
                        value={formData.countryCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            countryCode: e.target.value,
                          })
                        }
                        className="absolute left-0 z-10 h-full w-[4.75rem] cursor-pointer appearance-none rounded-l-xl border border-r-0 border-primary/10 bg-white px-2 text-sm text-primary outline-none"
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="No. telepon"
                        className={`${fieldClassCompact} pl-[5rem]`}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Alamat"
                    className={fieldClassCompact}
                    autoComplete="street-address"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Password"
                      className={fieldClassCompact}
                      autoComplete="new-password"
                    />
                    <input
                      type="password"
                      value={formData.retryPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          retryPassword: e.target.value,
                        })
                      }
                      placeholder="Ulangi password"
                      className={fieldClassCompact}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          termsAccepted: e.target.checked,
                        })
                      }
                      className="mt-0.5 h-4 w-4 rounded border-primary/20 text-primary accent-[var(--primary)]"
                    />
                    <span className="text-sm leading-relaxed text-primary/50">
                      Saya telah membaca dan menyetujui{" "}
                      <button
                        type="button"
                        onClick={() => {
                          alert(
                            "Terms of Service: This is a sample terms of service agreement that outlines the rules and regulations for using our platform."
                          );
                        }}
                        className="text-primary underline decoration-primary/25 underline-offset-2 transition-colors duration-200 hover:decoration-primary/50"
                      >
                        Syarat Layanan
                      </button>
                    </span>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.termsAccepted) {
                          alert("Please accept the Terms of Service");
                          return;
                        }
                        if (formData.password !== formData.retryPassword) {
                          alert("Passwords do not match");
                          return;
                        }
                        handleSignup(formData);
                      }}
                      className="landing-btn landing-btn-primary w-full max-w-[300px]"
                    >
                      Daftar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {mounted &&
        modalContent &&
        createPortal(modalContent, document.body)}
      {mounted &&
        modalContentFailLogin &&
        createPortal(modalContentFailLogin, document.body)}
    </>
  );
}
