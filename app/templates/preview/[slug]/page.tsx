"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import TemplateRenderer from "../../../components/invitation/TemplateRenderer";
import { mockTemplates } from "../../../lib/templates";
import {
  buildProjectDataFromMockTemplate,
  buildProjectDataFromTemplateApiRow,
  type PublicTemplateRow,
} from "../../../lib/catalogTemplates";
import { stripLegacyBackgroundKeys } from "../../../lib/projectDataUtils";
import type { ProjectData } from "../../../lib/mockData";
import { api, getAccessToken } from "../../../lib/api";

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [using, setUsing] = useState(false);
  const [useError, setUseError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoadError("Template tidak ditemukan");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const mock = mockTemplates.find((t) => t.slug === slug);
      if (mock?.templateData?.sections?.length) {
        try {
          const p = buildProjectDataFromMockTemplate(mock);
          if (!cancelled) setProject(p);
        } catch {
          if (!cancelled) setLoadError("Template tidak valid");
        }
        if (!cancelled) setLoading(false);
        return;
      }

      const res = await api.get<PublicTemplateRow>(`/api/templates/${slug}`);
      if (cancelled) return;
      if (!res.success || !res.data?.page_structure?.length) {
        setLoadError(res.success === false ? res.error : "Template tidak ditemukan");
        setLoading(false);
        return;
      }
      setProject(buildProjectDataFromTemplateApiRow(res.data, slug));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleUseTemplate = async () => {
    if (!project) return;
    const token = getAccessToken();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/templates/preview/${slug}`)}`);
      return;
    }

    setUsing(true);
    setUseError(null);
    try {
      const finalComponentData = stripLegacyBackgroundKeys(project.component_data);
      const res = await api.post<{ id: string } | Record<string, unknown>>("/api/projects", {
        template_slug: slug,
        name: project.name,
        page_structure: project.page_structure,
        component_data: finalComponentData,
        event_date: project.event_date ?? undefined,
        event_time: project.event_time ?? undefined,
        venue_name: project.venue_name ?? undefined,
        venue_address: project.venue_address ?? undefined,
        venue_coordinates: project.venue_coordinates ?? undefined,
      });
      if (!res.success || !res.data) {
        setUseError(res.success === false ? res.error : "Gagal membuat proyek");
        return;
      }
      router.push("/projects");
    } catch (e: unknown) {
      setUseError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setUsing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gray-100 pt-6 pb-10 sm:pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 bg-white/90 backdrop-blur-sm rounded-t-xl px-4 py-4 sm:rounded-xl sm:mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/templates"
                className="shrink-0 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-primary hover:bg-background transition-colors"
              >
                ←
              </Link>
              <h1
                className="text-xl font-semibold text-primary truncate"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {project?.name ?? "Preview template"}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {useError && (
                <span className="text-sm text-red-600 max-w-full sm:max-w-xs truncate" title={useError}>
                  {useError}
                </span>
              )}
              <button
                type="button"
                onClick={() => void handleUseTemplate()}
                disabled={using || !project || !!loadError}
                className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-all disabled:opacity-50 min-h-[44px]"
              >
                {using ? "Menyimpan…" : "Gunakan Template"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-muted py-16">Memuat preview…</div>
          ) : loadError ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{loadError}</p>
              <Link href="/templates" className="text-primary underline">
                Kembali ke daftar template
              </Link>
            </div>
          ) : project ? (
            <div className="flex justify-center items-start min-h-[calc(100vh-10rem)] pb-8">
              {/* Same phone mockup as editor preview mode */}
              <div className="w-[375px] max-w-full bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border-[10px] border-gray-800">
                <div className="h-6 bg-gray-800 flex items-center justify-center shrink-0">
                  <div className="w-32 h-1.5 bg-gray-600 rounded-full" />
                </div>
                <div
                  className="phone-mockup-scroll overflow-y-auto overflow-x-hidden"
                  style={{ height: "calc(100vh - 4rem - 2.5rem)", maxHeight: "800px" }}
                >
                  <TemplateRenderer project={project} isPreview />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  );
}
