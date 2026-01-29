"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface ClosingSectionProps extends CurveDividerProps, DecorativeFlowersProps {
  coupleNames?: string;
  message?: string;
  designerCredit?: string;
  socialLinks?: {
    whatsapp?: string;
    instagram?: string;
  };
  audioUrl?: string;
  logoUrl?: string;
  coupleNamesAlign?: "left" | "center" | "right" | "justify";
  messageAlign?: "left" | "center" | "right" | "justify";
  designerCreditAlign?: "left" | "center" | "right" | "justify";
  coupleNamesColor?: string;
  messageColor?: string;
  designerCreditColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
  className?: string;
}

export default function ClosingSection({
  coupleNames = "Bayu & Nia",
  message = "Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan putra-putri kami.",
  designerCredit = "Invitation by Putri Grafika",
  socialLinks = {},
  audioUrl,
  logoUrl,
  coupleNamesAlign = "center",
  messageAlign = "center",
  designerCreditAlign = "center",
  coupleNamesColor,
  messageColor,
  designerCreditColor,
  backgroundColor,
  backgroundImageUrl,
  backgroundImages,
  showTopCurve = true,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = ""
}: ClosingSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
    sectionStyle.background = 'linear-gradient(to bottom, #ffffff, #f9fafb, #111827)';
  }

  const mapAlignToClass = (align?: "left" | "center" | "right" | "justify") => {
    switch (align) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      case "center":
      default:
        return "text-center";
    }
  };

  return (
    <>
      <section 
        className={`py-16 px-6 w-full relative ${className}`}
        style={sectionStyle}
      >
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

        <div 
          className="relative z-10 max-w-2xl mx-auto text-center text-white"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          {/* Spacer */}
          <div className="h-36" />

          {/* Couple Names */}
          <h2
            className={`text-4xl md:text-5xl font-bold mb-8 ${mapAlignToClass(coupleNamesAlign)}`}
            style={{ fontFamily: "var(--font-playfair)", color: coupleNamesColor || "#ffffff" }}
          >
            {coupleNames}
          </h2>

          {/* Thank You Message */}
          <p
            className={`text-base md:text-lg leading-relaxed mb-12 ${mapAlignToClass(messageAlign)}`}
            style={{ fontFamily: "var(--font-dm-sans)", color: messageColor || "rgba(255, 255, 255, 0.9)" }}
          >
            {message}
          </p>

          {/* Logo Image */}
          {logoUrl && (
            <div className="mb-8 flex justify-center">
              <Image
                src={logoUrl}
                alt="Closing section logo"
                width={96}
                height={96}
                className="object-contain max-h-24 max-w-[120px]"
              />
            </div>
          )}

          {/* Designer Credit */}
          {designerCredit && (
            <div className="mb-8">
              <p
                className={`text-sm ${mapAlignToClass(designerCreditAlign)}`}
                style={{ fontFamily: "var(--font-dm-sans)", color: designerCreditColor || "rgba(255, 255, 255, 0.7)" }}
              >
                {designerCredit}
              </p>
            </div>
          )}

          {/* Social Icons */}
          {(socialLinks.whatsapp || socialLinks.instagram) && (
            <div className="flex items-center justify-center gap-4 mb-8">
              {socialLinks.whatsapp && (
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-all"
                  aria-label="WhatsApp"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center text-white transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </section>

      {/* Audio Player Button (Fixed Bottom Right) */}
      {audioUrl && (
        <>
          <audio ref={audioRef} loop>
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
          <button
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-transparent text-[#B49A5E] hover:bg-white/10 transition-all z-50 flex items-center justify-center"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </>
              )}
            </svg>
          </button>
        </>
      )}
    </>
  );
}

