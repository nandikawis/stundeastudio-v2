"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface CarouselImage {
  url: string;
  alt?: string;
  order?: number;
}

interface ImageCarouselProps extends CurveDividerProps, DecorativeFlowersProps {
  images?: CarouselImage[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  isEditable?: boolean;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  // Countdown timer props
  countdownTargetDate?: string;
  countdownDesign?: "simple" | "elegant-card" | "minimal";
  countdownShowDays?: boolean;
  countdownShowHours?: boolean;
  countdownShowMinutes?: boolean;
  countdownShowSeconds?: boolean;
  countdownTitleColor?: string;
  countdownValueColor?: string;
  countdownLabelColor?: string;
  countdownCardColor?: string;
  // Date and message section props
  dateMessageDate?: string;
  dateMessageText?: string;
  dateMessageDateColor?: string;
  dateMessageTextColor?: string;
}

export default function ImageCarousel({
  images = [],
  autoplay = true,
  autoplayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = "",
  isEditable = false,
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
  countdownTargetDate,
  countdownDesign = "elegant-card",
  countdownShowDays = true,
  countdownShowHours = true,
  countdownShowMinutes = true,
  countdownShowSeconds = true,
  countdownTitleColor,
  countdownValueColor,
  countdownLabelColor,
  countdownCardColor,
  dateMessageDate,
  dateMessageText,
  dateMessageDateColor,
  dateMessageTextColor
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, images.length]);

  // Countdown timer functionality
  useEffect(() => {
    if (!countdownTargetDate) return;

    const calculateTimeLeft = () => {
      const target = new Date(countdownTargetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [countdownTargetDate]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // Show placeholder slots when editable or when empty
  const displayImages = images.length > 0 ? images : [];
  const placeholderSlots = isEditable && images.length === 0 ? 3 : 0;

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
    sectionStyle.backgroundColor = '#fafafa';
  }

  return (
    <section 
      className={`py-16 px-4 w-full relative ${className}`}
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
        className="max-w-6xl mx-auto relative z-10"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
          {displayImages.length > 0 ? (
            <>
              {/* Images */}
              <div className="relative w-full h-full">
                {displayImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {showArrows && displayImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-primary flex items-center justify-center transition-all shadow-lg z-10"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-primary flex items-center justify-center transition-all shadow-lg z-10"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {showDots && displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {displayImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-white w-8"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            // Placeholder slots
            <div className="w-full h-full flex items-center justify-center gap-4 p-4">
              {Array.from({ length: placeholderSlots || 1 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-full bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">Image Slot {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date and Message Section - Between carousel and countdown */}
        {(dateMessageDate || dateMessageText) && (
          <div className="mt-8 mb-6 px-4">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex-1 h-[2px] mr-3"
                style={{ backgroundColor: dateMessageDateColor || "#8b7355" }}
              />
              {dateMessageDate && (
                <div 
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ fontFamily: "var(--font-dm-sans)", color: dateMessageDateColor || "#8b7355" }}
                >
                  {dateMessageDate}
                </div>
              )}
            </div>
            {dateMessageText && (
              <p 
                className="text-sm leading-relaxed break-words"
                style={{ 
                  fontFamily: "var(--font-dm-sans)", 
                  color: dateMessageTextColor || "#4a4a4a",
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}
              >
                {dateMessageText}
              </p>
            )}
          </div>
        )}

        {/* Countdown Timer - Below carousel */}
        {countdownTargetDate && (() => {
          const timeUnits = [
            { label: "Hari", value: timeLeft.days, show: countdownShowDays },
            { label: "Jam", value: timeLeft.hours, show: countdownShowHours },
            { label: "Menit", value: timeLeft.minutes, show: countdownShowMinutes },
            { label: "Detik", value: timeLeft.seconds, show: countdownShowSeconds }
          ].filter(unit => unit.show);

          if (countdownDesign === "elegant-card") {
            return (
              <div className="mt-6">
                <div className="grid grid-cols-4 gap-1.5 max-w-sm mx-auto px-2">
                  {timeUnits.map((unit, index) => (
                    <div
                      key={index}
                      className="rounded-md p-2 text-center"
                      style={{ 
                        backgroundColor: countdownCardColor || "#d4a574",
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    >
                      <div className="text-xl font-bold leading-tight mb-0.5" style={{ fontFamily: "var(--font-playfair)", color: countdownValueColor || "#ffffff" }}>
                        {String(unit.value).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] uppercase tracking-wide leading-tight" style={{ color: countdownLabelColor || "#ffffff" }}>
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (countdownDesign === "minimal") {
            return (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-4">
                  {timeUnits.map((unit, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: countdownValueColor || "#1f2937" }}>
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      <span className="text-xs" style={{ color: countdownLabelColor || "#6b7280" }}>{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Simple design (default)
          return (
            <div className="mt-12 text-center">
              <div className="flex items-center justify-center gap-6">
                {timeUnits.map((unit, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: countdownValueColor || "#1f2937" }}>
                      {String(unit.value).padStart(2, "0")}
                    </span>
                    <span className="text-sm" style={{ color: countdownLabelColor || "#6b7280" }}>{unit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}
