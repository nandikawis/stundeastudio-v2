"use client";

import { useState, useEffect } from "react";

interface EventDetailsProps {
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueCoordinates?: { lat: number; lng: number };
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
  className?: string;
}

export default function EventDetails({
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  venueCoordinates,
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

  return (
    <section 
      className={`py-12 px-6 w-full ${!backgroundColor ? 'bg-gradient-to-b from-white via-gray-50 to-white' : ''} ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Date Counter */}
          <div className="text-center">
            <div className="mb-4">
              <div className="text-lg mb-2" style={{ fontFamily: "var(--font-dm-sans)", color: dateMonthYearColor || "#4b5563" }}>
                {dateCounter.month} <br /> {dateCounter.year}
              </div>
              <div className="text-6xl md:text-7xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: dateDayColor || "#1f2937" }}>
                {dateCounter.day || "9"}
              </div>
            </div>
          </div>

          {/* Right Column - Event Details */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: titleColor || "#1f2937" }}>
              Resepsi
            </h2>

            {/* Event Time */}
            {displayEventTime && (
              <p className="text-base mb-4 flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "var(--font-dm-sans)", color: eventTimeColor || "#374151" }}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{displayEventTime}</span>
              </p>
            )}

        {/* Venue Name */}
        {displayVenueName && (
          <p className="text-base mb-2 flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "var(--font-dm-sans)", color: venueNameColor || "#374151" }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{displayVenueName}</span>
          </p>
        )}

            {/* Venue Address */}
            {displayVenueAddress && (
              <p className="text-sm mb-6" style={{ fontFamily: "var(--font-dm-sans)", color: venueAddressColor || "#4b5563" }}>
                {displayVenueAddress}
              </p>
            )}

            {/* Map Button */}
            {venueCoordinates && (
              <a
                href={`https://maps.google.com/?q=${venueCoordinates.lat},${venueCoordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all text-sm"
              >
                <span>Petunjuk Arah</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Closing Message */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-700 mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: closingMessageColor || undefined }}>
            {closingMessage}
          </p>
          <h5 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "var(--font-playfair)", color: closingTextColor || undefined }}>
            {closingText}
          </h5>
        </div>
      </div>
    </section>
  );
}

