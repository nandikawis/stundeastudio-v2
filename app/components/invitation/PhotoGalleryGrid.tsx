"use client";

import { useState } from "react";
import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";


interface GalleryImage {
  id?: string;
  url: string;
  alt?: string;
}

export type GalleryDesign = "two" | "three" | "mosaic" | "framed";

interface PhotoGalleryGridProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"title"> {
  images?: GalleryImage[];
  columns?: number;
  design?: GalleryDesign;
  title?: string;
  titleColor?: string;
  titleAlign?: "left" | "center" | "right" | "justify";
  className?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
}

function resolveDesign(design?: GalleryDesign, columns?: number): GalleryDesign {
  if (design) return design;
  if (columns === 3) return "three";
  return "two";
}

export default function PhotoGalleryGrid({
  images = [],
  columns = 2,
  design,
  title = "Photo Gallery",
  titleColor,
  titleAlign = "center",
  className = "",
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
  flowerStyle = "beage",
  titleFont,
  titleSize,
  titleEmphasis,
}: PhotoGalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const galleryDesign = resolveDesign(design, columns);
  const isMosaic = galleryDesign === "mosaic";
  const isFramed = galleryDesign === "framed";
  const isThree = galleryDesign === "three";
  const displayImages = images.length > 0 ? images : [];
  const placeholderCount = isThree ? 6 : 4;

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

  const firstBg = Array.isArray(backgroundImages) && backgroundImages.length > 0
    ? backgroundImages[0]
    : undefined;
  const bgUrl =
    typeof firstBg === "string"
      ? firstBg
      : firstBg && typeof firstBg === "object" && typeof firstBg.url === "string"
        ? firstBg.url
        : backgroundImageUrl || undefined;

  const sectionStyle: React.CSSProperties = {};
  if (bgUrl) {
    sectionStyle.backgroundImage = `url(${bgUrl})`;
    sectionStyle.backgroundSize = "cover";
    sectionStyle.backgroundPosition = "center";
    sectionStyle.backgroundRepeat = "no-repeat";
  } else if (backgroundColor) {
    sectionStyle.backgroundColor = backgroundColor;
  } else {
    sectionStyle.backgroundColor = "#f7f6f3";
  }

  const titleAlignClass = mapAlignToClass(titleAlign);
  const titleTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: titleFont, size: titleSize, emphasis: titleEmphasis, fallbackFont, color });
  const heading = title ? (
    <div className={`mb-8 ${titleAlignClass}`}>
      <h2
        className="text-[1.85rem] font-medium leading-tight tracking-[-0.02em]"
        style={titleTx("var(--font-playfair)", titleColor || "#1f1d1a")}
      >
        {title}
      </h2>
      <div
        className={`mt-3 h-px w-10 bg-[#c4a574] ${
          titleAlign === "left" ? "" : titleAlign === "right" ? "ml-auto" : "mx-auto"
        }`}
      />
    </div>
  ) : null;

  const tileClass =
    "group relative overflow-hidden text-left transition-transform duration-100 ease-out active:scale-[0.98]";
  const imageClass =
    "object-cover transition-transform duration-200 ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03]";

  const renderTile = (image: GalleryImage | null, index: number, extraClass: string) => {
    if (!image) {
      return (
        <div
          key={`placeholder-${index}`}
          className={`flex items-center justify-center border border-dashed border-neutral-300 bg-neutral-200 ${extraClass}`}
        >
          <svg className="h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }

    if (isFramed) {
      return (
        <button
          key={image.id || index}
          type="button"
          onClick={() => setSelectedImage(image.url)}
          className={`${tileClass} border border-[#c4a574]/45 p-[4px] ${extraClass}`}
        >
          <span className="relative block aspect-[4/5] overflow-hidden border border-[#c4a574]/25">
            <Image
              src={image.url}
              alt={image.alt || `Gallery ${index + 1}`}
              fill
              className={imageClass}
              sizes="50vw"
            />
          </span>
        </button>
      );
    }

    return (
      <button
        key={image.id || index}
        type="button"
        onClick={() => setSelectedImage(image.url)}
        className={`${tileClass} ${extraClass}`}
      >
        <Image
          src={image.url}
          alt={image.alt || `Gallery ${index + 1}`}
          fill
          className={imageClass}
          sizes={isThree ? "33vw" : "50vw"}
        />
      </button>
    );
  };

  const items = displayImages.length > 0
    ? displayImages
    : Array.from({ length: placeholderCount }, () => null);

  return (
    <>
      <section className={`relative w-full px-6 py-16 ${className}`} style={sectionStyle}>
        {bgUrl && backgroundColor && (
          <div className="absolute inset-0" style={{ backgroundColor, opacity: 0.5 }} />
        )}
        {renderTopCurve({ showTopCurve, topCurveColor, topCurveStyle })}
        {renderDecorativeFlowers({ decorativeFlowers, flowerStyle, showTopCurve, showBottomCurve })}

        <div
          className="relative z-10 mx-auto max-w-4xl"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          {heading}

          {isMosaic ? (
            <div className="grid grid-cols-2 gap-2.5">
              {items.map((image, index) =>
                renderTile(
                  image,
                  index,
                  index === 0 ? "col-span-2 aspect-[4/5] rounded-sm" : "aspect-square rounded-sm"
                )
              )}
            </div>
          ) : isFramed ? (
            <div className="grid grid-cols-2 gap-3.5">
              {items.map((image, index) => renderTile(image, index, image ? "" : "aspect-[4/5]"))}
            </div>
          ) : (
            <div className={`grid ${isThree ? "grid-cols-3 gap-1.5" : "grid-cols-2 gap-2.5"}`}>
              {items.map((image, index) =>
                renderTile(image, index, "aspect-square rounded-sm")
              )}
            </div>
          )}
        </div>
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 text-white transition-transform duration-100 ease-out hover:text-white/80 active:scale-[0.97]"
            aria-label="Close"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative h-full w-full max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={selectedImage} alt="Gallery image" fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </>
  );
}
