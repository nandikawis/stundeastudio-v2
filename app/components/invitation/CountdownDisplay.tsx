import { textStyle, type TextStyleFields } from "../../lib/textStyle";

export type CountdownDesign = "simple" | "elegant-card" | "minimal" | "rule" | "banner" | "editorial";

export type CountdownUnit = {
  label: string;
  value: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

interface CountdownDisplayProps extends
  TextStyleFields<"value">,
  TextStyleFields<"label">,
  TextStyleFields<"title"> {
  units: CountdownUnit[];
  design?: CountdownDesign;
  valueColor?: string;
  labelColor?: string;
  cardColor?: string;
  titleColor?: string;
  className?: string;
}

export default function CountdownDisplay({
  units,
  design = "elegant-card",
  valueColor,
  labelColor,
  cardColor,
  titleColor,
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
}: CountdownDisplayProps) {
  const valueTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: valueFont, size: valueSize, emphasis: valueEmphasis, fallbackFont, color });
  const labelTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: labelFont, size: labelSize, emphasis: labelEmphasis, fallbackFont, color });
  const titleTx = (fallbackFont: string, color?: string) =>
    textStyle({ font: titleFont, size: titleSize, emphasis: titleEmphasis, fallbackFont, color });
  if (design === "elegant-card") {
    return (
      <div className={`mx-auto grid max-w-sm grid-cols-4 gap-2 px-1 ${className}`}>
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-sm border border-[#c4a574]/35 px-1.5 py-3 text-center"
            style={{ backgroundColor: cardColor || "#ffffff" }}
          >
            <div
              className="text-[1.35rem] font-medium leading-none tracking-[-0.02em] tabular-nums"
              style={valueTx("var(--font-playfair)", valueColor || "#1f1d1a")}
            >
              {pad(unit.value)}
            </div>
            <div
              className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em]"
              style={labelTx("var(--font-dm-sans)", labelColor || "#c4a574")}
            >
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (design === "minimal") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        {units.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span
                className="text-[1.15rem] font-medium tabular-nums leading-none"
                style={valueTx("var(--font-playfair)", valueColor || "#1f1d1a")}
              >
                {pad(unit.value)}
              </span>
              <span
                className="mt-1.5 text-[9px] uppercase tracking-[0.16em]"
                style={labelTx("var(--font-dm-sans)", labelColor || "#8a8178")}
              >
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 && (
              <span className="mb-4 text-[13px] text-[#c4a574]/70" aria-hidden>
                :
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (design === "rule") {
    return (
      <div className={`flex items-stretch justify-center ${className}`}>
        {units.map((unit, index) => (
          <div key={unit.label} className="flex">
            {index > 0 && <div className="mx-3 w-px self-stretch bg-[#c4a574]/45" />}
            <div className="flex flex-col items-center px-1">
              <span
                className="text-[1.5rem] font-medium tabular-nums leading-none tracking-[-0.02em]"
                style={valueTx("var(--font-playfair)", valueColor || "#1f1d1a")}
              >
                {pad(unit.value)}
              </span>
              <span
                className="mt-2 text-[9px] uppercase tracking-[0.2em]"
                style={labelTx("var(--font-dm-sans)", labelColor || "#8a8178")}
              >
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (design === "banner") {
    return (
      <div
        className={`mx-auto flex max-w-sm items-stretch justify-center border border-[#c4a574]/45 px-2 py-4 ${className}`}
        style={{ backgroundColor: cardColor || "#ffffff" }}
      >
        {units.map((unit, index) => (
          <div key={unit.label} className="flex min-w-0 flex-1">
            {index > 0 && <div className="w-px self-stretch bg-[#c4a574]/35" />}
            <div className="flex flex-1 flex-col items-center px-1">
              <span
                className="text-[1.4rem] font-medium tabular-nums leading-none tracking-[-0.02em]"
                style={valueTx("var(--font-playfair)", valueColor || "#1f1d1a")}
              >
                {pad(unit.value)}
              </span>
              <span
                className="mt-2 text-[9px] uppercase tracking-[0.18em]"
                style={labelTx("var(--font-dm-sans)", labelColor || "#8a8178")}
              >
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (design === "editorial") {
    return (
      <div className={`text-center ${className}`}>
        <p
          className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em]"
          style={titleTx("var(--font-dm-sans)", titleColor || "#c4a574")}
        >
          Menuju Hari Bahagia
        </p>
        <div className="flex items-end justify-center gap-3">
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-end gap-3">
              <div className="flex flex-col items-center">
                <span
                  className="text-[1.85rem] font-medium italic tabular-nums leading-none tracking-[-0.03em]"
                  style={valueTx("var(--font-playfair)", valueColor || "#1f1d1a")}
                >
                  {pad(unit.value)}
                </span>
                <span
                  className="mt-2 text-[9px] uppercase tracking-[0.18em]"
                  style={labelTx("var(--font-dm-sans)", labelColor || "#8a8178")}
                >
                  {unit.label}
                </span>
              </div>
              {index < units.length - 1 && (
                <span className="mb-6 text-[12px] text-[#c4a574]" aria-hidden>
                  /
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-5 h-px w-10 bg-[#c4a574]" />
      </div>
    );
  }

  return (
    <div className={`flex items-end justify-center gap-3 ${className}`}>
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-end gap-3">
          <div className="flex flex-col items-center">
            <span
              className="text-[2rem] font-medium tabular-nums leading-none tracking-[-0.03em]"
              style={valueTx("var(--font-playfair)", valueColor || "#1f1d1a")}
            >
              {pad(unit.value)}
            </span>
            <span
              className="mt-2 text-[10px] uppercase tracking-[0.16em]"
              style={labelTx("var(--font-dm-sans)", labelColor || "#8a8178")}
            >
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="mb-6 text-[1.25rem] text-[#c4a574]/80" aria-hidden>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
