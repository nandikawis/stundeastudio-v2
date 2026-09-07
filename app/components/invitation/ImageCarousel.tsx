"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import CountdownDisplay, { CountdownDesign } from "./CountdownDisplay";
import PeekCarousel, { PEEK_VIEWPORT_FALLBACK } from "./PeekCarousel";
import { textStyle, type TextStyleFields } from "../../lib/textStyle";

interface CarouselImage {
  url: string;
  alt?: string;
  order?: number;
}

export type CarouselDesign = "classic" | "framed" | "filmstrip" | "landscape" | "inset" | "peek";

interface ImageCarouselProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"dateMessageDate">,
  TextStyleFields<"dateMessageText">,
  TextStyleFields<"countdownValue">,
  TextStyleFields<"countdownLabel">,
  TextStyleFields<"countdownTitle"> {
  images?: CarouselImage[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  isEditable?: boolean;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  carouselDesign?: CarouselDesign;
  countdownTargetDate?: string;
  countdownDesign?: CountdownDesign;
  countdownShowDays?: boolean;
  countdownShowHours?: boolean;
  countdownShowMinutes?: boolean;
  countdownShowSeconds?: boolean;
  countdownTitleColor?: string;
  countdownValueColor?: string;
  countdownLabelColor?: string;
  countdownCardColor?: string;
  dateMessageDate?: string;
  dateMessageText?: string;
  dateMessageDateColor?: string;
  dateMessageTextColor?: string;
  dateMessageDateAlign?: "left" | "center" | "right" | "justify";
  dateMessageTextAlign?: "left" | "center" | "right" | "justify";
  dateMessageShowLine?: boolean;
  dateMessageLinePlacement?: "before" | "after" | "both";
  dateMessageLineColor?: string;
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
  carouselDesign = "classic",
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
  dateMessageTextColor,
  dateMessageDateAlign = "center",
  dateMessageTextAlign = "center",
  dateMessageShowLine = true,
  dateMessageLinePlacement = "before",
  dateMessageLineColor,
  dateMessageDateFont,
  dateMessageDateSize,
  dateMessageDateEmphasis,
  dateMessageTextFont,
  dateMessageTextSize,
  dateMessageTextEmphasis,
  countdownValueFont,
  countdownValueSize,
  countdownValueEmphasis,
  countdownLabelFont,
  countdownLabelSize,
  countdownLabelEmphasis,
  countdownTitleFont,
  countdownTitleSize,
  countdownTitleEmphasis,
}: ImageCarouselProps) {
  // Normalize legacy "minimal" (from saved project data) to "landscape"
  const carouselDesignResolved =
    ((carouselDesign as string) === "minimal" ? "landscape" : carouselDesign) ?? "classic";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Avoid hydration mismatch: countdown uses Date so we only render it after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (carouselDesignResolved === "peek" || !autoplay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, images.length, carouselDesignResolved]);

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

  const dateLineColor = dateMessageLineColor || dateMessageDateColor || "#8b7355";
  const dateTx = textStyle({
    font: dateMessageDateFont,
    size: dateMessageDateSize,
    emphasis: dateMessageDateEmphasis,
    fallbackFont: "var(--font-dm-sans)",
    color: dateMessageDateColor || "#8b7355",
  });
  const renderDateHairline = (key: string) => (
    <div
      key={key}
      className="h-[2px] min-w-[32px] flex-1"
      style={{ backgroundColor: dateLineColor }}
    />
  );

  // Show placeholder slots when editable or when empty
  // Filter out images with obviously invalid/empty URLs to avoid runtime URL errors.
  const displayImages = images.length > 0 
    ? images.filter((image) => {
        if (!image || typeof image.url !== "string") return false;
        const trimmed = image.url.trim();
        if (!trimmed) return false;
        // Allow absolute URLs, root-relative paths, and data: URLs (editor preview from "select file")
        return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/") || trimmed.startsWith("data:");
      })
    : [];
  const placeholderSlots = isEditable && images.length === 0 ? 3 : 0;
  const design = carouselDesignResolved;
  const isClassic = design === "classic";
  const isFramed = design === "framed";
  const isFilmstrip = design === "filmstrip";
  const isLandscape = design === "landscape";
  const isInset = design === "inset";
  const isPeek = design === "peek";

  const sectionStyle: React.CSSProperties = {};

  if (backgroundImageUrl) {
    sectionStyle.backgroundImage = `url(${backgroundImageUrl})`;
    sectionStyle.backgroundSize = "cover";
    sectionStyle.backgroundPosition = "center";
    sectionStyle.backgroundRepeat = "no-repeat";
  } else if (backgroundColor) {
    sectionStyle.backgroundColor = backgroundColor;
  } else {
    sectionStyle.backgroundColor = isClassic ? "#fafafa" : "#f7f6f3";
  }

  const slides =
    displayImages.length > 0 ? (
      <div className="relative h-full w-full">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              index === currentIndex ? "opacity-100" : "pointer-events-none opacity-0"
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
    ) : (
      <div className="flex h-full w-full items-center justify-center gap-4 p-4">
        {Array.from({ length: placeholderSlots || 1 }).map((_, index) => (
          <div
            key={index}
            className="flex h-full flex-1 items-center justify-center rounded-sm border-2 border-dashed border-neutral-300 bg-neutral-200"
          >
            <div className="text-center">
              <svg className="mx-auto mb-2 h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-neutral-400">Image Slot {index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    );

  const arrows =
    showArrows && displayImages.length > 1 ? (
      <>
        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#f7f6f3]/92 text-[#1f1d1a] shadow-sm transition-[transform,background-color] duration-100 ease-out hover:bg-white active:scale-[0.97]"
          aria-label="Previous image"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#f7f6f3]/92 text-[#1f1d1a] shadow-sm transition-[transform,background-color] duration-100 ease-out hover:bg-white active:scale-[0.97]"
          aria-label="Next image"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </>
    ) : null;

  const goldDots = (mode: "overlay" | "below" | "flush") =>
    showDots && displayImages.length > 1 ? (
      <div
        className={
          mode === "overlay"
            ? "absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
            : mode === "flush"
              ? "flex justify-center gap-1.5"
              : "mt-4 flex justify-center gap-1.5"
        }
      >
        {displayImages.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none ${
              index === currentIndex
                ? mode === "overlay"
                  ? "w-6 bg-white"
                  : "w-6 bg-[#c4a574]"
                : mode === "overlay"
                  ? "w-1.5 bg-white/45"
                  : "w-1.5 bg-[#c4a574]/35"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    ) : null;

  const thumbs =
    displayImages.length > 1 ? (
      <div className="mt-3 flex justify-center gap-2 overflow-x-auto px-1">
        {displayImages.map((image, index) => (
          <button
            type="button"
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-sm transition-opacity duration-200 ease-out motion-reduce:transition-none ${
              index === currentIndex
                ? "opacity-100 ring-1 ring-[#c4a574] ring-offset-1 ring-offset-[#f7f6f3]"
                : "opacity-45 hover:opacity-80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={image.alt || `Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="44px"
            />
          </button>
        ))}
      </div>
    ) : null;

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
        {isPeek ? (
          <div>
            {displayImages.length > 0 ? (
              <PeekCarousel
                images={displayImages}
                index={currentIndex}
                onIndexChange={setCurrentIndex}
                autoplay={autoplay}
                autoplayInterval={5000}
              />
            ) : (
              <div className="relative overflow-hidden rounded-sm" style={{ height: PEEK_VIEWPORT_FALLBACK }}>{slides}</div>
            )}
            {goldDots("below")}
          </div>
        ) : isFramed ? (
          <div className="relative bg-white px-2.5 pb-8 pt-2.5 shadow-[0_18px_40px_rgba(40,32,24,0.12)]">
            <div className="relative h-[320px] overflow-hidden">
              {slides}
              {arrows}
            </div>
            <div className="absolute inset-x-0 bottom-2.5">{goldDots("flush")}</div>
          </div>
        ) : isInset ? (
          <div>
            <div className="border border-[#c4a574]/45 p-[5px]">
              <div className="relative h-[340px] overflow-hidden border border-[#c4a574]/30">
                {slides}
                {arrows}
              </div>
            </div>
            {goldDots("below")}
          </div>
        ) : isFilmstrip ? (
          <div>
            <div className="relative h-[300px] overflow-hidden rounded-sm">
              {slides}
              {arrows}
            </div>
            {thumbs}
          </div>
        ) : isLandscape ? (
          <div>
            <div className="relative h-[210px] overflow-hidden">
              {slides}
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/25 via-transparent to-black/25" />
              {arrows}
            </div>
            {goldDots("below")}
          </div>
        ) : (
          <div className="relative h-[380px] overflow-hidden rounded-sm">
            {slides}
            {arrows}
            {goldDots("overlay")}
          </div>
        )}

        {/* Date and Message Section - Between carousel and countdown */}
        {(dateMessageDate || dateMessageText) && (
          <div className="mt-8 mb-6 px-4">
            {dateMessageDate && (
              dateMessageShowLine ? (
                <div className="mb-4 flex w-full items-center gap-3">
                  {(dateMessageLinePlacement === "before" || dateMessageLinePlacement === "both") &&
                    renderDateHairline("line-before")}
                  <div className="shrink-0 whitespace-nowrap text-sm font-medium" style={dateTx}>
                    {dateMessageDate}
                  </div>
                  {(dateMessageLinePlacement === "after" || dateMessageLinePlacement === "both") &&
                    renderDateHairline("line-after")}
                </div>
              ) : (
                <div className={`mb-4 ${mapAlignToClass(dateMessageDateAlign)}`}>
                  <div className="text-sm font-medium" style={dateTx}>
                    {dateMessageDate}
                  </div>
                </div>
              )
            )}
            {dateMessageText && (
              <p 
                className={`text-sm leading-relaxed break-words ${mapAlignToClass(dateMessageTextAlign)}`}
                style={textStyle({
                  font: dateMessageTextFont,
                  size: dateMessageTextSize,
                  emphasis: dateMessageTextEmphasis,
                  fallbackFont: "var(--font-dm-sans)",
                  color: dateMessageTextColor || "#4a4a4a",
                  extra: {
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                  },
                })}
              >
                {dateMessageText}
              </p>
            )}
          </div>
        )}

        {mounted && countdownTargetDate && (
          <CountdownDisplay
            className="mt-8"
            units={[
              countdownShowDays && { label: "Hari", value: timeLeft.days },
              countdownShowHours && { label: "Jam", value: timeLeft.hours },
              countdownShowMinutes && { label: "Menit", value: timeLeft.minutes },
              countdownShowSeconds && { label: "Detik", value: timeLeft.seconds },
            ].filter((unit): unit is { label: string; value: number } => Boolean(unit))}
            design={countdownDesign}
            valueColor={countdownValueColor}
            labelColor={countdownLabelColor}
            cardColor={countdownCardColor}
            titleColor={countdownTitleColor}
            valueFont={countdownValueFont}
            valueSize={countdownValueSize}
            valueEmphasis={countdownValueEmphasis}
            labelFont={countdownLabelFont}
            labelSize={countdownLabelSize}
            labelEmphasis={countdownLabelEmphasis}
            titleFont={countdownTitleFont}
            titleSize={countdownTitleSize}
            titleEmphasis={countdownTitleEmphasis}
          />
        )}
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}
