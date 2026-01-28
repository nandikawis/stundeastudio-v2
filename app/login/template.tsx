"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation when component mounts
      gsap.fromTo(
        elementRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    });

    // Cleanup
    return () => ctx.revert();
  }, []);

  return (
    <div ref={elementRef} className="w-full">
      {children}
    </div>
  );
} 