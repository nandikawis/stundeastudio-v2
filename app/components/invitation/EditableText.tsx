"use client";

import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span";
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  onResize?: (width: number, height: number) => void;
  isEditable?: boolean;
}

export default function EditableText({
  value,
  onChange,
  className = "",
  placeholder = "Click to edit...",
  multiline = false,
  tag = "p",
  style = {},
  width,
  height,
  onResize,
  isEditable = false
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: width || 0, height: height || 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    if (containerRef.current && !width && !height) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    } else if (width && height) {
      setDimensions({ width, height });
    }
  }, [width, height]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      const newWidth = Math.max(50, startDimensions.width + deltaX);
      const newHeight = multiline ? Math.max(50, startDimensions.height + deltaY) : startDimensions.height;

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      if (isResizing && onResize) {
        onResize(dimensions.width, dimensions.height);
      }
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, startPos, startDimensions, dimensions, onResize, multiline]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartDimensions({ width: rect.width, height: rect.height });
    setIsResizing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const Tag = tag;
  const containerStyle: React.CSSProperties = {
    ...style,
    width: dimensions.width > 0 ? `${dimensions.width}px` : undefined,
    height: multiline && dimensions.height > 0 ? `${dimensions.height}px` : undefined,
    minWidth: "50px",
    minHeight: multiline ? "50px" : undefined
  };

  if (isEditing) {
    if (multiline) {
      return (
        <div ref={containerRef} className="relative inline-block group" style={containerStyle}>
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`${className} outline-none border-2 border-accent rounded px-2 py-1 w-full h-full resize-none`}
            style={{ width: "100%", height: "100%" }}
            rows={Math.max(3, editValue.split("\n").length)}
          />
          {isEditable && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-accent border-2 border-white rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onMouseDown={handleResizeStart}
              title="Resize"
            />
          )}
        </div>
      );
    } else {
      return (
        <div ref={containerRef} className="relative inline-block group" style={containerStyle}>
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`${className} outline-none border-2 border-accent rounded px-2 py-1 w-full`}
            style={{ width: "100%" }}
          />
          {isEditable && (
            <div
              className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-accent border-2 border-white rounded cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onMouseDown={handleResizeStart}
              title="Resize width"
            />
          )}
        </div>
      );
    }
  }

  return (
    <div ref={containerRef} className="relative inline-block group" style={containerStyle}>
      <Tag
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className={`${className} cursor-text hover:bg-accent/10 rounded px-1 transition-colors ${!value ? "text-muted italic" : ""}`}
        style={style}
      >
        {value || placeholder}
      </Tag>
      {isEditable && isEditing && (
        <>
          {multiline ? (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-accent border-2 border-white rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onMouseDown={handleResizeStart}
              title="Resize"
            />
          ) : (
            <div
              className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-accent border-2 border-white rounded cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onMouseDown={handleResizeStart}
              title="Resize width"
            />
          )}
        </>
      )}
    </div>
  );
}
