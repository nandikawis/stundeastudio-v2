"use client";

import { useState, useEffect } from "react";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";

interface CountdownTimerProps extends CurveDividerProps, DecorativeFlowersProps {
  targetDate?: string;
  design?: "simple" | "elegant-card" | "minimal";
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  titleColor?: string;
  valueColor?: string;
  labelColor?: string;
  className?: string;
}

export default function CountdownTimer({
  targetDate,
  design = "elegant-card",
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
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
  titleColor,
  valueColor,
  labelColor,
  className = ""
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
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
  }, [targetDate]);

  // Build background style
  const backgroundStyle: React.CSSProperties = {};
  
  if (backgroundImageUrl) {
    backgroundStyle.backgroundImage = `url(${backgroundImageUrl})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundRepeat = 'no-repeat';
  } else if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor;
  }

  if (!targetDate) {
    return (
      <div 
        className={`text-center py-8 relative ${className}`}
        style={Object.keys(backgroundStyle).length > 0 ? backgroundStyle : undefined}
      >
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
        <p 
          className="text-muted relative z-10"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          No event date set
        </p>
        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </div>
    );
  }

  const timeUnits = [
    { label: "Hari", value: timeLeft.days, show: showDays },
    { label: "Jam", value: timeLeft.hours, show: showHours },
    { label: "Menit", value: timeLeft.minutes, show: showMinutes },
    { label: "Detik", value: timeLeft.seconds, show: showSeconds }
  ].filter(unit => unit.show);

  if (design === "elegant-card") {
    return (
      <div 
        className={`py-12 px-4 w-full relative ${className}`}
        style={Object.keys(backgroundStyle).length > 0 ? backgroundStyle : undefined}
      >
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
          className="max-w-4xl mx-auto relative z-10"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          <h3 className="text-center text-xl font-semibold mb-8" style={{ fontFamily: "var(--font-playfair)", color: titleColor || "#1f2937" }}>
            Menuju Hari Bahagia
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeUnits.map((unit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-border p-6 text-center shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: valueColor || "#1f2937" }}>
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-sm uppercase tracking-wider" style={{ color: labelColor || "#6b7280" }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </div>
    );
  }

  if (design === "minimal") {
    return (
      <div 
        className={`text-center py-8 px-4 relative ${className}`}
        style={Object.keys(backgroundStyle).length > 0 ? backgroundStyle : undefined}
      >
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
          className="inline-flex items-center gap-4 relative z-10"
          style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
        >
          {timeUnits.map((unit, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: valueColor || "#1f2937" }}>
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-xs" style={{ color: labelColor || "#6b7280" }}>{unit.label}</span>
            </div>
          ))}
        </div>
        {/* Bottom Curve Divider */}
        {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
      </div>
    );
  }

  // Simple design (default)
  return (
    <div 
      className={`text-center py-8 px-4 relative ${className}`}
      style={Object.keys(backgroundStyle).length > 0 ? backgroundStyle : undefined}
    >
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
        className="flex items-center justify-center gap-6 relative z-10"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {timeUnits.map((unit, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: valueColor || "#1f2937" }}>
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-sm" style={{ color: labelColor || "#6b7280" }}>{unit.label}</span>
          </div>
        ))}
      </div>
      {/* Bottom Curve Divider */}
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </div>
  );
}

