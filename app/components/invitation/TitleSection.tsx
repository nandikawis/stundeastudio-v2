"use client";

interface TitleSectionProps {
  text?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  className?: string;
}

export default function TitleSection({
  text = "Kami Mengundang Anda",
  fontSize = "48px",
  color = "#2d2d2d",
  fontWeight = "bold",
  className = ""
}: TitleSectionProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <h1
        className="font-bold"
        style={{
          fontSize,
          color,
          fontWeight,
          fontFamily: "var(--font-playfair)"
        }}
      >
        {text}
      </h1>
    </div>
  );
}

