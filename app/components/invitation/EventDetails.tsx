"use client";

import { useState, useEffect } from "react";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

export type EventDetailsDesign = 'card' | 'elegant-split' | 'modern-minimal' | 'timeline-vertical' | 'badge-accent' | 'framed-classic';

interface EventDetailsProps extends CurveDividerProps, DecorativeFlowersProps {
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueCoordinates?: { lat: number; lng: number };
  googleMapsLink?: string;
  mapButtonText?: string;
  mapButtonColor?: string;
  mapButtonTextColor?: string;
  invitationMessage?: string;
  invitationMessageColor?: string;
  closingMessage?: string;
  closingText?: string; // "Om Shanti Shanti Shanti Om"
  dateMonthYearColor?: string;
  dateDayColor?: string;
  titleColor?: string;
  eventTimeColor?: string;
  venueNameColor?: string;
  venueAddressColor?: string;
  closingMessageColor?: string;
  closingTextColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }> | string[];
  design?: EventDetailsDesign;
  cardBackgroundColor?: string;
  cardOpacity?: number;
  cardHeaderColor?: string;
  cardBodyColor?: string;
  className?: string;
}

export default function EventDetails({
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  venueCoordinates,
  googleMapsLink,
  mapButtonText = "Petunjuk Arah",
  mapButtonColor = "#111827",
  mapButtonTextColor = "#ffffff",
  invitationMessage = "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.",
  invitationMessageColor,
  closingMessage = "Atas kehadiran dan doa restunya kami ucapkan terimakasih.",
  closingText = "Om Shanti Shanti Shanti Om",
  dateMonthYearColor,
  dateDayColor,
  titleColor,
  eventTimeColor,
  venueNameColor,
  venueAddressColor,
  closingMessageColor,
  closingTextColor,
  backgroundColor,
  backgroundImageUrl,
  backgroundImages,
  design = 'card',
  cardBackgroundColor,
  cardOpacity = 0.95,
  cardHeaderColor,
  cardBodyColor,
  showTopCurve,
  showBottomCurve,
  topCurveColor,
  bottomCurveColor,
  topCurveStyle,
  bottomCurveStyle,
  decorativeFlowers = false,
  flowerStyle = 'beage',
  className = ""
}: EventDetailsProps) {
  const [dateCounter, setDateCounter] = useState({ month: "", year: "", day: 0 });

  // Use component-level data first, then fall back to props (project-level data)
  const displayEventDate = eventDate;
  const displayEventTime = eventTime;
  const displayVenueName = venueName;
  const displayVenueAddress = venueAddress;

  useEffect(() => {
    if (displayEventDate) {
      const date = new Date(displayEventDate);
      const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
      setDateCounter({
        month: months[date.getMonth()],
        year: date.getFullYear().toString(),
        day: date.getDate()
      });
    }
  }, [displayEventDate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
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

  // Helper function to convert hex to rgba with opacity
  const hexToRgba = (hex: string | undefined, opacity: number): string => {
    if (!hex) return `rgba(255, 255, 255, ${opacity})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Get card background style
  const getCardBackgroundStyle = (defaultColor: string = '#ffffff') => {
    const bgColor = cardBackgroundColor || defaultColor;
    const opacity = cardOpacity;
    return {
      backgroundColor: hexToRgba(bgColor, opacity),
      backdropFilter: 'blur(8px)',
    };
  };

  // Render map button below card
  const renderMapButton = () => {
    const mapUrl = googleMapsLink || (venueCoordinates ? `https://maps.google.com/?q=${venueCoordinates.lat},${venueCoordinates.lng}` : '#');
    // Ensure we always have valid colors, even if props are empty string
    const buttonBgColor = (mapButtonColor && mapButtonColor.trim() !== '') ? mapButtonColor : '#111827';
    const buttonTextColor = (mapButtonTextColor && mapButtonTextColor.trim() !== '') ? mapButtonTextColor : '#ffffff';
    const buttonText = (mapButtonText && mapButtonText.trim() !== '') ? mapButtonText : 'Petunjuk Arah';

    return (
      <div className="text-center mb-6">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full transition-all text-xs font-medium hover:opacity-90"
          style={{ 
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
            border: 'none',
          }}
        >
          <span className="uppercase tracking-wide">{buttonText}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: buttonTextColor }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    );
  };

  // Render based on design style
  const renderContent = () => {
    switch (design) {
      case 'card':
        return (
          <div className="max-w-sm mx-auto relative z-10 px-4">
            {/* Invitation Message - Above card */}
            {invitationMessage && (
              <div className="mb-6 text-center">
                <p className="text-base leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: invitationMessageColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {invitationMessage}
                </p>
              </div>
            )}
            
            {/* Card Style - Horizontal split with dark left, white right */}
            <div className="backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="grid grid-cols-4">
                {/* Left Column - Date (1/4 width, dark background) */}
                <div className="p-4 flex flex-col justify-center" style={{ 
                  backgroundColor: cardHeaderColor ? hexToRgba(cardHeaderColor, 1) : '#1f2937'
                }}>
                  <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-dm-sans)", lineHeight: "1" }}>
                    {dateCounter.day || "19"}
                  </div>
                  <div className="text-xs text-gray-300 mb-1 uppercase tracking-wide" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {dateCounter.month}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {dateCounter.year}
                  </div>
                </div>

                {/* Right Column - Event Details (3/4 width, white background) */}
                <div className="p-4 col-span-3" style={cardBodyColor ? { backgroundColor: hexToRgba(cardBodyColor, cardOpacity) } : getCardBackgroundStyle('#ffffff')}>
                  <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-dm-sans)", color: titleColor || "#374151" }}>
                    Resepsi
                  </h2>

                  {displayEventTime && (
                    <p className="text-xs mb-3 flex items-start gap-2" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151", lineHeight: "1.5" }}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{displayEventTime}</span>
                    </p>
                  )}

                  {displayVenueName && (
                    <p className="text-xs mb-2 flex items-start gap-2" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151", lineHeight: "1.5" }}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{displayVenueName}</span>
                    </p>
                  )}

                  {displayVenueAddress && (
                    <p className="text-xs mb-4 leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                      {displayVenueAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Map Button - Below card */}
            {renderMapButton()}

            {/* Closing Message - Below card on background (two lines) */}
            <div className="text-center px-2">
              {closingMessage.includes('terimakasih') ? (
                <>
                  <p className="text-sm mb-1 text-white drop-shadow-md leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                    {closingMessage.split('terimakasih')[0]?.trim()}
                  </p>
                  <p className="text-sm mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                    terimakasih.
                  </p>
                </>
              ) : (
                <p className="text-sm mb-3 text-white drop-shadow-md leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                  {closingMessage}
                </p>
              )}
              <h5 className="text-base font-semibold text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || "#ffffff" }}>
                {closingText}
              </h5>
            </div>
          </div>
        );

      case 'elegant-split':
        return (
          <div className="max-w-sm mx-auto relative z-10 px-4">
            {/* Invitation Message - Above card */}
            {invitationMessage && (
              <div className="mb-6 text-center">
                <p className="text-base leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: invitationMessageColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {invitationMessage}
                </p>
              </div>
            )}
            
            {/* Elegant Split Design - Mobile optimized */}
            <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6" style={getCardBackgroundStyle('#ffffff')}>
              <div className="grid grid-cols-2">
                {/* Left Side - Date with elegant background */}
                <div className="p-4 flex flex-col items-center justify-center border-r border-gray-200" style={{ backgroundColor: cardHeaderColor ? hexToRgba(cardHeaderColor, 0.9) : 'rgba(249, 250, 251, 0.9)' }}>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-dm-sans)", color: dateMonthYearColor || "#6b7280" }}>
                      {dateCounter.month} {dateCounter.year}
                    </div>
                    <div className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: dateDayColor || "#1f2937", lineHeight: "1" }}>
                      {dateCounter.day || "19"}
                    </div>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
                  </div>
                </div>

                {/* Right Side - Event Details */}
                <div className="p-4" style={{ backgroundColor: cardBodyColor ? hexToRgba(cardBodyColor, cardOpacity) : undefined }}>
                  <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-dm-sans)", color: titleColor || "#1f2937" }}>
                    Resepsi
                  </h2>

                  <div className="space-y-3">
                    {displayEventTime && (
                      <div className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: eventTimeColor || "#6b7280" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151" }}>
                          {displayEventTime}
                        </p>
                      </div>
                    )}

                    {displayVenueName && (
                      <div className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: venueNameColor || "#6b7280" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-xs font-medium mb-0.5 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151" }}>
                            {displayVenueName}
                          </p>
                          {displayVenueAddress && (
                            <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#6b7280" }}>
                              {displayVenueAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* Map Button - Below card */}
            {renderMapButton()}

            {/* Closing Message */}
            <div className="text-center px-2">
              <p className="text-sm mb-2 text-white drop-shadow-md leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || undefined }}>
                {closingMessage}
              </p>
              <h5 className="text-base font-semibold text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || undefined }}>
                {closingText}
              </h5>
            </div>
          </div>
        );

      case 'modern-minimal':
        return (
          <div className="max-w-sm mx-auto relative z-10 px-4">
            {/* Invitation Message - Above card */}
            {invitationMessage && (
              <div className="mb-6 text-center">
                <p className="text-base leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: invitationMessageColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {invitationMessage}
                </p>
              </div>
            )}
            
            {/* Modern Minimal Design - Mobile optimized */}
            <div className="text-center mb-6">
              <div className="inline-block">
                <div className="text-5xl font-bold leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", color: dateDayColor || "#1f2937" }}>
                  {dateCounter.day || "19"}
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)", color: dateMonthYearColor || "#6b7280" }}>
                  {dateCounter.month} {dateCounter.year}
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm rounded-xl p-5 shadow-lg mb-6" style={getCardBackgroundStyle('#ffffff')}>
              <h2 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: "var(--font-dm-sans)", color: titleColor || "#1f2937" }}>
                Resepsi
              </h2>

              <div className="space-y-3 text-center">
                {displayEventTime && (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: eventTimeColor || "#6b7280" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151" }}>
                      {displayEventTime}
                    </p>
                  </div>
                )}

                {displayVenueName && (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: venueNameColor || "#6b7280" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-xs font-medium" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151" }}>
                      {displayVenueName}
                    </p>
                  </div>
                )}

                {displayVenueAddress && (
                  <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#6b7280" }}>
                    {displayVenueAddress}
                  </p>
                )}

              </div>
            </div>

            {/* Map Button - Below card */}
            {renderMapButton()}

            {/* Closing Message */}
            <div className="text-center px-2">
              <p className="text-sm mb-2 text-white drop-shadow-md leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || undefined }}>
                {closingMessage}
              </p>
              <h5 className="text-base font-semibold text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || undefined }}>
                {closingText}
              </h5>
            </div>
          </div>
        );

      case 'timeline-vertical':
        return (
          <div className="max-w-sm mx-auto relative z-10 px-4">
            {/* Invitation Message - Above card */}
            {invitationMessage && (
              <div className="mb-6 text-center">
                <p className="text-base leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: invitationMessageColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {invitationMessage}
                </p>
              </div>
            )}
            
            {/* Timeline Vertical Design - Mobile optimized */}
            <div className="backdrop-blur-sm rounded-2xl shadow-xl p-5 mb-6" style={getCardBackgroundStyle('#ffffff')}>
              {/* Date Badge at Top */}
              <div className="text-center mb-5 pb-4 border-b border-gray-200">
                <div className="inline-block">
                  <div className="text-5xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: dateDayColor || "#1f2937", lineHeight: "1" }}>
                    {dateCounter.day || "19"}
                  </div>
                  <div className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)", color: dateMonthYearColor || "#6b7280" }}>
                    {dateCounter.month} {dateCounter.year}
                  </div>
                </div>
              </div>

              {/* Event Details - Vertical Timeline */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: titleColor || "#1f2937" }}>
                  Resepsi
                </h2>

                {displayEventTime && (
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151" }}>
                        {displayEventTime}
                      </p>
                    </div>
                  </div>
                )}

                {displayVenueName && (
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151" }}>
                        {displayVenueName}
                      </p>
                      {displayVenueAddress && (
                        <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#6b7280" }}>
                          {displayVenueAddress}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Map Button - Below card */}
            {renderMapButton()}

            {/* Closing Message */}
            <div className="text-center px-2">
              {closingMessage.includes('terimakasih') ? (
                <>
                  <p className="text-sm mb-1 text-white drop-shadow-md leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                    {closingMessage.split('terimakasih')[0]?.trim()}
                  </p>
                  <p className="text-sm mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                    terimakasih.
                  </p>
                </>
              ) : (
                <p className="text-sm mb-3 text-white drop-shadow-md leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                  {closingMessage}
                </p>
              )}
              <h5 className="text-base font-semibold text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || "#ffffff" }}>
                {closingText}
              </h5>
            </div>
          </div>
        );

      case 'badge-accent':
        return (
          <div className="max-w-sm mx-auto relative z-10 px-4">
            {/* Invitation Message - Above card */}
            {invitationMessage && (
              <div className="mb-6 text-center">
                <p className="text-base leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: invitationMessageColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {invitationMessage}
                </p>
              </div>
            )}
            
            {/* Badge Accent Design - Mobile optimized */}
            <div className="backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-6">
              {/* Accent Header */}
              <div className="px-5 py-3" style={{ 
                background: cardHeaderColor 
                  ? `linear-gradient(to right, ${cardHeaderColor}, ${cardHeaderColor})` 
                  : 'linear-gradient(to right, #1f2937, #111827)' 
              }}>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-3xl font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-dm-sans)", lineHeight: "1" }}>
                      {dateCounter.day || "19"}
                    </div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {dateCounter.month} {dateCounter.year}
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      Resepsi
                    </h2>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5" style={cardBodyColor ? { backgroundColor: hexToRgba(cardBodyColor, cardOpacity) } : getCardBackgroundStyle('#ffffff')}>
                <div className="space-y-4">
                  {displayEventTime && (
                    <div className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: eventTimeColor || "#6b7280" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151" }}>
                        {displayEventTime}
                      </p>
                    </div>
                  )}

                  {displayVenueName && (
                    <div className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: venueNameColor || "#6b7280" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-0.5 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151" }}>
                          {displayVenueName}
                        </p>
                        {displayVenueAddress && (
                          <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#6b7280" }}>
                            {displayVenueAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Map Button - Below card */}
            {renderMapButton()}

            {/* Closing Message */}
            <div className="text-center px-2">
              {closingMessage.includes('terimakasih') ? (
                <>
                  <p className="text-sm mb-1 text-white drop-shadow-md leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                    {closingMessage.split('terimakasih')[0]?.trim()}
                  </p>
                  <p className="text-sm mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                    terimakasih.
                  </p>
                </>
              ) : (
                <p className="text-sm mb-3 text-white drop-shadow-md leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                  {closingMessage}
                </p>
              )}
              <h5 className="text-base font-semibold text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || "#ffffff" }}>
                {closingText}
              </h5>
            </div>
          </div>
        );

      case 'framed-classic':
  return (
          <div className="max-w-sm mx-auto relative z-10 px-4">
            {/* Invitation Message - Above card */}
            {invitationMessage && (
              <div className="mb-6 text-center">
                <p className="text-base leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: invitationMessageColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {invitationMessage}
                </p>
              </div>
            )}
            
            {/* Framed Classic Design - Mobile optimized */}
            <div className="backdrop-blur-sm rounded-xl shadow-xl border-2 border-gray-200 p-5 mb-6 relative" style={getCardBackgroundStyle('#ffffff')}>
              {/* Decorative corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gray-300"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gray-300"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gray-300"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gray-300"></div>

              {/* Date Section - Top Center */}
              <div className="text-center mb-5 pb-4 border-b-2 border-gray-200">
                <div className="text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: dateDayColor || "#1f2937", lineHeight: "1" }}>
                  {dateCounter.day || "19"}
                </div>
                <div className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-sans)", color: dateMonthYearColor || "#6b7280", letterSpacing: "1px" }}>
                  {dateCounter.month} {dateCounter.year}
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-playfair)", color: titleColor || "#1f2937" }}>
                  Resepsi
                </h2>

                {displayEventTime && (
                  <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: eventTimeColor || "#6b7280" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151" }}>
                      {displayEventTime}
                    </p>
                  </div>
                )}

                {displayVenueName && (
                  <div className="flex items-start gap-3 py-2 border-b border-gray-100">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: venueNameColor || "#6b7280" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-0.5 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151" }}>
                        {displayVenueName}
                      </p>
                      {displayVenueAddress && (
                        <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#6b7280" }}>
                          {displayVenueAddress}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Map Button - Below card */}
            {renderMapButton()}

            {/* Closing Message */}
            <div className="text-center px-2">
              {closingMessage.includes('terimakasih') ? (
                <>
                  <p className="text-sm mb-1 text-white drop-shadow-md leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                    {closingMessage.split('terimakasih')[0]?.trim()}
                  </p>
                  <p className="text-sm mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                    terimakasih.
                  </p>
                </>
              ) : (
                <p className="text-sm mb-3 text-white drop-shadow-md leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || "#ffffff" }}>
                  {closingMessage}
                </p>
              )}
              <h5 className="text-base font-semibold text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || "#ffffff" }}>
                {closingText}
              </h5>
            </div>
          </div>
        );

      default:
        // Fallback to card style - render card design
        return (
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Invitation Message - Above card */}
            {invitationMessage && (
              <div className="mb-6 text-center">
                <p className="text-base leading-relaxed break-words" style={{ fontFamily: "var(--font-dm-sans)", color: invitationMessageColor || "#374151", wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {invitationMessage}
                </p>
              </div>
            )}
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left border-r-0 md:border-r border-gray-200 pr-0 md:pr-8">
              <div className="text-lg mb-2" style={{ fontFamily: "var(--font-dm-sans)", color: dateMonthYearColor || "#4b5563" }}>
                {dateCounter.month} <br /> {dateCounter.year}
              </div>
              <div className="text-6xl md:text-7xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: dateDayColor || "#1f2937" }}>
                {dateCounter.day || "9"}
              </div>
            </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: titleColor || "#1f2937" }}>
              Resepsi
            </h2>
            {displayEventTime && (
              <p className="text-base mb-4 flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151" }}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{displayEventTime}</span>
              </p>
            )}
        {displayVenueName && (
          <p className="text-base mb-2 flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151" }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{displayVenueName}</span>
          </p>
        )}
            {displayVenueAddress && (
              <p className="text-sm mb-6" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#4b5563" }}>
                {displayVenueAddress}
              </p>
            )}
                </div>
          </div>
        </div>

            {/* Map Button - Below card */}
            {renderMapButton()}

            <div className="text-center">
              <p className="text-base mb-4 text-white drop-shadow-lg" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || undefined }}>
            {closingMessage}
          </p>
              <h5 className="text-lg font-semibold text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || undefined }}>
            {closingText}
          </h5>
        </div>
      </div>
        );
    }
  };

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
      <div style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}>
        {renderContent()}
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </section>
  );
}

