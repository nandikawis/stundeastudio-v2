"use client";

import { componentRegistry } from "./index";
import { ProjectData } from "@/app/lib/mockData";

interface TemplateRendererProps {
  project: ProjectData;
  guestName?: string;
  isPreview?: boolean;
}

export default function TemplateRenderer({ project, guestName, isPreview = false }: TemplateRendererProps) {
  // Sort components by order
  const sortedComponents = [...project.page_structure].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen w-full bg-background">
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
        };

        return (
          <Component
            key={componentConfig.id}
            {...props}
          />
        );
      })}
    </div>
  );
}

