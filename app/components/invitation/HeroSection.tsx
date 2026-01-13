"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroSectionProps {
  subtitle?: string;
  coupleNames?: string;
  quote?: string;
  backgroundImages?: string[];
  subtitleColor?: string;
  coupleNamesColor?: string;
  quoteColor?: string;
  backgroundColor?: string;
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
  className = ""
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate background images
  useEffect(() => {
    if (backgroundImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section 
      className={`relative min-h-screen w-full flex items-end justify-center overflow-hidden ${className}`}
      style={backgroundColor && !backgroundImages?.length ? { backgroundColor } : undefined}
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

      {/* Content */}
      <div className="relative z-10 w-full px-6 py-16 text-center text-white">
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
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-16 fill-white">
          <path d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z" />
        </svg>
      </div>

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

