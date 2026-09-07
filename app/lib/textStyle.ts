import type { CSSProperties } from "react";

export type TextEmphasis = "" | "normal" | "bold" | "italic" | "bold-italic";

export const INVITE_FONTS = [
  { id: "", label: "Default", css: "" },
  { id: "playfair", label: "Playfair Display", css: "var(--font-playfair)" },
  { id: "cormorant", label: "Cormorant Garamond", css: "var(--font-cormorant)" },
  { id: "eb-garamond", label: "EB Garamond", css: "var(--font-eb-garamond)" },
  { id: "libre-baskerville", label: "Libre Baskerville", css: "var(--font-libre-baskerville)" },
  { id: "lora", label: "Lora", css: "var(--font-lora)" },
  { id: "spectral", label: "Spectral", css: "var(--font-spectral)" },
  { id: "cardo", label: "Cardo", css: "var(--font-cardo)" },
  { id: "cinzel", label: "Cinzel", css: "var(--font-cinzel)" },
  { id: "great-vibes", label: "Great Vibes", css: "var(--font-great-vibes)" },
  { id: "allura", label: "Allura", css: "var(--font-allura)" },
  { id: "parisienne", label: "Parisienne", css: "var(--font-parisienne)" },
  { id: "pinyon", label: "Pinyon Script", css: "var(--font-pinyon)" },
  { id: "dancing-script", label: "Dancing Script", css: "var(--font-dancing-script)" },
  { id: "sacramento", label: "Sacramento", css: "var(--font-sacramento)" },
  { id: "dm-sans", label: "DM Sans", css: "var(--font-dm-sans)" },
  { id: "montserrat", label: "Montserrat", css: "var(--font-montserrat)" },
  { id: "josefin", label: "Josefin Sans", css: "var(--font-josefin)" },
  { id: "outfit", label: "Outfit", css: "var(--font-outfit)" },
] as const;

export const INVITE_FONT_SIZE_MIN = 8;
export const INVITE_FONT_SIZE_MAX = 96;
export const INVITE_FONT_SIZE_STEP = 1;

export function textAlignClass(align?: string) {
  switch (align) {
    case "left":
      return "w-full self-stretch text-left";
    case "right":
      return "w-full self-stretch text-right";
    case "justify":
      return "w-full self-stretch text-justify";
    default:
      return "w-full self-stretch text-center";
  }
}

export type TextStyleFields<P extends string> = {
  [K in `${P}Font`]?: string;
} & {
  [K in `${P}Size`]?: number | string;
} & {
  [K in `${P}Emphasis`]?: string;
};

const FONT_CSS: Record<string, string> = Object.fromEntries(
  INVITE_FONTS.filter((font) => font.id).map((font) => [font.id, font.css])
);

export function textStyle(opts: {
  font?: string;
  size?: number | string;
  emphasis?: string;
  fallbackFont?: string;
  color?: string;
  extra?: CSSProperties;
}): CSSProperties {
  const style: CSSProperties = { ...(opts.extra || {}) };

  if (opts.color) style.color = opts.color;

  const chosen = opts.font ? FONT_CSS[opts.font] : "";
  const family = chosen || opts.fallbackFont;
  if (family) style.fontFamily = family;

  if (opts.size !== undefined && opts.size !== null && opts.size !== "") {
    const n = typeof opts.size === "number" ? opts.size : Number(opts.size);
    if (!Number.isNaN(n) && n > 0) style.fontSize = `${n}px`;
  }

  if (opts.emphasis === "normal") {
    style.fontWeight = 400;
    style.fontStyle = "normal";
  } else if (opts.emphasis === "bold") {
    style.fontWeight = 700;
    style.fontStyle = "normal";
  } else if (opts.emphasis === "italic") {
    style.fontWeight = 400;
    style.fontStyle = "italic";
  } else if (opts.emphasis === "bold-italic") {
    style.fontWeight = 700;
    style.fontStyle = "italic";
  }

  return style;
}
