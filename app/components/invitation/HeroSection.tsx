"use client";

import { useState, useEffect, useMemo } from "react";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";

export type HeroSectionDesign = "classic" | "centered" | "split" | "inset" | "lockup" | "immersive";

/** Accepts string URLs or `{ url }` objects (legacy / migrated editor data). */
export function normalizeHeroBackgroundImages(
  raw: unknown
): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      if (
        entry &&
        typeof entry === "object" &&
        typeof (entry as { url?: string }).url === "string"
      ) {
        return (entry as { url: string }).url.trim();
      }
      return "";
    })
    .filter(Boolean);
}

interface HeroSectionProps extends DecorativeFlowersProps,
  TextStyleFields<"subtitle">,
  TextStyleFields<"coupleNames">,
  TextStyleFields<"quote"> {
  subtitle?: string;
  coupleNames?: string;
  quote?: string;
  /** Slideshow images (strings or `{ url }` per section). */
  backgroundImages?: (string | { url: string; alt?: string; order?: number })[];
  subtitleColor?: string;
  coupleNamesColor?: string;
  quoteColor?: string;
  /** Text alignment controls */
  subtitleAlign?: "left" | "center" | "right" | "justify";
  coupleNamesAlign?: "left" | "center" | "right" | "justify";
  quoteAlign?: "left" | "center" | "right" | "justify";
  backgroundColor?: string;
  curveColor?: string;
  topCurveColor?: string;
  showTopCurve?: boolean;
  showBottomCurve?: boolean;
  topCurveStyle?: 'gentle' | 'wave' | 'smooth';
  bottomCurveStyle?: 'gentle' | 'wave' | 'smooth';
  design?: HeroSectionDesign;
  className?: string;
  /** Compact layout for template cards / thumbnails: fixed height, no slideshow, lighter visuals */
  previewMode?: boolean;
}

