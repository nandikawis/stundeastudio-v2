"use client";

import { useEffect, useRef, useState } from "react";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";


export type KadoDigitalDesign = "classic" | "editorial" | "framed" | "night";
export type KadoCardDesign = "graphite" | "gold" | "ivory" | "stripe";

export const KADO_CARD_DEFAULTS: Record<KadoCardDesign, string> = {
  graphite: "#1c1c1c",
  gold: "#c4a574",
  ivory: "#f3efe6",
  stripe: "#1a1916",
};

export type GiftAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export const DEFAULT_GIFT_ACCOUNTS: GiftAccount[] = [
  { id: "acc-1", bankName: "BCA", accountNumber: "1234567890", accountName: "John Doe" },
  { id: "acc-2", bankName: "Mandiri", accountNumber: "0987654321", accountName: "Jane Doe" },
];

interface KadoDigitalSectionProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"title">,
  TextStyleFields<"message"> {
  title?: string;
  message?: string;
  accounts?: GiftAccount[];
  qrisImageUrl?: string;
  qrisLabel?: string;
  titleAlign?: "left" | "center" | "right" | "justify";
  messageAlign?: "left" | "center" | "right" | "justify";
  titleColor?: string;
  messageColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
  design?: KadoDigitalDesign;
  cardDesign?: KadoCardDesign;
  cardColor?: string;
  className?: string;
}

function parseHex(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "").trim();
  if (h.length === 3) {
    return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
  }
  if (h.length >= 6 && /^[0-9a-fA-F]+$/.test(h.slice(0, 6))) {
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  return null;
}

function mixHex(hex: string, toward: "white" | "black", amount: number) {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const t = toward === "white" ? 255 : 0;
  const m = (c: number) => Math.round(c + (t - c) * amount);
  return `#${[m(rgb[0]), m(rgb[1]), m(rgb[2])].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function isLightHex(hex: string) {
  const rgb = parseHex(hex);
  if (!rgb) return false;
  return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.58;
}

function cardFaceGradient(hex: string) {
  return `linear-gradient(125deg, ${mixHex(hex, "white", 0.16)} 0%, ${hex} 42%, ${mixHex(hex, "black", 0.22)} 100%)`;
}
function formatAccountNumber(value: string) {
  const compact = value.replace(/\s/g, "");
  if (/^\d{8,}$/.test(compact)) {
    return compact.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }
  return value;
}

function EmvChip({ uid }: { uid: string }) {
  const gid = `chip-${uid.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg width="36" height="26" viewBox="0 0 36 26" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="36" y2="26">
          <stop offset="0%" stopColor="#f0e0b8" />
          <stop offset="45%" stopColor="#d4b06a" />
          <stop offset="100%" stopColor="#b08940" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="35" height="25" rx="4" fill={`url(#${gid})`} stroke="#9a7538" />
      <path d="M8 0.5v25M28 0.5v25M0.5 8.5h35M0.5 17.5h35" stroke="#8a6830" strokeWidth="0.55" opacity="0.65" />
      <rect x="12.5" y="8" width="11" height="10" rx="1.2" fill="none" stroke="#8a6830" strokeWidth="0.7" />
    </svg>
  );
}

