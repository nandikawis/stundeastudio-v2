"use client";

import { useEffect, useRef } from "react";
import Moveable from "moveable";
import { EditorElement } from "../../lib/editorState";

interface MoveableElementProps {
  element: EditorElement;
  isSelected: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onUpdate: (updates: Partial<EditorElement>) => void;
  onSelect: () => void;
  onDelete?: () => void;
  zoom?: number;
  canvasWidth?: number;
  children: React.ReactNode;
}

export default function MoveableElement({
  element,
  isSelected,
  containerRef,
  onUpdate,
  onSelect,
  onDelete,
  zoom = 1,
  canvasWidth = 375,
  children,
}: MoveableElementProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable | null>(null);

  useEffect(() => {
    if (!targetRef.current || !containerRef.current || !isSelected) {
      if (moveableRef.current) {
        moveableRef.current.destroy();
        moveableRef.current = null;
      }
      return;
    }

    const moveable = new Moveable(containerRef.current, {
      target: targetRef.current,
      draggable: true,
      resizable: true,
      rotatable: true,
      throttleDrag: 0,
      throttleResize: 0,
      throttleRotate: 0,
      keepRatio: element.locked || false,
      origin: false,
      renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
      edge: false,
      zoom: zoom,
    });

    moveableRef.current = moveable;

    let currentX = element.x;
    let currentY = element.y;
    let currentWidth = element.width;
    let currentHeight = element.height;
    let currentRotation = element.rotation;

    // Handle drag
    moveable.on("drag", ({ target, left, top, transform }) => {
      // Clamp X position to keep element within canvas bounds
      const clampedX = Math.max(0, Math.min(left, canvasWidth - currentWidth));
      currentX = clampedX;
      currentY = top;
      target.style.left = `${clampedX}px`;
      target.style.top = `${top}px`;
      target.style.transform = `rotate(${currentRotation}deg)`;
    });

    moveable.on("dragEnd", () => {
      // Ensure element stays within bounds
      const finalX = Math.max(0, Math.min(currentX, canvasWidth - currentWidth));
      onUpdate({
        x: finalX,
        y: currentY,
      });
    });

    // Handle resize
    moveable.on("resize", ({ target, width, height, drag, transform }) => {
      // Clamp width to not exceed canvas width
      const maxWidth = canvasWidth;
      const clampedWidth = Math.min(width, maxWidth);
      currentWidth = clampedWidth;
      currentHeight = height;
      
      const beforeTranslate = drag.beforeTranslate;
      let newX = element.x;
      if (beforeTranslate) {
        newX = element.x + beforeTranslate[0];
      }
      
      // Clamp X position to keep element within canvas bounds
      const clampedX = Math.max(0, Math.min(newX, canvasWidth - clampedWidth));
      currentX = clampedX;
      if (beforeTranslate) {
        currentY = element.y + beforeTranslate[1];
      }
      
      target.style.width = `${clampedWidth}px`;
      target.style.height = `${height}px`;
      target.style.left = `${clampedX}px`;
      target.style.top = `${currentY}px`;
      target.style.transform = `rotate(${currentRotation}deg)`;
    });

    moveable.on("resizeEnd", () => {
      // Ensure element stays within bounds
      const finalWidth = Math.min(currentWidth, canvasWidth);
      const finalX = Math.max(0, Math.min(currentX, canvasWidth - finalWidth));
      onUpdate({
        width: finalWidth,
        height: currentHeight,
        x: finalX,
        y: currentY,
      });
    });

    // Handle rotate
    moveable.on("rotate", ({ target, rotation, transform }) => {
      currentRotation = rotation;
      target.style.transform = `rotate(${rotation}deg)`;
    });

    moveable.on("rotateEnd", () => {
      onUpdate({
        rotation: currentRotation,
      });
    });

    // Update moveable position when element changes externally
    moveable.updateRect();

    return () => {
      moveable.destroy();
      moveableRef.current = null;
    };
  }, [isSelected, element.id, zoom, canvasWidth]); // Only recreate when selection or zoom changes

  // Update element position when element data changes (from external updates)
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.style.left = `${element.x}px`;
      targetRef.current.style.top = `${element.y}px`;
      targetRef.current.style.width = `${element.width}px`;
      targetRef.current.style.height = `${element.height}px`;
      targetRef.current.style.transform = `rotate(${element.rotation}deg)`;
      if (moveableRef.current) {
        moveableRef.current.updateRect();
      }
    }
  }, [element.x, element.y, element.width, element.height, element.rotation, isSelected]);

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: `rotate(${element.rotation}deg)`,
    transformOrigin: "center center",
    zIndex: element.zIndex || 0,
  };

  return (
    <div
      ref={targetRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {children}
      {isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-50 transition-all"
          style={{
            cursor: "pointer",
          }}
          title="Delete element"
        >
          ×
        </button>
      )}
    </div>
  );
}

