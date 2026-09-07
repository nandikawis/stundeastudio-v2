"use client";

import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";

export type ReligiousGreetingDesign = "classic" | "editorial" | "framed" | "rule" | "banner" | "split";

interface ReligiousGreetingProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"greeting">,
  TextStyleFields<"message"> {
  greeting?: string;
  message?: string;
  greetingColor?: string;
  messageColor?: string;
  greetingAlign?: "left" | "center" | "right" | "justify";
  messageAlign?: "left" | "center" | "right" | "justify";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
  design?: ReligiousGreetingDesign;
  className?: string;
}

export default function ReligiousGreeting({
  greeting = "Om Swastyastu",
  message = "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.",
  greetingColor,
  messageColor,
  greetingAlign = "center",
  messageAlign = "center",
  backgroundColor,
  backgroundImageUrl,
  backgroundImages,
  design = "classic",
  showTopCurve = true,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = "",
  greetingFont,
  greetingSize,
  greetingEmphasis,
  messageFont,
  messageSize,
  messageEmphasis,
}: ReligiousGreetingProps) {
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
  } else if (design !== "classic") {
    sectionStyle.backgroundColor = "#f7f6f3";
  } else {
    sectionStyle.background = 'linear-gradient(to bottom, #ffffff, #f9fafb, #ffffff)';
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

  const greetingAlignClass = mapAlignToClass(greetingAlign);
  const messageAlignClass = mapAlignToClass(messageAlign);
  const greetingTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: greetingFont, size: greetingSize, emphasis: greetingEmphasis, fallbackFont, color });
  const messageTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: messageFont, size: messageSize, emphasis: messageEmphasis, fallbackFont, color });
  const isEditorial = design === "editorial";
  const isFramed = design === "framed";
  const isRule = design === "rule";
  const isBanner = design === "banner";
  const isSplit = design === "split";

  return (
    <section 
      className={`${isBanner ? "w-full relative py-0" : "py-12 px-6 w-full relative"} ${className}`}
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

      {isBanner ? (
        <div className="relative z-10" style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}>
          <div className="bg-[#1f1d1a] px-8 py-12 text-center">
            <h2
              className={`text-[2rem] font-medium italic leading-tight ${greetingAlignClass}`}
              style={greetingTx("var(--font-playfair)", greetingColor || "#f7f6f3")}
            >
              {greeting}
            </h2>
          </div>
          <div className="px-6 py-10">
            <p
              className={`mx-auto max-w-md text-[14px] leading-relaxed ${messageAlignClass}`}
              style={messageTx("var(--font-dm-sans)", messageColor || "#4b5563")}
            >
              {message}
            </p>
          </div>
        </div>
      ) : (
      <div 
        className={`relative z-10 mx-auto max-w-2xl px-2 ${isEditorial || isSplit ? "" : "text-center"}`}
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {isEditorial ? (
          <div className={`${greetingAlign === "right" ? "ml-auto" : greetingAlign === "left" ? "mr-auto" : "mx-auto"} max-w-[300px] ${greetingAlignClass}`}>
            <h2
              className="text-[2rem] font-medium leading-[1.15] tracking-[-0.02em]"
              style={greetingTx("var(--font-playfair)", greetingColor || "#1f1d1a")}
            >
              {greeting}
            </h2>
            <p
              className={`mt-5 text-[13px] leading-relaxed ${messageAlignClass}`}
              style={messageTx("var(--font-dm-sans)", messageColor || "#6b6258")}
            >
              {message}
            </p>
          </div>
        ) : isFramed ? (
          <div className="rounded-[22px] border border-black/[0.04] bg-white px-7 py-10 shadow-[0_16px_40px_rgba(40,32,24,0.08)]">
            <h2
              className={`text-[1.85rem] font-medium italic leading-tight ${greetingAlignClass}`}
              style={greetingTx("var(--font-playfair)", greetingColor || "#1f1d1a")}
            >
              {greeting}
            </h2>
            <p
              className={`mt-5 text-[14px] leading-relaxed ${messageAlignClass}`}
              style={messageTx("var(--font-dm-sans)", messageColor || "#6b6258")}
            >
              {message}
            </p>
          </div>
        ) : isRule ? (
          <div>
            <p
              className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em]"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#c4a574" }}
            >
              Salam
            </p>
            <h2
              className={`text-[2rem] font-medium leading-tight ${greetingAlignClass}`}
              style={greetingTx("var(--font-playfair)", greetingColor || "#1f1d1a")}
            >
              {greeting}
            </h2>
            <div className="mx-auto my-5 h-px w-10 bg-[#c4a574]" />
            <p
              className={`text-[14px] leading-relaxed ${messageAlignClass}`}
              style={messageTx("var(--font-dm-sans)", messageColor || "#6b6258")}
            >
              {message}
            </p>
          </div>
        ) : isSplit ? (
          <div className="text-left">
            <h2
              className="max-w-[12ch] text-[2.45rem] font-medium italic leading-[1.08] tracking-[-0.03em]"
              style={greetingTx("var(--font-playfair)", greetingColor || "#1f1d1a")}
            >
              {greeting}
            </h2>
            <p
              className="mt-6 max-w-[34ch] border-l-2 border-[#c4a574] pl-5 text-[13px] leading-relaxed"
              style={messageTx("var(--font-dm-sans)", messageColor || "#6b6258")}
            >
              {message}
            </p>
          </div>
        ) : (
          <>
        <h2
          className={`text-2xl md:text-3xl font-bold mb-4 ${greetingAlignClass}`}
          style={greetingTx("var(--font-playfair)", greetingColor || "#1f2937")}
        >
          {greeting}
        </h2>
        <p
          className={`text-sm md:text-base leading-relaxed ${messageAlignClass}`}
          style={messageTx("var(--font-dm-sans)", messageColor || "#374151")}
        >
          {message}
        </p>
          </>
        )}
      </div>
      )}
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}

