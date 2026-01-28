"use client";

import { useState, useEffect } from "react";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface HeroSectionProps extends DecorativeFlowersProps {
  subtitle?: string;
  coupleNames?: string;
  quote?: string;
  /** Slideshow images only; no single-image background. */
  backgroundImages?: string[];
  subtitleColor?: string;
  coupleNamesColor?: string;
  quoteColor?: string;
  backgroundColor?: string;
  curveColor?: string;
  topCurveColor?: string;
  showTopCurve?: boolean;
  showBottomCurve?: boolean;
  topCurveStyle?: 'gentle' | 'wave' | 'smooth';
  bottomCurveStyle?: 'gentle' | 'wave' | 'smooth';
  className?: string;
}

export default function HeroSection({
  subtitle = "The Wedding of",
  coupleNames = "Bayu & Nia",
  quote = "Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.",
  backgroundImages = [],
  subtitleColor,
  coupleNamesColor,
  quoteColor,
  backgroundColor,
  curveColor,
  topCurveColor,
  showTopCurve = true,
  showBottomCurve = true,
  topCurveStyle = 'gentle',
  bottomCurveStyle = 'gentle',
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = ""
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Curve SVG paths for different styles
  const curvePaths = {
    gentle: "M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z", // Original gentle curve
    wave: "M0,0c100,0,200,60,300,60c100,0,200-60,300-60c100,0,200,60,300,60c100,0,100-60,100-60v100H0V0z", // Wavy pattern
    smooth: "M0,0c200,0,300,40,500,40c200,0,300-40,500-40v100H0V0z" // Smooth rounded curve
  };

  // Auto-rotate background images
  useEffect(() => {
    if (backgroundImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // When no slideshow images, use backgroundColor or default gradient (no single-image background)
  const sectionStyle: React.CSSProperties = {};
  if (!backgroundImages?.length) {
    if (backgroundColor) {
      sectionStyle.backgroundColor = backgroundColor;
    } else {
      sectionStyle.background = 'linear-gradient(to bottom, #111827, #1f2937, #111827)';
    }
  }

  return (
    <section 
      className={`relative min-h-screen w-full flex items-end justify-center overflow-hidden ${className}`}
      style={Object.keys(sectionStyle).length > 0 ? sectionStyle : undefined}
    >
      {/* Background Slideshow with Ken Burns Effect */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "120%",
                  backgroundPosition: "center"
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-16" style={{ fill: topCurveColor || '#ffffff', transform: 'rotate(180deg)' }}>
            <path d={curvePaths[topCurveStyle]} />
          </svg>
        </div>
      )}

      {/* Decorative Flowers */}
      {renderDecorativeFlowers({ decorativeFlowers, flowerStyle, showTopCurve, showBottomCurve })}

      {/* Content */}
      <div 
        className="relative z-10 w-full px-6 py-16 text-center text-white"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        <p className="text-lg mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: subtitleColor || "rgba(255, 255, 255, 0.9)" }}>
          {subtitle}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: coupleNamesColor || "#ffffff" }}>
          {coupleNames}
        </h2>
        <p className="text-base md:text-lg italic max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: quoteColor || "rgba(255, 255, 255, 0.9)" }}>
          "{quote}"
        </p>
      </div>

      {/* SVG Curve Divider at Bottom */}
      {showBottomCurve && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-16" style={{ fill: curveColor || '#ffffff' }}>
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

