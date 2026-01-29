"use client";

import { useRef, useState } from "react";
import { componentRegistry } from "./index";
import { ProjectData } from "@/app/lib/mockData";

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

  return (
    <>
      <div className="relative min-h-screen w-full bg-background">
        {sortedComponents.map((componentConfig) => {
          const Component = componentRegistry[componentConfig.type];
          
          if (!Component) {
            console.warn(`Component type "${componentConfig.type}" not found`);
            return null;
          }

          // Get component data
          const componentData = project.component_data[componentConfig.id] || {};
          
          // Merge config with data
          // For EventDetails, prioritize component_data over project-level data
          const props = {
            ...componentConfig.config,
            ...componentData,
            // Add event data for EventDetails (use component_data first, then fall back to project-level)
            eventDate: componentData.eventDate || project.event_date,
            eventTime: componentData.eventTime || project.event_time,
            venueName: componentData.venueName || project.venue_name,
            venueAddress: componentData.venueAddress || project.venue_address,
            guestName: guestName,
            // Extra context flags for sections like CoverSection
            isPreview,
            isStandaloneInvitation,
          };

          return (
            <Component
              key={componentConfig.id}
              {...props}
            />
          );
        })}
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

