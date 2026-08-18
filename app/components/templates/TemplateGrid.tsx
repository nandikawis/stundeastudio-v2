"use client";

import { useState, useMemo } from "react";
import TemplateCard from "./TemplateCard";
import type { Template } from "../../lib/templates";

function uniqueSortedValues<T>(items: T[], keyFn: (t: T) => string): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const raw = keyFn(item).trim();
    set.add(raw || "—");
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

interface TemplateGridProps {
  templates: Template[];
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`shrink-0 border-b-2 pb-2 text-sm transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-primary/45 hover:text-primary/70"
      }`}
    >
      <span className="max-w-[12rem] truncate">{label}</span>
    </button>
  );
}

export default function TemplateGrid({ templates: initialTemplates }: TemplateGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryOptions = useMemo(
    () => uniqueSortedValues(initialTemplates, (t) => t.category),
    [initialTemplates]
  );

  const styleOptions = useMemo(
    () => uniqueSortedValues(initialTemplates, (t) => t.style),
    [initialTemplates]
  );

  const filteredTemplates = useMemo(() => {
    let filtered = initialTemplates;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => {
        const v = t.category.trim() || "—";
        return v === selectedCategory;
      });
    }
    if (selectedStyle !== "all") {
      filtered = filtered.filter((t) => {
        const v = t.style.trim() || "—";
        return v === selectedStyle;
      });
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.style.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [selectedCategory, selectedStyle, searchQuery, initialTemplates]);

  return (
    <div className="w-full">
      {/* Search + filters */}
      <div className="flex flex-col gap-10 border-b border-primary/8 pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="relative w-full max-w-sm">
          <label htmlFor="template-search" className="sr-only">
            Cari template
          </label>
          <input
            id="template-search"
            type="text"
            placeholder="Cari nama atau gaya…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-b border-primary/15 bg-transparent py-3 pr-4 text-[15px] text-primary outline-none transition-[border-color] duration-200 placeholder:text-primary/35 focus:border-primary/40"
          />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/35">
              Kategori
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <FilterChip
                label="Semua"
                active={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              />
              {categoryOptions.map((value) => (
                <FilterChip
                  key={`cat-${value}`}
                  label={value}
                  active={selectedCategory === value}
                  onClick={() => setSelectedCategory(value)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/35">
              Style
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <FilterChip
                label="Semua"
                active={selectedStyle === "all"}
                onClick={() => setSelectedStyle("all")}
              />
              {styleOptions.map((value) => (
                <FilterChip
                  key={`style-${value}`}
                  label={value}
                  active={selectedStyle === value}
                  onClick={() => setSelectedStyle(value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-primary/45">
        {filteredTemplates.length} template
        {searchQuery.trim() ? (
          <>
            {" "}
            untuk &ldquo;{searchQuery.trim()}&rdquo;
          </>
        ) : null}
      </p>

      {filteredTemplates.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="mt-16 max-w-sm">
          <h3
            className="text-2xl font-medium tracking-[-0.02em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Tidak ada hasil
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-primary/50">
            Coba kata kunci lain, atau reset filter kategori dan style.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedStyle("all");
            }}
            className="landing-btn landing-btn-ghost mt-6"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
