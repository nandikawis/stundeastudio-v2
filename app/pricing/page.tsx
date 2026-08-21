import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlanCheckoutButton from "../components/PlanCheckoutButton";

export const metadata = {
  title: "Harga & Paket | Stundea Studio",
  description:
    "Pilih paket undangan pernikahan digital yang sesuai dengan kebutuhan Anda. Mulai dari Rp 50.000/tahun.",
};

const plans = [
  {
    id: "individual" as const,
    name: "Individual",
    price: "50.000",
    period: "/ 6 bulan",
    blurb: "Untuk pasangan yang membuat undangan sendiri.",
    highlights: [
      "1 undangan aktif",
      "Carousel max 5 foto",
      "Galeri max 10 foto",
      "RSVP max 500 tamu",
      "Bagikan kelola RSVP",
    ],
    missing: ["Hapus branding"],
    cta: "Pilih Individual",
    featured: false,
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "150.000",
    period: "/ tahun",
    blurb: "Untuk fotografer atau studio kecil dengan beberapa klien.",
    highlights: [
      "5 undangan aktif",
      "Carousel max 15 foto",
      "Galeri max 30 foto",
      "RSVP max 1000 tamu / undangan",
      "Bagikan kelola RSVP",
      "Hapus branding",
    ],
    missing: [],
    cta: "Pilih Pro",
    featured: true,
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    price: "500.000",
    period: "/ tahun",
    blurb: "Untuk studio dan WO yang butuh kapasitas lebih besar.",
    highlights: [
      "20 undangan aktif",
      "Carousel & galeri unlimited",
      "Tamu unlimited",
      "Bagikan kelola RSVP",
      "Hapus branding",
      "Priority support",
    ],
    missing: [],
    cta: "Pilih Enterprise",
    featured: false,
  },
];

const comparison = [
  { label: "Durasi", values: ["6 bulan", "1 tahun", "1 tahun"] },
  { label: "Undangan aktif", values: ["1", "5", "20"] },
  { label: "Carousel", values: ["5", "15", "Unlimited"] },
  { label: "Galeri foto", values: ["10", "30", "Unlimited"] },
  { label: "Maksimal tamu", values: ["500", "1000 / undangan", "Unlimited"] },
  { label: "Bagikan kelola RSVP", values: [true, true, true] },
  { label: "Hapus branding", values: [false, true, true] },
];

const audiences = [
  {
    plan: "Individual",
    lines: [
      "Pasangan yang akan menikah",
      "Ingin menghemat biaya cetak",
      "Tamu di bawah 200 orang",
    ],
  },
  {
    plan: "Pro",
    lines: [
      "Fotografer freelance",
      "Studio foto kecil",
      "Sekitar 5 klien per tahun",
    ],
  },
  {
    plan: "Enterprise",
    lines: [
      "Studio prewedding",
      "Wedding organizer",
      "20+ klien per tahun",
    ],
  },
];

