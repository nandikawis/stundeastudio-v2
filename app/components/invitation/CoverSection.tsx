"use client";

import { useState } from "react";
import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { ImageContainerStyle } from "./CoupleProfile";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";

export type CoverSectionDesign = 'simple' | 'with-container' | 'framed-card' | 'fullbleed' | 'arch' | 'docked';

interface CoverSectionProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"date">,
  TextStyleFields<"coupleNames">,
  TextStyleFields<"quote">,
  TextStyleFields<"guestLocation"> {
  date?: string;
  coupleNames?: string;
  /** Greeting / salam text shown below the couple names */
  quote?: string;
  /** Actual guest name injected from URL or guest list */
  guestName?: string;
  /** Placeholder text when no guestName is provided */
  guestNamePlaceholder?: string;
  /** Customizable text for the \"Di Tempat\" line */
  guestLocationText?: string;
  /** Customizable color for the \"Di Tempat\" line */
  guestLocationColor?: string;
  dateColor?: string;
  coupleNamesColor?: string;
  quoteColor?: string;
  /** Text alignment controls */
  dateAlign?: "left" | "center" | "right" | "justify";
  coupleNamesAlign?: "left" | "center" | "right" | "justify";
  quoteAlign?: "left" | "center" | "right" | "justify";
  guestBlockAlign?: "left" | "center" | "right" | "justify";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
  /** Design variant: simple (no image container) or with-container (with image container) */
  design?: CoverSectionDesign;
  /** Cover image URL (shown in container when design is 'with-container') */
  imageUrl?: string;
  /** Image container style (same as CoupleProfile) */
  imageStyle?: ImageContainerStyle;
  /** Glow color for glow-style containers */
  glowColor?: string;
  className?: string;
  isEditor?: boolean;
  /** True when rendered on standalone public invitation pages (full viewport height) */
  isStandaloneInvitation?: boolean;
  /** Called when cover has finished opening (so parent can unmount cover layer and avoid white flash) */
  onOpened?: () => void;
  onEditContent?: () => void;
  onChangeDesign?: () => void;
}

