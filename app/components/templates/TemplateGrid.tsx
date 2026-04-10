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

export default function TemplateGrid({ templates: initialTemplates }: TemplateGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryOptions = useMemo(
    () => uniqueSortedValues(initialTemplates, (t) => t.category),
    [initialTemplates]
  );

  const styleOptions = useMemo(() => uniqueSortedValues(initialTemplates, (t) => t.style), [initialTemplates]);

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
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Cari template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-full border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted mb-3">Kategori</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-primary border border-border hover:border-accent hover:text-accent-dark"
              }`}
            >
              Semua
            </button>
            {categoryOptions.map((value) => (
              <button
                type="button"
                key={`cat-${value}`}
                onClick={() => setSelectedCategory(value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all max-w-[min(100%,14rem)] truncate ${
                  selectedCategory === value
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-primary border border-border hover:border-accent hover:text-accent-dark"
                }`}
                title={value}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted mb-3">Style</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedStyle("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedStyle === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-primary border border-border hover:border-accent hover:text-accent-dark"
              }`}
            >
              Semua
            </button>
            {styleOptions.map((value) => (
              <button
                type="button"
                key={`style-${value}`}
                onClick={() => setSelectedStyle(value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all max-w-[min(100%,14rem)] truncate ${
                  selectedStyle === value
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-primary border border-border hover:border-accent hover:text-accent-dark"
                }`}
                title={value}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 text-center">
        <p className="text-muted text-sm">
          Menampilkan <span className="font-semibold text-primary">{filteredTemplates.length}</span> template
          {searchQuery && ` untuk "${searchQuery}"`}
        </p>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 text-muted mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-primary mb-2">Template tidak ditemukan</h3>
          <p className="text-muted">Coba kata kunci lain atau ubah filter kategori / style</p>
        </div>
      )}
    </div>
  );
}
