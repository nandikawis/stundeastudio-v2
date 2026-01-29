"use client";

import { useState } from "react";
import { ProjectData, ComponentConfig } from "../../lib/mockData";
import { componentRegistry } from "../invitation/index";
import SectionDesignPicker from "./SectionDesignPicker";

interface SectionEditorProps {
  project: ProjectData;
  onUpdateProject: (project: ProjectData) => void;
  onSelectSection?: (sectionId: string | null) => void;
  selectedSectionId?: string | null;
  eventData?: {
    eventDate?: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
  };
  // Preview-only image data, keyed by section ID. Allows showing local
  // data URLs without persisting them in ProjectData/localStorage.
  previewImages?: Record<string, { backgroundImageUrl?: string; backgroundImages?: Array<{ url: string; alt?: string; order?: number }>; imageUrl?: string; images?: any[]; logoUrl?: string }>;
}

export default function SectionEditor({
  project,
  onUpdateProject,
  onSelectSection,
  selectedSectionId: externalSelectedSectionId,
  eventData,
  previewImages,
}: SectionEditorProps) {
  const [internalSelectedSectionId, setInternalSelectedSectionId] = useState<string | null>(null);
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const [editMode, setEditMode] = useState<'design' | 'content' | null>(null);

  const selectedSectionId = externalSelectedSectionId !== undefined ? externalSelectedSectionId : internalSelectedSectionId;

  const sortedComponents = [...project.page_structure].sort((a, b) => a.order - b.order);

  const handleSectionClick = (sectionId: string, mode: 'design' | 'content' = 'content') => {
    if (selectedSectionId === sectionId && editMode === mode) {
      // Deselect if clicking the same section in the same mode
      setInternalSelectedSectionId(null);
      setEditMode(null);
      if (onSelectSection) onSelectSection(null);
    } else {
      setInternalSelectedSectionId(sectionId);
      setEditMode(mode);
      if (onSelectSection) onSelectSection(sectionId);
      
      if (mode === 'design') {
        setShowDesignPicker(true);
      }
    }
  };

  const handleDesignSelect = (design: any) => {
    if (!selectedSectionId) return;

    const updatedProject = { ...project };
    const section = updatedProject.page_structure.find(s => s.id === selectedSectionId);
    
    if (section) {
      // Update component type if different
      if (design.componentType && design.componentType !== section.type) {
        section.type = design.componentType;
      }

      // Update component data with design defaults
      if (design.defaultData) {
        updatedProject.component_data[selectedSectionId] = {
          ...updatedProject.component_data[selectedSectionId],
          ...design.defaultData,
          designId: design.id // Also save designId for tracking
        };
      }

      onUpdateProject(updatedProject);
      setShowDesignPicker(false);
      setInternalSelectedSectionId(null);
      if (onSelectSection) onSelectSection(null);
    }
  };

  return (
    <div className="w-full">
      {sortedComponents.map((componentConfig) => {
        const Component = componentRegistry[componentConfig.type];
        const isSelected = selectedSectionId === componentConfig.id;
        
        if (!Component) {
          console.warn(`Component type "${componentConfig.type}" not found`);
          return null;
        }

        const componentData = project.component_data[componentConfig.id] || {};
        const preview = previewImages?.[componentConfig.id] || {};

        // Merge preview data (e.g. data URL images) over persisted component_data
        const mergedData = {
          ...componentData,
          ...preview,
        };

        const isCoverSection = componentConfig.type === 'CoverSection';
        
        const props = {
          ...componentConfig.config,
          ...mergedData,
          // For EventDetails, prioritize mergedData over project-level data
          eventDate: (mergedData as any).eventDate || eventData?.eventDate || project.event_date,
          eventTime: (mergedData as any).eventTime || eventData?.eventTime || project.event_time,
          venueName: (mergedData as any).venueName || eventData?.venueName || project.venue_name,
          venueAddress: (mergedData as any).venueAddress || eventData?.venueAddress || project.venue_address,
          // Pass isEditor and callbacks for CoverSection
          ...(isCoverSection ? { 
            isEditor: true,
            onEditContent: () => handleSectionClick(componentConfig.id, 'content'),
            onChangeDesign: () => handleSectionClick(componentConfig.id, 'design'),
          } : {}),
        };
        
        return (
          <div
            key={componentConfig.id}
            className={`relative w-full group ${
              isSelected ? 'ring-2 ring-accent ring-offset-2' : ''
            }`}
          >
            {/* Section Overlay - Click to Edit (hide for CoverSection since buttons are inside) */}
            {!isSelected && !isCoverSection && (
              <>
                {/* Hover background - non-blocking */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-accent/5 transition-all pointer-events-none z-40" />
                {/* Edit buttons - only these are interactive */}
                <div className="absolute top-2 right-2 opacity-100 group-hover:opacity-100 transition-opacity flex gap-2 z-50 pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionClick(componentConfig.id, 'content');
                    }}
                    className="px-3 py-1 bg-accent text-white rounded-full text-xs font-medium hover:bg-accent-dark transition-all"
                  >
                    Edit Content
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionClick(componentConfig.id, 'design');
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded-full text-xs font-medium hover:bg-gray-700 transition-all"
                  >
                    Change Design
                  </button>
                </div>
              </>
            )}

            {/* Render Component */}
            <Component {...props} />
          </div>
        );
      })}

      {/* Design Picker Modal */}
      {showDesignPicker && selectedSectionId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <SectionDesignPicker
              sectionType={project.page_structure.find(s => s.id === selectedSectionId)?.type || ''}
              currentDesign={project.component_data[selectedSectionId]?.designId}
              onSelectDesign={handleDesignSelect}
              onClose={() => {
                setShowDesignPicker(false);
                setInternalSelectedSectionId(null);
                if (onSelectSection) onSelectSection(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

