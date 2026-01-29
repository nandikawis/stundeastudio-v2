"use client";

import { useState } from "react";
import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface GalleryImage {
  id?: string;
  url: string;
  alt?: string;
}

interface PhotoGalleryGridProps extends CurveDividerProps, DecorativeFlowersProps {
  images?: GalleryImage[];
  columns?: number;
  title?: string;
  titleColor?: string;
  titleAlign?: "left" | "center" | "right" | "justify";
  className?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
}

export default function PhotoGalleryGrid({
  images = [],
  columns = 2,
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
  flowerStyle = 'beage'
}: PhotoGalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  if (images.length === 0) {
    return (
      <section 
        className={`py-16 px-6 w-full relative ${className}`}
        style={sectionStyle}
      >
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
          className="max-w-4xl mx-auto relative z-10"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          {title && (
            <h2
              className={`text-3xl font-bold mb-8 ${mapAlignToClass(titleAlign)}`}
              style={{ fontFamily: "var(--font-playfair)", color: titleColor || "#1f2937" }}
            >
              {title}
            </h2>
          )}
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
              >
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </section>
    );
  }

  return (
    <>
      <section 
        className={`py-16 px-6 w-full relative ${className}`}
        style={sectionStyle}
      >
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
          className="relative z-10 max-w-4xl mx-auto"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          {title && (
            <h2
              className={`text-3xl font-bold mb-8 ${mapAlignToClass(titleAlign)}`}
              style={{ fontFamily: "var(--font-playfair)", color: titleColor || "#1f2937" }}
            >
              {title}
            </h2>
          )}

          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedImage(image.url)}
                className="relative aspect-square overflow-hidden rounded group cursor-pointer"
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes={`(max-width: 768px) 50vw, ${100 / columns}vw`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

