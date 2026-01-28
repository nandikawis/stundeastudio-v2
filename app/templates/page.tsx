import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TemplateGrid from "../components/templates/TemplateGrid";
import { mockTemplates } from "../lib/templates";

export const metadata = {
  title: "Template Undangan | Stundea Studio",
  description:
    "Pilih dari koleksi template undangan pernikahan digital yang elegan dan dapat dikustomisasi.",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-white to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-dark text-sm font-medium mb-6 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Koleksi Template Premium
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 animate-fade-in-up opacity-0"
            style={{
              fontFamily: "var(--font-playfair)",
              animationDelay: "0.2s",
              animationFillMode: "forwards",
            }}
          >
            Pilih Template
            <br />
            <span className="gradient-text">Impian Anda</span>
          </h1>
          <p
            className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            Jelajahi koleksi template undangan pernikahan digital yang elegan.
            Semua template dapat dikustomisasi sesuai keinginan Anda.
          </p>
        </div>
      </section>

      {/* Templates Grid Section */}
      <section className="py-16">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <TemplateGrid templates={mockTemplates} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-primary mb-4 animate-fade-in-up opacity-0"
            style={{
              fontFamily: "var(--font-playfair)",
              animationDelay: "0.5s",
              animationFillMode: "forwards",
            }}
          >
            Tidak Menemukan Template yang Cocok?
          </h2>
          <p
            className="text-muted text-lg mb-8 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            Tim kami siap membantu Anda membuat template custom sesuai kebutuhan.
            Hubungi kami untuk konsultasi gratis.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-light transition-all hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi via WhatsApp
            </a>
            <a
              href="/pricing"
              className="px-8 py-4 border-2 border-border text-primary rounded-full font-medium hover:border-accent hover:text-accent-dark transition-all"
            >
              Lihat Paket Harga
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

