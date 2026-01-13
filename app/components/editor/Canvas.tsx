"use client";

import { ReactNode, useRef, useEffect, useState, forwardRef } from "react";

interface CanvasProps {
  width: number;
  height: number;
  zoom: number;
  panX: number;
  panY: number;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (panX: number, panY: number) => void;
  children: ReactNode;
  className?: string;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
  width,
  height,
  zoom,
  panX,
  panY,
  onZoomChange,
  onPanChange,
  children,
  className = "",
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Handle zoom with mouse wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onZoomChange) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.25, Math.min(2, zoom * delta));
        onZoomChange(newZoom);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoom, onZoomChange]);

  // Handle pan with middle mouse button
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  useEffect(() => {
    if (!isPanning || !onPanChange) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPanX = e.clientX - panStart.x;
      const newPanY = e.clientY - panStart.y;
      onPanChange(newPanX, newPanY);
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, panStart, onPanChange]);

  const canvasStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: "relative",
    backgroundColor: "#ffffff",
    transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
    transformOrigin: "0 0",
  };

  return (
    <div
      ref={containerRef}
      className={`canvas-container overflow-y-auto overflow-x-hidden ${className}`}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        cursor: isPanning ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={ref}
        className="canvas"
        style={canvasStyle}
      >
        {children}
      </div>
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
