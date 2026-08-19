/**
 * Mirrors backend plan limits for UI copy.
 * Server enforcement remains the source of truth.
 */

export type PlanId = "freeplan" | "individual" | "pro" | "enterprise";
export type PlanStatus = "trialing" | "active" | "expired";

export type PlanLimits = {
  maxPublished: number;
  maxCarousel: number | null;
  maxGallery: number | null;
  maxGuests: number | null;
  canShareRsvpManage: boolean;
  canEditBranding: boolean;
};

export type Entitlements = {
  planId: PlanId | string;
  planName: string;
  blurb?: string;
  status: PlanStatus | string;
  durationLabel?: string;
  priceIdr?: number;
  priceLabel?: string;
  trialEndsAt?: string | null;
  planExpiresAt?: string | null;
  limits: PlanLimits;
};

export type ProfileWithPlan = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  plan?: string | null;
  plan_status?: string | null;
  trial_ends_at?: string | null;
  plan_expires_at?: string | null;
  role?: string | null;
  entitlements?: Entitlements;
};

export function formatLimit(value: number | null | undefined): string {
  if (value == null) return "Unlimited";
  return String(value);
}

export function statusLabelId(status: string | undefined): string {
  switch (status) {
    case "trialing":
      return "Masa uji coba";
    case "active":
      return "Aktif";
    case "expired":
      return "Berakhir";
    default:
      return status || "—";
  }
}

export function formatDateId(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
