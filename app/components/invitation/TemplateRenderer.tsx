"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { componentRegistry } from "./index";
import { ProjectData } from "@/app/lib/mockData";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isShellElement(el: Element): boolean {
  return Boolean(
    el.closest("[data-invite-shell]") ||
      el.closest("svg") ||
      (el instanceof HTMLElement &&
        el.classList.contains("pointer-events-none") &&
        (el.classList.contains("absolute") ||
          el.parentElement?.classList.contains("absolute")))
  );
}

/**
 * Inner content only — never curves, flowers, or full-bleed shells.
 * Prefer `[data-invite-reveal]`; otherwise a small set of text nodes.
 */
function getRevealTargets(root: HTMLElement): HTMLElement[] {
  const marked = Array.from(
    root.querySelectorAll<HTMLElement>("[data-invite-reveal]")
  ).filter((el) => !isShellElement(el));
  if (marked.length) return marked.slice(0, 8);

  const scope = root.querySelector("section") ?? root;
  const raw = Array.from(
    scope.querySelectorAll<HTMLElement>("h1, h2, h3, h4, p, blockquote, figure, button")
  );

  const targets: HTMLElement[] = [];
  for (const el of raw) {
    if (targets.length >= 6) break;
    if (isShellElement(el)) continue;
    if (el.getAttribute("aria-hidden") === "true") continue;
    if (!el.textContent?.trim()) continue;
    if (targets.some((t) => t.contains(el))) continue;
    for (let i = targets.length - 1; i >= 0; i--) {
      if (el.contains(targets[i])) targets.splice(i, 1);
    }
    targets.push(el);
  }
  return targets;
}

