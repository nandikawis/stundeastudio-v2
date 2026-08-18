"use client";

import { useEffect, useState } from "react";
import MoltenMetal from "@/components/MoltenMetal";

/**
 * Hero WebGL background. Isolated client island so Navbar (sibling)
 * is not re-rendered by this effect loop.
 */
export default function HeroMoltenBg() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 30%, #e8e8e8, #f7f6f3 55%, #d4d4d4)",
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <MoltenMetal
        color1="#ffffff"
        color2="#000000"
        color3="#ffffff"
        colorMode="molten"
        speed={0.1}
        scale={2}
        detail={8}
        glow={1.6}
        coreSize={0.15}
        swirl={1}
        fold={-0.2}
        blackPoint={0.02}
        brightness={1.3}
        opacity={1}
        grain={false}
        grainIntensity={0.05}
        mouseInteraction={false}
        mouseStrength={0}
        className="h-full w-full"
      />
      {/* Soft veil so type stays readable over bright metal */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 246, 243, 0) 0%, rgba(247, 246, 243, 0) 55%, rgba(247, 246, 243, 0) 100%)",
        }}
      />
    </div>
  );
}
