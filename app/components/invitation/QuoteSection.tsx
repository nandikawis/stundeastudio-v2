"use client";

import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

// Available decorative image styles for the quote section.
// These map to PNG files stored in /public/quotedecorative.
const QUOTE_DECORATIVE_IMAGES: Record<string, { src: string; alt: string }> = {
  "baby-bread": {
    src: "/quotedecorative/baby bread.png",
    alt: "Baby bread decorative illustration",
  },
  "grey-and-white": {
    src: "/quotedecorative/grey and white.png",
    alt: "Grey and white decorative illustration",
  },
  "pink-and-yellow": {
    src: "/quotedecorative/pink and yellow.png",
    alt: "Pink and yellow decorative illustration",
  },
  "pink-bouquet": {
    src: "/quotedecorative/pink bouquet.png",
    alt: "Pink bouquet decorative illustration",
  },
  "pink-love": {
    src: "/quotedecorative/pink love.png",
    alt: "Pink love decorative illustration",
  },
  "white-teraccota": {
    src: "/quotedecorative/white teraccota.png",
    alt: "White terracotta decorative illustration",
  },
  white: {
    src: "/quotedecorative/white.png",
    alt: "White floral decorative illustration",
  },
};

type QuoteDecorativeStyle = keyof typeof QUOTE_DECORATIVE_IMAGES;

interface QuoteSectionProps extends CurveDividerProps, DecorativeFlowersProps {
  /** Legacy combined quote; kept for backward compatibility. */
  quote?: string;
  /** Primary (Sanskrit) part of the quote. */
  primaryQuote?: string;
  /** Secondary (Indonesian) translation part of the quote. */
  secondaryQuote?: string;
  author?: string;
  // Use a named decorative style backed by /public/quotedecorative PNGs.
  // We intentionally do NOT support arbitrary image URLs here anymore.
  quoteDecorativeStyle?: QuoteDecorativeStyle;
  quoteColor?: string;
  secondaryQuoteColor?: string;
  authorColor?: string;
  /** Text alignment controls */
  quoteAlign?: "left" | "center" | "right" | "justify";
  secondaryQuoteAlign?: "left" | "center" | "right" | "justify";
  authorAlign?: "left" | "center" | "right" | "justify";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
  className?: string;
}

export default function QuoteSection({
  quote = "Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.",
  primaryQuote,
  secondaryQuote,
  author = "Rg Veda X.85.42.",
  quoteDecorativeStyle,
  quoteColor,
  secondaryQuoteColor,
  authorColor,
  quoteAlign = "center",
  secondaryQuoteAlign,
  authorAlign = "center",
  backgroundColor,
  backgroundImageUrl,
  backgroundImages,
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
    // If only color is set, use it as solid background
    sectionStyle.backgroundColor = backgroundColor;
  } else {
    // Default white background
    sectionStyle.backgroundColor = '#ffffff';
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

  const quoteAlignClass = mapAlignToClass(quoteAlign);
  const secondaryQuoteAlignClass = mapAlignToClass(secondaryQuoteAlign || quoteAlign);
  const authorAlignClass = mapAlignToClass(authorAlign);

  // Backwards compatible split: if explicit primary/secondary are not provided,
  // derive them from the legacy "quote" field using the existing double-newline separator.
  const [legacyPrimary, legacySecondary] = (quote || "").split("\n\n");
  const displayPrimaryQuote =
    (primaryQuote && primaryQuote.trim().length > 0) ? primaryQuote : legacyPrimary;
  const displaySecondaryQuote =
    (secondaryQuote && secondaryQuote.trim().length > 0)
      ? secondaryQuote
      : legacySecondary;

  return (
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
        className="max-w-2xl mx-auto text-center relative z-10"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {/* Decorative Image from /public/quotedecorative (optional) */}
        {quoteDecorativeStyle && QUOTE_DECORATIVE_IMAGES[quoteDecorativeStyle] && (
          <div className="mb-4 flex justify-center">
            <Image
              src={QUOTE_DECORATIVE_IMAGES[quoteDecorativeStyle].src}
              alt={QUOTE_DECORATIVE_IMAGES[quoteDecorativeStyle].alt}
              width={120}
              height={160}
              className="object-contain"
            />
          </div>
        )}

        {/* Quote Text */}
        <div className="mb-6">
          {displayPrimaryQuote && (
            <p
              className={`text-base md:text-lg leading-relaxed whitespace-pre-line mb-4 ${quoteAlignClass}`}
              style={{ fontFamily: "var(--font-dm-sans)", color: quoteColor || "#374151" }}
            >
              <strong className="italic">{displayPrimaryQuote}</strong>
            </p>
          )}
          {displaySecondaryQuote && (
            <p
              className={`text-sm md:text-base leading-relaxed whitespace-pre-line ${secondaryQuoteAlignClass}`}
              style={{ fontFamily: "var(--font-dm-sans)", color: secondaryQuoteColor || quoteColor || "#4b5563" }}
            >
              {displaySecondaryQuote}
            </p>
          )}
        </div>

        {/* Author */}
        {author && (
          <p
            className={`text-sm italic flex items-center gap-2 ${authorAlignClass} ${
              authorAlign === 'center'
                ? 'justify-center'
                : authorAlign === 'right'
                ? 'justify-end'
                : 'justify-start'
            }`}
            style={{ fontFamily: "var(--font-dm-sans)", color: authorColor || "#6b7280" }}
          >
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

