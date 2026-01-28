import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavigationLogin from "./Navigationlogin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This marks this layout as a root layout
export const metadata: Metadata = {
  title: "Register Property",
  description: "Register your property",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationLogin>{children}</NavigationLogin>;
}
