import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TemplatesCatalog from "../components/templates/TemplatesCatalog";

export const metadata = {
  title: "Template Undangan | Stundea Studio",
  description:
    "Pilih dari koleksi template undangan pernikahan digital yang elegan dan dapat dikustomisasi.",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="landing-root bg-[#f7f6f3] text-primary">
        {/* Hero */}
        <section className="px-5 pb-12 pt-36 sm:px-8 lg:px-14 lg:pb-16 lg:pt-40">
          <div className="mx-auto max-w-[1200px]">
            <p className="landing-enter text-[11px] font-medium uppercase tracking-[0.3em] text-primary/40">
              Template
            </p>
            <h1
              className="landing-enter landing-enter-1 mt-5 max-w-[14ch] text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pilih arah visual undangan kalian.
            </h1>
            <p className="landing-enter landing-enter-2 mt-6 max-w-md text-base leading-relaxed text-primary/55 sm:text-lg">
              Koleksi template yang bisa dikustomisasi—warna, foto, teks, dan
              susunan. Mulai dari satu yang terasa paling dekat.
            </p>
          </div>
        </section>

        {/* Catalog */}
        <section className="px-5 pb-20 sm:px-8 lg:px-14 lg:pb-28">
          <div className="mx-auto max-w-[1200px]">
            <TemplatesCatalog />
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-primary/8 bg-white px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Belum menemukan yang cocok?
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary/50">
                Tanya kami soal arah desain, atau lihat paket harga dulu—semua
                template premium tersedia di setiap paket.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/6281337531477"
                target="_blank"
                rel="noopener noreferrer"
                className="landing-btn landing-btn-primary"
              >
                Chat WhatsApp
              </a>
              <Link href="/pricing" className="landing-btn landing-btn-ghost">
                Lihat harga
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
