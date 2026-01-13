"use client";

interface CoupleProfileProps {
  name?: string;
  fullName?: string;
  relation?: string;
  parents?: {
    father?: string;
    mother?: string;
  };
  address?: string;
  imageUrl?: string;
  type?: "groom" | "bride";
  nameColor?: string;
  fullNameColor?: string;
  relationColor?: string;
  fatherNameColor?: string;
  motherNameColor?: string;
  addressColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function CoupleProfile({
  name = "John",
  fullName = "John Doe",
  relation = "Anak pertama dari pasangan",
  parents = {
    father: "Father Name",
    mother: "Mother Name"
  },
  address = "Address here",
  imageUrl,
  type = "groom",
  nameColor,
  fullNameColor,
  relationColor,
  fatherNameColor,
  motherNameColor,
  addressColor,
  backgroundColor,
  className = ""
}: CoupleProfileProps) {
  const isGroom = type === "groom";

  return (
    <section 
      className={`py-12 px-6 w-full ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="max-w-md mx-auto text-center">
        {/* Circular Photo (always covers, no space left) */}
        <div className="mx-auto mb-6" style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          boxShadow: "0px 2px 15px 0px rgb(0 0 0 / 25%)",
          overflow: "hidden",
          position: "relative",
          backgroundColor: !imageUrl ? "#e5e7eb" : undefined // gray-200 fallback
        }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block"
              }}
              className={`w-full h-full ${isGroom ? "mempelai-foto-pria" : "mempelai-foto-wanita"}`}
              draggable={false}
            />
          ) : (
            <span className="flex w-full h-full items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          )}
        </div>

        {/* Name */}
        <h4 className="text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-playfair)", color: nameColor || "#1f2937" }}>
          {name}
        </h4>

        {/* Full Name */}
        <h5 className="text-lg mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: fullNameColor || "#374151" }}>
          {fullName}
        </h5>

        {/* Relation */}
        <p className="text-sm mb-2" style={{ fontFamily: "var(--font-dm-sans)", color: relationColor || "#4b5563" }}>
          {relation}
        </p>

        {/* Parents */}
        {parents.father && (
          <>
            <p className="text-sm mb-1" style={{ fontFamily: "var(--font-dm-sans)", color: fatherNameColor || "#374151" }}>
              {parents.father}
            </p>
            <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
              &
            </p>
            <p className="text-sm mb-4" style={{ fontFamily: "var(--font-dm-sans)", color: motherNameColor || "#374151" }}>
              {parents.mother}
            </p>
          </>
        )}

        {/* Address */}
        {address && (
          <p className="text-xs mt-4" style={{ fontFamily: "var(--font-dm-sans)", color: addressColor || "#4b5563" }}>
            {address}
          </p>
        )}
      </div>
    </section>
  );
}
