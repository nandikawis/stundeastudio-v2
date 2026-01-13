"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id?: string;
  url: string;
  alt?: string;
}

interface PhotoGalleryGridProps {
  images?: GalleryImage[];
  columns?: number;
  className?: string;
  backgroundColor?: string;
}

export default function PhotoGalleryGrid({
  images = [],
  columns = 2,
  className = "",
  backgroundColor
}: PhotoGalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <section 
        className={`py-16 px-6 w-full ${!backgroundColor ? 'bg-white' : ''} ${className}`}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
            Photo Gallery
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
              >
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
        className={`py-16 px-6 w-full ${!backgroundColor ? 'bg-gradient-to-b from-white via-gray-50 to-white' : ''} relative ${className}`}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        {/* SVG Curve Divider at Top */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-16 fill-white">
            <path d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
            Photo Gallery
          </h2>

          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedImage(image.url)}
                className="relative aspect-square overflow-hidden rounded group cursor-pointer"
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes={`(max-width: 768px) 50vw, ${100 / columns}vw`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

