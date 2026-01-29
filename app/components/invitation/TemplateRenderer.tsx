"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { componentRegistry } from "./index";
import { ProjectData } from "@/app/lib/mockData";

gsap.registerPlugin(ScrollTrigger);

function FadeInWrap({
  children,
  disabled,
  scrollerEl,
}: {
  children: ReactNode;
  disabled?: boolean;
  /** When content scrolls inside this element (standalone invitation), pass it so ScrollTrigger fires for sections below the fold */
  scrollerEl?: HTMLElement | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (disabled || !ref.current) return;
    const el = ref.current;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
          ...(scrollerEl && { scroller: scrollerEl }),
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [disabled, scrollerEl]);
  if (disabled) return <>{children}</>;
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

interface TemplateRendererProps {
  project: ProjectData;
  guestName?: string;
  isPreview?: boolean;
  /** When true, used on standalone public invitation pages (full viewport canvas) */
  isStandaloneInvitation?: boolean;
}

export default function TemplateRenderer({
  project,
  guestName,
  isPreview = false,
  isStandaloneInvitation = false,
}: TemplateRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [contentScrollEl, setContentScrollEl] = useState<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sort components by order
  const sortedComponents = [...project.page_structure].sort((a, b) => a.order - b.order);

  const toggleAudio = () => {
    if (audioRef.current && project.background_music_url) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const buildProps = (componentConfig: (typeof sortedComponents)[0]) => {
    const componentData = project.component_data[componentConfig.id] || {};
    const base = {
      ...componentConfig.config,
      ...componentData,
      eventDate: componentData.eventDate || project.event_date,
      eventTime: componentData.eventTime || project.event_time,
      venueName: componentData.venueName || project.venue_name,
      venueAddress: componentData.venueAddress || project.venue_address,
      guestName: guestName,
      isPreview,
      isStandaloneInvitation,
    };
    if (componentConfig.type === "CoverSection") {
      return { ...base, onOpened: () => setCoverOpen(true) };
    }
    return base;
  };

  // Standalone invitation: render content behind the cover so hero is painted from first load (avoids white flash when opening cover)
  const coverComponents = sortedComponents.filter((c) => c.type === "CoverSection");
  const contentComponents = sortedComponents.filter((c) => c.type !== "CoverSection");

  const renderSection = (
    componentConfig: (typeof sortedComponents)[0],
    scrollEl?: HTMLDivElement | null
  ) => {
    const Component = componentRegistry[componentConfig.type];
    if (!Component) {
      console.warn(`Component type "${componentConfig.type}" not found`);
      return null;
    }
    const section = (
      <Component key={componentConfig.id} {...buildProps(componentConfig)} />
    );
    const useFade = !isPreview && componentConfig.type !== "CoverSection";
    return useFade ? (
      <FadeInWrap key={componentConfig.id} scrollerEl={scrollEl}>
        {section}
      </FadeInWrap>
    ) : (
      section
    );
  };

  if (isStandaloneInvitation && coverComponents.length > 0) {
    return (
      <>
        <div className="relative min-h-screen w-full bg-background">
          {/* Content layer: sits behind the cover so hero etc. are painted from first load (no white flash when cover opens) */}
          <div
            ref={(el) => setContentScrollEl(el ?? null)}
            className="absolute inset-0 z-0 min-h-screen w-full overflow-y-auto bg-background"
          >
            {contentComponents.map((cc) => renderSection(cc, contentScrollEl))}
          </div>
          {/* Cover layer: only mount while cover is not yet opened; when opened we unmount so content layer is visible */}
          {!coverOpen && (
            <div className="absolute inset-0 z-50 h-screen w-full overflow-hidden">
              {coverComponents.map((cc) => renderSection(cc))}
            </div>
          )}
        </div>
        {project.background_music_url && (
          <>
            <audio ref={audioRef} loop>
              <source src={project.background_music_url} type="audio/mpeg" />
            </audio>
            <button
              onClick={toggleAudio}
              className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isPlaying ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </>
                )}
              </svg>
            </button>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className="relative min-h-screen w-full bg-background">
        {sortedComponents.map((cc) => renderSection(cc))}
      </div>

      {project.background_music_url && (
        <>
          <audio ref={audioRef} loop>
            <source src={project.background_music_url} type="audio/mpeg" />
          </audio>
          <button
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all z-50 flex items-center justify-center border border-border"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </>
              )}
            </svg>
          </button>
        </>
      )}
    </>
  );
}

