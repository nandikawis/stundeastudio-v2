"use client";

import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface ReligiousGreetingProps extends CurveDividerProps, DecorativeFlowersProps {
  greeting?: string;
  message?: string;
  imageUrl?: string;
  greetingColor?: string;
  messageColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  className?: string;
}

export default function ReligiousGreeting({
  greeting = "Om Swastyastu",
  message = "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.",
  imageUrl,
  greetingColor,
  messageColor,
  backgroundColor,
  backgroundImageUrl,
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
  // Build background style for section
  const sectionStyle: React.CSSProperties = {};
  
  if (backgroundImageUrl) {
    sectionStyle.backgroundImage = `url(${backgroundImageUrl})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  } else if (backgroundColor) {
    sectionStyle.backgroundColor = backgroundColor;
  } else {
    sectionStyle.background = 'linear-gradient(to bottom, #ffffff, #f9fafb, #ffffff)';
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
        className="relative z-10 max-w-2xl mx-auto text-center"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {/* Om Swastyastu Image */}
        {imageUrl && (
          <div className="mb-8">
            <div className="relative w-full max-w-md mx-auto aspect-[1140/581]">
              <Image
                src={imageUrl}
                alt={greeting}
                fill
                className="object-contain"
                sizes="(max-width: 1140px) 100vw, 1140px"
              />
            </div>
          </div>
        )}

        {/* Greeting Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: greetingColor || "#1f2937" }}>
          {greeting}
        </h2>

        {/* Message */}
        <p className="text-base md:text-lg leading-relaxed px-4" style={{ fontFamily: "var(--font-dm-sans)", color: messageColor || "#374151" }}>
          {message}
        </p>
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}

