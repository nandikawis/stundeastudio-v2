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

interface BlankSectionProps {
  className?: string;
  width?: number;
  height?: number;
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

export default function BlankSection({
  className = "",
  width,
  height,
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
}: BlankSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const sortedChildren = [...(children || [])].sort((a, b) => a.order - b.order);
  const hasChildren = sortedChildren.length > 0;

  const style: React.CSSProperties = {
    width: width ? `${width}px` : "100%",
    height: height ? `${height}px` : hasChildren ? "auto" : "200px",
    minHeight: "200px"
  };

  // Remove border and styling when it has children
  const sectionClassName = hasChildren
    ? `bg-transparent relative ${className}`
    : `bg-background border-2 border-dashed border-gray-300 relative ${className}`;

  return (
    <section 
      ref={sectionRef}
      className={sectionClassName}
      style={style}
    >
      {/* Empty state - only show when no children */}
      {!hasChildren && isEditable && (
        <div className="absolute inset-0 flex items-center justify-center text-center text-muted">
          <div>
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm text-gray-400">Blank Section</p>
            <p className="text-xs text-gray-300 mt-1">Select this section and add components from the sidebar</p>
          </div>
        </div>
      )}

      {/* Nested Components with absolute positioning */}
      {hasChildren && (
        <div className="relative w-full h-full" style={{ minHeight: height || 400 }}>
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
    </section>
  );
}
