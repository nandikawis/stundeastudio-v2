"use client";

import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

export type ImageContainerStyle = 
  // Circular styles (3)
  'circular' | 'circular-gradient' | 'circular-glow' |
  // Rounded styles (3)
  'rounded-elegant' | 'rounded-modern' | 'rounded-glow' |
  // Oval styles (3)
  'oval-vintage' | 'oval-classic' | 'oval-glow' |
  // Hexagon styles (3)
  'hexagon-glow' | 'hexagon-classic' | 'hexagon-modern' |
  // Square styles (3)
  'square-frame' | 'square-elegant' | 'square-glow';

export type CoupleProfileDesign = 'simple' | 'with-container';

interface CoupleProfileProps extends CurveDividerProps, DecorativeFlowersProps {
  name?: string;
  fullName?: string;
  relation?: string;
  parents?: {
    father?: string;
    mother?: string;
  };
  address?: string;
  imageUrl?: string;
  design?: CoupleProfileDesign;
  imageStyle?: ImageContainerStyle;
  glowColor?: string;
  type?: "groom" | "bride";
  nameAlign?: "left" | "center" | "right" | "justify";
  fullNameAlign?: "left" | "center" | "right" | "justify";
  relationAlign?: "left" | "center" | "right" | "justify";
  fatherNameAlign?: "left" | "center" | "right" | "justify";
  motherNameAlign?: "left" | "center" | "right" | "justify";
  addressAlign?: "left" | "center" | "right" | "justify";
  nameColor?: string;
  fullNameColor?: string;
  relationColor?: string;
  fatherNameColor?: string;
  motherNameColor?: string;
  addressColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  decorativeFlowers?: boolean;
  flowerStyle?: 'red' | 'beage' | 'pink' | 'white';
  className?: string;
}

