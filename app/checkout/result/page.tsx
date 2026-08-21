"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { api } from "../../lib/api";
import { useRequireAuth } from "../../lib/useRequireAuth";
import { statusLabelId, type Entitlements } from "../../lib/plans";

type PaymentStatus = {
  invoice_number: string;
  plan: string;
  amount: number;
  status: string;
  paid_at?: string | null;
  entitlements?: Entitlements | null;
};

function CheckoutResultInner() {
  const { ready } = useRequireAuth();
  const params = useSearchParams();
  const invoice = params.get("invoice") || "";
  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !invoice) return;
    let cancelled = false;
    let tries = 0;
    const timer: { id?: number } = {};

    const tick = async () => {
      const res = await api.get<PaymentStatus>(
        `/api/payments/status?invoice=${encodeURIComponent(invoice)}`
      );
      if (cancelled) return true;
      if (!res.success || !res.data) {
        setError(!res.success ? res.error : "Tidak bisa cek pembayaran");
        return false;
      }
      setPayment(res.data);
      setError(null);
      return res.data.status === "paid";
    };

    (async () => {
      const done = await tick();
      if (done || cancelled) return;
      timer.id = window.setInterval(async () => {
        tries += 1;
        const paid = await tick();
        if (paid || tries >= 20) {
          if (timer.id != null) window.clearInterval(timer.id);
        }
      }, 2000);
    })();

    return () => {
      cancelled = true;
      if (timer.id != null) window.clearInterval(timer.id);
    };
  }, [ready, invoice]);

  const paid = payment?.status === "paid";

  return (
    <main className="landing-root flex min-h-screen flex-col bg-[#f7f6f3] text-primary">
      <Navbar />
      <div className="relative z-0 mx-auto w-full max-w-[640px] flex-1 px-5 pb-20 pt-36 sm:px-8 lg:pt-40">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
          Pembayaran
        </p>
        <h1
          className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {paid
            ? "Pembayaran berhasil"
            : error
              ? "Ada yang terlewat"
              : "Menunggu konfirmasi"}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-primary/50">
          {paid
            ? `Paket ${payment?.entitlements?.planName || payment?.plan} sudah aktif.`
            : error
              ? error
              : "DOKU sedang mengonfirmasi pembayaran. Halaman ini akan berubah otomatis."}
        </p>

        {payment && (
          <div className="mt-8 rounded-2xl border border-primary/8 bg-white/80 px-5 py-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-primary/45">Invoice</span>
              <span className="font-medium">{payment.invoice_number}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <span className="text-primary/45">Status</span>
              <span className="font-medium">
                {payment.status === "paid"
                  ? "Lunas"
                  : payment.status === "pending"
                    ? "Menunggu"
                    : payment.status}
              </span>
            </div>
            {payment.entitlements && (
              <div className="mt-3 flex justify-between gap-4">
                <span className="text-primary/45">Paket akun</span>
                <span className="font-medium">
                  {payment.entitlements.planName} ·{" "}
                  {statusLabelId(payment.entitlements.status)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/settings" className="landing-btn landing-btn-primary">
            Ke pengaturan
          </Link>
          <Link href="/projects" className="landing-btn landing-btn-ghost">
            Ke proyek
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <main className="landing-root flex min-h-screen flex-col bg-[#f7f6f3] text-primary">
          <Navbar />
          <p className="px-5 pt-36 text-sm text-primary/45">Memuat…</p>
        </main>
      }
    >
      <CheckoutResultInner />
    </Suspense>
  );
}
