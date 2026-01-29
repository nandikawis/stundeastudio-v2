"use client";

import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface ReligiousGreetingProps extends CurveDividerProps, DecorativeFlowersProps {
  greeting?: string;
  message?: string;
  greetingColor?: string;
  messageColor?: string;
  greetingAlign?: "left" | "center" | "right" | "justify";
  messageAlign?: "left" | "center" | "right" | "justify";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
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
  showTopCurve = true,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = ""
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
  } else {
    sectionStyle.background = 'linear-gradient(to bottom, #ffffff, #f9fafb, #ffffff)';
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

  const greetingAlignClass = mapAlignToClass(greetingAlign);
  const messageAlignClass = mapAlignToClass(messageAlign);

  return (
    <section 
      className={`py-12 px-6 w-full relative ${className}`}
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
        className="relative z-10 max-w-2xl mx-auto text-center px-2"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {/* Greeting Heading */}
        <h2
          className={`text-2xl md:text-3xl font-bold mb-4 ${greetingAlignClass}`}
          style={{ fontFamily: "var(--font-playfair)", color: greetingColor || "#1f2937" }}
        >
          {greeting}
        </h2>

        {/* Message */}
        <p
          className={`text-sm md:text-base leading-relaxed ${messageAlignClass}`}
          style={{ fontFamily: "var(--font-dm-sans)", color: messageColor || "#374151" }}
        >
          {message}
        </p>
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}

