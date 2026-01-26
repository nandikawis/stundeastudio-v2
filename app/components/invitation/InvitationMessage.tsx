"use client";

import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface InvitationMessageProps extends CurveDividerProps, DecorativeFlowersProps {
  message?: string;
  messageColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  className?: string;
}

export default function InvitationMessage({
  message = "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.",
  messageColor,
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
}: InvitationMessageProps) {
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
    sectionStyle.backgroundColor = '#ffffff';
  }

  return (
    <section 
      className={`py-12 px-6 w-full relative ${className}`}
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
        <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: messageColor || "#374151" }}>
          {message}
        </p>
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}

