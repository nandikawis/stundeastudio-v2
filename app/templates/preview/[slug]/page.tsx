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
    <main className="landing-root flex min-h-screen flex-col bg-[#f7f6f3] text-primary">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-primary/8 bg-[#f7f6f3]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-14">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/templates"
              className="landing-btn landing-btn-ghost !px-3 !py-2 text-sm"
            >
              ← Template
            </Link>
            <div className="min-w-0 hidden sm:block">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/35">
                Preview
              </p>
              <h1
                className="truncate text-lg font-medium tracking-[-0.02em] text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {project?.name ?? (loading ? "Memuat…" : "Template")}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {useError && (
              <span
                className="hidden max-w-[14rem] truncate text-sm text-red-600/90 md:inline"
                title={useError}
              >
                {useError}
              </span>
            )}
            <button
              type="button"
              onClick={() => void handleUseTemplate()}
              disabled={using || !project || !!loadError}
              className="landing-btn landing-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {using ? "Menyimpan…" : "Gunakan template"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        {/* Title under header on smaller screens (desktop uses sticky bar) */}
        <div className="px-5 pt-6 text-center sm:hidden">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/35">
            Preview
          </p>
          <h1
            className="mt-1 text-2xl font-medium tracking-[-0.02em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {project?.name ?? (loading ? "Memuat…" : "Template")}
          </h1>
        </div>

        <section className="flex flex-1 flex-col px-5 pb-16 pt-6 sm:px-8 sm:pt-8 lg:px-14">
          <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center">
            {loading ? (
              <p className="py-24 text-center text-sm text-primary/45">
                Memuat preview…
              </p>
            ) : loadError ? (
              <div className="py-24 text-center">
                <h2
                  className="text-2xl font-medium tracking-[-0.02em] text-primary"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Tidak dapat dimuat
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-[15px] text-primary/50">
                  {loadError}
                </p>
                <Link
                  href="/templates"
                  className="landing-btn landing-btn-primary mt-8 inline-flex"
                >
                  Kembali ke template
                </Link>
              </div>
            ) : project ? (
              <>
                <p className="mb-6 hidden text-[11px] font-medium uppercase tracking-[0.28em] text-primary/35 sm:block">
                  Seperti di HP tamu
                </p>

                <div className="flex w-full flex-1 items-center justify-center">
                  <div
                    className="flex w-full max-w-[390px] flex-col overflow-hidden rounded-[2.25rem] border-[10px] border-neutral-800 bg-white shadow-[0_24px_64px_rgba(45,45,45,0.14)]"
                    style={{
                      width: "min(390px, 100%, calc((100dvh - 9rem) * 9 / 19.5))",
                      aspectRatio: "9 / 19.5",
                      maxHeight: "min(780px, calc(100dvh - 9rem))",
                    }}
                  >
                    <div className="flex h-7 shrink-0 items-center justify-center bg-neutral-800">
                      <div className="h-1.5 w-28 rounded-full bg-neutral-600" />
                    </div>
                    <div className="phone-mockup-scroll min-h-0 flex-1 overflow-hidden">
                      <TemplateRenderer project={project} isPreview />
                    </div>
                  </div>
                </div>

                {useError && (
                  <p className="mt-6 max-w-md text-center text-sm text-red-600/90">
                    {useError}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={() => void handleUseTemplate()}
                    disabled={using}
                    className="landing-btn landing-btn-primary disabled:opacity-50"
                  >
                    {using ? "Menyimpan…" : "Gunakan template"}
                  </button>
                  <Link href="/templates" className="landing-btn landing-btn-ghost">
                    Lihat yang lain
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
