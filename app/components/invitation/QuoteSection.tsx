"use client";

import Image from "next/image";

interface QuoteSectionProps {
  quote?: string;
  author?: string;
  imageUrl?: string;
  quoteColor?: string;
  authorColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function QuoteSection({
  quote = "Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.",
  author = "Rg Veda X.85.42.",
  imageUrl,
  quoteColor,
  authorColor,
  backgroundColor,
  className = ""
}: QuoteSectionProps) {
  return (
    <section 
      className={`py-16 px-6 w-full ${!backgroundColor ? 'bg-white' : ''} ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative Image */}
        {imageUrl && (
          <div className="mb-8">
            <div className="relative w-full max-w-xs mx-auto aspect-[505/1024]">
              <Image
                src={imageUrl}
                alt="Decorative theme"
                fill
                className="object-contain"
                sizes="(max-width: 505px) 100vw, 505px"
              />
            </div>
          </div>
        )}

        {/* Quote Text */}
        <div className="mb-6">
          <p className="text-base md:text-lg leading-relaxed whitespace-pre-line mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: quoteColor || "#374151" }}>
            <strong className="italic">{quote.split('\n\n')[0]}</strong>
          </p>
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-dm-sans)", color: quoteColor || "#4b5563" }}>
            {quote.split('\n\n')[1]}
          </p>
        </div>

        {/* Author */}
        {author && (
          <p className="text-sm italic flex items-center justify-center gap-2" style={{ fontFamily: "var(--font-dm-sans)", color: authorColor || "#6b7280" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {author}
          </p>
        )}
      </div>
    </section>
  );
}

