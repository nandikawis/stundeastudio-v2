"use client";

interface CoupleNamesProps {
  text?: string;
  fontSize?: string;
  color?: string;
  className?: string;
}

export default function CoupleNames({
  text = "John & Jane",
  fontSize = "36px",
  color = "#c9a87c",
  className = ""
}: CoupleNamesProps) {
  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <h2
        className="font-semibold"
        style={{
          fontSize,
          color,
          fontFamily: "var(--font-playfair)"
        }}
      >
        {text}
      </h2>
    </div>
  );
}

