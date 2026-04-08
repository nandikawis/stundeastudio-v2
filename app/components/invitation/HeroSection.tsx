"use client";

import { useState, useEffect, useMemo } from "react";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

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

interface HeroSectionProps extends DecorativeFlowersProps {
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
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = "",
  previewMode = false
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
  if (!slideshowUrls.length) {
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
        return "text-left";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      default:
        return "text-center";
    }
  };

  const subtitleAlignClass = mapAlignToClass(subtitleAlign);
  const coupleNamesAlignClass = mapAlignToClass(coupleNamesAlign);
  const quoteAlignClass = mapAlignToClass(quoteAlign);

  const sectionHeightClass = previewMode
    ? "h-full min-h-0 w-full"
    : "min-h-screen";

  const curveSvgClass = previewMode ? "h-8 sm:h-10" : "h-16";

  return (
    <section 
      className={`relative ${sectionHeightClass} w-full flex items-end justify-center overflow-hidden ${className}`}
      style={Object.keys(sectionStyle).length > 0 ? sectionStyle : undefined}
    >
      {/* Background Slideshow with Ken Burns Effect */}
      {slideshowUrls.length > 0 && (
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
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>
          ))}
        </div>
      )}

      {/* SVG Curve Divider at Top */}
      {showTopCurve && (
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full ${curveSvgClass}`} style={{ fill: topCurveColor || '#ffffff', transform: 'rotate(180deg)' }}>
            <path d={curvePaths[topCurveStyle]} />
          </svg>
        </div>
      )}

      {/* Decorative Flowers */}
      {renderDecorativeFlowers({ decorativeFlowers: effectiveFlowers, flowerStyle, showTopCurve, showBottomCurve })}

      {/* Content */}
      <div 
        className={`relative z-10 w-full text-center text-white ${
          previewMode ? "px-4 pt-8 pb-16 sm:pb-20" : "px-6 pt-16 pb-32"
        }`}
        style={getFlowerMargin({ decorativeFlowers: effectiveFlowers, showTopCurve, showBottomCurve })}
      >
        <p
          className={`${previewMode ? "text-xs sm:text-sm mb-2" : "text-lg mb-4"} ${subtitleAlignClass}`}
          style={{ fontFamily: "var(--font-dm-sans)", color: subtitleColor || "rgba(255, 255, 255, 0.9)" }}
        >
          {subtitle}
        </p>
        <h2
          className={`${
            previewMode ? "text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3" : "text-4xl md:text-5xl mb-6"
          } font-bold ${coupleNamesAlignClass}`}
          style={{ fontFamily: "var(--font-playfair)", color: coupleNamesColor || "#ffffff" }}
        >
          {coupleNames}
        </h2>
        <p
          className={`${
            previewMode
              ? "text-[10px] sm:text-xs italic max-w-full mx-auto leading-snug line-clamp-3"
              : "text-base md:text-lg italic max-w-2xl mx-auto leading-relaxed"
          } ${quoteAlignClass}`}
          style={{ fontFamily: "var(--font-dm-sans)", color: quoteColor || "rgba(255, 255, 255, 0.9)" }}
        >
          "{quote}"
        </p>
      </div>

      {/* SVG Curve Divider at Bottom */}
      {showBottomCurve && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className={`w-full ${curveSvgClass}`} style={{ fill: curveColor || '#ffffff' }}>
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

