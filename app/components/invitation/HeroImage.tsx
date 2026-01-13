"use client";

import Image from "next/image";

interface HeroImageProps {
  imageUrl?: string;
  alt?: string;
  height?: string;
  overlay?: boolean;
  className?: string;
}

export default function HeroImage({
  imageUrl,
  alt = "Hero Image",
  height = "400px",
  overlay = false,
  className = ""
}: HeroImageProps) {
  const defaultImage = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200";

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <Image
        src={imageUrl || defaultImage}
        alt={alt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      )}
    </div>
  );
}

