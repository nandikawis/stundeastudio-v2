import Link from "next/link";
import Image from "next/image";
import HeroMoltenBg from "./HeroMoltenBg";

/**
 * Landing body only. Navbar stays a sibling in page.tsx so pill↔bar
 * CSS transitions are never interrupted by landing work.
 *
 * Motion follows Emil Kowalski: ease-out on enter, transform+opacity only,
 * active scale 0.97 on press, no scroll observers, no scale(0).
 */
export default function LandingSections() {
  return (
    <div className="landing-root bg-[#f7f6f3] text-primary">
      {/* ── Hero: MoltenMetal bg + type (product mockup stays below) ── */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-16 pt-36 sm:px-8 sm:pb-20 lg:px-14 lg:pb-24 lg:pt-40">
        <HeroMoltenBg />

        <div className="relative z-[1] mx-auto w-full max-w-[1200px]">
          <p className="landing-enter text-[11px] font-medium uppercase tracking-[0.3em] text-primary/40">
            Stundea Studio
          </p>

          <h1
            className="landing-enter landing-enter-1 mt-6 max-w-[11ch] text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Undangan digital dengan rasa.
          </h1>

          <div className="landing-enter landing-enter-2 mt-10 flex flex-col gap-8 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[28rem] text-base leading-relaxed text-primary/55 sm:text-lg">
              Pilih template, sesuaikan detail, bagikan ke tamu. Tenang,
              personal, dan terlihat disusun dengan sengaja.
            </p>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/templates" className="landing-btn landing-btn-primary">
                Mulai buat undangan
              </Link>
              <Link href="/pricing" className="landing-btn landing-btn-ghost">
                Lihat harga
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product: mockup as object, contained — never as page wallpaper ── */}
      <section className="bg-[#0c0c0c] px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-white/35">
            Seperti ini di HP tamu
          </p>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:rounded-3xl">
            <Image
              src="/invitation_design.png"
              alt="Contoh undangan digital Stundea Studio di ponsel"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-contain"
              priority
            />
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/templates" className="landing-btn landing-btn-on-dark">
              Jelajahi template
            </Link>
          </div>
        </div>
      </section>

      {/* ── What you get: sparse definitions, no cards ── */}
      <section id="features" className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2
              className="text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Semua yang dibutuhkan. Tidak lebih.
            </h2>
          </div>

          <dl className="lg:col-span-7 lg:col-start-6">
            {[
              {
                t: "Editor visual",
                d: "Ubah teks, foto, warna, dan susunan tanpa menyentuh kode.",
              },
              {
                t: "RSVP & tamu",
                d: "Konfirmasi kehadiran terkumpul rapi—siap untuk hari H.",
              },
              {
                t: "Link & QR",
                d: "Bagikan sekali. Musik, countdown, dan petunjuk arah ikut serta.",
              },
              {
                t: "Mobile-first",
                d: "Dirancang untuk layar yang benar-benar dipakai tamu: ponsel.",
              },
            ].map((row) => (
              <div
                key={row.t}
                className="grid grid-cols-1 gap-2 border-t border-primary/10 py-8 first:border-t-0 first:pt-0 sm:grid-cols-12 sm:gap-6 sm:py-9"
              >
                <dt className="sm:col-span-4 text-[15px] font-medium text-primary">
                  {row.t}
                </dt>
                <dd className="sm:col-span-8 text-[15px] leading-relaxed text-primary/55">
                  {row.d}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Flow: quiet steps, large type ── */}
      <section className="border-y border-primary/8 bg-white px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
            Tiga langkah
          </p>
          <ol className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {[
              { n: "1", t: "Pilih", d: "Template yang cocok dengan karakter kalian." },
              { n: "2", t: "Sesuaikan", d: "Detail acara, foto, dan musik—semuanya visual." },
              { n: "3", t: "Bagikan", d: "Kirim link atau QR. Selesai." },
            ].map((s) => (
              <li key={s.n}>
                <span
                  className="text-sm tabular-nums text-accent-dark"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {s.n}
                </span>
                <h3
                  className="mt-3 text-3xl font-medium tracking-[-0.02em] text-primary"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {s.t}
                </h3>
                <p className="mt-3 max-w-[16rem] text-[15px] leading-relaxed text-primary/50">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
        <figure className="mx-auto max-w-[720px]">
          <blockquote
            className="text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.35] tracking-[-0.02em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            “Tenang, elegan, dan tamu langsung paham. Kami hemat tanpa mengurangi
            kesan.”
          </blockquote>
          <figcaption className="mt-8 text-sm text-primary/45">
            Anisa & Rizky — Jakarta
          </figcaption>
        </figure>
      </section>

      {/* ── Contact: solid surface, no backdrop-blur ── */}
      <section
        id="contact"
        className="border-t border-primary/10 bg-white px-5 py-20 sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              className="text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Siap membuat undangan kalian?
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary/50">
              Mulai dari paket harga, atau hubungi kami jika butuh bantuan memilih
              arah desain.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pricing" className="landing-btn landing-btn-primary">
                Paket harga
              </Link>
              <a
                href="https://wa.me/6281337531477"
                target="_blank"
                rel="noopener noreferrer"
                className="landing-btn landing-btn-ghost"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <ul className="space-y-5 text-sm lg:text-right">
            <li>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-primary/35">
                Email
              </span>
              <a
                href="mailto:connect@stundeastudio.com"
                className="mt-1 inline-block font-medium text-primary transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-accent-dark"
              >
                connect@stundeastudio.com
              </a>
            </li>
            <li>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-primary/35">
                WhatsApp
              </span>
              <a
                href="https://wa.me/6281337531477"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-medium text-primary transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-accent-dark"
              >
                +62 813-3753-1477
              </a>
            </li>
            <li>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-primary/35">
                Jam
              </span>
              <span className="mt-1 inline-block font-medium text-primary">
                Senin–Sabtu, 09:00–18:00 WIB
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