const faqs = [
  {
    q: "Apa yang dimaksud dengan undangan aktif?",
    a: "Undangan yang masih bisa diakses tamu. Setelah acara selesai atau dihapus, slotnya bisa dipakai lagi.",
  },
  {
    q: "Berapa lama undangan aktif?",
    a: "Sesuai paket: Individual 6 bulan, Pro dan Enterprise 1 tahun. Akun baru mendapat uji coba gratis 14 hari dengan 1 undangan aktif.",
  },
  {
    q: "Bisa request template custom?",
    a: "Belum. Semua template bisa dikustomisasi warna, font, dan layout.",
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="font-medium text-primary">{value}</span>;
  }
  return value ? (
    <span className="text-accent-dark" aria-label="Termasuk">
      ✓
    </span>
  ) : (
    <span className="text-primary/25" aria-label="Tidak termasuk">
      —
    </span>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="landing-root bg-[#f7f6f3] text-primary">
        {/* Hero */}
        <section className="px-5 pb-12 pt-36 sm:px-8 lg:px-14 lg:pb-16 lg:pt-40">
          <div className="mx-auto max-w-[1200px]">
            <p className="landing-enter text-[11px] font-medium uppercase tracking-[0.3em] text-primary/40">
              Harga
            </p>
            <h1
              className="landing-enter landing-enter-1 mt-5 max-w-[12ch] text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Paket yang jelas. Tanpa kejutan.
            </h1>
            <p className="landing-enter landing-enter-2 mt-6 max-w-md text-base leading-relaxed text-primary/55 sm:text-lg">
              Dari pasangan individual hingga studio—pilih kapasitas yang
              benar-benar Anda butuhkan. Semua berlangganan tahunan.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="px-5 pb-20 sm:px-8 lg:px-14">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`flex flex-col rounded-2xl border px-6 py-8 sm:px-7 ${
                  plan.featured
                    ? "border-primary bg-primary text-white"
                    : "border-primary/10 bg-white"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2
                    className={`text-2xl font-medium tracking-[-0.02em] ${
                      plan.featured ? "text-white" : "text-primary"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {plan.name}
                  </h2>
                  {plan.featured && (
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent-light/90">
                      Populer
                    </span>
                  )}
                </div>

                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    plan.featured ? "text-white/55" : "text-primary/50"
                  }`}
                >
                  {plan.blurb}
                </p>

                <div className="mt-8 flex items-baseline gap-1">
                  <span
                    className={`text-sm ${
                      plan.featured ? "text-white/50" : "text-primary/45"
                    }`}
                  >
                    Rp
                  </span>
                  <span
                    className={`text-4xl font-medium tracking-[-0.03em] sm:text-5xl ${
                      plan.featured ? "text-white" : "text-primary"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.featured ? "text-white/45" : "text-primary/40"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.highlights.map((item) => (
                    <li
                      key={item}
                      className={`text-sm leading-snug ${
                        plan.featured ? "text-white/80" : "text-primary/70"
                      }`}
                    >
                      <span
                        className={`mr-2 ${
                          plan.featured ? "text-accent-light" : "text-accent-dark"
                        }`}
                      >
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                  {plan.missing.map((item) => (
                    <li
                      key={item}
                      className={`text-sm leading-snug line-through ${
                        plan.featured ? "text-white/25" : "text-primary/25"
                      }`}
                    >
                      <span className="mr-2">·</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <PlanCheckoutButton
                  planId={plan.id}
                  label={plan.cta}
                  className={`landing-btn mt-10 w-full disabled:opacity-60 ${
                    plan.featured
                      ? "bg-white text-primary hover:bg-accent-light"
                      : "landing-btn-primary"
                  }`}
                />
              </article>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="border-y border-primary/8 bg-white px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-[1200px]">
            <h2
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.03em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Perbandingan singkat
            </h2>
            <p className="mt-3 max-w-md text-[15px] text-primary/50">
              Detail kapasitas antar paket—tanpa daftar panjang yang sama di
              setiap kolom.
            </p>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-primary/10">
                    <th className="py-4 pr-4 font-medium text-primary/40">
                      Fitur
                    </th>
                    <th className="px-3 py-4 text-center font-medium text-primary">
                      Individual
                    </th>
                    <th className="px-3 py-4 text-center font-medium text-primary">
                      Pro
                    </th>
                    <th className="px-3 py-4 text-center font-medium text-primary">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-primary/6 last:border-0"
                    >
                      <td className="py-4 pr-4 text-primary/55">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-3 py-4 text-center">
                          <CellValue value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-[1200px]">
            <h2
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.03em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Paket mana yang cocok?
            </h2>
            <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
              {audiences.map((a) => (
                <div key={a.plan}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/35">
                    {a.plan}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {a.lines.map((line) => (
                      <li
                        key={line}
                        className="text-[15px] leading-relaxed text-primary/65"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-primary/8 bg-white px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-[720px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35">
              FAQ
            </p>
            <h2
              className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.03em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pertanyaan umum
            </h2>

            <div className="mt-12 divide-y divide-primary/10">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[15px] font-medium text-primary transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      className="shrink-0 text-primary/35 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-primary/55">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Masih ragu?
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary/50">
                Tanya kami—kami bantu pilih paket yang masuk akal untuk situasi
                Anda.
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
              <Link href="/" className="landing-btn landing-btn-ghost">
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
