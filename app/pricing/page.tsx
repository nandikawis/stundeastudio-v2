import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Harga & Paket | Stundea Studio",
  description: "Pilih paket undangan pernikahan digital yang sesuai dengan kebutuhan Anda. Mulai dari Rp 50.000/tahun.",
};

const pricingPlans = [
  {
    name: "Individual",
    description: "Cocok untuk pasangan yang ingin membuat undangan pernikahan digital sendiri",
    price: "50.000",
    period: "/tahun",
    popular: false,
    features: [
      { text: "1 Undangan Aktif", included: true },
      { text: "Semua Template Premium", included: true },
      { text: "RSVP Online", included: true },
      { text: "Manajemen Tamu (max 200)", included: true },
      { text: "Musik Latar", included: true },
      { text: "QR Code & Link Sharing", included: true },
      { text: "Peta Lokasi", included: true },
      { text: "Galeri Foto (max 10)", included: true },
      { text: "Countdown Timer", included: true },
      { text: "Custom Domain", included: false },
      { text: "Hapus Branding", included: false },
      { text: "Priority Support", included: false },
    ],
    cta: "Pilih Individual",
    href: "#",
  },
  {
    name: "Pro",
    description: "Ideal untuk fotografer atau bisnis kecil yang melayani beberapa klien",
    price: "150.000",
    period: "/tahun",
    popular: true,
    features: [
      { text: "5 Undangan Aktif", included: true },
      { text: "Semua Template Premium", included: true },
      { text: "RSVP Online", included: true },
      { text: "Manajemen Tamu (max 500/undangan)", included: true },
      { text: "Musik Latar", included: true },
      { text: "QR Code & Link Sharing", included: true },
      { text: "Peta Lokasi", included: true },
      { text: "Galeri Foto (max 30)", included: true },
      { text: "Countdown Timer", included: true },
      { text: "Custom Domain", included: true },
      { text: "Hapus Branding", included: true },
      { text: "Priority Support", included: false },
    ],
    cta: "Pilih Pro",
    href: "#",
  },
  {
    name: "Enterprise",
    description: "Untuk bisnis fotografi menengah yang membutuhkan kapasitas lebih besar",
    price: "500.000",
    period: "/tahun",
    popular: false,
    features: [
      { text: "20 Undangan Aktif", included: true },
      { text: "Semua Template Premium", included: true },
      { text: "RSVP Online", included: true },
      { text: "Manajemen Tamu (unlimited)", included: true },
      { text: "Musik Latar", included: true },
      { text: "QR Code & Link Sharing", included: true },
      { text: "Peta Lokasi", included: true },
      { text: "Galeri Foto (unlimited)", included: true },
      { text: "Countdown Timer", included: true },
      { text: "Custom Domain", included: true },
      { text: "Hapus Branding", included: true },
      { text: "Priority Support 24/7", included: true },
    ],
    cta: "Pilih Enterprise",
    href: "#",
  },
];

