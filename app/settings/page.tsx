"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../lib/api";
import { useRequireAuth } from "../lib/useRequireAuth";
import { getCachedAuth, setCachedAuth } from "../lib/auth";
import {
  formatDateId,
  formatLimit,
  statusLabelId,
  type ProfileWithPlan,
} from "../lib/plans";
import PlanCheckoutButton from "../components/PlanCheckoutButton";

const paidPlans = [
  {
    id: "individual" as const,
    name: "Individual",
    price: "50.000",
    period: "6 bulan",
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "150.000",
    period: "1 tahun",
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    price: "500.000",
    period: "1 tahun",
  },
];

const fieldClass =
  "w-full rounded-xl border border-primary/10 bg-white px-4 py-3 text-[15px] text-primary outline-none transition-[border-color] duration-200 placeholder:text-primary/35 focus:border-primary/35";

export default function SettingsPage() {
  const { ready: authReady } = useRequireAuth();
  const [profile, setProfile] = useState<ProfileWithPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<ProfileWithPlan>("/api/auth/profile");
      if (cancelled) return;
      if (!res.success || !res.data) {
        setError(res.success === false ? res.error : "Gagal memuat profil");
        setProfile(null);
        setLoading(false);
        return;
      }
      setProfile(res.data);
      setFullName(res.data.full_name || "");
      setPhone(res.data.phone || "");
      setAddress(res.data.address || "");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Nama wajib diisi");
      return;
    }
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    const res = await api.patch<ProfileWithPlan>("/api/auth/profile", {
      full_name: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    setSaving(false);
    if (!res.success || !res.data) {
      setError(res.success === false ? res.error : "Gagal menyimpan profil");
      return;
    }
    setProfile(res.data);
    setFullName(res.data.full_name || "");
    setPhone(res.data.phone || "");
    setAddress(res.data.address || "");
    setSaveMessage("Profil tersimpan");
    const cached = getCachedAuth();
    if (cached) {
      setCachedAuth(
        {
          ...cached.user,
          full_name: res.data.full_name,
          phone: res.data.phone,
          address: res.data.address,
        },
        cached.token
      );
    }
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const ent = profile?.entitlements;
  const limits = ent?.limits;
  const endsAt =
    ent?.planId === "freeplan" ? ent?.trialEndsAt : ent?.planExpiresAt;

  return (
    <main className="landing-root flex min-h-screen flex-col bg-[#f7f6f3] text-primary">
      <Navbar />
      <div className="relative z-0 mx-auto w-full max-w-[900px] flex-1 px-5 pb-20 pt-36 sm:px-8 lg:px-14 lg:pt-40">
        <Link
          href="/projects"
          className="landing-btn landing-btn-ghost relative z-10 !px-3 !py-2 text-sm"
        >
          ← Proyek
        </Link>

        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
          Akun
        </p>
        <h1
          className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Pengaturan
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-primary/50">
          Profil dan paket langganan Anda.
        </p>

        {error && (
          <p className="mt-6 text-sm text-red-600/90">{error}</p>
        )}

        {loading ? (
          <p className="mt-12 text-sm text-primary/45">Memuat…</p>
        ) : profile ? (
          <div className="mt-10 space-y-6">
            <section className="rounded-2xl border border-primary/8 bg-white/80 px-5 py-6 sm:px-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2
                  className="text-lg font-medium tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Profil
                </h2>
                <p className="text-xs text-primary/40">
                  {profile.role === "creator" ? "Creator" : "Pengguna"}
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={fieldClass}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldClass}
                    autoComplete="tel"
                    placeholder="+62…"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                    Alamat
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={fieldClass}
                    autoComplete="street-address"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="landing-btn landing-btn-primary disabled:opacity-50"
                  >
                    {saving ? "Menyimpan…" : "Simpan profil"}
                  </button>
                  {saveMessage && (
                    <span className="text-sm text-primary/50">{saveMessage}</span>
                  )}
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-primary/8 bg-white/80 px-5 py-6 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2
                    className="text-lg font-medium tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Paket
                  </h2>
                  <p className="mt-2 text-[15px] text-primary/50">
                    {ent?.blurb || "Paket langganan aktif Anda."}
                  </p>
                </div>
                <Link href="/pricing" className="landing-btn landing-btn-ghost shrink-0">
                  Detail harga
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-primary/8 bg-[#f7f6f3]/70 px-4 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                    Paket
                  </p>
                  <p className="mt-2 text-xl font-medium tracking-[-0.02em]">
                    {ent?.planName || profile.plan || "Free Trial"}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/8 bg-[#f7f6f3]/70 px-4 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                    Status
                  </p>
                  <p className="mt-2 text-xl font-medium tracking-[-0.02em]">
                    {statusLabelId(ent?.status)}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/8 bg-[#f7f6f3]/70 px-4 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                    {ent?.planId === "freeplan" ? "Uji coba berakhir" : "Berlaku hingga"}
                  </p>
                  <p className="mt-2 text-xl font-medium tracking-[-0.02em]">
                    {formatDateId(endsAt)}
                  </p>
                </div>
              </div>

              {ent?.status === "expired" && (
                <p className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-900/80">
                  Masa paket sudah berakhir. Undangan publik tidak aktif sampai
                  Anda memperpanjang atau upgrade.
                </p>
              )}

              <div className="mt-8 border-t border-primary/8 pt-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                  Upgrade / perpanjang
                </p>
                <p className="mt-2 text-sm text-primary/50">
                  Pembayaran diproses DOKU. Paket aktif setelah pembayaran
                  dikonfirmasi.
                </p>
                <ul className="mt-5 space-y-3">
                  {paidPlans.map((p) => {
                    const current =
                      ent?.planId === p.id && ent?.status === "active";
                    return (
                      <li
                        key={p.id}
                        className="flex flex-col gap-3 rounded-xl border border-primary/8 bg-[#f7f6f3]/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="mt-0.5 text-sm text-primary/45">
                            Rp {p.price} / {p.period}
                            {current ? " · paket aktif" : ""}
                          </p>
                        </div>
                        <PlanCheckoutButton
                          planId={p.id}
                          label={current ? "Perpanjang" : `Pilih ${p.name}`}
                          redirectTo="/settings"
                          className="landing-btn landing-btn-primary !px-4 !py-2 text-sm"
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {limits && (
                <ul className="mt-8 space-y-3 border-t border-primary/8 pt-6">
                  {[
                    {
                      label: "Undangan aktif",
                      value: formatLimit(limits.maxPublished),
                    },
                    {
                      label: "Foto carousel / proyek",
                      value: formatLimit(limits.maxCarousel),
                    },
                    {
                      label: "Foto galeri / proyek",
                      value: formatLimit(limits.maxGallery),
                    },
                    {
                      label: "Tamu RSVP / proyek",
                      value: formatLimit(limits.maxGuests),
                    },
                    {
                      label: "Bagikan kelola RSVP",
                      value: limits.canShareRsvpManage ? "Ya" : "Tidak",
                    },
                    {
                      label: "Ubah branding Stundea",
                      value: limits.canEditBranding ? "Ya" : "Tidak",
                    },
                  ].map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-primary/50">{row.label}</span>
                      <span className="font-medium text-primary">{row.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  );
}
