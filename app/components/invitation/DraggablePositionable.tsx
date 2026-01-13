"use client";

import { ReactNode, useState, useRef, useEffect, useCallback } from "react";

interface DraggablePositionableProps {
  componentId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
  children: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
  parentRef?: React.RefObject<HTMLElement | null>;
}

export default function DraggablePositionable({
  componentId,
  isSelected,
  onSelect,
  onDelete,
  onResize,
  onPositionChange,
  children,
  defaultWidth,
  defaultHeight,
  defaultX,
  defaultY,
  parentRef
}: DraggablePositionableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const [dimensions, setDimensions] = useState({ 
    width: defaultWidth || 200, 
    height: defaultHeight || 100 
  });
  const [position, setPosition] = useState({ 
    x: defaultX || 0, 
    y: defaultY || 0 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  // Track final values during resize for callback
  const finalDimensionsRef = useRef(dimensions);
  const finalPositionRef = useRef(position);

  // Initialize dimensions only once from props
  useEffect(() => {
    if (!hasInitializedRef.current) {
      if (defaultWidth !== undefined) {
        setDimensions(prev => ({ ...prev, width: defaultWidth }));
        finalDimensionsRef.current = { ...finalDimensionsRef.current, width: defaultWidth };
      }
      if (defaultHeight !== undefined) {
        setDimensions(prev => ({ ...prev, height: defaultHeight }));
        finalDimensionsRef.current = { ...finalDimensionsRef.current, height: defaultHeight };
      }
      if (defaultX !== undefined) {
        setPosition(prev => ({ ...prev, x: defaultX }));
        finalPositionRef.current = { ...finalPositionRef.current, x: defaultX };
      }
      if (defaultY !== undefined) {
        setPosition(prev => ({ ...prev, y: defaultY }));
        finalPositionRef.current = { ...finalPositionRef.current, y: defaultY };
      }
      hasInitializedRef.current = true;
    }
  }, []); // Only run once on mount

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !parentRef?.current) return;

      const parentRect = parentRef.current.getBoundingClientRect();
      const newX = e.clientX - parentRect.left - dragStart.offsetX;
      const newY = e.clientY - parentRect.top - dragStart.offsetY;

      // Keep within bounds
      const boundedX = Math.max(0, Math.min(newX, parentRect.width - dimensions.width));
      const boundedY = Math.max(0, Math.min(newY, parentRect.height - dimensions.height));

      setPosition({ x: boundedX, y: boundedY });
      finalPositionRef.current = { x: boundedX, y: boundedY };
    };

    const handleMouseUp = () => {
      if (isDragging && onPositionChange) {
        onPositionChange(componentId, finalPositionRef.current.x, finalPositionRef.current.y);
      }
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, dimensions, onPositionChange, componentId, parentRef]);

  // Handle resizing
  useEffect(() => {
    let currentWidth = dimensions.width;
    let currentHeight = dimensions.height;
    let currentX = position.x;
    let currentY = position.y;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || !parentRef?.current) return;

      const parentRect = parentRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      let newWidth = startDimensions.width;
      let newHeight = startDimensions.height;
      let newX = startPosition.x;
      let newY = startPosition.y;

      switch (resizeHandle) {
        case 'se':
          newWidth = Math.max(50, startDimensions.width + deltaX);
          newHeight = Math.max(50, startDimensions.height + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(50, startDimensions.width - deltaX);
          newHeight = Math.max(50, startDimensions.height + deltaY);
          newX = startPosition.x + (startDimensions.width - newWidth);
          break;
        case 'ne':
          newWidth = Math.max(50, startDimensions.width + deltaX);
          newHeight = Math.max(50, startDimensions.height - deltaY);
          newY = startPosition.y + (startDimensions.height - newHeight);
          break;
        case 'nw':
          newWidth = Math.max(50, startDimensions.width - deltaX);
          newHeight = Math.max(50, startDimensions.height - deltaY);
          newX = startPosition.x + (startDimensions.width - newWidth);
          newY = startPosition.y + (startDimensions.height - newHeight);
          break;
        case 'e':
          newWidth = Math.max(50, startDimensions.width + deltaX);
          break;
        case 'w':
          newWidth = Math.max(50, startDimensions.width - deltaX);
          newX = startPosition.x + (startDimensions.width - newWidth);
          break;
        case 's':
          newHeight = Math.max(50, startDimensions.height + deltaY);
          break;
        case 'n':
          newHeight = Math.max(50, startDimensions.height - deltaY);
          newY = startPosition.y + (startDimensions.height - newHeight);
          break;
      }

      // Keep within parent bounds
      if (newX + newWidth > parentRect.width) {
        newWidth = parentRect.width - newX;
      }
      if (newY + newHeight > parentRect.height) {
        newHeight = parentRect.height - newY;
      }
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }

      currentWidth = newWidth;
      currentHeight = newHeight;
      currentX = newX;
      currentY = newY;

      setDimensions({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
      finalDimensionsRef.current = { width: newWidth, height: newHeight };
      finalPositionRef.current = { x: newX, y: newY };
    };

    const handleMouseUp = () => {
      if (isResizing) {
        if (onResize && currentWidth > 0 && currentHeight > 0) {
          onResize(componentId, currentWidth, currentHeight);
        }
        if (onPositionChange && (currentX !== startPosition.x || currentY !== startPosition.y)) {
          onPositionChange(componentId, currentX, currentY);
        }
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
  }, [isResizing, resizeHandle, dragStart, startDimensions, startPosition, componentId, onResize, onPositionChange, parentRef]);

  const handleDragStart = (e: React.MouseEvent) => {
    // Don't start dragging if we're clicking on a resize handle or delete button
    const target = e.target as HTMLElement;
    if (target.closest('[data-resize-handle]') || target.closest('[data-delete-button]')) {
      return;
    }
    
    e.stopPropagation();
    if (!containerRef.current || !parentRef?.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      offsetX: e.clientX - containerRect.left,
      offsetY: e.clientY - containerRect.top
    });
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault(); // Also prevent default
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX, y: e.clientY, offsetX: 0, offsetY: 0 });
    setStartDimensions({ width: rect.width, height: rect.height });
    setStartPosition({ x: position.x, y: position.y });
    setIsResizing(true);
    setResizeHandle(handle);
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    cursor: isDragging ? 'grabbing' : 'move',
    zIndex: isSelected ? 10 : 1,
    minWidth: "50px",
    minHeight: "50px"
  };

  const resizeHandleClass = "absolute w-3 h-3 bg-accent border-2 border-white rounded-full cursor-pointer hover:bg-accent-dark z-30";

  return (
    <div
      ref={containerRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(componentId);
      }}
      onMouseDown={handleDragStart}
      className={`relative group ${isSelected ? "ring-2 ring-accent" : ""}`}
    >
      {/* Drag Handle - visible indicator */}
      {isSelected && (
        <div
          className="absolute -left-8 top-2 w-6 h-6 bg-accent text-white rounded cursor-grab active:cursor-grabbing flex items-center justify-center z-20 shadow-md pointer-events-none"
          title="Drag to move"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      )}

      {/* Delete Button */}
      {isSelected && onDelete && (
        <button
          data-delete-button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this component?")) {
              onDelete(componentId);
            }
          }}
          className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-30 shadow-lg"
          title="Delete component"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Resize Handles - Always visible when selected */}
      {isSelected && (
        <>
          <div data-resize-handle className={resizeHandleClass + " top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize"} onMouseDown={(e) => handleResizeStart(e, 'nw')} title="Resize" />
          <div data-resize-handle className={resizeHandleClass + " top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize"} onMouseDown={(e) => handleResizeStart(e, 'ne')} title="Resize" />
          <div data-resize-handle className={resizeHandleClass + " bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize"} onMouseDown={(e) => handleResizeStart(e, 'sw')} title="Resize" />
          <div data-resize-handle className={resizeHandleClass + " bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize"} onMouseDown={(e) => handleResizeStart(e, 'se')} title="Resize" />
          <div data-resize-handle className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-accent border-2 border-white rounded cursor-ew-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'w')} title="Resize width" />
          <div data-resize-handle className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-accent border-2 border-white rounded cursor-ew-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'e')} title="Resize width" />
          <div data-resize-handle className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-accent border-2 border-white rounded cursor-ns-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'n')} title="Resize height" />
          <div data-resize-handle className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-3 bg-accent border-2 border-white rounded cursor-ns-resize z-30" onMouseDown={(e) => handleResizeStart(e, 's')} title="Resize height" />
        </>
      )}

      <div className="relative w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
