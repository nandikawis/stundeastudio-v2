import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingSections from "./components/landing/LandingSections";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar stays a sibling — not under landing motion/state */}
      <Navbar />
      <LandingSections />
      <Footer />
    </main>
  );
}