export default function CoupleProfile({
  name = "John",
  fullName = "John Doe",
  relation = "Anak pertama dari pasangan",
  parents = {
    father: "Father Name",
    mother: "Mother Name"
  },
  address = "Address here",
  imageUrl,
  design = "with-container",
  imageStyle = "circular",
  glowColor = "#b49549",
  type = "groom",
  nameAlign = "center",
  fullNameAlign = "center",
  relationAlign = "center",
  fatherNameAlign = "center",
  motherNameAlign = "center",
  addressAlign = "center",
  nameColor,
  fullNameColor,
  relationColor,
  fatherNameColor,
  motherNameColor,
  addressColor,
  backgroundColor,
  backgroundImageUrl,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  showTopCurve,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  className = ""
}: CoupleProfileProps) {
  const isGroom = type === "groom";

  const mapAlignToClass = (align?: "left" | "center" | "right" | "justify") => {
    switch (align) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      case "center":
      default:
        return "text-center";
    }
  };

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
        className="max-w-md mx-auto text-center relative z-10"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {/* Image Container - only show when design is 'with-container' */}
        {design === 'simple' && (
          <div className="mb-62"></div>
        )}
        {design === 'with-container' && (
          // With-container design - apply all container styles
          (() => {
          const containerStyle: React.CSSProperties = {
          width: 250,
          height: 250,
            margin: "0 auto 24px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          };

          const imageWrapperStyle: React.CSSProperties = {
            width: "100%",
            height: "100%",
          overflow: "hidden",
          position: "relative",
            backgroundColor: !imageUrl ? "#e5e7eb" : undefined
          };

          // Helper function to convert hex to rgba
          const hexToRgba = (hex: string, alpha: number): string => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };

          // Helper function to get darker shade for secondary glow
          const getDarkerGlow = (hex: string, alpha: number): string => {
            const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 30);
            const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 30);
            const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 30);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };

          // Apply style-specific properties with beautiful default borders
          switch (imageStyle) {
            case 'circular':
              imageWrapperStyle.borderRadius = "50%";
              imageWrapperStyle.boxShadow = "0px 4px 20px 0px rgba(0, 0, 0, 0.15)";
              imageWrapperStyle.border = "4px solid rgba(180, 149, 73, 0.4)";
              break;
            case 'circular-gradient':
              imageWrapperStyle.borderRadius = "50%";
              imageWrapperStyle.boxShadow = "0px 4px 20px 0px rgba(0, 0, 0, 0.15)";
              containerStyle.padding = "4px";
              containerStyle.background = "linear-gradient(135deg, #d4af37 0%, #b8945f 25%, #8b7355 50%, #6b5d4f 75%, #4a4a4a 100%)";
              containerStyle.borderRadius = "50%";
              break;
            case 'rounded-elegant':
              imageWrapperStyle.borderRadius = "20px";
              imageWrapperStyle.boxShadow = "0px 8px 30px rgba(0, 0, 0, 0.12), 0px 0px 0px 3px rgba(255, 255, 255, 0.9), inset 0px 0px 0px 2px rgba(180, 149, 73, 0.5)";
              break;
            case 'square-frame':
              imageWrapperStyle.borderRadius = "0";
              imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.1)";
              containerStyle.padding = "8px";
              containerStyle.background = "linear-gradient(135deg, #f5f5f0 0%, #e8e8e3 100%)";
              containerStyle.borderRadius = "4px";
              containerStyle.boxShadow = "inset 0px 0px 0px 2px rgba(139, 115, 85, 0.3)";
              break;
            case 'square-elegant':
              imageWrapperStyle.borderRadius = "0";
              imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.1)";
              containerStyle.padding = "6px";
              containerStyle.background = "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #0f0f0f 100%)";
              containerStyle.borderRadius = "4px";
              containerStyle.boxShadow = "inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1), 0px 6px 25px rgba(0, 0, 0, 0.3)";
              break;
            case 'square-glow':
              imageWrapperStyle.borderRadius = "0";
              imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
              containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
              break;
            case 'hexagon-glow':
              imageWrapperStyle.borderRadius = "0";
              imageWrapperStyle.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)";
              imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.4)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.2)}`;
              containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.3)})`;
              break;
            case 'hexagon-classic':
              imageWrapperStyle.borderRadius = "0";
              imageWrapperStyle.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)";
              imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
              containerStyle.padding = "6px";
              containerStyle.background = "linear-gradient(135deg, #8b7355 0%, #6b5d4f 100%)";
              containerStyle.filter = "drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2))";
              break;
            case 'hexagon-modern':
              imageWrapperStyle.borderRadius = "0";
              imageWrapperStyle.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)";
              imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
              containerStyle.padding = "8px";
              containerStyle.background = "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #0f0f0f 100%)";
              containerStyle.filter = "drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.4))";
              break;
            case 'circular-glow':
              imageWrapperStyle.borderRadius = "50%";
              imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
              containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
              break;
            case 'rounded-modern':
              imageWrapperStyle.borderRadius = "24px";
              imageWrapperStyle.boxShadow = "0px 8px 32px rgba(0, 0, 0, 0.12), inset 0px 0px 0px 2px rgba(255, 255, 255, 0.8)";
              containerStyle.padding = "3px";
              containerStyle.background = "linear-gradient(135deg, #d4af37 0%, #b8945f 50%, #8b7355 100%)";
              containerStyle.borderRadius = "27px";
              break;
            case 'oval-vintage':
              imageWrapperStyle.borderRadius = "50%";
              imageWrapperStyle.width = "220px";
              imageWrapperStyle.height = "280px";
              imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
              containerStyle.width = "250px";
              containerStyle.height = "310px";
              containerStyle.padding = "12px";
              containerStyle.background = "#f5e6d3";
              containerStyle.borderRadius = "50%";
              containerStyle.boxShadow = "inset 0px 0px 0px 2px #8b6f47, 0px 4px 20px rgba(0, 0, 0, 0.1)";
              break;
            case 'oval-classic':
              imageWrapperStyle.borderRadius = "50%";
              imageWrapperStyle.width = "220px";
              imageWrapperStyle.height = "280px";
              imageWrapperStyle.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.15)";
              containerStyle.width = "250px";
              containerStyle.height = "310px";
              containerStyle.padding = "10px";
              containerStyle.background = "#e8dcc6";
              containerStyle.borderRadius = "50%";
              containerStyle.boxShadow = "inset 0px 0px 0px 1px #d4c4a8, inset 0px 0px 0px 3px #f5e6d3, 0px 6px 25px rgba(0, 0, 0, 0.12)";
              break;
            case 'oval-glow':
              imageWrapperStyle.borderRadius = "50%";
              imageWrapperStyle.width = "220px";
              imageWrapperStyle.height = "280px";
              imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
              containerStyle.width = "250px";
              containerStyle.height = "310px";
              containerStyle.padding = "12px";
              containerStyle.background = "#f5e6d3";
              containerStyle.borderRadius = "50%";
              containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
              break;
            case 'rounded-glow':
              imageWrapperStyle.borderRadius = "20px";
              imageWrapperStyle.boxShadow = `0px 0px 30px ${hexToRgba(glowColor, 0.5)}, 0px 0px 60px ${getDarkerGlow(glowColor, 0.3)}, 0px 4px 20px rgba(0, 0, 0, 0.15)`;
              containerStyle.filter = `drop-shadow(0px 0px 20px ${hexToRgba(glowColor, 0.4)})`;
              break;
          }

          return (
            <div className="mx-auto mb-6" style={containerStyle}>
              <div style={imageWrapperStyle}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block"
              }}
              className={`w-full h-full ${isGroom ? "mempelai-foto-pria" : "mempelai-foto-wanita"}`}
              draggable={false}
            />
          ) : (
            <span className="flex w-full h-full items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          )}
        </div>
            </div>
          );
          })()
        )}

        {/* Name */}
        <h4 
          className={`text-2xl font-semibold mb-2 ${mapAlignToClass(nameAlign)}`} 
          style={{ fontFamily: "var(--font-playfair)", color: nameColor || "#1f2937" }}
        >
          {name}
        </h4>

        {/* Full Name */}
        <h5 
          className={`text-lg mb-4 ${mapAlignToClass(fullNameAlign)}`} 
          style={{ fontFamily: "var(--font-dm-sans)", color: fullNameColor || "#374151" }}
        >
          {fullName}
        </h5>

        {/* Relation */}
        <p 
          className={`text-sm mb-2 ${mapAlignToClass(relationAlign)}`} 
          style={{ fontFamily: "var(--font-dm-sans)", color: relationColor || "#4b5563" }}
        >
          {relation}
        </p>

        {/* Parents */}
        {parents.father && (
          <>
            <p 
              className={`text-sm mb-1 ${mapAlignToClass(fatherNameAlign)}`} 
              style={{ fontFamily: "var(--font-dm-sans)", color: fatherNameColor || "#374151" }}
            >
              {parents.father}
            </p>
            <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
              &
            </p>
            <p 
              className={`text-sm mb-4 ${mapAlignToClass(motherNameAlign)}`} 
              style={{ fontFamily: "var(--font-dm-sans)", color: motherNameColor || "#374151" }}
            >
              {parents.mother}
            </p>
          </>
        )}

        {/* Address */}
        {address && (
          <p 
            className={`text-xs mt-4 ${mapAlignToClass(addressAlign)}`} 
            style={{ fontFamily: "var(--font-dm-sans)", color: addressColor || "#4b5563" }}
          >
            {address}
          </p>
        )}
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}
