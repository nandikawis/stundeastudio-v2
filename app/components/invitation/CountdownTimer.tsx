"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate?: string;
  design?: "simple" | "elegant-card" | "minimal";
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  backgroundColor?: string;
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

  if (!targetDate) {
    return (
      <div 
        className={`text-center py-8 ${className}`}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <p className="text-muted">No event date set</p>
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
        className={`py-12 px-4 w-full ${className}`}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <div className="max-w-4xl mx-auto">
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
      </div>
    );
  }

  if (design === "minimal") {
    return (
      <div 
        className={`text-center py-8 px-4 ${className}`}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <div className="inline-flex items-center gap-4">
          {timeUnits.map((unit, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: valueColor || "#1f2937" }}>
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-xs" style={{ color: labelColor || "#6b7280" }}>{unit.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Simple design (default)
  return (
    <div 
      className={`text-center py-8 px-4 ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="flex items-center justify-center gap-6">
        {timeUnits.map((unit, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: valueColor || "#1f2937" }}>
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-sm" style={{ color: labelColor || "#6b7280" }}>{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

