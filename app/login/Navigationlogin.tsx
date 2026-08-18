"use client";

import React, { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    text: "Tenang, elegan, dan tamu langsung paham. Kami hemat tanpa mengurangi kesan.",
    author: "Anisa & Rizky",
    role: "Jakarta",
  },
  {
    id: 2,
    text: "Template-nya rapi, editornya jelas. Undangan klien saya siap dibagikan dalam hitungan jam.",
    author: "John D.",
    role: "Photographer",
  },
  {
    id: 3,
    text: "RSVP dan link QR membuat hari H jauh lebih tenang. Intuitif dan efisien.",
    author: "Elly",
    role: "Client",
  },
];

export default function NavigationLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] =
    useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="landing-root flex h-screen overflow-hidden bg-[#f7f6f3] text-primary">
        {/* Form — left */}
        <main className="h-full w-full overflow-y-auto bg-[#f7f6f3] md:w-[60%]">
          {children}
        </main>

        {/* Brand panel — right */}
        <aside className="relative hidden h-full w-[40%] overflow-hidden rounded-bl-3xl rounded-tl-3xl border-l border-primary/10 bg-primary text-white md:block">
          <div className="flex h-full flex-col px-12 py-16 lg:px-16 lg:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
              Stundea Studio
            </p>
            <h1
              className="mt-5 max-w-[12ch] text-[clamp(2rem,3.5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Undangan digital dengan rasa.
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50">
              Masuk untuk mengelola undangan, tamu, dan detail acara kalian.
            </p>

            <div className="mt-auto flex flex-col pt-16">
              <div className="relative min-h-[160px]">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`absolute inset-x-0 top-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      index === currentTestimonialIndex
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                    aria-hidden={index !== currentTestimonialIndex}
                  >
                    <blockquote
                      className="text-xl font-medium leading-snug tracking-[-0.02em] text-white/90 sm:text-2xl"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      “{testimonial.text}”
                    </blockquote>
                    <figcaption className="mt-6 text-sm text-white/45">
                      {testimonial.author}
                      <span className="mx-2 text-white/25">·</span>
                      {testimonial.role}
                    </figcaption>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-2" role="tablist" aria-label="Testimoni">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={idx === currentTestimonialIndex}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      idx === currentTestimonialIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/30 hover:bg-white/50"
                    }`}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div id="modal-root" className="relative" />
    </>
  );
}
