"use client";

import { ReactNode } from "react";

interface SelectableComponentProps {
  componentId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children: ReactNode;
}

export default function SelectableComponent({
  componentId,
  isSelected,
  onSelect,
  children
}: SelectableComponentProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(componentId);
      }}
      className={`relative cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-accent ring-offset-2" : "hover:ring-1 hover:ring-accent/50"
      }`}
    >
      {children}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded text-xs font-medium">
          Selected
        </div>
      )}
    </div>
  );
}

