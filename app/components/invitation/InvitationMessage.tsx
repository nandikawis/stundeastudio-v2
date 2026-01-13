"use client";

interface InvitationMessageProps {
  message?: string;
  messageColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function InvitationMessage({
  message = "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.",
  messageColor,
  backgroundColor,
  className = ""
}: InvitationMessageProps) {
  return (
    <section 
      className={`py-12 px-6 w-full ${!backgroundColor ? 'bg-white' : ''} ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)", color: messageColor || "#374151" }}>
          {message}
        </p>
      </div>
    </section>
  );
}

