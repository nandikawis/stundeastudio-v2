"use client";

import {
  ADDABLE_SECTIONS,
  type AddableSectionType,
} from "../../lib/sectionDefaults";

interface AddSectionPickerProps {
  onSelect: (type: AddableSectionType) => void;
  onClose: () => void;
}

export default function AddSectionPicker({
  onSelect,
  onClose,
}: AddSectionPickerProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Tutup"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              className="text-lg font-medium tracking-[-0.02em] text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Tambah section
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Pilih jenis section yang ingin ditambahkan
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-muted hover:text-primary"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {ADDABLE_SECTIONS.map((item) => (
            <li key={item.type}>
              <button
                type="button"
                onClick={() => onSelect(item.type)}
                className="flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-background"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-primary">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {item.description}
                  </span>
                </span>
                <span className="shrink-0 text-lg text-accent">+</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
