import type { Metadata } from "next";
import NavigationLogin from "./Navigationlogin";

export const metadata: Metadata = {
  title: "Masuk | Stundea Studio",
  description: "Masuk atau daftar untuk mengelola undangan digital Anda.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationLogin>{children}</NavigationLogin>;
}
