"use client";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export default function ColorPicker({ label, value, onChange, defaultValue = '#000000' }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <label className="text-xs text-muted">{label}:</label>}
      <input
        type="color"
        value={value || defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 border border-border rounded cursor-pointer"
      />
    </div>
  );
}

