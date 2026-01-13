"use client";

import { useRef } from "react";
import { componentRegistry } from "./index";
import DraggablePositionable from "./DraggablePositionable";

interface ComponentConfig {
  id: string;
  type: string;
  order: number;
  config?: Record<string, any>;
}

interface HeroProps {
  className?: string;
  width?: number;
  height?: number;
  backgroundImages?: string[];
  isEditable?: boolean;
  children?: ComponentConfig[];
  componentData?: Record<string, any>;
  projectData?: {
    eventDate?: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
  };
  onSelectComponent?: (id: string) => void;
  onDeleteComponent?: (id: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
  selectedComponentId?: string | null;
  onUpdate?: (field: string, value: any) => void;
}

export default function Hero({
  className = "",
  width,
  height,
  backgroundImages = [],
  isEditable = false,
  children = [],
  componentData = {},
  projectData,
  onSelectComponent,
  onDeleteComponent,
  onResize,
  onPositionChange,
  selectedComponentId,
  onUpdate
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const sortedChildren = [...(children || [])].sort((a, b) => a.order - b.order);
  const hasChildren = sortedChildren.length > 0;

  const style: React.CSSProperties = {
    width: width ? `${width}px` : "100%",
    height: height ? `${height}px` : "auto",
    minHeight: height ? undefined : "600px"
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative ${className}`}
      style={style}
    >
      {/* Background Images */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="relative w-full h-full">
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  index === 0 ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${image})`,
                  animation: backgroundImages.length > 1 
                    ? `fadeInOut ${backgroundImages.length * 5}s infinite ${index * 5}s`
                    : undefined
                }}
              />
            ))}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      )}

      {/* Curved Bottom Shape (if needed) */}
      {!hasChildren && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-16 fill-background">
            <path d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z" />
          </svg>
        </div>
      )}

      {/* Empty state - only show when no children */}
      {!hasChildren && isEditable && (
        <div className="absolute inset-0 flex items-center justify-center text-center text-muted z-20">
          <div>
            <svg className="w-12 h-12 mx-auto mb-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm text-white/70">Hero Section</p>
            <p className="text-xs text-white/50 mt-1">Select this section and add components from the sidebar</p>
          </div>
        </div>
      )}

      {/* Nested Components with absolute positioning */}
      {hasChildren && (
        <div className="relative w-full h-full z-10" style={{ minHeight: height || 600 }}>
          {sortedChildren.map((childConfig) => {
            const Component = componentRegistry[childConfig.type];
            if (!Component) return null;

            const childData = componentData[childConfig.id] || {};
            const props = {
              ...childConfig.config,
              ...childData,
              eventDate: projectData?.eventDate,
              eventTime: projectData?.eventTime,
              venueName: projectData?.venueName,
              venueAddress: projectData?.venueAddress,
              isEditable: isEditable,
              onUpdate: (field: string, value: any) => {
                if (onUpdate) {
                  onUpdate(`children_${childConfig.id}_${field}`, value);
                }
              }
            };

            // If editable, wrap in DraggablePositionable for free positioning
            if (isEditable && onSelectComponent && onDeleteComponent) {
              return (
                <DraggablePositionable
                  key={childConfig.id}
                  componentId={childConfig.id}
                  isSelected={selectedComponentId === childConfig.id}
                  onSelect={onSelectComponent}
                  onDelete={onDeleteComponent}
                  onResize={onResize}
                  onPositionChange={onPositionChange}
                  defaultWidth={childData.width || 200}
                  defaultHeight={childData.height || 100}
                  defaultX={childData.x || 0}
                  defaultY={childData.y || 0}
                  parentRef={sectionRef}
                >
                  <Component {...props} />
                </DraggablePositionable>
              );
            }

            return (
              <div
                key={childConfig.id}
                style={{
                  position: 'absolute',
                  left: `${childData.x || 0}px`,
                  top: `${childData.y || 0}px`,
                  width: childData.width ? `${childData.width}px` : 'auto',
                  height: childData.height ? `${childData.height}px` : 'auto'
                }}
              >
                <Component {...props} />
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

