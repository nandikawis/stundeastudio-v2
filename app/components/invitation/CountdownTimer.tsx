"use client";

import { useState, useEffect } from "react";
import { renderTopCurve, renderBottomCurve, CurveDividerProps } from "../../lib/curveHelpers";
import { renderDecorativeFlowers, getFlowerMargin, DecorativeFlowersProps } from "../../lib/flowerHelpers";
import CountdownDisplay, { CountdownDesign } from "./CountdownDisplay";
import type { TextStyleFields } from "../../lib/textStyle";

interface CountdownTimerProps extends CurveDividerProps, DecorativeFlowersProps,
  TextStyleFields<"value">,
  TextStyleFields<"label">,
  TextStyleFields<"title"> {
  targetDate?: string;
  design?: CountdownDesign;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  titleColor?: string;
  valueColor?: string;
  labelColor?: string;
  cardColor?: string;
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
  flowerStyle = "beage",
  titleColor,
  valueColor,
  labelColor,
  cardColor,
  className = "",
  valueFont,
  valueSize,
  valueEmphasis,
  labelFont,
  labelSize,
  labelEmphasis,
  titleFont,
  titleSize,
  titleEmphasis,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const backgroundStyle: React.CSSProperties = {};

  if (backgroundImageUrl) {
    backgroundStyle.backgroundImage = `url(${backgroundImageUrl})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
    backgroundStyle.backgroundRepeat = "no-repeat";
  } else if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor;
  }

  const timeUnits = [
    { label: "Hari", value: timeLeft.days, show: showDays },
    { label: "Jam", value: timeLeft.hours, show: showHours },
    { label: "Menit", value: timeLeft.minutes, show: showMinutes },
    { label: "Detik", value: timeLeft.seconds, show: showSeconds },
  ]
    .filter((unit) => unit.show)
    .map(({ label, value }) => ({ label, value }));

  return (
    <div
      className={`relative w-full px-4 py-12 ${className}`}
      style={Object.keys(backgroundStyle).length > 0 ? backgroundStyle : undefined}
    >
      {backgroundImageUrl && backgroundColor && (
        <div className="absolute inset-0" style={{ backgroundColor, opacity: 0.5 }} />
      )}
      {renderTopCurve({ showTopCurve, topCurveColor, topCurveStyle })}
      {renderDecorativeFlowers({ decorativeFlowers, flowerStyle, showTopCurve, showBottomCurve })}
      <div
        className="relative z-10"
        style={getFlowerMargin({ decorativeFlowers, showTopCurve, showBottomCurve })}
      >
        {!targetDate ? (
          <p className="py-8 text-center text-muted">No event date set</p>
        ) : (
          <CountdownDisplay
            units={timeUnits}
            design={design}
            valueColor={valueColor}
            labelColor={labelColor}
            cardColor={cardColor}
            titleColor={titleColor}
            valueFont={valueFont}
            valueSize={valueSize}
            valueEmphasis={valueEmphasis}
            labelFont={labelFont}
            labelSize={labelSize}
            labelEmphasis={labelEmphasis}
            titleFont={titleFont}
            titleSize={titleSize}
            titleEmphasis={titleEmphasis}
          />
        )}
      </div>
      {renderBottomCurve({ showBottomCurve, bottomCurveColor, bottomCurveStyle })}
    </div>
  );
}
