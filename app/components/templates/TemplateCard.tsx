"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Template } from "../../lib/templates";
import { api, getAccessToken } from "../../lib/api";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseTemplate = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await api.post<{ id: string }>("/api/projects", {
      template_slug: template.slug,
      name: template.name,
    });
    if (res.success && res.data?.id) {
      router.push(`/editor/${res.data.id}`);
    } else {
      setError(res.success === false ? res.error : "Gagal membuat proyek");
      setLoading(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleUseTemplate}
      onKeyDown={(e) => e.key === "Enter" && handleUseTemplate(e as unknown as React.MouseEvent)}
      className="group relative block rounded-2xl overflow-hidden bg-white border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-background">
        <Image
          src={template.thumbnailUrl}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
              Premium
            </span>
          </div>
        )}

        {/* Hover CTA / Loading */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/20">
          {loading ? (
            <div className="px-6 py-3 bg-white rounded-full text-sm text-primary">Membuat proyek...</div>
          ) : (
            <div className="px-6 py-3 bg-white text-primary rounded-full font-medium text-sm shadow-lg">
              Gunakan Template
            </div>
          )}
        </div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
            <div className="px-6 py-3 bg-white rounded-full text-sm text-primary">Membuat proyek...</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-primary group-hover:text-accent-dark transition-colors">
            {template.name}
          </h3>
        </div>
        <p className="text-sm text-muted line-clamp-2 mb-3">
          {template.description}
        </p>
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-accent/10 text-accent-dark text-xs font-medium rounded-full">
            {template.category}
          </span>
        </div>
      </div>
    </div>
  );
}

