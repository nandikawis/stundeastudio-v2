// Component library exports - New Structure
export { default as BlankSection } from "./BlankSection";
export { default as Hero } from "./Hero";
export { default as CountdownTimer } from "./CountdownTimer";
export { default as ImageCarousel } from "./ImageCarousel";

// New Bayu & Nia style components
export { default as CoverSection } from "./CoverSection";
export { default as HeroSection } from "./HeroSection";
export { default as QuoteSection } from "./QuoteSection";
export { default as ReligiousGreeting } from "./ReligiousGreeting";
export { default as CoupleProfile } from "./CoupleProfile";
export { default as EventDetails } from "./EventDetails";
export { default as PhotoGalleryGrid } from "./PhotoGalleryGrid";
export { default as ClosingSection } from "./ClosingSection";

// Legacy components (keeping for backward compatibility)
export { default as HeroImage } from "./HeroImage";
export { default as TitleSection } from "./TitleSection";
export { default as CoupleNames } from "./CoupleNames";

// Import for registry
import BlankSection from "./BlankSection";
import Hero from "./Hero";
import CountdownTimer from "./CountdownTimer";
import ImageCarousel from "./ImageCarousel";
import CoverSection from "./CoverSection";
import HeroSection from "./HeroSection";
import QuoteSection from "./QuoteSection";
import ReligiousGreeting from "./ReligiousGreeting";
import CoupleProfile from "./CoupleProfile";
import EventDetails from "./EventDetails";
import PhotoGalleryGrid from "./PhotoGalleryGrid";
import ClosingSection from "./ClosingSection";
import HeroImage from "./HeroImage";
import TitleSection from "./TitleSection";
import CoupleNames from "./CoupleNames";

// Component registry for dynamic rendering
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  BlankSection,
  Hero,
  ImageCarousel,
  // New Bayu & Nia style components
  CoverSection,
  HeroSection,
  QuoteSection,
  ReligiousGreeting,
  CoupleProfile,
  EventDetails,
  PhotoGalleryGrid,
  ClosingSection,
  // Legacy
  HeroImage,
  TitleSection,
  CoupleNames,
};
