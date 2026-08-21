"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { getCachedAuth, loginRedirectUrl } from "../lib/auth";

type PaidPlanId = "individual" | "pro" | "enterprise";

type Props = {
  planId: PaidPlanId;
  label: string;
  className?: string;
  /** Where to send logged-out users after login */
  redirectTo?: string;
};

export default function PlanCheckoutButton({
  planId,
  label,
  className,
  redirectTo = "/pricing",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (!getCachedAuth()) {
      router.push(loginRedirectUrl(redirectTo));
      return;
    }
    setLoading(true);
    setError(null);
    const res = await api.post<{ paymentUrl: string }>("/api/payments/checkout", {
      plan: planId,
    });
    if (!res.success || !res.data?.paymentUrl) {
      setLoading(false);
      setError(
        !res.success ? res.error : "Gagal memulai pembayaran. Coba lagi."
      );
      return;
    }
    window.location.href = res.data.paymentUrl;
  };

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className={className}
      >
        {loading ? "Mengalihkan ke pembayaran…" : label}
      </button>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600/90">{error}</p>
      )}
    </div>
  );
}
