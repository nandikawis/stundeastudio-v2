import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="inline-block">
              <div className="h-[34px] w-[140px] overflow-hidden rounded-md md:h-[40px] md:w-[170px]">
                <Image
                  src="/13.png"
                  alt="Stundea Studio"
                  width={340}
                  height={40}
                  className="h-full w-[130%] max-w-none -translate-x-6 object-cover md:-translate-x-8"
                />
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              Undangan pernikahan digital yang tenang, personal, dan siap
              dibagikan—untuk pasangan di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7 md:gap-8">
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-light/80">
                Navigasi
              </h4>
              <ul className="mt-4 space-y-3">
                {[
                  { href: "/", label: "Beranda" },
                  { href: "#features", label: "Fitur" },
                  { href: "/templates", label: "Template" },
                  { href: "/pricing", label: "Harga" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-light/80">
                Dukungan
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#contact"
                    className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
                  >
                    Hubungi kami
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-white/35">Kebijakan privasi</span>
                </li>
                <li>
                  <span className="text-sm text-white/35">Syarat & ketentuan</span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-light/80">
                Kontak
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/55">
                <li>
                  <a
                    href="mailto:connect@stundeastudio.com"
                    className="transition-colors duration-200 hover:text-white"
                  >
                    connect@stundeastudio.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6281337531477"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-white"
                  >
                    +62 813-3753-1477
                  </a>
                </li>
                <li>Bali, Indonesia</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Stundea Studio. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
