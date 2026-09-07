"use client";

import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";

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

export type QuoteSectionDesign = "classic" | "editorial" | "framed" | "pullquote" | "verse" | "bar";

interface QuoteSectionProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"quote">,
  TextStyleFields<"secondaryQuote">,
  TextStyleFields<"author"> {
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
  design?: QuoteSectionDesign;
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
  design = "classic",
  showTopCurve,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = "",
  quoteFont,
  quoteSize,
  quoteEmphasis,
  secondaryQuoteFont,
  secondaryQuoteSize,
  secondaryQuoteEmphasis,
  authorFont,
  authorSize,
  authorEmphasis,
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
  } else if (design !== "classic") {
    sectionStyle.backgroundColor = "#f7f6f3";
  } else {
    // Default white background
    sectionStyle.backgroundColor = '#ffffff';
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

  const quoteAlignClass = mapAlignToClass(quoteAlign);
  const secondaryQuoteAlignClass = mapAlignToClass(secondaryQuoteAlign || quoteAlign);
  const authorAlignClass = mapAlignToClass(authorAlign);
  const quoteTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: quoteFont, size: quoteSize, emphasis: quoteEmphasis, fallbackFont, color });
  const secondaryTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: secondaryQuoteFont, size: secondaryQuoteSize, emphasis: secondaryQuoteEmphasis, fallbackFont, color });
  const authorTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: authorFont, size: authorSize, emphasis: authorEmphasis, fallbackFont, color });

  // Backwards compatible split: if explicit primary/secondary are not provided,
  // derive them from the legacy "quote" field using the existing double-newline separator.
  const [legacyPrimary, legacySecondary] = (quote || "").split("\n\n");
  const displayPrimaryQuote =
    (primaryQuote && primaryQuote.trim().length > 0) ? primaryQuote : legacyPrimary;
  const displaySecondaryQuote =
    (secondaryQuote && secondaryQuote.trim().length > 0)
      ? secondaryQuote
      : legacySecondary;

  const isClassic = design === "classic";
  const isEditorial = design === "editorial";
  const isFramed = design === "framed";
  const isPullquote = design === "pullquote";
  const isVerse = design === "verse";
  const isBar = design === "bar";
  const goldRule = <div className="mx-auto h-px w-10 bg-[#c4a574]" />;

  const authorLine = author ? (
    <p
      className={`text-[12px] italic ${authorAlignClass}`}
      style={authorTx("var(--font-dm-sans)", authorColor || "#8a8178")}
    >
      {author}
    </p>
  ) : null;

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
        className={`max-w-2xl mx-auto relative z-10 ${isBar ? "text-left" : "text-center"}`}
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {isClassic && quoteDecorativeStyle && QUOTE_DECORATIVE_IMAGES[quoteDecorativeStyle] && (
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

        {isEditorial ? (
          <div>
            {displayPrimaryQuote && (
              <p
                className={`text-[1.35rem] font-medium italic leading-[1.55] ${quoteAlignClass}`}
                style={quoteTx("var(--font-playfair)", quoteColor || "#1f1d1a")}
              >
                {displayPrimaryQuote}
              </p>
            )}
            <div className="my-6">{goldRule}</div>
            {displaySecondaryQuote && (
              <p
                className={`text-[14px] leading-relaxed ${secondaryQuoteAlignClass}`}
                style={secondaryTx("var(--font-dm-sans)", secondaryQuoteColor || "#6b6258")}
              >
                {displaySecondaryQuote}
              </p>
            )}
            {author && <div className="mt-7">{authorLine}</div>}
          </div>
        ) : isFramed ? (
          <div className="border border-[#c4a574]/45 px-7 py-10 sm:px-9">
            {displayPrimaryQuote && (
              <p
                className={`text-[1.15rem] font-medium italic leading-[1.6] ${quoteAlignClass}`}
                style={quoteTx("var(--font-playfair)", quoteColor || "#1f1d1a")}
              >
                {displayPrimaryQuote}
              </p>
            )}
            {displaySecondaryQuote && (
              <p
                className={`mt-5 text-[13px] leading-relaxed ${secondaryQuoteAlignClass}`}
                style={secondaryTx("var(--font-dm-sans)", secondaryQuoteColor || "#6b6258")}
              >
                {displaySecondaryQuote}
              </p>
            )}
            {author && <div className="mt-7">{authorLine}</div>}
          </div>
        ) : isPullquote ? (
          <div className="relative px-2 pt-6">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 text-[5.5rem] leading-none text-[#c4a574]/30"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              “
            </span>
            {displayPrimaryQuote && (
              <p
                className={`relative text-[1.25rem] font-medium italic leading-[1.55] ${quoteAlignClass}`}
                style={quoteTx("var(--font-playfair)", quoteColor || "#1f1d1a")}
              >
                {displayPrimaryQuote}
              </p>
            )}
            {displaySecondaryQuote && (
              <p
                className={`mt-5 text-[13px] leading-relaxed ${secondaryQuoteAlignClass}`}
                style={secondaryTx("var(--font-dm-sans)", secondaryQuoteColor || "#6b6258")}
              >
                {displaySecondaryQuote}
              </p>
            )}
            {author && <div className="mt-7">{authorLine}</div>}
          </div>
        ) : isVerse ? (
          <div className="flex flex-col items-center">
            <div className="mb-1 h-px w-16 bg-[#c4a574]" />
            <div className="mb-8 h-px w-9 bg-[#c4a574]" />
            {displayPrimaryQuote && (
              <p
                className={`text-[1.05rem] leading-relaxed tracking-[0.01em] ${quoteAlignClass}`}
                style={quoteTx("var(--font-playfair)", quoteColor || "#1f1d1a")}
              >
                {displayPrimaryQuote}
              </p>
            )}
            {displaySecondaryQuote && (
              <p
                className={`mt-5 max-w-md text-[13px] leading-relaxed ${secondaryQuoteAlignClass}`}
                style={secondaryTx("var(--font-dm-sans)", secondaryQuoteColor || "#6b6258")}
              >
                {displaySecondaryQuote}
              </p>
            )}
            {author && <div className="mt-7">{authorLine}</div>}
            <div className="mt-8 h-px w-9 bg-[#c4a574]" />
            <div className="mt-1 h-px w-16 bg-[#c4a574]" />
          </div>
        ) : isBar ? (
          <div className="border-l-2 border-[#c4a574] pl-6 text-left">
            {displayPrimaryQuote && (
              <p
                className="text-[1.2rem] font-medium italic leading-[1.55]"
                style={quoteTx("var(--font-playfair)", quoteColor || "#1f1d1a")}
              >
                {displayPrimaryQuote}
              </p>
            )}
            {displaySecondaryQuote && (
              <p
                className="mt-5 text-[13px] leading-relaxed"
                style={secondaryTx("var(--font-dm-sans)", secondaryQuoteColor || "#6b6258")}
              >
                {displaySecondaryQuote}
              </p>
            )}
            {author && (
              <p
                className="mt-6 text-[12px] italic"
                style={authorTx("var(--font-dm-sans)", authorColor || "#8a8178")}
              >
                {author}
              </p>
            )}
          </div>
        ) : (
          <>
        {/* Quote Text */}
        <div className="mb-6">
          {displayPrimaryQuote && (
            <p
              className={`text-base md:text-lg leading-relaxed whitespace-pre-line mb-4 ${quoteAlignClass}`}
              style={quoteTx("var(--font-dm-sans)", quoteColor || "#374151")}
            >
              <strong className="italic">{displayPrimaryQuote}</strong>
            </p>
          )}
          {displaySecondaryQuote && (
            <p
              className={`text-sm md:text-base leading-relaxed whitespace-pre-line ${secondaryQuoteAlignClass}`}
              style={secondaryTx("var(--font-dm-sans)", secondaryQuoteColor || quoteColor || "#4b5563")}
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
            style={authorTx("var(--font-dm-sans)", authorColor || "#6b7280")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {author}
          </p>
        )}
          </>
        )}
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}