export default function HeroSection({
  subtitle = "The Wedding of",
  coupleNames = "Bayu & Nia",
  quote = "Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.",
  backgroundImages = [],
  subtitleColor,
  coupleNamesColor,
  quoteColor,
  subtitleAlign = "center",
  coupleNamesAlign = "center",
  quoteAlign = "center",
  backgroundColor,
  curveColor,
  topCurveColor,
  showTopCurve = true,
  showBottomCurve = true,
  topCurveStyle = 'gentle',
  bottomCurveStyle = 'gentle',
  design = "classic",
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = "",
  previewMode = false,
  subtitleFont,
  subtitleSize,
  subtitleEmphasis,
  coupleNamesFont,
  coupleNamesSize,
  coupleNamesEmphasis,
  quoteFont,
  quoteSize,
  quoteEmphasis,
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const normalizedUrls = useMemo(
    () => normalizeHeroBackgroundImages(backgroundImages),
    [backgroundImages]
  );

  const slideshowUrls = useMemo(() => {
    if (previewMode && normalizedUrls.length > 1) {
      return [normalizedUrls[0]];
    }
    return normalizedUrls;
  }, [previewMode, normalizedUrls]);

  const effectiveFlowers = previewMode ? false : decorativeFlowers;
  const isCentered = design === "centered";
  const isSplit = design === "split";
  const isInset = design === "inset";
  const isLockup = design === "lockup";
  const isImmersive = design === "immersive";

  // Curve SVG paths for different styles
  const curvePaths = {
    gentle: "M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z", // Original gentle curve
    wave: "M0,0c100,0,200,60,300,60c100,0,200-60,300-60c100,0,200,60,300,60c100,0,100-60,100-60v100H0V0z", // Wavy pattern
    smooth: "M0,0c200,0,300,40,500,40c200,0,300-40,500-40v100H0V0z" // Smooth rounded curve
  };

  // Keep slide index valid when removing images (e.g. 2 → 1 slide after slideshow was on index 1)
  useEffect(() => {
    setCurrentImageIndex((prev) => {
      if (slideshowUrls.length === 0) return 0;
      return prev % slideshowUrls.length;
    });
  }, [slideshowUrls.length]);

  // Auto-rotate background images (disabled in previewMode)
  useEffect(() => {
    if (previewMode) return;
    if (slideshowUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slideshowUrls.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideshowUrls.length, previewMode]);

  // No images: gradient or solid color. With images: optional color underlay behind slides
  const sectionStyle: React.CSSProperties = {};
  if (isInset || isSplit) {
    sectionStyle.backgroundColor = backgroundColor || "#f7f6f3";
  } else if (!slideshowUrls.length) {
    if (backgroundColor) {
      sectionStyle.backgroundColor = backgroundColor;
    } else {
      sectionStyle.background =
        "linear-gradient(to bottom, #111827, #1f2937, #111827)";
    }
  } else if (backgroundColor) {
    sectionStyle.backgroundColor = backgroundColor;
  }

  const mapAlignToClass = (align?: "left" | "center" | "right" | "justify") => {
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
  };

  const subtitleAlignClass = mapAlignToClass(subtitleAlign);
  const coupleNamesAlignClass = mapAlignToClass(coupleNamesAlign);
  const quoteAlignClass = mapAlignToClass(quoteAlign);
  const subtitleTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: subtitleFont, size: subtitleSize, emphasis: subtitleEmphasis, fallbackFont, color });
  const namesTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: coupleNamesFont, size: coupleNamesSize, emphasis: coupleNamesEmphasis, fallbackFont, color });
  const quoteTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: quoteFont, size: quoteSize, emphasis: quoteEmphasis, fallbackFont, color });

  const sectionHeightClass = previewMode
    ? "min-h-full w-full"
    : "min-h-screen";

  const curveSvgClass = previewMode ? "h-8 sm:h-10" : "h-16";

  const overlayClass = isCentered
    ? "bg-black/40"
    : isLockup
      ? "bg-gradient-to-r from-black/70 via-black/35 to-black/10"
      : isSplit
        ? "bg-gradient-to-t from-black/25 to-transparent"
        : isInset
          ? "bg-gradient-to-t from-black/55 via-black/15 to-transparent"
          : isImmersive
            ? "bg-gradient-to-t from-black/70 via-black/10 to-black/20"
            : "bg-gradient-to-t from-black/60 via-black/30 to-transparent";

  const renderSlideshow = () => {
    if (slideshowUrls.length === 0) {
      return (
        <div className={`absolute inset-0 ${isInset || isSplit ? "bg-neutral-300" : ""}`} />
      );
    }
    return (
      <div className="absolute inset-0 z-0">
        {slideshowUrls.map((imageUrl, index) => (
          <div
            key={`${index}-${imageUrl.slice(0, 48)}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center ${previewMode ? "" : "animate-ken-burns"}`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div className={`absolute inset-0 ${overlayClass}`} />
          </div>
        ))}
      </div>
    );
  };

  const sectionAlignClass = isCentered || isInset
    ? "items-center justify-center"
    : isLockup
      ? "items-center justify-start"
      : isSplit
        ? "items-stretch justify-end"
        : "items-end justify-center";

  return (
    <section 
      className={`relative ${sectionHeightClass} w-full flex overflow-hidden ${sectionAlignClass} ${className}`}
      style={Object.keys(sectionStyle).length > 0 ? sectionStyle : undefined}
    >
      {/* Full-bleed slideshow for classic / centered / lockup / immersive */}
      {!isSplit && !isInset && renderSlideshow()}

      {/* SVG Curve Divider at Top */}
      {showTopCurve && (
        <div className="pointer-events-none absolute -top-px right-0 left-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full ${curveSvgClass}`} style={{ fill: topCurveColor || (isInset || isSplit ? '#f7f6f3' : '#ffffff'), transform: 'rotate(180deg)' }}>
            <path d={curvePaths[topCurveStyle]} />
          </svg>
        </div>
      )}

      {/* Decorative Flowers */}
      {renderDecorativeFlowers({ decorativeFlowers: effectiveFlowers, flowerStyle, showTopCurve, showBottomCurve })}

      {isSplit ? (
        <div className="absolute inset-0 z-10 flex flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {renderSlideshow()}
          </div>
          <div
            className={`relative z-[11] flex shrink-0 flex-col items-center justify-center bg-[#f7f6f3] px-6 ${
              previewMode ? "py-4" : "px-8 py-10"
            }`}
            style={getFlowerMargin({ decorativeFlowers: effectiveFlowers, showTopCurve, showBottomCurve })}
          >
            <p
              className={`${previewMode ? "text-[10px] mb-1" : "text-[11px] mb-3"} font-medium uppercase tracking-[0.32em] ${subtitleAlignClass}`}
              style={subtitleTx("var(--font-dm-sans)", subtitleColor || "#8a8178")}
            >
              {subtitle}
            </p>
            <h2
              className={`${
                previewMode ? "text-xl mb-1.5" : "text-[2.4rem] mb-3"
              } font-medium italic leading-[1.08] tracking-[-0.02em] ${coupleNamesAlignClass}`}
              style={namesTx("var(--font-playfair)", coupleNamesColor || "#c4a574")}
            >
              {coupleNames}
            </h2>
            <div className="mb-3 h-px w-10 bg-[#c4a574]/70" />
            <p
              className={`${
                previewMode
                  ? "text-[10px] leading-snug line-clamp-2"
                  : "text-[14px] leading-relaxed"
              } max-w-md ${quoteAlignClass}`}
              style={quoteTx("var(--font-dm-sans)", quoteColor || "#6b6258")}
            >
              {quote}
            </p>
          </div>
        </div>
      ) : isInset ? (
        <div
          className={`relative z-10 mx-auto flex w-full max-w-md flex-col items-center ${
            previewMode ? "px-4 py-6" : "px-6 py-16"
          }`}
          style={getFlowerMargin({ decorativeFlowers: effectiveFlowers, showTopCurve, showBottomCurve })}
        >
          <p
            className={`${previewMode ? "text-[10px] mb-3" : "text-[11px] mb-5"} font-medium uppercase tracking-[0.32em] ${subtitleAlignClass}`}
            style={subtitleTx("var(--font-dm-sans)", subtitleColor || "#8a8178")}
          >
            {subtitle}
          </p>
          <div
            className={`relative w-full overflow-hidden rounded-[22px] shadow-[0_22px_44px_rgba(40,32,24,0.16)] ${
              previewMode ? "aspect-[4/5]" : "aspect-[3/4]"
            }`}
          >
            {renderSlideshow()}
            <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 text-center">
              <h2
                className={`${
                  previewMode ? "text-xl" : "text-[2.15rem]"
                } font-medium italic leading-[1.08] tracking-[-0.02em] ${coupleNamesAlignClass}`}
                style={namesTx("var(--font-playfair)", coupleNamesColor || "#ffffff")}
              >
                {coupleNames}
              </h2>
            </div>
          </div>
          <p
            className={`${
              previewMode
                ? "mt-3 text-[10px] leading-snug line-clamp-2"
                : "mt-6 text-[14px] leading-relaxed"
            } max-w-sm ${quoteAlignClass}`}
            style={quoteTx("var(--font-dm-sans)", quoteColor || "#6b6258")}
          >
            {quote}
          </p>
        </div>
      ) : isCentered ? (
        <div
          className={`relative z-10 w-full text-center text-white ${
            previewMode ? "px-4 py-8" : "px-6 py-16"
          }`}
          style={getFlowerMargin({ decorativeFlowers: effectiveFlowers, showTopCurve, showBottomCurve })}
        >
          <p
            className={`${previewMode ? "text-[10px] mb-2" : "text-[11px] mb-4"} font-medium uppercase tracking-[0.34em] ${subtitleAlignClass}`}
            style={subtitleTx("var(--font-dm-sans)", subtitleColor || "rgba(255,255,255,0.82)")}
          >
            {subtitle}
          </p>
          <h2
            className={`${
              previewMode ? "text-2xl mb-2" : "text-[2.75rem] md:text-5xl mb-5"
            } font-medium italic leading-[1.05] tracking-[-0.02em] ${coupleNamesAlignClass}`}
            style={namesTx("var(--font-playfair)", coupleNamesColor || "#c4a574")}
          >
            {coupleNames}
          </h2>
          <div className="mx-auto mb-5 h-px w-12 bg-white/50" />
          <p
            className={`${
              previewMode
                ? "text-[10px] italic max-w-full leading-snug line-clamp-3"
                : "text-base italic max-w-lg mx-auto leading-relaxed"
            } ${quoteAlignClass}`}
            style={quoteTx("var(--font-dm-sans)", quoteColor || "rgba(255,255,255,0.88)")}
          >
            {quote}
          </p>
        </div>
      ) : isLockup ? (
        <div
          className={`relative z-10 w-full max-w-md text-white ${
            previewMode ? "px-4 py-8" : "px-8 py-16"
          }`}
          style={getFlowerMargin({ decorativeFlowers: effectiveFlowers, showTopCurve, showBottomCurve })}
        >
          <p
            className={`${previewMode ? "text-[10px] mb-2" : "text-[11px] mb-4"} font-medium uppercase tracking-[0.3em] ${subtitleAlignClass}`}
            style={subtitleTx("var(--font-dm-sans)", subtitleColor || "rgba(255,255,255,0.78)")}
          >
            {subtitle}
          </p>
          <h2
            className={`${
              previewMode ? "text-2xl mb-3" : "text-[2.6rem] mb-5"
            } font-medium italic leading-[1.08] tracking-[-0.02em] ${coupleNamesAlignClass}`}
            style={namesTx("var(--font-playfair)", coupleNamesColor || "#ffffff")}
          >
            {coupleNames}
          </h2>
          <div className={`mb-5 h-px w-10 bg-[#c4a574] ${coupleNamesAlign === "left" ? "" : coupleNamesAlign === "right" ? "ml-auto" : "mx-auto"}`} />
          <p
            className={`${
              previewMode
                ? "text-[10px] italic max-w-[28ch] leading-snug line-clamp-3"
                : "text-[15px] italic max-w-[22ch] leading-relaxed"
            } ${quoteAlignClass}`}
            style={quoteTx("var(--font-dm-sans)", quoteColor || "rgba(255,255,255,0.86)")}
          >
            {quote}
          </p>
        </div>
      ) : isImmersive ? (
        <div
          className="absolute inset-0 z-10 flex flex-col justify-end text-white"
        >
          <div
            className={`w-full ${previewMode ? "px-4 pb-6 pt-16" : "px-7 pb-14 pt-40"}`}
            style={getFlowerMargin({ decorativeFlowers: effectiveFlowers, showTopCurve, showBottomCurve })}
          >
            <p
              className={`${previewMode ? "mb-2 text-[9px]" : "mb-3 text-[11px]"} font-medium uppercase tracking-[0.36em] ${subtitleAlignClass}`}
              style={subtitleTx("var(--font-dm-sans)", subtitleColor || "rgba(255,255,255,0.75)")}
            >
              {subtitle}
            </p>
            <h2
              className={`${
                previewMode ? "text-[1.7rem]" : "text-[2.65rem]"
              } font-medium italic leading-[1.08] tracking-[-0.03em] ${coupleNamesAlignClass}`}
              style={namesTx("var(--font-playfair)", coupleNamesColor || "#ffffff")}
            >
              {coupleNames}
            </h2>
            <div
              className={`mt-4 h-px w-10 bg-white/45 ${
                coupleNamesAlign === "left" ? "" : coupleNamesAlign === "right" ? "ml-auto" : "mx-auto"
              }`}
            />
            <p
              className={`${
                previewMode
                  ? "mt-3 text-[10px] leading-snug line-clamp-2"
                  : "mt-4 text-[13px] leading-relaxed line-clamp-3"
              } max-w-[32ch] ${quoteAlign === "left" ? "mr-auto" : quoteAlign === "right" ? "ml-auto" : "mx-auto"} ${quoteAlignClass}`}
              style={quoteTx("var(--font-dm-sans)", quoteColor || "rgba(255,255,255,0.78)")}
            >
              {quote}
            </p>
          </div>
        </div>
      ) : (
        <div 
          className={`relative z-10 w-full text-center text-white ${
            previewMode ? "px-4 pt-8 pb-16 sm:pb-20" : "px-6 pt-16 pb-32"
          }`}
          style={getFlowerMargin({ decorativeFlowers: effectiveFlowers, showTopCurve, showBottomCurve })}
        >
          <p
            className={`${previewMode ? "text-xs sm:text-sm mb-2" : "text-lg mb-4"} ${subtitleAlignClass}`}
            style={subtitleTx("var(--font-dm-sans)", subtitleColor || "rgba(255, 255, 255, 0.9)")}
          >
            {subtitle}
          </p>
          <h2
            className={`${
              previewMode ? "text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3" : "text-4xl md:text-5xl mb-6"
            } font-bold ${coupleNamesAlignClass}`}
            style={namesTx("var(--font-playfair)", coupleNamesColor || "#ffffff")}
          >
            {coupleNames}
          </h2>
          <p
            className={`${
              previewMode
                ? "text-[10px] sm:text-xs italic max-w-full mx-auto leading-snug line-clamp-3"
                : "text-base md:text-lg italic max-w-2xl mx-auto leading-relaxed"
            } ${quoteAlignClass}`}
            style={quoteTx("var(--font-dm-sans)", quoteColor || "rgba(255, 255, 255, 0.9)")}
          >
            "{quote}"
          </p>
        </div>
      )}

      {/* SVG Curve Divider at Bottom */}
      {showBottomCurve && (
        <div className="pointer-events-none absolute right-0 -bottom-px left-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full ${curveSvgClass}`} style={{ fill: curveColor || (isInset || isSplit ? '#f7f6f3' : '#ffffff') }}>
            <path d={curvePaths[bottomCurveStyle]} />
          </svg>
        </div>
      )}

      <style jsx>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.1) translate(-2%, -2%);
          }
        }
        .animate-ken-burns {
          animation: ken-burns 10s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
}