const faqs = [
  {
    question: "Apa yang dimaksud dengan 'Undangan Aktif'?",
    answer: "Undangan aktif adalah undangan yang masih bisa diakses oleh tamu. Setelah acara selesai atau Anda menghapus undangan, slot tersebut bisa digunakan untuk undangan baru.",
  },
  {
    question: "Apakah saya bisa upgrade paket di tengah periode?",
    answer: "Ya, Anda bisa upgrade kapan saja. Biaya yang sudah dibayar akan diperhitungkan secara prorata untuk paket baru Anda.",
  },
  {
    question: "Bagaimana cara pembayaran?",
    answer: "Kami menerima pembayaran via transfer bank, e-wallet (GoPay, OVO, DANA), dan kartu kredit/debit.",
  },
  {
    question: "Apakah ada garansi uang kembali?",
    answer: "Ya, kami memberikan garansi 7 hari uang kembali jika Anda tidak puas dengan layanan kami.",
  },
  {
    question: "Berapa lama undangan akan aktif?",
    answer: "Undangan akan aktif selama masa berlangganan Anda (1 tahun). Anda bisa memperpanjang sebelum masa aktif habis.",
  },
  {
    question: "Apakah bisa request template custom?",
    answer: "Untuk saat ini kami belum menyediakan layanan custom template. Namun, semua template kami bisa dikustomisasi warna, font, dan layoutnya.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-dark text-sm font-medium mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            Harga Transparan
          </span>
          <h1 
            className="text-4xl md:text-5xl font-bold text-primary mb-6 animate-fade-in-up opacity-0"
            style={{ fontFamily: "var(--font-playfair)", animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Pilih Paket yang Tepat
            <br />
            <span className="gradient-text">untuk Anda</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            Harga terjangkau untuk semua kalangan. Mulai dari pasangan individual hingga bisnis fotografi profesional.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 animate-fade-in-up opacity-0 ${
                  plan.popular
                    ? "bg-primary text-white shadow-2xl shadow-primary/20 scale-105 z-10"
                    : "bg-white border border-border hover:shadow-xl hover:border-accent/30"
                }`}
                style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: "forwards" }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-accent text-white text-sm font-medium rounded-full">
                      Paling Populer
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 
                    className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-primary"}`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? "text-white/70" : "text-muted"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-sm ${plan.popular ? "text-white/70" : "text-muted"}`}>Rp</span>
                    <span 
                      className={`text-5xl font-bold ${plan.popular ? "text-white" : "text-primary"}`}
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <span className={`text-sm ${plan.popular ? "text-white/70" : "text-muted"}`}>
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <svg 
                          className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-accent-light" : "text-accent"}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg 
                          className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-white/30" : "text-gray-300"}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? plan.popular ? "text-white" : "text-primary" 
                          : plan.popular ? "text-white/40" : "text-gray-400"
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={plan.href}
                  className={`block w-full py-4 rounded-xl font-medium text-center transition-all ${
                    plan.popular
                      ? "bg-accent text-white hover:bg-accent-dark"
                      : "bg-primary text-white hover:bg-primary-light"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-12 text-center animate-fade-in-up opacity-0" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 border border-green-200">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-green-800 font-medium">Garansi 7 Hari Uang Kembali</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <h2 
              className="text-3xl font-bold text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Perbandingan Lengkap
            </h2>
            <p className="text-muted mt-3">
              Lihat detail fitur untuk setiap paket
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-primary">Fitur</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">Individual</th>
                  <th className="text-center py-4 px-4 font-semibold text-accent-dark bg-accent/5">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-muted">Undangan Aktif</td>
                  <td className="py-4 px-4 text-center text-primary font-medium">1</td>
                  <td className="py-4 px-4 text-center text-primary font-medium bg-accent/5">5</td>
                  <td className="py-4 px-4 text-center text-primary font-medium">20</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-muted">Maksimal Tamu</td>
                  <td className="py-4 px-4 text-center text-primary font-medium">200</td>
                  <td className="py-4 px-4 text-center text-primary font-medium bg-accent/5">500/undangan</td>
                  <td className="py-4 px-4 text-center text-primary font-medium">Unlimited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-muted">Galeri Foto</td>
                  <td className="py-4 px-4 text-center text-primary font-medium">10 foto</td>
                  <td className="py-4 px-4 text-center text-primary font-medium bg-accent/5">30 foto</td>
                  <td className="py-4 px-4 text-center text-primary font-medium">Unlimited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-muted">Template Premium</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-accent/5">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-muted">Custom Domain</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-accent/5">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-muted">Hapus Branding</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-accent/5">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-muted">Priority Support</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-accent/5">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-muted">Harga</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">Rp 50.000/thn</td>
                  <td className="py-4 px-4 text-center text-accent-dark font-bold bg-accent/5">Rp 150.000/thn</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">Rp 500.000/thn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up opacity-0" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
            <h2 
              className="text-3xl font-bold text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Paket Mana yang Cocok untuk Anda?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Individual */}
            <div className="bg-white rounded-2xl p-8 border border-border animate-fade-in-up opacity-0" style={{ animationDelay: "1.0s", animationFillMode: "forwards" }}>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Paket Individual</h3>
              <p className="text-muted mb-4">Cocok untuk:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Pasangan yang akan menikah
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Ingin hemat biaya undangan
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Tamu undangan di bawah 200 orang
                </li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-accent animate-fade-in-up opacity-0" style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Paket Pro</h3>
              <p className="text-muted mb-4">Cocok untuk:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Fotografer freelance
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Studio foto kecil
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Ingin tambah value untuk klien
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Melayani 5 klien per tahun
                </li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border border-border animate-fade-in-up opacity-0" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Paket Enterprise</h3>
              <p className="text-muted mb-4">Cocok untuk:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Studio prewedding menengah
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Wedding organizer
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Butuh kapasitas besar
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Melayani 20+ klien per tahun
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up opacity-0" style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}>
            <span className="text-accent-dark text-sm font-medium uppercase tracking-wider">FAQ</span>
            <h2 
              className="text-3xl font-bold text-primary mt-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-background rounded-xl border border-border overflow-hidden animate-fade-in-up opacity-0"
                style={{ animationDelay: `${1.4 + index * 0.1}s`, animationFillMode: "forwards" }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-medium text-primary pr-4">{faq.question}</span>
                  <svg 
                    className="w-5 h-5 text-muted flex-shrink-0 transition-transform group-open:rotate-180" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-muted">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up opacity-0"
            style={{ fontFamily: "var(--font-playfair)", animationDelay: "2.0s", animationFillMode: "forwards" }}
          >
            Masih Ragu?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: "2.1s", animationFillMode: "forwards" }}>
            Hubungi tim kami untuk konsultasi gratis. Kami akan membantu Anda memilih paket yang paling sesuai dengan kebutuhan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: "2.2s", animationFillMode: "forwards" }}>
            <Link 
              href="https://wa.me/6281234567890"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white rounded-full text-base font-medium hover:bg-accent-dark transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat via WhatsApp
            </Link>
            <Link 
              href="/"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-full text-base font-medium hover:bg-white/10 transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

