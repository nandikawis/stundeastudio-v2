"use client";

import { EditorElement } from "../../lib/editorState";
import Image from "next/image";
import ImageCarousel from "../../components/invitation/ImageCarousel";
import CoverSection from "../../components/invitation/CoverSection";
import HeroSection from "../../components/invitation/HeroSection";
import QuoteSection from "../../components/invitation/QuoteSection";
import ReligiousGreeting from "../../components/invitation/ReligiousGreeting";
import CoupleProfile, { CoupleProfileDesign } from "../../components/invitation/CoupleProfile";
import EventDetails, { EventDetailsDesign } from "../../components/invitation/EventDetails";
import PhotoGalleryGrid from "../../components/invitation/PhotoGalleryGrid";
import ClosingSection from "../../components/invitation/ClosingSection";

interface ElementRendererProps {
  element: EditorElement;
  isSelected?: boolean;
  onClick?: () => void;
  eventData?: {
    eventDate?: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
  };
}

export default function ElementRenderer({
  element,
  isSelected = false,
  onClick,
  eventData,
}: ElementRendererProps) {
  // ElementRenderer doesn't handle positioning - that's done by MoveableElement
  // We just render the content
  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    cursor: onClick ? "pointer" : "default",
    overflow: "hidden",
    position: "relative",
  };

  const renderContent = () => {
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: element.styles?.textAlign === "center" ? "center" : "flex-start",
              padding: "8px",
              wordWrap: "break-word",
              overflow: "hidden",
              fontSize: element.styles?.fontSize || 16,
              fontFamily: element.styles?.fontFamily || "inherit",
              fontWeight: element.styles?.fontWeight || "normal",
              color: element.styles?.color || "#000",
              backgroundColor: element.styles?.backgroundColor || "transparent",
            }}
          >
            {element.content?.text || "Text"}
          </div>
        );

      case "image":
        return element.content?.url ? (
          <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
            <Image
              src={element.content.url}
              alt={element.content.alt || ""}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
          >
            No Image
          </div>
        );

      case "shape":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: element.styles?.backgroundColor || "#3b82f6",
              borderRadius: element.styles?.borderRadius ? `${element.styles.borderRadius}px` : "0",
              opacity: element.styles?.opacity || 1,
            }}
          />
        );

      case "carousel":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <ImageCarousel
              images={element.content?.images || []}
              autoplay={element.content?.autoplay !== false}
              autoplayInterval={element.content?.autoplayInterval || 5000}
              className="w-full h-full"
              isEditable={false}
              carouselDesign={element.content?.carouselDesign || "classic"}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
              countdownTargetDate={element.content?.countdownTargetDate || eventData?.eventDate}
              countdownDesign={element.content?.countdownDesign || "elegant-card"}
              countdownShowDays={element.content?.countdownShowDays !== false}
              countdownShowHours={element.content?.countdownShowHours !== false}
              countdownShowMinutes={element.content?.countdownShowMinutes !== false}
              countdownShowSeconds={element.content?.countdownShowSeconds !== false}
              countdownTitleColor={element.content?.countdownTitleColor}
              countdownValueColor={element.content?.countdownValueColor}
              countdownLabelColor={element.content?.countdownLabelColor}
              countdownCardColor={element.content?.countdownCardColor}
              dateMessageDate={element.content?.dateMessageDate}
              dateMessageText={element.content?.dateMessageText}
              dateMessageDateColor={element.content?.dateMessageDateColor}
              dateMessageTextColor={element.content?.dateMessageTextColor}
              dateMessageDateAlign={element.content?.dateMessageDateAlign}
              dateMessageTextAlign={element.content?.dateMessageTextAlign}
            />
          </div>
        );

      case "cover":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <CoverSection
              date={element.content?.date}
              coupleNames={element.content?.coupleNames}
              quote={element.content?.quote}
              guestName={element.content?.guestName}
              dateAlign={element.content?.dateAlign}
              coupleNamesAlign={element.content?.coupleNamesAlign}
              quoteAlign={element.content?.quoteAlign}
              guestBlockAlign={element.content?.guestBlockAlign}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
            />
          </div>
        );

      case "hero-section":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <HeroSection
              subtitle={element.content?.subtitle}
              coupleNames={element.content?.coupleNames}
              quote={element.content?.quote}
              subtitleAlign={element.content?.subtitleAlign}
              coupleNamesAlign={element.content?.coupleNamesAlign}
              quoteAlign={element.content?.quoteAlign}
              backgroundImages={element.content?.backgroundImages || []}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
            />
          </div>
        );

      case "quote":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <QuoteSection
              quote={element.content?.quote}
              primaryQuote={element.content?.primaryQuote}
              secondaryQuote={element.content?.secondaryQuote}
              author={element.content?.author}
              quoteAlign={element.content?.quoteAlign}
              secondaryQuoteAlign={element.content?.secondaryQuoteAlign}
              secondaryQuoteColor={element.content?.secondaryQuoteColor}
              authorAlign={element.content?.authorAlign}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
            />
          </div>
        );

      case "religious-greeting":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <ReligiousGreeting
              greeting={element.content?.greeting}
              message={element.content?.message}
              greetingAlign={element.content?.greetingAlign}
              messageAlign={element.content?.messageAlign}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
            />
          </div>
        );

      case "couple-profile":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <CoupleProfile
              name={element.content?.name}
              fullName={element.content?.fullName}
              relation={element.content?.relation}
              parents={element.content?.parents}
              address={element.content?.address}
              imageUrl={element.content?.imageUrl}
              design={element.content?.design as CoupleProfileDesign | undefined}
              imageStyle={element.content?.imageStyle}
              glowColor={element.content?.glowColor}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
              type={element.content?.type}
              nameAlign={element.content?.nameAlign}
              fullNameAlign={element.content?.fullNameAlign}
              relationAlign={element.content?.relationAlign}
              fatherNameAlign={element.content?.fatherNameAlign}
              motherNameAlign={element.content?.motherNameAlign}
              addressAlign={element.content?.addressAlign}
            />
          </div>
        );

      case "event-details":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <EventDetails
              eventDate={element.content?.eventDate || eventData?.eventDate}
              eventTime={element.content?.eventTime || eventData?.eventTime}
              venueName={element.content?.venueName || eventData?.venueName}
              venueAddress={element.content?.venueAddress || eventData?.venueAddress}
              venueCoordinates={element.content?.venueCoordinates}
              googleMapsLink={element.content?.googleMapsLink}
              mapButtonText={element.content?.mapButtonText}
              mapButtonColor={element.content?.mapButtonColor}
              mapButtonTextColor={element.content?.mapButtonTextColor}
              invitationMessage={element.content?.invitationMessage}
              invitationMessageColor={element.content?.invitationMessageColor}
              invitationMessageAlign={element.content?.invitationMessageAlign}
              closingMessageAlign={element.content?.closingMessageAlign}
              closingTextAlign={element.content?.closingTextAlign}
              design={element.content?.design as EventDetailsDesign | undefined}
              cardBackgroundColor={element.content?.cardBackgroundColor}
              cardOpacity={element.content?.cardOpacity}
              cardHeaderColor={element.content?.cardHeaderColor}
              cardBodyColor={element.content?.cardBodyColor}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
            />
          </div>
        );

      case "photo-gallery":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <PhotoGalleryGrid
              images={element.content?.images || []}
              columns={element.content?.columns || 2}
              title={element.content?.title}
              titleColor={element.content?.titleColor}
              titleAlign={element.content?.titleAlign}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
            />
          </div>
        );

      case "closing":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <ClosingSection
              coupleNames={element.content?.coupleNames}
              message={element.content?.message}
              designerCredit={element.content?.designerCredit}
              socialLinks={element.content?.socialLinks}
              audioUrl={element.content?.audioUrl}
              logoUrl={element.content?.logoUrl}
              coupleNamesAlign={element.content?.coupleNamesAlign}
              messageAlign={element.content?.messageAlign}
              designerCreditAlign={element.content?.designerCreditAlign}
              decorativeFlowers={element.content?.decorativeFlowers}
              flowerStyle={element.content?.flowerStyle}
            />
          </div>
        );

      case "section":
      case "blank":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: element.styles?.backgroundColor || "transparent",
              border: element.type === "blank" ? "2px dashed #d1d5db" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
          >
            {element.type === "blank" ? "Blank Section" : "Section"}
          </div>
        );

      default:
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
          >
            {element.type}
          </div>
        );
    }
  };

  return (
    <div style={containerStyle} onClick={onClick}>
      {renderContent()}
    </div>
  );
}

