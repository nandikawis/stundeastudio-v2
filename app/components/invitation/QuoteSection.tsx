"use client";

import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface QuoteSectionProps extends CurveDividerProps, DecorativeFlowersProps {
  quote?: string;
  author?: string;
  imageUrl?: string;
  quoteColor?: string;
  authorColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  className?: string;
}

export default function QuoteSection({
  quote = "Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.",
  author = "Rg Veda X.85.42.",
  imageUrl,
  quoteColor,
  authorColor,
  backgroundColor,
  backgroundImageUrl,
  showTopCurve,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = ""
}: QuoteSectionProps) {
  // Build background style for section
  const sectionStyle: React.CSSProperties = {};
  
  if (backgroundImageUrl) {
    sectionStyle.backgroundImage = `url(${backgroundImageUrl})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  } else if (backgroundColor) {
    // If only color is set, use it as solid background
    sectionStyle.backgroundColor = backgroundColor;
  } else {
    // Default white background
    sectionStyle.backgroundColor = '#ffffff';
  }

  return (
    <section 
      className={`py-16 px-6 w-full relative ${className}`}
      style={sectionStyle}
    >
      {/* Color overlay if both image and color are set */}
      {backgroundImageUrl && backgroundColor && (
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
        className="max-w-2xl mx-auto text-center relative z-10"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
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
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}

