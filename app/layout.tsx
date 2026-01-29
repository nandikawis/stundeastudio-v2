import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
