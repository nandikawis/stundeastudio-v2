"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

// Testimonial data
const testimonials = [
  {
    id: 1,
    text: "Simple unbelievable! I'm really satisfied by Are Property's work. They are absolutely an amazing team!",
    author: "Rin H.",
    role: "Business Owner",
    image: "/Rin.png",
  },
  {
    id: 2,
    text: "Outstanding service and professional team. They helped me find my dream property!",
    author: "John D..",
    role: "Property Owner",
    image: "/Jhon.png",
  },
  {
    id: 3,
    text: "The best property platform I've ever used. Intuitive and efficient!",
    author: "Elly.",
    role: "Real Estate Agent",
    image: "/Elly.png",
  },
];

export default function NavigationLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] =
    useState<number>(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
  <>
  <div className="flex h-screen bg-background overflow-hidden">
        {/* Main content area - di kiri */}
        <main className="w-full md:w-[60%] overflow-y-auto bg-background">
          {children}
        </main>

        {/* Sidebar dengan rounded left corners dan brand background - di kanan */}
        <aside className="hidden md:block w-[40%] border-l border-border bg-gradient-to-b from-primary to-accent rounded-tl-3xl rounded-bl-3xl text-white">
          <div className="flex flex-col h-full p-20">
            {/* Main heading */}
            <h1 className="text-5xl font-bold mb-4">
              Start Your Property With Us.
            </h1>

            {/* Subtitle */}
            <p className="text-xl mb-16">
              Join - enjoy exclusive features & many more
            </p>

            {/* Testimonial section with card and pagination */}
            <div className="flex flex-col flex-grow justify-center">
              {/* Cards Container */}
              <div className="relative h-[300px]">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`absolute w-full transition-all duration-500 ${
                      index === currentTestimonialIndex
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-full"
                    }`}
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl">
                      <p className="text-lg mb-6">{testimonial.text}</p>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold">{testimonial.author}</h3>
                          <p className="text-sm text-white/80">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex gap-2 justify-center relative">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentTestimonialIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
      
      {/* Portal container for modal */}
      <div id="modal-root" className="relative"></div>
    </>
  );
}
