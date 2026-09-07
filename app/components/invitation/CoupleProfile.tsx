"use client";

import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";


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

export type CoupleProfileDesign = 'simple' | 'with-container' | 'collage' | 'editorial' | 'caption' | 'folio';

interface CoupleProfileProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"name">,
  TextStyleFields<"fullName">,
  TextStyleFields<"relation">,
  TextStyleFields<"fatherName">,
  TextStyleFields<"motherName">,
  TextStyleFields<"address"> {
  name?: string;
  fullName?: string;
  relation?: string;
  parents?: {
    father?: string;
    mother?: string;
  };
  address?: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  instagram?: string;
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
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
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
  secondaryImageUrl,
  instagram,
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
  backgroundImages,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  nameFont,
  nameSize,
  nameEmphasis,
  fullNameFont,
  fullNameSize,
  fullNameEmphasis,
  relationFont,
  relationSize,
  relationEmphasis,
  fatherNameFont,
  fatherNameSize,
  fatherNameEmphasis,
  motherNameFont,
  motherNameSize,
  motherNameEmphasis,
  addressFont,
  addressSize,
  addressEmphasis,
  showTopCurve,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  className = ""
}: CoupleProfileProps) {
  const isGroom = type === "groom";
  const isCollage = design === "collage";
  const isEditorial = design === "editorial";
  const isCaption = design === "caption";
  const isFolio = design === "folio";
  const isComposedProfile = isCollage || isEditorial || isCaption || isFolio;
  const collageSecondary = secondaryImageUrl || imageUrl;
  const ringLabel = isGroom ? "MEMPELAI PRIA" : "MEMPELAI WANITA";
  const parentsLine = [relation, parents.father, parents.father && parents.mother ? 'dan' : null, parents.mother]
    .filter(Boolean)
    .join(' ');
  const igHandle = instagram ? instagram.replace(/^@/, '') : '';

  const mapAlignToClass = (align?: "left" | "center" | "right" | "justify") => {
    switch (align) {
      case "left":
        return "w-full self-stretch text-left";
      case "right":
        return "w-full self-stretch text-right";
      case "justify":
        return "w-full self-stretch text-justify";
      case "center":
      default:
        return "w-full self-stretch text-center";
    }
  };
  const nameTx = (fallbackFont: string, color?: string, extra?: React.CSSProperties) =>
    textStyle({ font: nameFont, size: nameSize, emphasis: nameEmphasis, fallbackFont, color, extra });
  const fullNameTx = (fallbackFont: string, color?: string, extra?: React.CSSProperties) =>
    textStyle({ font: fullNameFont, size: fullNameSize, emphasis: fullNameEmphasis, fallbackFont, color, extra });
  const relationTx = (fallbackFont: string, color?: string, extra?: React.CSSProperties) =>
    textStyle({ font: relationFont, size: relationSize, emphasis: relationEmphasis, fallbackFont, color, extra });
  const fatherTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: fatherNameFont, size: fatherNameSize, emphasis: fatherNameEmphasis, fallbackFont, color });
  const motherTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: motherNameFont, size: motherNameSize, emphasis: motherNameEmphasis, fallbackFont, color });
  const addressTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: addressFont, size: addressSize, emphasis: addressEmphasis, fallbackFont, color });
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
  } else if (isComposedProfile) {
    sectionStyle.backgroundColor = '#f7f6f3';
  } else {
    sectionStyle.background = 'linear-gradient(to bottom, #ffffff, #f9fafb, #ffffff)';
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
        className={`relative z-10 mx-auto max-w-md ${isCollage || isEditorial || isFolio ? '' : 'text-center'}`}
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {isCollage ? (
          <div className={`flex flex-col ${isGroom ? 'items-start' : 'items-end'}`}>
            <div className="relative mb-10 w-full" data-invite-reveal>
              <div
                className={`relative z-10 w-[72%] overflow-hidden rounded-sm shadow-[0_18px_40px_rgba(0,0,0,0.16)] ${
                  isGroom ? '' : 'ml-auto'
                }`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="aspect-[3/4] w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-200">
                    <svg className="h-16 w-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div
                className={`absolute bottom-3 z-20 w-[42%] overflow-hidden rounded-sm shadow-[0_14px_30px_rgba(0,0,0,0.2)] ${
                  isGroom ? 'right-0' : 'left-0'
                }`}
              >
                {collageSecondary ? (
                  <img
                    src={collageSecondary}
                    alt=""
                    className="aspect-square w-full object-cover grayscale"
                    draggable={false}
                  />
                ) : (
                  <div className="aspect-square w-full bg-neutral-300" />
                )}
              </div>
              <div
                className={`pointer-events-none absolute z-30 h-[108px] w-[108px] ${
                  isGroom ? 'right-1 top-1' : 'left-1 top-1'
                }`}
                aria-hidden
              >
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path
                      id={`couple-ring-${type}`}
                      d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    />
                  </defs>
                  <text
                    fill={nameColor || '#1f2937'}
                    fontSize="8.2"
                    letterSpacing="2.4"
                    style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}
                  >
                    <textPath href={`#couple-ring-${type}`} startOffset="0%">
                      {`${ringLabel}  ·  ${ringLabel}  ·  `}
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            <h4
              className={`max-w-[16ch] text-[1.85rem] font-medium leading-[1.15] tracking-[-0.02em] ${mapAlignToClass(nameAlign)} ${
                nameAlign === "right" ? "ml-auto" : nameAlign === "left" ? "mr-auto" : isGroom ? "mr-auto" : "ml-auto"
              }`}
              style={nameTx("var(--font-playfair)", nameColor || "#1f2937")}
            >
              {fullName || name}
            </h4>
            <p
              className={`mt-3 max-w-[280px] text-[13px] leading-relaxed ${mapAlignToClass(relationAlign)} ${
                relationAlign === "right" ? "ml-auto" : relationAlign === "left" ? "mr-auto" : isGroom ? "mr-auto" : "ml-auto"
              }`}
              style={relationTx("var(--font-dm-sans)", relationColor || "#4b5563")}
            >
              {parentsLine}
            </p>
            {igHandle && (
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-2 text-[12px] text-white transition-transform duration-100 ease-out hover:bg-neutral-700 active:scale-[0.97]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 4.5A4.5 4.5 0 1016.5 12 4.5 4.5 0 0012 7.5zm0 2A2.5 2.5 0 1114.5 12 2.5 2.5 0 0112 9.5zM17.75 6.5a.75.75 0 10.75.75.75.75 0 00-.75-.75z" />
                </svg>
                {igHandle}
              </a>
            )}
          </div>
        ) : isEditorial ? (
          <div className={`flex flex-col ${isGroom ? 'items-start' : 'items-end'}`}>
            <div className="relative w-full" data-invite-reveal>
              <div
                className={`relative w-[70%] overflow-hidden rounded-sm shadow-[0_18px_40px_rgba(0,0,0,0.14)] ${
                  isGroom ? '' : 'ml-auto'
                }`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="aspect-[3/4] w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-200">
                    <svg className="h-16 w-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div
                className={`relative z-10 -mt-14 w-[78%] rounded-sm bg-[#f7f6f3]/90 px-1 py-3 backdrop-blur-[2px] ${
                  nameAlign === "left" ? "" : nameAlign === "right" ? "ml-auto" : isGroom ? "ml-auto" : ""
                } ${mapAlignToClass(nameAlign)}`}
              >
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.28em]"
                  style={relationTx("var(--font-dm-sans)", relationColor || "#8a8178")}
                >
                  {ringLabel}
                </p>
                <h4
                  className={`mt-2 max-w-[14ch] text-[1.9rem] font-medium leading-[1.12] tracking-[-0.02em] ${mapAlignToClass(nameAlign)}`}
                  style={nameTx("var(--font-playfair)", nameColor || "#1f2937", { marginLeft: isGroom ? 'auto' : undefined })}
                >
                  {fullName || name}
                </h4>
                <div
                  className={`mt-3 h-px w-10 bg-[#c4a574] ${isGroom ? 'ml-auto' : ''}`}
                />
                <p
                  className="mt-3 max-w-[260px] text-[13px] leading-relaxed"
                  style={relationTx("var(--font-dm-sans)", relationColor || "#4b5563", { marginLeft: isGroom ? 'auto' : undefined })}
                >
                  {parentsLine}
                </p>
                {igHandle && (
                  <a
                    href={`https://instagram.com/${igHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-2 text-[12px] text-white transition-transform duration-100 ease-out hover:bg-neutral-700 active:scale-[0.97]"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 4.5A4.5 4.5 0 1016.5 12 4.5 4.5 0 0012 7.5zm0 2A2.5 2.5 0 1114.5 12 2.5 2.5 0 0112 9.5zM17.75 6.5a.75.75 0 10.75.75.75.75 0 00-.75-.75z" />
                    </svg>
                    {igHandle}
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : isCaption ? (
          <div className="mx-auto w-full max-w-sm">
            <div className="relative mb-16" data-invite-reveal>
              <div className="overflow-hidden rounded-[22px] shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="aspect-[4/5] w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center bg-neutral-200">
                    <svg className="h-16 w-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={`absolute inset-x-5 bottom-0 translate-y-1/2 rounded-2xl bg-[#f7f6f3] px-5 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.1)] ${mapAlignToClass(nameAlign)}`}>
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.26em]"
                  style={relationTx("var(--font-dm-sans)", relationColor || "#8a8178")}
                >
                  {ringLabel}
                </p>
                <h4
                  className={`mt-1.5 text-[1.55rem] font-medium leading-[1.15] tracking-[-0.02em] ${mapAlignToClass(nameAlign)}`}
                  style={nameTx("var(--font-playfair)", nameColor || "#1f2937")}
                >
                  {fullName || name}
                </h4>
              </div>
            </div>
            <p
              className={`mx-auto max-w-[280px] text-[13px] leading-relaxed ${mapAlignToClass(relationAlign)}`}
              style={relationTx("var(--font-dm-sans)", relationColor || "#4b5563")}
            >
              {parentsLine}
            </p>
            {igHandle && (
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-2 text-[12px] text-white transition-transform duration-100 ease-out hover:bg-neutral-700 active:scale-[0.97]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 4.5A4.5 4.5 0 1016.5 12 4.5 4.5 0 0012 7.5zm0 2A2.5 2.5 0 1114.5 12 2.5 2.5 0 0112 9.5zM17.75 6.5a.75.75 0 10.75.75.75.75 0 00-.75-.75z" />
                </svg>
                {igHandle}
              </a>
            )}
          </div>
        ) : isFolio ? (
          <div className={`flex items-center gap-4 ${isGroom ? '' : 'flex-row-reverse'}`}>
            <div
              className="w-[48%] shrink-0 overflow-hidden rounded-sm shadow-[0_16px_36px_rgba(0,0,0,0.14)]"
              data-invite-reveal
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="aspect-[3/4] w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-200">
                  <svg className="h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className={`min-w-0 flex-1 ${mapAlignToClass(nameAlign)}`}>
              <p
                className="text-[10px] font-medium uppercase tracking-[0.26em]"
                style={relationTx("var(--font-dm-sans)", relationColor || "#8a8178")}
              >
                {ringLabel}
              </p>
              <h4
                className="mt-2 text-[1.5rem] font-medium leading-[1.12] tracking-[-0.02em]"
                style={nameTx("var(--font-playfair)", nameColor || "#1f2937")}
              >
                {fullName || name}
              </h4>
              <div className={`mt-3 h-px w-8 bg-[#c4a574] ${isGroom ? '' : 'ml-auto'}`} />
              <p
                className="mt-3 text-[12px] leading-relaxed"
                style={relationTx("var(--font-dm-sans)", relationColor || "#4b5563")}
              >
                {parentsLine}
              </p>
              {igHandle && (
                <a
                  href={`https://instagram.com/${igHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3.5 py-1.5 text-[11px] text-white transition-transform duration-100 ease-out hover:bg-neutral-700 active:scale-[0.97]"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 4.5A4.5 4.5 0 1016.5 12 4.5 4.5 0 0012 7.5zm0 2A2.5 2.5 0 1114.5 12 2.5 2.5 0 0112 9.5zM17.75 6.5a.75.75 0 10.75.75.75.75 0 00-.75-.75z" />
                  </svg>
                  {igHandle}
                </a>
              )}
            </div>
          </div>
        ) : (
          <>
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
          style={nameTx("var(--font-playfair)", nameColor || "#1f2937")}
        >
          {name}
        </h4>

        {/* Full Name */}
        <h5 
          className={`text-lg mb-4 ${mapAlignToClass(fullNameAlign)}`} 
          style={fullNameTx("var(--font-dm-sans)", fullNameColor || "#374151")}
        >
          {fullName}
        </h5>

        {/* Relation */}
        <p 
          className={`text-sm mb-2 ${mapAlignToClass(relationAlign)}`} 
          style={relationTx("var(--font-dm-sans)", relationColor || "#4b5563")}
        >
          {relation}
        </p>

        {/* Parents */}
        {parents.father && (
          <>
            <p 
              className={`text-sm mb-1 ${mapAlignToClass(fatherNameAlign)}`} 
              style={fatherTx("var(--font-dm-sans)", fatherNameColor || "#374151")}
            >
              {parents.father}
            </p>
            <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
              &
            </p>
            <p 
              className={`text-sm mb-4 ${mapAlignToClass(motherNameAlign)}`} 
              style={motherTx("var(--font-dm-sans)", motherNameColor || "#374151")}
            >
              {parents.mother}
            </p>
          </>
        )}

        {/* Address */}
        {address && (
          <p 
            className={`text-xs mt-4 ${mapAlignToClass(addressAlign)}`} 
            style={addressTx("var(--font-dm-sans)", addressColor || "#4b5563")}
          >
            {address}
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
