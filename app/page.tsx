import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-dark text-sm font-medium mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Platform Undangan Digital #1 di Indonesia
            </div>

            {/* Main Heading */}
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 animate-fade-in-up opacity-0"
              style={{ fontFamily: "var(--font-playfair)", animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              Undangan Pernikahan
              <br />
              <span className="gradient-text">Elegan & Terjangkau</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              Buat undangan pernikahan digital yang memukau dalam hitungan menit. 
              Tanpa coding, tanpa ribet—cukup pilih template, sesuaikan, dan bagikan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <Link 
                href="/templates"
                className="px-8 py-4 bg-primary text-white rounded-full text-base font-medium hover:bg-primary-light transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                Mulai Buat Undangan
              </Link>
              <Link 
                href="/templates"
                className="px-8 py-4 border-2 border-border text-primary rounded-full text-base font-medium hover:border-accent hover:text-accent-dark transition-all"
              >
                Lihat Template
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-16 animate-fade-in-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>10K+</div>
                <div className="text-sm text-muted mt-1">Undangan Dibuat</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>50+</div>
                <div className="text-sm text-muted mt-1">Template Premium</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>99%</div>
                <div className="text-sm text-muted mt-1">Kepuasan Klien</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-accent-dark text-sm font-medium uppercase tracking-wider">Fitur Unggulan</span>
            <h2 
              className="text-3xl md:text-4xl font-bold text-primary mt-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-muted mt-4 max-w-2xl mx-auto">
              Fitur lengkap untuk membuat undangan pernikahan digital yang profesional dan berkesan
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 bg-card">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Template Premium</h3>
              <p className="text-muted leading-relaxed">
                Pilih dari 50+ template elegan yang dirancang oleh desainer profesional. Sesuaikan warna, font, dan layout sesuai selera.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 bg-card">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">RSVP Online</h3>
              <p className="text-muted leading-relaxed">
                Kelola konfirmasi kehadiran tamu dengan mudah. Lihat siapa yang akan hadir dan pantau jumlah tamu secara real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 bg-card">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Manajemen Tamu</h3>
              <p className="text-muted leading-relaxed">
                Import daftar tamu dari Excel, kirim undangan massal via WhatsApp, dan kelola database tamu dengan efisien.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 bg-card">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Musik & Animasi</h3>
              <p className="text-muted leading-relaxed">
                Tambahkan musik latar yang romantis dan animasi halus untuk membuat undangan Anda lebih hidup dan berkesan.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 bg-card">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">QR Code & Link</h3>
              <p className="text-muted leading-relaxed">
                Dapatkan QR code dan link unik untuk setiap undangan. Mudah dibagikan via media sosial atau dicetak.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 bg-card">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Peta Lokasi</h3>
              <p className="text-muted leading-relaxed">
                Integrasikan Google Maps untuk menunjukkan lokasi acara. Tamu bisa langsung navigasi ke venue dengan satu klik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-dark text-sm font-medium uppercase tracking-wider">Cara Kerja</span>
            <h2 
              className="text-3xl md:text-4xl font-bold text-primary mt-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Buat Undangan dalam 3 Langkah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                1
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Pilih Template</h3>
              <p className="text-muted">
                Jelajahi koleksi template premium kami dan pilih yang paling sesuai dengan tema pernikahan Anda.
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-accent to-accent/30" />
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                2
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Kustomisasi</h3>
              <p className="text-muted">
                Masukkan detail acara, unggah foto, pilih musik, dan sesuaikan desain sesuai keinginan Anda.
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-accent to-accent/30" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                3
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Bagikan</h3>
              <p className="text-muted">
                Dapatkan link undangan dan bagikan ke semua tamu melalui WhatsApp, media sosial, atau QR code.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full text-base font-medium hover:bg-primary-light transition-all hover:shadow-xl hover:shadow-primary/20"
            >
              Mulai Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-dark text-sm font-medium uppercase tracking-wider">Testimoni</span>
            <h2 
              className="text-3xl md:text-4xl font-bold text-primary mt-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Apa Kata Mereka?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-2xl bg-background border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted mb-6 leading-relaxed">
                &ldquo;Undangan digital dari Stundea Studio sangat membantu kami menghemat biaya. Desainnya elegan dan tamu-tamu kami sangat terkesan!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent-dark font-semibold">AR</span>
                </div>
                <div>
                  <div className="font-semibold text-primary">Anisa & Rizky</div>
                  <div className="text-sm text-muted">Jakarta</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-2xl bg-background border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted mb-6 leading-relaxed">
                &ldquo;Sebagai fotografer, paket Pro sangat membantu bisnis saya. Klien senang mendapat bonus undangan digital yang cantik!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent-dark font-semibold">BP</span>
                </div>
                <div>
                  <div className="font-semibold text-primary">Budi Photography</div>
                  <div className="text-sm text-muted">Bandung</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-2xl bg-background border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted mb-6 leading-relaxed">
                &ldquo;Fitur RSVP dan manajemen tamu sangat memudahkan kami mengatur acara. Highly recommended untuk calon pengantin!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent-dark font-semibold">DS</span>
                </div>
                <div>
                  <div className="font-semibold text-primary">Dina & Surya</div>
                  <div className="text-sm text-muted">Surabaya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Siap Membuat Undangan
            <br />
            Pernikahan Impian Anda?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pasangan yang telah mempercayakan momen spesial mereka kepada Stundea Studio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/pricing"
              className="px-8 py-4 bg-accent text-white rounded-full text-base font-medium hover:bg-accent-dark transition-all hover:shadow-xl"
            >
              Lihat Paket Harga
            </Link>
            <Link 
              href="#contact"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-full text-base font-medium hover:bg-white/10 transition-all"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 bg-background overflow-hidden">
        {/* Animated background (optional: add Plasma here later if desired) */}

        {/* Content */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-accent-dark text-sm font-medium uppercase tracking-wider">
              Hubungi Kami
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-primary mt-3 mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ada Pertanyaan?
            </h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              Tim kami siap membantu Anda. Pilih cara komunikasi yang paling nyaman bagi Anda untuk
              terhubung dengan Stundea Studio.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-primary">Email</div>
                <div className="text-muted text-sm">connect@stundeastudio.com</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-primary">WhatsApp</div>
                <div className="text-muted text-sm">+62 812 3456 7890</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-primary">Jam Operasional</div>
                <div className="text-muted text-sm">Senin - Sabtu, 09:00 - 18:00 WIB</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
