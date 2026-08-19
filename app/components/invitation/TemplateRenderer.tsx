"use client";

import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { componentRegistry } from "./index";
import { ProjectData } from "@/app/lib/mockData";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
 * Pick inner content to reveal — not the full section shell (bg / curves).
 * Explicit `[data-invite-reveal]` wins; otherwise headings, copy, cards, media.
 */
function getRevealTargets(root: HTMLElement): HTMLElement[] {
  const marked = Array.from(
    root.querySelectorAll<HTMLElement>("[data-invite-reveal]")
  ).filter((el) => !isShellElement(el));
  if (marked.length) return marked;

  const scope = root.querySelector("section") ?? root;
  const raw = Array.from(
    scope.querySelectorAll<HTMLElement>(
      [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "blockquote",
        "figure",
        "button",
        "img",
        "[class*='rounded-2xl']",
        "[class*='rounded-3xl']",
      ].join(", ")
    )
  );

  const targets: HTMLElement[] = [];
  const seenCarousel = new WeakSet<Element>();

  for (const el of raw) {
    if (targets.length >= 14) break;
    if (isShellElement(el)) continue;
    if (el.getAttribute("aria-hidden") === "true") continue;

    // Carousel / stacked slides: reveal the frame once, not every slide image
    const stackParent = el.closest(".relative");
    if (
      el.tagName === "IMG" &&
      stackParent &&
      stackParent.querySelectorAll("img").length > 2
    ) {
      if (seenCarousel.has(stackParent)) continue;
      seenCarousel.add(stackParent);
      if (
        targets.some((t) => t.contains(stackParent) || stackParent.contains(t))
      ) {
        continue;
      }
      targets.push(stackParent as HTMLElement);
      continue;
    }

    if (
      !el.textContent?.trim() &&
      el.tagName !== "IMG" &&
      !el.querySelector("img")
    ) {
      continue;
    }

    if (targets.some((t) => t.contains(el))) continue;
    for (let i = targets.length - 1; i >= 0; i--) {
      if (el.contains(targets[i])) targets.splice(i, 1);
    }

    targets.push(el);
  }

  return targets;
}

function isAlreadyInView(root: HTMLElement, scrollerEl?: HTMLElement | null) {
  const rootRect = root.getBoundingClientRect();
  if (scrollerEl) {
    const scrollerRect = scrollerEl.getBoundingClientRect();
    return rootRect.top < scrollerRect.top + scrollerRect.height * 0.85;
  }
  return rootRect.top < window.innerHeight * 0.85;
}

type RevealKind = "heading" | "media" | "copy";

function getRevealKind(el: HTMLElement): RevealKind {
  const tag = el.tagName;
  if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4") {
    return "heading";
  }
  if (
    tag === "IMG" ||
    tag === "FIGURE" ||
    el.querySelector("img") ||
    el.className.includes("rounded-2xl") ||
    el.className.includes("rounded-3xl")
  ) {
    return "media";
  }
  return "copy";
}

/**
 * Official GSAP patterns: useGSAP cleanup, matchMedia (reduced motion),
 * timeline + ScrollTrigger (ST on the timeline), autoAlpha + transform aliases.
 * Section shell stays put; already-on-screen sections stay painted.
 */
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

  useGSAP(
    () => {
      if (disabled || !ref.current) return;
      const root = ref.current;
      const targets = getRevealTargets(root);
      if (!targets.length) return;

      // Hero / above-the-fold: leave painted (cover open must not flash blank)
      if (isAlreadyInView(root, scrollerEl)) return;

      const headings = targets.filter((el) => getRevealKind(el) === "heading");
      const media = targets.filter((el) => getRevealKind(el) === "media");
      const copy = targets.filter((el) => getRevealKind(el) === "copy");

      const scrollerOpts = scrollerEl ? { scroller: scrollerEl } : {};

      const mm = gsap.matchMedia();
      mm.add(
        {
          isMotion: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);

          if (reduceMotion) {
            gsap.set(targets, { autoAlpha: 0 });
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: root,
                  start: "clamp(top 85%)",
                  once: true,
                  toggleActions: "play none none none",
                  ...scrollerOpts,
                },
              })
              .to(targets, {
                autoAlpha: 1,
                duration: 0.28,
                stagger: 0.04,
                ease: "power1.out",
              });
            return;
          }

          if (headings.length) {
            gsap.set(headings, { autoAlpha: 0, y: 40, scale: 0.96 });
          }
          if (media.length) {
            gsap.set(media, { autoAlpha: 0, y: 56, scale: 0.92 });
          }
          if (copy.length) {
            gsap.set(copy, { autoAlpha: 0, y: 32, scale: 0.98 });
          }

          const tl = gsap.timeline({
            defaults: { ease: "expo.out", overwrite: "auto" },
            scrollTrigger: {
              trigger: root,
              start: "clamp(top 85%)",
              once: true,
              toggleActions: "play none none none",
              ...scrollerOpts,
            },
          });

          tl.addLabel("enter");
          if (headings.length) {
            tl.to(
              headings,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                stagger: { each: 0.12, from: "start" },
                transformOrigin: "50% 100%",
              },
              "enter"
            );
          }
          if (media.length) {
            tl.to(
              media,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1,
                stagger: { each: 0.14, from: "start" },
                transformOrigin: "50% 50%",
              },
              "enter+=0.1"
            );
          }
          if (copy.length) {
            tl.to(
              copy,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.75,
                stagger: { each: 0.08, from: "start" },
                transformOrigin: "50% 50%",
              },
              "enter+=0.18"
            );
          }
        },
        root
      );

      return () => mm.revert();
    },
    {
      scope: ref,
      dependencies: [disabled, scrollerEl],
      revertOnUpdate: true,
    }
  );

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

  // After cover opens, layout/overflow change — recalc ScrollTrigger positions
  useGSAP(
    () => {
      if (!coverOpen || !contentScrollEl) return;
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    },
    { dependencies: [coverOpen, contentScrollEl] }
  );

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

  const coverLayer = (fullScreen: boolean) =>
    !coverOpen && (
      <div
        className={
          fullScreen
            ? "absolute inset-0 z-50 h-screen w-full overflow-hidden"
            : "absolute inset-0 z-50 h-full w-full overflow-hidden"
        }
      >
        {coverComponents.map((cc, i) =>
          renderSection(cc, i, null, { revealEnabled: false })
        )}
      </div>
    );

  /** Always mounted under the cover so hero is painted before open (no white blank). */
  const contentLayer = (fullScreen: boolean) => (
    <div
      ref={(el) => setContentScrollEl(el ?? null)}
      className={
        fullScreen
          ? "absolute inset-0 z-0 min-h-screen w-full bg-background"
          : "absolute inset-0 z-0 h-full w-full overflow-x-hidden bg-background"
      }
      style={{
        overflowY: coverOpen ? "auto" : "hidden",
        pointerEvents: coverOpen ? "auto" : "none",
      }}
      aria-hidden={!coverOpen}
    >
      {contentScrollEl &&
        contentComponents.map((cc, i) =>
          renderSection(cc, i, contentScrollEl, { revealEnabled: true })
        )}
    </div>
  );

  if (isStandaloneInvitation && coverComponents.length > 0) {
    return (
      <>
        <div className="relative min-h-screen w-full bg-background">
          {coverLayer(true)}
          {contentLayer(true)}
        </div>
        {musicControl}
      </>
    );
  }

  if (isPreview) {
    if (coverComponents.length > 0) {
      return (
        <div className="relative h-full w-full bg-background">
          {coverLayer(false)}
          {contentLayer(false)}
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
