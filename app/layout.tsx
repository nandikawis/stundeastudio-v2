import type { Metadata } from "next";
import {
  Allura,
  Cardo,
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  DM_Sans,
  EB_Garamond,
  Great_Vibes,
  Josefin_Sans,
  Libre_Baskerville,
  Lora,
  Montserrat,
  Outfit,
  Parisienne,
  Pinyon_Script,
  Playfair_Display,
  Sacramento,
  Spectral,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cardo = Cardo({
  variable: "--font-cardo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stundeastudio.com"),
  title: "Stundea Studio | Undangan Pernikahan Digital",
  description:
    "Buat undangan pernikahan digital yang elegan dan terjangkau. Platform pembuatan undangan pernikahan online terbaik di Indonesia.",
  keywords: [
    "undangan pernikahan",
    "undangan digital",
    "wedding invitation",
    "undangan online",
    "stundea studio",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Stundea Studio | Undangan Pernikahan Digital",
    description:
      "Buat undangan pernikahan digital yang elegan dan terjangkau. Platform pembuatan undangan pernikahan online terbaik di Indonesia.",
    siteName: "Stundea Studio",
    type: "website",
    images: [
      {
        url: "/stundea-studio-og.png",
        width: 1000,
        height: 1000,
        alt: "Stundea Studio",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Stundea Studio | Undangan Pernikahan Digital",
    description:
      "Buat undangan pernikahan digital yang elegan dan terjangkau. Platform pembuatan undangan pernikahan online terbaik di Indonesia.",
    images: ["/stundea-studio-og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable} ${greatVibes.variable} ${lora.variable} ${montserrat.variable} ${ebGaramond.variable} ${libreBaskerville.variable} ${spectral.variable} ${cardo.variable} ${cinzel.variable} ${allura.variable} ${parisienne.variable} ${pinyon.variable} ${dancingScript.variable} ${sacramento.variable} ${josefin.variable} ${outfit.variable} antialiased`}
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
