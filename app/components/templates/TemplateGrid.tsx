"use client";

import { useState, useMemo } from "react";
import TemplateCard from "./TemplateCard";
import { Template, getAllCategories, getTemplatesByCategory, searchTemplates, categoryLabels } from "../../lib/templates";

interface TemplateGridProps {
  templates: Template[];
}

export default function TemplateGrid({ templates: initialTemplates }: TemplateGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    let filtered = initialTemplates;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = getTemplatesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchTemplates(searchQuery);
      // Also apply category filter if not "all"
      if (selectedCategory !== "all") {
        filtered = filtered.filter(t => t.category === selectedCategory);
      }
    }

    return filtered;
  }, [selectedCategory, searchQuery, initialTemplates]);

  const categories = getAllCategories();

  return (
    <div className="w-full">
      {/* Search Bar */}
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

      {/* Category Filters */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-primary border border-border hover:border-accent hover:text-accent-dark"
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-primary border border-border hover:border-accent hover:text-accent-dark"
              }`}
            >
              {categoryLabels[category] || category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-muted text-sm">
          Menampilkan <span className="font-semibold text-primary">{filteredTemplates.length}</span> template
          {searchQuery && ` untuk "${searchQuery}"`}
        </p>
      </div>

      {/* Template Grid */}
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
          <p className="text-muted">
            Coba cari dengan kata kunci lain atau pilih kategori yang berbeda
          </p>
        </div>
      )}
    </div>
  );
}