function FadeInWrap({
  children,
  disabled,
  scrollerEl,
  className,
}: {
  children: ReactNode;
  disabled?: boolean;
  scrollerEl?: HTMLElement | null;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (disabled || !ref.current) return;
    const root = ref.current;
    const targets = getRevealTargets(root);
    if (!targets.length) return;

    const reduce = prefersReducedMotion();
    gsap.set(targets, reduce ? { opacity: 0 } : { opacity: 0, y: 10 });
    const tween = gsap.to(targets, {
      opacity: 1,
      ...(reduce ? {} : { y: 0 }),
      duration: reduce ? 0.25 : 0.4,
      stagger: 0.05,
      ease: "power2.out",
      overwrite: "auto",
      scrollTrigger: {
        trigger: root,
        start: "top 90%",
        once: true,
        ...(scrollerEl && { scroller: scrollerEl }),
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(targets, { clearProps: "opacity,transform,y" });
    };
  }, [disabled, scrollerEl]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface TemplateRendererProps {
  project: ProjectData;
  guestName?: string;
  guestSlug?: string;
  isPreview?: boolean;
  /** When true, used on standalone public invitation pages (full viewport canvas) */
  isStandaloneInvitation?: boolean;
}

export default function TemplateRenderer({
  project,
  guestName,
  guestSlug,
  isPreview = false,
  isStandaloneInvitation = false,
}: TemplateRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [contentScrollEl, setContentScrollEl] = useState<HTMLDivElement | null>(
    null
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const sortedComponents = [...project.page_structure].sort(
    (a, b) => a.order - b.order
  );

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
    const defaultDateMessage =
      "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.";
    const imageCarouselDefaults =
      componentConfig.id === "image-carousel"
        ? {
            dateMessageDate:
              (componentData as Record<string, unknown>).dateMessageDate ??
              "31.12.2026",
            dateMessageText:
              (componentData as Record<string, unknown>).dateMessageText ??
              defaultDateMessage,
            countdownTargetDate:
              (componentData as Record<string, unknown>).countdownTargetDate ??
              "2026-12-31T08:00:00.000Z",
            dateMessageDateAlign:
              (componentData as Record<string, unknown>).dateMessageDateAlign ??
              "center",
            dateMessageTextAlign:
              (componentData as Record<string, unknown>).dateMessageTextAlign ??
              "center",
          }
        : {};
    const base = {
      ...componentConfig.config,
      ...componentData,
      ...imageCarouselDefaults,
      eventDate: componentData.eventDate || project.event_date,
      eventTime: componentData.eventTime || project.event_time,
      venueName: componentData.venueName || project.venue_name,
      venueAddress: componentData.venueAddress || project.venue_address,
      guestName: guestName,
      guestSlug: guestSlug,
      projectId: project.id,
      isPreview,
      previewMode: isPreview,
      isStandaloneInvitation,
    };
    if (componentConfig.type === "CoverSection") {
      return { ...base, onOpened: () => setCoverOpen(true) };
    }
    return base;
  };

  const coverComponents = sortedComponents.filter(
    (c) => c.type === "CoverSection"
  );
  const contentComponents = sortedComponents.filter(
    (c) => c.type !== "CoverSection"
  );

  const renderSection = (
    componentConfig: (typeof sortedComponents)[0],
    index: number,
    scrollEl?: HTMLDivElement | null,
    opts?: { revealEnabled?: boolean }
  ) => {
    const Component = componentRegistry[componentConfig.type];
    if (!Component) {
      console.warn(`Component type "${componentConfig.type}" not found`);
      return null;
    }
    const seamClass = index > 0 ? "-mt-px" : undefined;
    const section = <Component {...buildProps(componentConfig)} />;
    const useFade =
      !isPreview &&
      componentConfig.type !== "CoverSection" &&
      opts?.revealEnabled !== false;
    return (
      <FadeInWrap
        key={componentConfig.id}
        disabled={!useFade}
        scrollerEl={scrollEl}
        className={seamClass}
      >
        {section}
      </FadeInWrap>
    );
  };

  const musicControl =
    project.background_music_url && (
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </>
            )}
          </svg>
        </button>
      </>
    );

  if (isStandaloneInvitation && coverComponents.length > 0) {
    return (
      <>
        <div className="relative min-h-screen w-full bg-background">
          {/* Cover paints first (DOM order + z-50) so hero never flashes ahead */}
          {!coverOpen && (
            <div className="absolute inset-0 z-50 h-screen w-full overflow-hidden">
              {coverComponents.map((cc, i) =>
                renderSection(cc, i, null, { revealEnabled: false })
              )}
            </div>
          )}
          {/* Content stays mounted but hidden until cover opens */}
          <div
            ref={(el) => setContentScrollEl(el ?? null)}
            className="absolute inset-0 z-0 min-h-screen w-full overflow-y-auto bg-background"
            style={{
              opacity: coverOpen ? 1 : 0,
              visibility: coverOpen ? "visible" : "hidden",
              pointerEvents: coverOpen ? "auto" : "none",
            }}
            aria-hidden={!coverOpen}
          >
            {contentComponents.map((cc, i) =>
              renderSection(cc, i, contentScrollEl, {
                revealEnabled: coverOpen,
              })
            )}
          </div>
        </div>
        {musicControl}
      </>
    );
  }

  if (isPreview) {
    if (coverComponents.length > 0) {
      return (
        <div className="relative h-full w-full bg-background">
          {!coverOpen && (
            <div className="absolute inset-0 z-50 h-full w-full overflow-hidden">
              {coverComponents.map((cc, i) =>
                renderSection(cc, i, null, { revealEnabled: false })
              )}
            </div>
          )}
          <div
            ref={(el) => setContentScrollEl(el ?? null)}
            className="absolute inset-0 z-0 h-full w-full overflow-y-auto overflow-x-hidden bg-background"
            style={{
              opacity: coverOpen ? 1 : 0,
              visibility: coverOpen ? "visible" : "hidden",
              pointerEvents: coverOpen ? "auto" : "none",
            }}
            aria-hidden={!coverOpen}
          >
            {contentComponents.map((cc, i) =>
              renderSection(cc, i, contentScrollEl, {
                revealEnabled: coverOpen,
              })
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-background">
        {sortedComponents.map((cc, i) => renderSection(cc, i))}
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen w-full bg-background">
        {sortedComponents.map((cc, i) => renderSection(cc, i))}
      </div>
      {musicControl}
    </>
  );
}
