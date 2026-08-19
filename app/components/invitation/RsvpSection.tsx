"use client";

import { useEffect, useState } from "react";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { api } from "../../lib/api";

type RsvpStatus = "pending" | "attending" | "not_attending" | "maybe";
export type RsvpDesign = "classic" | "card" | "minimal" | "soft";

interface RsvpSectionProps extends CurveDividerProps {
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  design?: RsvpDesign;
  designId?: string;
  /** Injected by TemplateRenderer for personalized invites */
  projectId?: string;
  guestSlug?: string;
  guestName?: string;
  isPreview?: boolean;
  className?: string;
}

function resolveDesign(design?: string, designId?: string): RsvpDesign {
  if (design === "classic" || design === "card" || design === "minimal" || design === "soft") {
    return design;
  }
  if (designId?.includes("card")) return "card";
  if (designId?.includes("minimal")) return "minimal";
  if (designId?.includes("soft")) return "soft";
  return "classic";
}

export default function RsvpSection({
  title = "Konfirmasi Kehadiran",
  subtitle = "Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan acara.",
  titleColor,
  subtitleColor,
  backgroundColor = "#ffffff",
  backgroundImageUrl,
  design,
  designId,
  projectId,
  guestSlug,
  guestName,
  isPreview = false,
  showTopCurve,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  className = "",
}: RsvpSectionProps) {
  const variant = resolveDesign(design, designId);
  const [status, setStatus] = useState<RsvpStatus | "">("");
  const [guestCount, setGuestCount] = useState(1);
  const [guestCountInput, setGuestCountInput] = useState("1");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resolvedName, setResolvedName] = useState(guestName || "");

  /** Editor / phone preview: show form for design, block real submit */
  const designOnly = isPreview || !guestSlug;
  const canSubmit = Boolean(projectId && guestSlug) && !isPreview;

  const syncGuestCount = (n: number) => {
    const clamped = Math.max(1, Math.min(20, n));
    setGuestCount(clamped);
    setGuestCountInput(String(clamped));
  };

  useEffect(() => {
    if (!projectId || !guestSlug || isPreview) return;
    let cancelled = false;
    setLoadingGuest(true);
    (async () => {
      const res = await api.get<{
        name: string;
        rsvp_status: RsvpStatus;
        number_of_guests: number;
        note?: string | null;
      }>(`/api/projects/public/${projectId}/guests/${guestSlug}`);
      if (cancelled) return;
      if (res.success && res.data) {
        setResolvedName(res.data.name);
        if (res.data.rsvp_status && res.data.rsvp_status !== "pending") {
          setStatus(res.data.rsvp_status);
          syncGuestCount(res.data.number_of_guests || 1);
          setNote(res.data.note || "");
          setDone(true);
        }
      }
      setLoadingGuest(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, guestSlug, isPreview]);

  const handleGuestCountChange = (raw: string) => {
    // Digits only; allow empty while typing
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setGuestCountInput(digits);
    if (digits === "") return;
    const n = Number(digits);
    if (Number.isFinite(n) && n >= 1) {
      setGuestCount(Math.min(20, n));
    }
  };

  const handleGuestCountBlur = () => {
    if (guestCountInput === "" || Number(guestCountInput) < 1) {
      syncGuestCount(1);
      return;
    }
    syncGuestCount(Number(guestCountInput));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (designOnly) return;
    if (!canSubmit || !status || status === "pending") {
      setError("Pilih apakah Anda hadir atau tidak.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await api.post(`/api/projects/public/${projectId}/guests/${guestSlug}/rsvp`, {
      rsvp_status: status,
      number_of_guests: status === "not_attending" ? 1 : guestCount,
      note: note.trim() || undefined,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Gagal mengirim konfirmasi");
      return;
    }
    setDone(true);
  };

  const sectionStyle: React.CSSProperties = {};
  if (backgroundImageUrl) {
    sectionStyle.backgroundImage = `url(${backgroundImageUrl})`;
    sectionStyle.backgroundSize = "cover";
    sectionStyle.backgroundPosition = "center";
  } else {
    sectionStyle.backgroundColor = backgroundColor || "#ffffff";
  }

  const ink = titleColor || "#2d2d2d";
  const muted = subtitleColor || "rgba(45,45,45,0.55)";

  const shellClass =
    variant === "card"
      ? "rounded-3xl border border-primary/10 bg-white/90 px-5 py-8 shadow-[0_12px_40px_rgba(45,45,45,0.06)] sm:px-8"
      : variant === "soft"
        ? "rounded-[2rem] bg-[#f7f6f3] px-5 py-8 sm:px-8"
        : variant === "minimal"
          ? "border-y border-primary/15 py-10"
          : "";

  const optionBase =
    variant === "minimal"
      ? "rounded-none border-b border-primary/20 px-2 py-3 text-sm font-medium transition-colors"
      : variant === "soft"
        ? "rounded-2xl border px-4 py-3 text-sm font-medium transition-colors"
        : "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors";

  const optionIdle =
    variant === "minimal"
      ? "border-primary/20 text-primary hover:bg-primary/[0.03]"
      : "border-primary/15 bg-white text-primary hover:bg-[#f7f6f3]";

  const optionActive =
    variant === "minimal"
      ? "border-primary text-primary"
      : variant === "soft"
        ? "border-primary/20 bg-primary text-white"
        : "border-primary bg-primary text-white";

  const fieldClass =
    variant === "minimal"
      ? "w-full border-0 border-b border-primary/20 bg-transparent px-0 py-2.5 text-sm text-primary outline-none focus:border-primary/50"
      : "w-full rounded-xl border border-primary/15 bg-white px-3 py-2.5 text-sm text-primary outline-none focus:border-primary/35";

  const submitClass =
    variant === "minimal"
      ? "w-full border border-primary bg-transparent px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
      : variant === "soft"
        ? "w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-50"
        : "w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-50";

  const displayName = designOnly
    ? resolvedName || guestName || "Nama Tamu"
    : resolvedName;

  const showForm = designOnly || (Boolean(guestSlug) && !loadingGuest && !done);
  const showGuestCount = status === "attending" || (designOnly && status !== "not_attending");

  return (
    <section
      className={`relative w-full overflow-hidden px-6 py-16 sm:py-20 ${className}`}
      style={sectionStyle}
    >
      {renderTopCurve({
        showTopCurve,
        topCurveColor,
        topCurveStyle,
      })}
      {renderBottomCurve({
        showBottomCurve,
        bottomCurveColor,
        bottomCurveStyle,
      })}

      <div className="relative z-10 mx-auto max-w-md text-center">
        <h2
          className={`font-medium tracking-[-0.02em] ${
            variant === "minimal" ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
          }`}
          style={{
            fontFamily: "var(--font-playfair)",
            color: ink,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-3 leading-relaxed ${
              variant === "minimal" ? "text-xs sm:text-sm" : "text-sm sm:text-[15px]"
            }`}
            style={{ color: muted }}
          >
            {subtitle}
          </p>
        )}

        {displayName && (
          <p className="mt-5 text-sm font-medium" style={{ color: ink }}>
            Untuk: {displayName}
          </p>
        )}

        {!designOnly && guestSlug && loadingGuest && (
          <p className="mt-8 text-sm text-primary/45">Memuat…</p>
        )}

        {!designOnly && guestSlug && !loadingGuest && done && (
          <div
            className={`mt-8 text-left ${
              variant === "card"
                ? "rounded-3xl border border-primary/10 bg-white/90 px-5 py-6 shadow-sm"
                : variant === "soft"
                  ? "rounded-[2rem] bg-[#f7f6f3] px-5 py-6"
                  : variant === "minimal"
                    ? "border-y border-primary/15 py-6"
                    : "rounded-2xl border border-primary/10 bg-[#f7f6f3] px-5 py-6"
            }`}
          >
            <p className="text-sm font-medium text-primary">Terima kasih!</p>
            <p className="mt-2 text-sm text-primary/55">
              Konfirmasi Anda sudah kami terima:{" "}
              <span className="font-medium text-primary">
                {status === "attending"
                  ? "Hadir"
                  : status === "maybe"
                    ? "Mungkin"
                    : "Tidak hadir"}
              </span>
              {status === "attending" && guestCount > 1
                ? ` · ${guestCount} orang`
                : ""}
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-4 text-xs font-medium text-primary/50 underline"
            >
              Ubah konfirmasi
            </button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className={`mt-8 space-y-4 text-left ${shellClass}`}>
            {variant === "card" && (
              <p className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-primary/35">
                RSVP
              </p>
            )}

            <div
              className={
                variant === "minimal"
                  ? "grid grid-cols-2 gap-0"
                  : "grid grid-cols-1 gap-2 sm:grid-cols-2"
              }
            >
              {(
                [
                  { value: "attending", label: "Hadir" },
                  { value: "not_attending", label: "Tidak hadir" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`${optionBase} ${
                    status === opt.value ? optionActive : optionIdle
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {showGuestCount && (
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-primary/50">
                  Jumlah orang
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={guestCountInput}
                  onChange={(e) => handleGuestCountChange(e.target.value)}
                  onBlur={handleGuestCountBlur}
                  className={fieldClass}
                  aria-label="Jumlah orang"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-primary/50">
                Catatan (opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Alergi, ucapan, dll."
                className={`${fieldClass} resize-none`}
              />
            </div>

            {error && <p className="text-sm text-red-600/90">{error}</p>}

            <button
              type="submit"
              disabled={designOnly || loading || !status}
              className={submitClass}
            >
              {loading ? "Mengirim…" : "Kirim konfirmasi"}
            </button>

            {designOnly && (
              <p className="text-center text-[11px] text-primary/40">
                Pratinjau desain — form aktif di link tamu yang dipublikasikan.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
