"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 100);
        ticking.current = false;
      });
    };
    onScroll(); // initial check
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rounded corners: pill before scroll, square after
  const borderRadius = scrolled ? "0px" : "999px";
  const borderRadiusMd = scrolled ? "0px" : "999px";

  // Width animation: narrow pill to full width
  const targetWidth = scrolled ? "100%" : "clamp(22rem, 70vw, 56rem)";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Breathing room so the pill looks floating at the top */}
      <div
        className={[
          "transition-[padding] duration-500",
          scrolled ? "py-0" : "py-8 md:py-12",
        ].join(" ")}
      >
        {/* Conditional page gutters: remove when scrolled for edge-to-edge */}
        <div
          className={[
            "transition-[padding] duration-500",
            scrolled ? "px-0" : "px-3 md:px-6",
          ].join(" ")}
        >
          <div className="w-full">
            {/* Animated BAR */}
            <div
              className={[
                "overflow-hidden mx-auto",
                // glass morphism look
                "backdrop-blur-xl backdrop-saturate-150 border border-white/20",
                scrolled
                  ? "bg-gradient-to-b from-white/80 to-white/70 shadow-md shadow-black/10 md:px-24 md:py-4 lg:px-24 lg:py-4"
                  : "bg-gradient-to-b from-white/60 to-white/40 shadow-xl shadow-black/15",
                // smooth animation
                "transition-[width,border-radius,background-color,box-shadow,padding] duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                "will-change-[width,border-radius]",
                "px-6 py-3",
              ].join(" ")}
              style={
                {
                  width: targetWidth,
                  borderRadius: borderRadius,
                  borderTopLeftRadius: borderRadius,
                  borderTopRightRadius: borderRadius,
                  borderBottomLeftRadius: borderRadius,
                  borderBottomRightRadius: borderRadius,
                  transform: "translateZ(0)",
                  contain: "layout style paint",
                } as React.CSSProperties
              }
            >
              <div className="flex items-center justify-between gap-6">
                {/* Logo + Brand */}
                <Link href="/" className="flex items-center gap-3 whitespace-nowrap group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span
                      className="text-white font-bold text-sm md:text-base"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      S
                    </span>
                  </div>
                  <span
                    className="text-base md:text-lg font-semibold text-primary group-hover:text-accent-dark transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Stundea Studio
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                  <Link
                    href="/"
                    className="text-primary/80 hover:text-primary text-sm font-medium transition-colors duration-200"
                  >
                    Beranda
                  </Link>
                  <Link
                    href="/templates"
                    className="text-primary/80 hover:text-primary text-sm font-medium transition-colors duration-200"
                  >
                    Template
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-primary/80 hover:text-primary text-sm font-medium transition-colors duration-200"
                  >
                    Harga
                  </Link>
                  <Link
                    href="#contact"
                    className="text-primary/80 hover:text-primary text-sm font-medium transition-colors duration-200"
                  >
                    Kontak
                  </Link>

                  {/* CTA Button */}
                  <Link
                    href="/pricing"
                    className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-all hover:shadow-lg hover:shadow-primary/20"
                  >
                    Mulai Sekarang
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden text-primary hover:text-primary-light focus:outline-none"
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {menuOpen ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* End Animated BAR */}

            {/* Mobile Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="md:hidden mx-3 mt-2 rounded-xl border border-white/20 bg-white/80 backdrop-blur-xl overflow-hidden"
                >
                  <div className="p-4 space-y-2">
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-3 rounded-lg text-primary hover:text-accent-dark hover:bg-accent/5 transition-colors font-medium"
                    >
                      Beranda
                    </Link>
                    <Link
                      href="/templates"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-3 rounded-lg text-primary hover:text-accent-dark hover:bg-accent/5 transition-colors font-medium"
                    >
                      Template
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-3 rounded-lg text-primary hover:text-accent-dark hover:bg-accent/5 transition-colors font-medium"
                    >
                      Harga
                    </Link>
                    <Link
                      href="#contact"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-3 rounded-lg text-primary hover:text-accent-dark hover:bg-accent/5 transition-colors font-medium"
                    >
                      Kontak
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-3 mt-2 text-center bg-primary text-white rounded-full font-medium hover:bg-primary-light transition-colors"
                    >
                      Mulai Sekarang
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

