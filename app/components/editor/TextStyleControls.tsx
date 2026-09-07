"use client";

import type { ReactNode } from "react";
import {
  INVITE_FONT_SIZE_MAX,
  INVITE_FONT_SIZE_MIN,
  INVITE_FONT_SIZE_STEP,
  INVITE_FONTS,
} from "../../lib/textStyle";

interface TextStyleControlsProps {
  prefix: string;
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
  alignKey?: string | false;
}

const NO_ALIGN = new Set([
  "dateMonthYear",
  "dateDay",
  "eventTime",
  "venueName",
  "venueAddress",
  "countdownTitle",
  "countdownValue",
  "countdownLabel",
  "value",
  "label",
]);

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-primary/70 transition-[transform,background-color,color] duration-100 ease-out hover:bg-[#c4a574]/12 hover:text-primary active:scale-[0.97] disabled:opacity-35";
const iconBtnOn = "bg-[#c4a574]/18 text-primary";

function IconBtn({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`${iconBtn} ${active ? iconBtnOn : ""}`}
    >
      {children}
    </button>
  );
}

export default function TextStyleControls({
  prefix,
  data,
  onUpdate,
  alignKey,
}: TextStyleControlsProps) {
  const font = String(data[`${prefix}Font`] || "");
  const sizeRaw = data[`${prefix}Size`];
  const size =
    sizeRaw === undefined || sizeRaw === null || sizeRaw === ""
      ? null
      : Number(sizeRaw);
  const hasSize = size !== null && !Number.isNaN(size) && size > 0;
  const emphasis = String(data[`${prefix}Emphasis`] || "");
  const boldOn = emphasis === "bold" || emphasis === "bold-italic";
  const italicOn = emphasis === "italic" || emphasis === "bold-italic";

  const resolvedAlignKey =
    alignKey === false
      ? null
      : alignKey ||
        (prefix === "guestLocation" ? "guestBlockAlign" : `${prefix}Align`);
  const showAlign = Boolean(resolvedAlignKey) && !NO_ALIGN.has(prefix);
  const align = String((resolvedAlignKey && data[resolvedAlignKey]) || "center");

  const setEmphasis = (nextBold: boolean, nextItalic: boolean) => {
    if (nextBold && nextItalic) onUpdate(`${prefix}Emphasis`, "bold-italic");
    else if (nextBold) onUpdate(`${prefix}Emphasis`, "bold");
    else if (nextItalic) onUpdate(`${prefix}Emphasis`, "italic");
    else onUpdate(`${prefix}Emphasis`, "");
  };

  const setSize = (next: number | "") => {
    if (next === "") {
      onUpdate(`${prefix}Size`, "");
      return;
    }
    const clamped = Math.min(INVITE_FONT_SIZE_MAX, Math.max(INVITE_FONT_SIZE_MIN, next));
    onUpdate(`${prefix}Size`, clamped);
  };

  const bump = (dir: 1 | -1) => {
    const base = hasSize ? size : 16;
    setSize(base + dir * INVITE_FONT_SIZE_STEP);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-xs text-muted">Font</span>
        <select
          value={font}
          onChange={(e) => onUpdate(`${prefix}Font`, e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-border/60 bg-background px-2 py-1.5 text-xs"
          style={
            INVITE_FONTS.find((item) => item.id === font)?.css
              ? { fontFamily: INVITE_FONTS.find((item) => item.id === font)?.css }
              : undefined
          }
        >
          {INVITE_FONTS.map((option) => (
            <option
              key={option.id || "default"}
              value={option.id}
              style={option.css ? { fontFamily: option.css } : undefined}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-xs text-muted">Size</span>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <button
            type="button"
            aria-label="Decrease size"
            onClick={() => bump(-1)}
            className={iconBtn}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M5 12h14" />
            </svg>
          </button>
          <input
            type="number"
            min={INVITE_FONT_SIZE_MIN}
            max={INVITE_FONT_SIZE_MAX}
            inputMode="numeric"
            placeholder="Auto"
            value={hasSize ? size : ""}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") setSize("");
              else setSize(Number(raw));
            }}
            className="h-8 w-16 rounded-md border border-border/60 bg-background text-center text-xs tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label="Increase size"
            onClick={() => bump(1)}
            className={iconBtn}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
          {hasSize && (
            <span className="text-[10px] text-muted">px</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-xs text-muted">Style</span>
        <div className="flex rounded-md border border-border/60 p-0.5">
          <IconBtn label="Bold" active={boldOn} onClick={() => setEmphasis(!boldOn, italicOn)}>
            <span className="text-[13px] font-bold leading-none">B</span>
          </IconBtn>
          <IconBtn label="Italic" active={italicOn} onClick={() => setEmphasis(boldOn, !italicOn)}>
            <span className="text-[13px] italic leading-none">I</span>
          </IconBtn>
        </div>
      </div>

      {showAlign && resolvedAlignKey && (
        <div className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-xs text-muted">Align</span>
          <div className="flex rounded-md border border-border/60 p-0.5">
            <IconBtn
              label="Align left"
              active={align === "left"}
              onClick={() => onUpdate(resolvedAlignKey, "left")}
            >
              <AlignLeftIcon />
            </IconBtn>
            <IconBtn
              label="Align center"
              active={align === "center"}
              onClick={() => onUpdate(resolvedAlignKey, "center")}
            >
              <AlignCenterIcon />
            </IconBtn>
            <IconBtn
              label="Align right"
              active={align === "right"}
              onClick={() => onUpdate(resolvedAlignKey, "right")}
            >
              <AlignRightIcon />
            </IconBtn>
            <IconBtn
              label="Justify"
              active={align === "justify"}
              onClick={() => onUpdate(resolvedAlignKey, "justify")}
            >
              <AlignJustifyIcon />
            </IconBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function AlignLeftIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M4 6h16M4 12h10M4 18h14" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M4 6h16M7 12h10M5 18h14" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M4 6h16M10 12h10M6 18h14" />
    </svg>
  );
}

function AlignJustifyIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
