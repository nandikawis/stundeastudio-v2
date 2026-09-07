"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type PeekImage = {
  url: string;
  alt?: string;
};

const SLIDE_MS = 280;
const SLIDE_EASE = "cubic-bezier(0.77, 0, 0.175, 1)";
const AUTOPLAY_MS = 5000;

function wrap(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function realFromTrack(trackIndex: number, length: number) {
  if (length <= 1) return 0;
  if (trackIndex <= 0) return length - 1;
  if (trackIndex >= length + 1) return 0;
  return trackIndex - 1;
}

interface PeekCarouselProps {
  images: PeekImage[];
  index: number;
  onIndexChange: (index: number) => void;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function PeekCarousel({
  images,
  index,
  onIndexChange,
  autoplay = true,
  autoplayInterval = 5000,
}: PeekCarouselProps) {
  const n = images.length;
  const looped = n > 1 ? [images[n - 1], ...images, images[0]] : images;
  const viewportRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const axisRef = useRef<"h" | "v" | null>(null);
  const dragXRef = useRef(0);
  const trackIndexRef = useRef(n > 1 ? index + 1 : 0);
  const lockedRef = useRef(false);
  const internalUpdateRef = useRef(false);
  const commitTrackRef = useRef<(nextTrack: number) => void>(() => {});

  const [width, setWidth] = useState(0);
  const [trackIndex, setTrackIndex] = useState(n > 1 ? index + 1 : 0);
  const [dragX, setDragX] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  trackIndexRef.current = trackIndex;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slideW = width * 0.68;
  const gap = width * 0.028;
  const peekPad = Math.max(0, (width - slideW) / 2);
  const step = slideW + gap;

  const commitTrack = useCallback(
    (nextTrack: number) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      internalUpdateRef.current = true;
      setAnimate(!reduceMotion);
      setTrackIndex(nextTrack);
      onIndexChange(realFromTrack(nextTrack, n));
      if (reduceMotion) {
        lockedRef.current = false;
        if (nextTrack === 0) setTrackIndex(n);
        else if (nextTrack === n + 1) setTrackIndex(1);
      }
    },
    [n, onIndexChange, reduceMotion]
  );
  commitTrackRef.current = commitTrack;

  useEffect(() => {
    if (n <= 1) {
      setTrackIndex(0);
      return;
    }
    if (internalUpdateRef.current) {
      internalUpdateRef.current = false;
      return;
    }
    const displayed = realFromTrack(trackIndexRef.current, n);
    if (displayed === index) return;
    setAnimate(!reduceMotion);
    const forward = wrap(displayed + 1, n) === index;
    const backward = wrap(displayed - 1, n) === index;
    if (forward) setTrackIndex((current) => current + 1);
    else if (backward) setTrackIndex((current) => current - 1);
    else setTrackIndex(index + 1);
  }, [index, n, reduceMotion]);

  const finishLoopJump = useCallback(() => {
    if (n <= 1) {
      lockedRef.current = false;
      return;
    }
    const current = trackIndexRef.current;
    if (current === 0) {
      setAnimate(false);
      setTrackIndex(n);
    } else if (current === n + 1) {
      setAnimate(false);
      setTrackIndex(1);
    }
    lockedRef.current = false;
  }, [n]);

  useEffect(() => {
    if (!autoplay || n <= 1 || dragging) return;
    const timer = window.setTimeout(() => {
      commitTrackRef.current(trackIndexRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, n, dragging, trackIndex]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (n <= 1) return;
    draggingRef.current = true;
    axisRef.current = null;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    dragXRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || n <= 1) return;
    const dx = event.clientX - startXRef.current;
    const dy = event.clientY - startYRef.current;
    if (!axisRef.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axisRef.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      if (axisRef.current === "h") {
        setDragging(true);
        setAnimate(false);
      }
    }
    if (axisRef.current !== "h") return;
    dragXRef.current = dx;
    setDragX(dx);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const wasHorizontal = axisRef.current === "h";
    axisRef.current = null;
    setDragging(false);

    if (!wasHorizontal) {
      setDragX(0);
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      if (x < bounds.width * 0.18) commitTrack(trackIndexRef.current - 1);
      else if (x > bounds.width * 0.82) commitTrack(trackIndexRef.current + 1);
      return;
    }

    const threshold = Math.max(40, step * 0.18);
    const dx = dragXRef.current;
    dragXRef.current = 0;
    setDragX(0);

    if (dx <= -threshold) {
      commitTrack(trackIndexRef.current + 1);
    } else if (dx >= threshold) {
      commitTrack(trackIndexRef.current - 1);
    } else {
      setAnimate(true);
    }
  };

  if (n === 0) return null;

  const offset = reduceMotion ? peekPad - (n > 1 ? index + 1 : 0) * step : peekPad - trackIndex * step + dragX;
  const progress = reduceMotion || step === 0 ? (n > 1 ? index + 1 : 0) : trackIndex - dragX / (step || 1);

  return (
    <div
      ref={viewportRef}
      className="relative h-[300px] w-full cursor-grab overflow-hidden select-none active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="flex h-full items-center will-change-transform"
        style={{
          gap,
          transform: `translate3d(${offset}px, 0, 0)`,
          transition:
            animate && !dragging && !reduceMotion
              ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}`
              : "none",
        }}
        onTransitionEnd={(event) => {
          if (event.propertyName !== "transform") return;
          finishLoopJump();
        }}
      >
        {looped.map((image, i) => {
          const dist = Math.abs(i - progress);
          const isActive = dist < 0.5;
          const scale = reduceMotion ? (i === (n > 1 ? index + 1 : 0) ? 1 : 0.86) : 1 - Math.min(dist, 1) * 0.14;
          const opacity = reduceMotion ? (isActive ? 1 : 0.45) : 1 - Math.min(dist, 1) * 0.5;
          return (
            <div
              key={`${image.url}-${i}`}
              className="relative h-[86%] shrink-0 overflow-hidden rounded-sm"
              style={{
                width: slideW || "68%",
                transform: `scale(${scale})`,
                opacity,
                border: isActive ? "1px solid rgba(196,165,116,0.45)" : "1px solid transparent",
                boxShadow: isActive ? "0 16px 36px rgba(40,32,24,0.16)" : "none",
                transition:
                  animate && !dragging && !reduceMotion
                    ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}, opacity ${SLIDE_MS}ms ${SLIDE_EASE}`
                    : "none",
              }}
            >
              <Image
                src={image.url}
                alt={image.alt || `Image ${realFromTrack(i, n) + 1}`}
                fill
                className="pointer-events-none object-cover"
                sizes="70vw"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
