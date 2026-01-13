"use client";

import Image from "next/image";

interface ReligiousGreetingProps {
  greeting?: string;
  message?: string;
  imageUrl?: string;
  greetingColor?: string;
  messageColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function ReligiousGreeting({
  greeting = "Om Swastyastu",
  message = "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.",
  imageUrl,
  greetingColor,
  messageColor,
  backgroundColor,
  className = ""
}: ReligiousGreetingProps) {
  return (
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

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Om Swastyastu Image */}
        {imageUrl && (
          <div className="mb-8">
            <div className="relative w-full max-w-md mx-auto aspect-[1140/581]">
              <Image
                src={imageUrl}
                alt={greeting}
                fill
                className="object-contain"
                sizes="(max-width: 1140px) 100vw, 1140px"
              />
            </div>
          </div>
        )}

        {/* Greeting Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: greetingColor || "#1f2937" }}>
          {greeting}
        </h2>

        {/* Message */}
        <p className="text-base md:text-lg leading-relaxed px-4" style={{ fontFamily: "var(--font-dm-sans)", color: messageColor || "#374151" }}>
          {message}
        </p>
      </div>
    </section>
  );
}

