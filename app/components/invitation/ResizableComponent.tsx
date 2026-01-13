"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ResizableComponentProps {
  componentId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
  children: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export default function ResizableComponent({
  componentId,
  isSelected,
  onSelect,
  onDelete,
  onResize,
  children,
  defaultWidth,
  defaultHeight
}: ResizableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: componentId });

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: defaultWidth || 0, height: defaultHeight || 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current && !defaultWidth && !defaultHeight) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    } else if (defaultWidth && defaultHeight) {
      setDimensions({ width: defaultWidth, height: defaultHeight });
    }
  }, [defaultWidth, defaultHeight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      let newWidth = startDimensions.width;
      let newHeight = startDimensions.height;

      switch (resizeHandle) {
        case 'se': // Southeast (bottom-right)
          newWidth = Math.max(100, startDimensions.width + deltaX);
          newHeight = Math.max(100, startDimensions.height + deltaY);
          break;
        case 'sw': // Southwest (bottom-left)
          newWidth = Math.max(100, startDimensions.width - deltaX);
          newHeight = Math.max(100, startDimensions.height + deltaY);
          break;
        case 'ne': // Northeast (top-right)
          newWidth = Math.max(100, startDimensions.width + deltaX);
          newHeight = Math.max(100, startDimensions.height - deltaY);
          break;
        case 'nw': // Northwest (top-left)
          newWidth = Math.max(100, startDimensions.width - deltaX);
          newHeight = Math.max(100, startDimensions.height - deltaY);
          break;
        case 'e': // East (right)
          newWidth = Math.max(100, startDimensions.width + deltaX);
          break;
        case 'w': // West (left)
          newWidth = Math.max(100, startDimensions.width - deltaX);
          break;
        case 's': // South (bottom)
          newHeight = Math.max(100, startDimensions.height + deltaY);
          break;
        case 'n': // North (top)
          newHeight = Math.max(100, startDimensions.height - deltaY);
          break;
      }

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      if (isResizing && onResize && resizeHandle && dimensions.width > 0 && dimensions.height > 0) {
        onResize(componentId, dimensions.width, dimensions.height);
      }
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, resizeHandle, startPos, startDimensions, dimensions, componentId, onResize]);

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartDimensions({ width: rect.width, height: rect.height });
    setIsResizing(true);
    setResizeHandle(handle);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging || isResizing ? "none" : transition,
    opacity: isDragging ? 0.5 : 1,
    width: dimensions.width > 0 ? `${dimensions.width}px` : "auto",
    height: dimensions.height > 0 ? `${dimensions.height}px` : "auto",
    minWidth: "100px",
    minHeight: "100px"
  };

  const resizeHandleClass = "absolute w-3 h-3 bg-accent border-2 border-white rounded-full cursor-pointer hover:bg-accent-dark z-20 opacity-0 group-hover:opacity-100 transition-opacity";

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(componentId);
      }}
      className={`relative group cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-accent ring-offset-2" : "hover:ring-1 hover:ring-accent/50"
      } ${isDragging ? "z-50" : ""}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-10 top-2 w-8 h-8 bg-accent text-white rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 shadow-md"
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Delete Button */}
      {isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this component?")) {
              onDelete(componentId);
            }
          }}
          className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg"
          title="Delete component"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className={`${resizeHandleClass} top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize`}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            title="Resize"
          />
          <div
            className={`${resizeHandleClass} top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize`}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            title="Resize"
          />
          <div
            className={`${resizeHandleClass} bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize`}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            title="Resize"
          />
          <div
            className={`${resizeHandleClass} bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize`}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            title="Resize"
          />
          {/* Edge handles */}
          <div
            className={`absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-accent border-2 border-white rounded cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-20`}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            title="Resize width"
          />
          <div
            className={`absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-accent border-2 border-white rounded cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-20`}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            title="Resize width"
          />
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-accent border-2 border-white rounded cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity z-20`}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            title="Resize height"
          />
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-3 bg-accent border-2 border-white rounded cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity z-20`}
            onMouseDown={(e) => handleResizeStart(e, 's')}
            title="Resize height"
          />
        </>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-accent border-dashed pointer-events-none" />
      )}

      <div ref={containerRef} className="relative w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
