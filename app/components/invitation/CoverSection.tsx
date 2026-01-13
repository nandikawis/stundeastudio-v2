"use client";

import { useState } from "react";
import Image from "next/image";

interface CoverSectionProps {
  date?: string;
  coupleNames?: string;
  quote?: string;
  guestName?: string;
  dateColor?: string;
  coupleNamesColor?: string;
  quoteColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function CoverSection({
  date = "09 .01 .2026",
  coupleNames = "Bayu & Nia",
  quote = "Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.",
  guestName,
  dateColor,
  coupleNamesColor,
  quoteColor,
  backgroundColor,
  className = ""
}: CoverSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section 
      className={`min-h-screen w-full flex flex-col items-center justify-center ${!backgroundColor ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : ''} text-white relative overflow-hidden ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 text-center px-6 py-12 max-w-md mx-auto">
        {/* Date */}
        <p className="text-lg md:text-xl mb-6 tracking-wider" style={{ fontFamily: "var(--font-playfair)", color: dateColor || "rgba(255, 255, 255, 0.9)" }}>
          {date}
        </p>

        {/* Couple Names */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)", color: coupleNamesColor || "#ffffff" }}>
          {coupleNames}
        </h1>

        {/* Quote */}
        <p className="text-base md:text-lg italic mb-12 leading-relaxed px-4" style={{ fontFamily: "var(--font-dm-sans)", color: quoteColor || "rgba(255, 255, 255, 0.8)" }}>
          "{quote}"
        </p>

        {/* Guest Name (if provided) */}
        {guestName && (
          <div className="mb-8">
            <p className="text-sm text-white/70 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <h2 className="text-2xl font-semibold">{guestName}</h2>
            <p className="text-sm text-white/70 mt-2">di Tempat</p>
          </div>
        )}

        {/* Open Invitation Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium transition-all duration-300 flex items-center gap-3 mx-auto group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Buka Undangan</span>
        </button>
      </div>

      {/* Hidden content that appears after button click */}
      {isOpen && (
        <div className="absolute inset-0 bg-black/95 z-20 flex items-center justify-center animate-fade-in">
          <div className="text-center px-6">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              The Wedding of
            </h2>
            <h3 className="text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              {coupleNames}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-8 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

