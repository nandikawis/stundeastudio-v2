"use client";

import { useState } from "react";
import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { ImageContainerStyle } from "./CoupleProfile";

export type CoverSectionDesign = 'simple' | 'with-container';

interface CoverSectionProps extends CurveDividerProps, DecorativeFlowersProps {
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
  onChangeDesign
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

  // Build background style for section
  const sectionStyle: React.CSSProperties = {};
  
  if (bgUrl) {
    sectionStyle.backgroundImage = `url(${bgUrl})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  } else if (backgroundColor) {
    sectionStyle.backgroundColor = backgroundColor;
  } else {
    // Default gradient
    sectionStyle.background = 'linear-gradient(to bottom, #111827, #1f2937, #111827)';
  }

  const mapAlignToClass = (align?: "left" | "center" | "right" | "justify") => {
    switch (align) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      default:
        return "text-center";
    }
  };

  const dateAlignClass = mapAlignToClass(dateAlign);
  const coupleNamesAlignClass = mapAlignToClass(coupleNamesAlign);
  const quoteAlignClass = mapAlignToClass(quoteAlign);
  const guestBlockAlignClass = mapAlignToClass(guestBlockAlign);

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
    ? "relative min-h-screen w-full max-w-[375px] mx-auto z-0" // Normal flow, mobile width in editor, low z-index so buttons appear above
    : "sticky top-0 w-full z-50"; // Sticky overlay inside the mobile screen container in preview/published

  return (
    <>
      <section 
        className={`${positionClasses} flex flex-col items-center justify-center text-white overflow-hidden ${className} ${
          !isEditor && isAnimating ? 'animate-fade-up-out' : ''
        } ${isEditor ? 'border-2 border-dashed border-accent/50 rounded-lg mb-4' : ''}`}
        style={{
          ...sectionStyle,
          ...(!isEditor
            ? {
                // In standalone wedding-invitation pages, use full viewport height
                ...(isStandaloneInvitation
                  ? {
                      height: '100vh',
                      maxHeight: '100vh',
                    }
                  : {
                      // In editor preview/mobile frame, match the internal screen height
                      height: 'calc(100vh - 4rem - 2.5rem)',
                      maxHeight: '800px',
                    }),
                willChange: isAnimating ? 'transform, opacity' : 'auto',
              }
            : {}),
        }}
        {...(isEditor ? { 'data-section-type': 'cover' } : {})}
      >
        {/* Editor mode label and buttons */}
        {isEditor && (
          <>
            <div className="absolute top-2 left-2 z-20 bg-accent text-white px-2 py-1 rounded text-xs font-medium pointer-events-none">
              Cover Section
            </div>
            {/* Edit buttons - always visible in editor mode */}
            <div className="absolute top-2 right-2 z-20 flex gap-2 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditContent?.();
                }}
                className="px-3 py-1 bg-accent text-white rounded-full text-xs font-medium hover:bg-accent-dark transition-all"
              >
                Edit Content
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeDesign?.();
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-full text-xs font-medium hover:bg-gray-700 transition-all"
              >
                Change Design
              </button>
            </div>
          </>
        )}
        
        {/* Color overlay if both image and color are set */}
        {bgUrl && backgroundColor && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor, opacity: 0.5 }}
          />
        )}
        {/* Top Curve Divider */}
        {renderTopCurve({ showTopCurve, topCurveColor, topCurveStyle })}
        {/* Decorative Flowers */}
        {renderDecorativeFlowers({ decorativeFlowers, flowerStyle, showTopCurve, showBottomCurve })}
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
        </div>

        <div 
          className="relative z-10 text-center px-6 py-12 max-w-md mx-auto w-full"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
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
            style={{ fontFamily: "var(--font-playfair)", color: dateColor || "rgba(255, 255, 255, 0.9)" }}
          >
            {date}
          </p>

          {/* Couple Names */}
          <h1
            className={`text-4xl md:text-5xl font-bold mb-8 ${coupleNamesAlignClass}`}
            style={{ fontFamily: "var(--font-playfair)", color: coupleNamesColor || "#ffffff" }}
          >
            {coupleNames}
          </h1>

          {/* Greeting / Salam */}
          <p
            className={`text-sm md:text-base mb-2 leading-relaxed px-4 ${quoteAlignClass}`}
            style={{ fontFamily: "var(--font-dm-sans)", color: quoteColor || "rgba(255, 255, 255, 0.8)" }}
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
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: guestLocationColor || "rgba(255, 255, 255, 0.7)",
              }}
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
        </div>

        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </section>

    </>
  );
}