export default function CoverSection({
  date = "09 .01 .2026",
  coupleNames = "Bayu & Nia",
  quote = "Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.",
  guestName,
  guestNamePlaceholder = "Nama Tamu",
  guestLocationText = "Di Tempat",
  guestLocationColor,
  dateColor,
  coupleNamesColor,
  quoteColor,
  dateAlign = "center",
  coupleNamesAlign = "center",
  quoteAlign = "center",
  guestBlockAlign = "center",
  backgroundColor,
  backgroundImageUrl,
  backgroundImages,
  design = 'simple',
  imageUrl,
  imageStyle = 'circular',
  glowColor = "#b49549",
  showTopCurve,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = "",
  isEditor = false,
  isStandaloneInvitation = false,
  onOpened,
  onEditContent,
  onChangeDesign,
  dateFont,
  dateSize,
  dateEmphasis,
  coupleNamesFont,
  coupleNamesSize,
  coupleNamesEmphasis,
  quoteFont,
  quoteSize,
  quoteEmphasis,
  guestLocationFont,
  guestLocationSize,
  guestLocationEmphasis,
}: CoverSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Extract background URL from array (like ImageCarousel) or fallback to legacy string
  const firstBg = Array.isArray(backgroundImages) && backgroundImages.length > 0
    ? backgroundImages[0]
    : undefined;
  const bgUrl =
    typeof firstBg === "string"
      ? firstBg
      : firstBg && typeof firstBg === "object" && typeof firstBg.url === "string"
        ? firstBg.url
        : backgroundImageUrl || undefined;

  const coverPhoto = imageUrl || bgUrl;
  const framedPhoto = coverPhoto;
  const isFramed = design === 'framed-card';
  const isFullbleed = design === 'fullbleed';
  const isArch = design === 'arch';
  const isDocked = design === 'docked';
  const isComposedCover = isFramed || isFullbleed || isArch || isDocked;

  // Build background style for section
  const sectionStyle: React.CSSProperties = {};

  if (isArch) {
    sectionStyle.backgroundColor = backgroundColor || '#f7f6f3';
  } else if (isFramed) {
    sectionStyle.backgroundColor = backgroundColor || '#0b0b0b';
  } else if (isDocked && coverPhoto) {
    sectionStyle.backgroundImage = `url(${coverPhoto})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  } else if (bgUrl) {
    sectionStyle.backgroundImage = `url(${bgUrl})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  } else if (backgroundColor) {
    sectionStyle.backgroundColor = backgroundColor;
  } else {
    sectionStyle.background = 'linear-gradient(to bottom, #111827, #1f2937, #111827)';
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

  const dateAlignClass = mapAlignToClass(dateAlign);
  const coupleNamesAlignClass = mapAlignToClass(coupleNamesAlign);
  const quoteAlignClass = mapAlignToClass(quoteAlign);
  const guestBlockAlignClass = mapAlignToClass(guestBlockAlign);
  const dateTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: dateFont, size: dateSize, emphasis: dateEmphasis, fallbackFont, color });
  const namesTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: coupleNamesFont, size: coupleNamesSize, emphasis: coupleNamesEmphasis, fallbackFont, color });
  const quoteTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: quoteFont, size: quoteSize, emphasis: quoteEmphasis, fallbackFont, color });
  const locationTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: guestLocationFont, size: guestLocationSize, emphasis: guestLocationEmphasis, fallbackFont, color });

  const handleOpenInvitation = () => {
    // In editor mode, don't animate or hide
    if (isEditor) return;
    
    setIsAnimating(true);
    // After animation completes, hide the section and notify parent (so cover layer can unmount and content is already painted)
    setTimeout(() => {
      setIsOpen(true);
      onOpened?.();
    }, 800); // Match animation duration
  };

  // Don't render if already opened (only in preview/published mode)
  if (!isEditor && isOpen) {
    return null;
  }

  // Determine positioning classes based on editor mode
  const positionClasses = isEditor
    ? `relative ${isDocked ? "h-[100svh] min-h-[100svh]" : "min-h-screen"} w-full max-w-[375px] mx-auto z-0`
    : isStandaloneInvitation
      ? "relative h-full w-full z-50"
      : "absolute inset-0 w-full z-50"; // Phone mockup: fill the frame screen

  return (
    <>
      <section 
        className={`${positionClasses} flex flex-col items-center ${
          isDocked ? "justify-end" : "justify-center"
        } text-white overflow-hidden ${className} ${
          !isEditor && isAnimating ? 'animate-fade-up-out' : ''
        } ${isEditor ? 'border-2 border-dashed border-accent/50 rounded-lg mb-4' : ''}`}
        style={{
          ...sectionStyle,
          ...(!isEditor
            ? {
                height: "100%",
                maxHeight: "100%",
                minHeight: "100%",
                willChange: isAnimating ? 'transform, opacity' : 'auto',
              }
            : {}),
        }}
        {...(isEditor ? { 'data-section-type': 'cover' } : {})}
      >
        {/* Editor mode label and buttons */}
        {isEditor && (
          <>
            <div className="pointer-events-none absolute top-2 left-2 z-20 rounded-md bg-black/45 px-2 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
              Cover
            </div>
            {/* Edit buttons - always visible in editor mode */}
            <div className="pointer-events-auto absolute top-2 right-2 z-20 flex gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditContent?.();
                }}
                className="rounded-full border border-white/25 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              >
                Edit konten
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeDesign?.();
                }}
                className="rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-black/65"
              >
                Ubah desain
              </button>
            </div>
          </>
        )}
        
        {/* Color overlay if both image and color are set */}
        {coverPhoto && backgroundColor && !isFramed && !isArch && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor, opacity: isFullbleed || isDocked ? 0.4 : 0.5 }}
          />
        )}
        {isFullbleed && coverPhoto && !backgroundColor && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        )}
        {isDocked && coverPhoto && !backgroundColor && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/55" />
        )}
        {/* Top Curve Divider */}
        {renderTopCurve({ showTopCurve, topCurveColor, topCurveStyle })}
        {/* Decorative Flowers */}
        {renderDecorativeFlowers({ decorativeFlowers, flowerStyle, showTopCurve, showBottomCurve })}
        {/* Background decorative elements */}
        {!isComposedCover && (
          <div className="absolute inset-0 opacity-10 z-0">
            <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
          </div>
        )}

        <div 
          className={
            isDocked
              ? 'absolute inset-0 z-10 flex w-full flex-col pt-14 text-center'
              : `relative z-10 mx-auto w-full max-w-md text-center ${
                  isComposedCover
                    ? 'flex h-full flex-col justify-between px-6 py-12'
                    : 'px-6 py-12'
                }`
          }
          style={isDocked ? undefined : getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          {isFramed ? (
            <div className="flex h-full flex-col items-center justify-center">
              {framedPhoto ? (
                <div className="mb-7 w-[82%] max-w-[280px] overflow-hidden rounded-[24px] shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
                  <img
                    src={framedPhoto}
                    alt={coupleNames}
                    className="aspect-[4/5] w-full object-cover"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="mb-7 flex aspect-[4/5] w-[82%] max-w-[280px] items-center justify-center rounded-[24px] bg-white/5">
                  <svg className="h-16 w-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <h1
                className={`mb-5 text-[2.15rem] font-medium italic leading-[1.1] tracking-[-0.02em] ${coupleNamesAlignClass}`}
                style={namesTx("var(--font-playfair)", coupleNamesColor || "#c4a574")}
              >
                {coupleNames}
              </h1>
              <p
                className={`mb-1.5 line-clamp-3 text-[13px] tracking-wide ${quoteAlignClass}`}
                style={quoteTx("var(--font-dm-sans)", quoteColor || "rgba(255,255,255,0.72)")}
              >
                {quote}
              </p>
              <div className={`mb-5 ${guestBlockAlignClass}`}>
                <h2
                  className="text-[1.65rem] italic leading-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {guestName || guestNamePlaceholder}
                </h2>
              </div>
              <button
                onClick={handleOpenInvitation}
                className="mx-auto flex w-full max-w-[240px] items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-medium text-white transition-[opacity,transform] duration-100 ease-out hover:opacity-90 active:scale-[0.97]"
                style={{ backgroundColor: coupleNamesColor || "#c4a574" }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Buka Undangan
              </button>
              <p
                className={`mt-4 text-[10px] leading-relaxed ${guestBlockAlignClass}`}
                style={locationTx("var(--font-dm-sans)", guestLocationColor || "rgba(255,255,255,0.45)")}
              >
                {guestLocationText}
              </p>
            </div>
          ) : isFullbleed ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p
                className={`mb-3 text-[11px] font-medium uppercase tracking-[0.32em] ${dateAlignClass}`}
                style={dateTx("var(--font-dm-sans)", dateColor || "rgba(255,255,255,0.85)")}
              >
                {date}
              </p>
              <h1
                className={`mb-4 text-[2.55rem] font-medium italic leading-[1.05] tracking-[-0.02em] ${coupleNamesAlignClass}`}
                style={namesTx("var(--font-playfair)", coupleNamesColor || "#ffffff")}
              >
                {coupleNames}
              </h1>
              <p
                className={`mb-5 text-[13px] leading-relaxed ${quoteAlignClass}`}
                style={quoteTx("var(--font-dm-sans)", quoteColor || "rgba(255,255,255,0.8)")}
              >
                {quote}
              </p>
              <div className={`mb-7 ${guestBlockAlignClass}`}>
                <h2 className="text-[1.7rem] font-medium tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                  {guestName || guestNamePlaceholder}
                </h2>
                <p
                  className="mt-2 text-[11px] italic"
                  style={locationTx("var(--font-dm-sans)", guestLocationColor || "rgba(255,255,255,0.65)")}
                >
                  {guestLocationText}
                </p>
              </div>
              <button
                onClick={handleOpenInvitation}
                className="mx-auto flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm text-neutral-900 shadow-lg transition-[transform,background-color] duration-100 ease-out hover:bg-white/92 active:scale-[0.97]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Buka Undangan
              </button>
            </div>
          ) : isArch ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p
                className={`mb-5 text-[10px] font-medium uppercase tracking-[0.34em] ${dateAlignClass}`}
                style={dateTx("var(--font-dm-sans)", dateColor || "#8a8178")}
              >
                {date}
              </p>
              <div
                className="mb-6 w-[68%] max-w-[240px] overflow-hidden shadow-[0_22px_44px_rgba(40,32,24,0.18)]"
                style={{ borderRadius: '999px 999px 18px 18px' }}
              >
                {coverPhoto ? (
                  <img
                    src={coverPhoto}
                    alt={coupleNames}
                    className="aspect-[3/4] w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-200">
                    <svg className="h-14 w-14 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <h1
                className={`mb-3 text-[2.2rem] font-medium italic leading-[1.08] tracking-[-0.02em] ${coupleNamesAlignClass}`}
                style={namesTx("var(--font-playfair)", coupleNamesColor || "#c4a574")}
              >
                {coupleNames}
              </h1>
              <div className="mb-5 h-px w-10 bg-[#c4a574]/70" />
              <div className={`mb-6 ${guestBlockAlignClass}`}>
                <p
                  className={`mb-1 line-clamp-2 text-[12px] ${quoteAlignClass}`}
                  style={quoteTx("var(--font-dm-sans)", quoteColor || "#6b6258")}
                >
                  {quote}
                </p>
                <h2
                  className="mt-2 text-[1.45rem] italic leading-tight"
                  style={{ fontFamily: "var(--font-playfair)", color: "#2c2a27" }}
                >
                  {guestName || guestNamePlaceholder}
                </h2>
              </div>
              <button
                onClick={handleOpenInvitation}
                className="mx-auto flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3 text-[13px] text-white transition-[transform,opacity] duration-100 ease-out hover:opacity-90 active:scale-[0.97]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Buka Undangan
              </button>
              <p
                className={`mt-4 text-[10px] leading-relaxed ${guestBlockAlignClass}`}
                style={locationTx("var(--font-dm-sans)", guestLocationColor || "#9a9188")}
              >
                {guestLocationText}
              </p>
            </div>
          ) : isDocked ? (
            <>
              <div className="px-6">
                <p
                  className={`mb-3 text-[11px] font-medium uppercase tracking-[0.32em] ${dateAlignClass}`}
                  style={dateTx("var(--font-dm-sans)", dateColor || "rgba(255,255,255,0.8)")}
                >
                  {date}
                </p>
                <h1
                  className={`text-[2.5rem] font-medium italic leading-[1.05] tracking-[-0.02em] ${coupleNamesAlignClass}`}
                  style={namesTx("var(--font-playfair)", coupleNamesColor || "#c4a574")}
                >
                  {coupleNames}
                </h1>
              </div>
              <div className="mt-auto w-full rounded-t-[28px] bg-[#f7f6f3] px-6 pb-7 pt-6 text-neutral-900 shadow-[0_-16px_40px_rgba(0,0,0,0.2)]">
                <p
                  className={`mb-2 line-clamp-2 text-[13px] leading-relaxed ${quoteAlignClass}`}
                  style={quoteTx("var(--font-dm-sans)", quoteColor || "#6b6258")}
                >
                  {quote}
                </p>
                <div className={`mb-5 ${guestBlockAlignClass}`}>
                  <h2
                    className="text-[1.55rem] font-medium italic leading-tight"
                    style={{ fontFamily: "var(--font-playfair)", color: "#1f1d1a" }}
                  >
                    {guestName || guestNamePlaceholder}
                  </h2>
                  <p
                    className="mt-1.5 text-[11px]"
                    style={locationTx("var(--font-dm-sans)", guestLocationColor || "#8a8178")}
                  >
                    {guestLocationText}
                  </p>
                </div>
                <button
                  onClick={handleOpenInvitation}
                  className="mx-auto flex w-full max-w-[240px] items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm text-white transition-[transform,opacity] duration-100 ease-out hover:opacity-90 active:scale-[0.97]"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Buka Undangan
                </button>
              </div>
            </>
          ) : (
            <>
          {/* Image Container - only show when design is 'with-container' */}
          {design === 'with-container' && (
            (() => {
              const containerStyle: React.CSSProperties = {
                width: 250,
                height: 250,
                margin: "0 auto 32px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              };

              const imageWrapperStyle: React.CSSProperties = {
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                backgroundColor: !imageUrl ? "rgba(255, 255, 255, 0.1)" : undefined
              };

              // Helper function to convert hex to rgba
              const hexToRgba = (hex: string, alpha: number): string => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
              };

              // Helper function to get darker shade for secondary glow
              const getDarkerGlow = (hex: string, alpha: number): string => {
                const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 30);
                const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 30);
                const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 30);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
              };

              // Apply style-specific properties with beautiful default borders
              switch (imageStyle) {
                case 'circular':
                  imageWrapperStyle.borderRadius = "50%";
                  imageWrapperStyle.boxShadow = "0px 4px 20px 0px rgba(0, 0, 0, 0.15)";
                  imageWrapperStyle.border = "4px solid rgba(255, 255, 255, 0.4)";
                  break;
                case 'circular-gradient':
                  imageWrapperStyle.borderRadius = "50%";
                  imageWrapperStyle.boxShadow = "0px 4px 20px 0px rgba(0, 0, 0, 0.15)";
                  containerStyle.padding = "4px";
                  containerStyle.background = "linear-gradient(135deg, #d4af37 0%, #b8945f 25%, #8b7355 50%, #6b5d4f 75%, #4a4a4a 100%)";
                  containerStyle.borderRadius = "50%";
                  break;
                case 'rounded-elegant':
                  imageWrapperStyle.borderRadius = "20px";
                  imageWrapperStyle.boxShadow = "0px 8px 30px rgba(0, 0, 0, 0.12), 0px 0px 0px 3px rgba(255, 255, 255, 0.9), inset 0px 0px 0px 2px rgba(255, 255, 255, 0.5)";
                  break;
                case 'square-frame':
                  imageWrapperStyle.borderRadius = "0";
                  imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.1)";
                  containerStyle.padding = "8px";
                  containerStyle.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)";
                  containerStyle.borderRadius = "4px";
                  containerStyle.boxShadow = "inset 0px 0px 0px 2px rgba(255, 255, 255, 0.3)";
                  break;
                case 'square-elegant':
                  imageWrapperStyle.borderRadius = "0";
                  imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.1)";
                  containerStyle.padding = "6px";
                  containerStyle.background = "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%)";
                  containerStyle.borderRadius = "4px";
                  containerStyle.boxShadow = "inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1), 0px 6px 25px rgba(0, 0, 0, 0.3)";
                  break;
                case 'square-glow':
                  imageWrapperStyle.borderRadius = "0";
                  imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
                  containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
                  break;
                case 'hexagon-glow':
                  imageWrapperStyle.borderRadius = "0";
                  imageWrapperStyle.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)";
                  imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.4)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.2)}`;
                  containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.3)})`;
                  break;
                case 'hexagon-classic':
                  imageWrapperStyle.borderRadius = "0";
                  imageWrapperStyle.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)";
                  imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
                  containerStyle.padding = "6px";
                  containerStyle.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)";
                  containerStyle.filter = "drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2))";
                  break;
                case 'hexagon-modern':
                  imageWrapperStyle.borderRadius = "0";
                  imageWrapperStyle.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)";
                  imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
                  containerStyle.padding = "8px";
                  containerStyle.background = "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%)";
                  containerStyle.filter = "drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.4))";
                  break;
                case 'circular-glow':
                  imageWrapperStyle.borderRadius = "50%";
                  imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
                  containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
                  break;
                case 'rounded-modern':
                  imageWrapperStyle.borderRadius = "24px";
                  imageWrapperStyle.boxShadow = "0px 8px 32px rgba(0, 0, 0, 0.12), inset 0px 0px 0px 2px rgba(255, 255, 255, 0.8)";
                  containerStyle.padding = "3px";
                  containerStyle.background = "linear-gradient(135deg, #d4af37 0%, #b8945f 50%, #8b7355 100%)";
                  containerStyle.borderRadius = "27px";
                  break;
                case 'oval-vintage':
                  imageWrapperStyle.borderRadius = "50%";
                  imageWrapperStyle.width = "220px";
                  imageWrapperStyle.height = "280px";
                  imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
                  containerStyle.width = "250px";
                  containerStyle.height = "310px";
                  containerStyle.padding = "12px";
                  containerStyle.background = "rgba(255, 255, 255, 0.15)";
                  containerStyle.borderRadius = "50%";
                  containerStyle.boxShadow = "inset 0px 0px 0px 2px rgba(255, 255, 255, 0.3), 0px 4px 20px rgba(0, 0, 0, 0.1)";
                  break;
                case 'oval-classic':
                  imageWrapperStyle.borderRadius = "50%";
                  imageWrapperStyle.width = "220px";
                  imageWrapperStyle.height = "280px";
                  imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
                  containerStyle.width = "250px";
                  containerStyle.height = "310px";
                  containerStyle.padding = "10px";
                  containerStyle.background = "rgba(255, 255, 255, 0.1)";
                  containerStyle.borderRadius = "50%";
                  containerStyle.boxShadow = "inset 0px 0px 0px 1px rgba(255, 255, 255, 0.2), inset 0px 0px 0px 3px rgba(255, 255, 255, 0.1), 0px 6px 25px rgba(0, 0, 0, 0.12)";
                  break;
                case 'oval-glow':
                  imageWrapperStyle.borderRadius = "50%";
                  imageWrapperStyle.width = "220px";
                  imageWrapperStyle.height = "280px";
                  imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
                  containerStyle.width = "250px";
                  containerStyle.height = "310px";
                  containerStyle.padding = "12px";
                  containerStyle.background = "rgba(255, 255, 255, 0.15)";
                  containerStyle.borderRadius = "50%";
                  containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
                  break;
                case 'rounded-glow':
                  imageWrapperStyle.borderRadius = "20px";
                  imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
                  containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
                  break;
              }

              return (
                <div className="mx-auto mb-8" style={containerStyle}>
                  <div style={imageWrapperStyle}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={coupleNames}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          display: "block"
                        }}
                        draggable={false}
                      />
                    ) : (
                      <span className="flex w-full h-full items-center justify-center">
                        <svg className="w-24 h-24 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              );
            })()
          )}

          {/* Date */}
          <p
            className={`text-lg md:text-xl mb-6 tracking-wider ${dateAlignClass}`}
            style={dateTx("var(--font-playfair)", dateColor || "rgba(255, 255, 255, 0.9)")}
          >
            {date}
          </p>

          {/* Couple Names */}
          <h1
            className={`text-4xl md:text-5xl font-bold mb-8 ${coupleNamesAlignClass}`}
            style={namesTx("var(--font-playfair)", coupleNamesColor || "#ffffff")}
          >
            {coupleNames}
          </h1>

          {/* Greeting / Salam */}
          <p
            className={`text-sm md:text-base mb-2 leading-relaxed px-4 ${quoteAlignClass}`}
            style={quoteTx("var(--font-dm-sans)", quoteColor || "rgba(255, 255, 255, 0.8)")}
          >
            {quote}
          </p>

          {/* Guest block (guest name + location) */}
          <div className={`mb-8 ${guestBlockAlignClass}`}>
            <h2 className="text-2xl font-semibold">
              {guestName || guestNamePlaceholder}
            </h2>
            <p
              className="text-sm text-white/70 mt-2"
              style={locationTx("var(--font-dm-sans)", guestLocationColor || "rgba(255, 255, 255, 0.7)")}
            >
              {guestLocationText}
            </p>
          </div>

          {/* Open Invitation Button */}
          <button
            onClick={handleOpenInvitation}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium transition-all duration-300 flex items-center gap-3 mx-auto group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Buka Undangan</span>
          </button>
            </>
          )}
        </div>

        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </section>

    </>
  );
}