function mapAlignToClass(align?: "left" | "center" | "right" | "justify") {
  switch (align) {
    case "left":
      return "w-full self-stretch text-left";
    case "right":
      return "w-full self-stretch text-right";
    case "justify":
      return "w-full self-stretch text-justify";
    default:
      return "w-full self-stretch text-center";
  }
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = value;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function KadoDigitalSection({
  title = "Kado Digital",
  message = "Doa restu Anda merupakan karunia yang sangat berarti. Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberikan kado secara digital.",
  accounts = DEFAULT_GIFT_ACCOUNTS,
  qrisImageUrl,
  qrisLabel = "QRIS",
  titleAlign = "center",
  messageAlign = "center",
  titleColor,
  messageColor,
  backgroundColor,
  backgroundImageUrl,
  backgroundImages,
  design = "classic",
  cardDesign = "graphite",
  cardColor,
  showTopCurve = true,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = "beage",
  className = "",
  titleFont,
  titleSize,
  titleEmphasis,
  messageFont,
  messageSize,
  messageEmphasis,
}: KadoDigitalSectionProps) {
  const isNight = design === "night";
  const isEditorial = design === "editorial";
  const isFramed = design === "framed";
  const titleTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: titleFont, size: titleSize, emphasis: titleEmphasis, fallbackFont, color });
  const messageTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: messageFont, size: messageSize, emphasis: messageEmphasis, fallbackFont, color });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const handleCopy = async (id: string, number: string) => {
    const ok = await copyText(number.replace(/\s/g, ""));
    if (!ok) return;
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    setCopiedId(id);
    copiedTimer.current = setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 1600);
  };

  const firstBg = Array.isArray(backgroundImages) && backgroundImages.length > 0
    ? backgroundImages[0]
    : undefined;
  const bgUrl =
    typeof firstBg === "string"
      ? firstBg
      : firstBg && typeof firstBg === "object" && typeof firstBg.url === "string"
        ? firstBg.url
        : backgroundImageUrl || undefined;

  const sectionStyle: React.CSSProperties = {};
  if (bgUrl) {
    sectionStyle.backgroundImage = `url(${bgUrl})`;
    sectionStyle.backgroundSize = "cover";
    sectionStyle.backgroundPosition = "center";
    sectionStyle.backgroundRepeat = "no-repeat";
  } else if (backgroundColor) {
    sectionStyle.backgroundColor = backgroundColor;
  } else if (isNight) {
    sectionStyle.backgroundColor = "#1f1d1a";
  } else {
    sectionStyle.backgroundColor = "#f7f6f3";
  }

  const headingColor = titleColor || (isNight ? "#c4a574" : "#1f1d1a");
  const bodyColor = messageColor || (isNight ? "rgba(247,246,243,0.78)" : "#6b6258");
  const resolvedCardDesign: KadoCardDesign =
    cardDesign === "gold" || cardDesign === "ivory" || cardDesign === "stripe" ? cardDesign : "graphite";
  const resolvedCardColor = cardColor || KADO_CARD_DEFAULTS[resolvedCardDesign];
  const cardIsLight = isLightHex(resolvedCardColor);
  const ink = cardIsLight ? "text-[#1f1d1a]" : "text-white";
  const inkMuted = cardIsLight ? "text-[#1f1d1a]/55" : "text-white/70";
  const inkSoft = cardIsLight ? "text-[#1f1d1a]/80" : "text-white/90";

  const list = (Array.isArray(accounts) ? accounts : [])
    .map((account, index) => ({
      ...account,
      id: account.id || `acc-${index}`,
    }))
    .filter((a) => a.bankName || a.accountNumber || a.accountName);

  const bankCard = (account: GiftAccount) => {
    const copied = copiedId === account.id;
    const isGold = resolvedCardDesign === "gold";
    const isIvory = resolvedCardDesign === "ivory";
    const isStripe = resolvedCardDesign === "stripe";
    return (
      <button
        key={account.id}
        type="button"
        onClick={() => account.accountNumber && handleCopy(account.id, account.accountNumber)}
        className={`relative w-full cursor-pointer overflow-hidden rounded-2xl border-0 text-left shadow-[0_14px_32px_rgba(20,18,16,0.22)] transition-transform duration-100 ease-out active:scale-[0.985] ${
          isGold ? "ring-1 ring-[#e8d5a3]/50" : isIvory ? "ring-1 ring-[#c4a574]/35" : isNight ? "ring-1 ring-[#c4a574]/40" : ""
        }`}
        style={{
          aspectRatio: "1.586 / 1",
          background: cardFaceGradient(resolvedCardColor),
        }}
        aria-label={copied ? "Nomor rekening disalin" : `Salin nomor ${account.bankName || "rekening"}`}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isGold
              ? "linear-gradient(115deg, rgba(255,236,200,0.28) 0%, rgba(255,255,255,0.06) 30%, transparent 55%)"
              : cardIsLight
                ? "linear-gradient(115deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 26%, transparent 52%)"
                : "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, transparent 52%)",
          }}
        />
        {isIvory && (
          <div className="pointer-events-none absolute inset-[7px] rounded-[12px] border border-[#c4a574]/40" />
        )}
        {isStripe && (
          <div
            className="pointer-events-none absolute inset-x-0 top-[48%] h-11 -translate-y-1/2"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(196,165,116,0.55) 18%, rgba(232,213,163,0.7) 50%, rgba(196,165,116,0.55) 82%, transparent 100%)",
            }}
          />
        )}
        <div className="absolute inset-0 flex flex-col px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-[9px] font-medium uppercase tracking-[0.22em] ${inkMuted}`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Rekening
            </p>
            {account.bankName && (
              <p
                className={`truncate text-[11px] font-medium uppercase tracking-[0.16em] ${ink}`}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {account.bankName}
              </p>
            )}
          </div>

          <div className="mt-3">
            <EmvChip uid={account.id} />
          </div>

          {account.accountNumber ? (
            <p
              className={`relative mt-auto break-words text-[15px] leading-none tracking-[0.14em] sm:text-[17px] ${ink}`}
              style={{ fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace' }}
            >
              {formatAccountNumber(account.accountNumber)}
            </p>
          ) : (
            <div className="mt-auto" />
          )}

          <div className="mt-3 flex items-end justify-between gap-3">
            {account.accountName ? (
              <p
                className={`min-w-0 truncate text-[11px] uppercase tracking-[0.14em] ${inkSoft}`}
                style={{ fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace' }}
              >
                {account.accountName}
              </p>
            ) : (
              <span />
            )}
            <span
              className={`shrink-0 text-[8px] font-medium uppercase tracking-[0.18em] ${inkMuted}`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {copied ? "Disalin" : "Salin ▸"}
            </span>
          </div>
        </div>
      </button>
    );
  };

  const qris = qrisImageUrl ? (
    <div className={`mt-10 ${isEditorial ? "text-left" : "text-center"}`}>
      {qrisLabel && (
        <p
          className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em]"
          style={{ fontFamily: "var(--font-dm-sans)", color: "#c4a574" }}
        >
          {qrisLabel}
        </p>
      )}
      <div className={isEditorial ? "" : "flex justify-center"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrisImageUrl}
          alt={qrisLabel || "QRIS"}
          className="h-auto w-[148px] bg-white object-contain p-2"
        />
      </div>
    </div>
  ) : null;

  const heading = (
    <>
      <p
        className="text-[10px] font-medium uppercase tracking-[0.32em]"
        style={{ fontFamily: "var(--font-dm-sans)", color: "#c4a574" }}
      >
        Amplop
      </p>
      <h2
        className={`mt-3 font-medium leading-[1.1] tracking-[-0.02em] ${
          isEditorial ? "text-[2.35rem] italic" : "text-[2.1rem] italic"
        } ${mapAlignToClass(titleAlign)}`}
        style={titleTx("var(--font-playfair)", headingColor)}
      >
        {title}
      </h2>
      {!isEditorial && (
        <div
          className={`my-5 h-px w-10 bg-[#c4a574] ${
            titleAlign === "left" ? "" : titleAlign === "right" ? "ml-auto" : "mx-auto"
          }`}
        />
      )}
      {message && (
        <p
          className={`text-[13px] leading-relaxed ${isEditorial ? "mt-5 max-w-[38ch]" : ""} ${mapAlignToClass(messageAlign)}`}
          style={messageTx("var(--font-dm-sans)", bodyColor)}
        >
          {message}
        </p>
      )}
    </>
  );

  const accountList = (
    <div className={`mt-8 space-y-4 ${isEditorial ? "max-w-sm" : ""}`}>
      {list.map((account) => bankCard(account))}
    </div>
  );

  const body = (
    <>
      {heading}
      {accountList}
      {qris}
    </>
  );

  return (
    <section className={`relative w-full px-6 py-16 ${className}`} style={sectionStyle}>
      {bgUrl && backgroundColor && (
        <div className="absolute inset-0" style={{ backgroundColor, opacity: 0.5 }} />
      )}
      {renderTopCurve({ showTopCurve, topCurveColor, topCurveStyle })}
      {renderDecorativeFlowers({ decorativeFlowers, flowerStyle, showTopCurve, showBottomCurve })}

      <div
        className={`relative z-10 mx-auto max-w-md ${isEditorial ? "" : "text-center"}`}
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {isFramed ? (
          <div className="border border-[#c4a574]/45 p-[6px]">
            <div className="bg-white px-6 py-10" style={{ border: "1px solid rgba(196,165,116,0.28)" }}>
              {body}
            </div>
          </div>
        ) : (
          body
        )}
      </div>
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}
