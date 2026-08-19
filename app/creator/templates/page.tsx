"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PublishTemplateModal from "../../components/creator/PublishTemplateModal";
import { api } from "../../lib/api";
import { styleLabels, templateCategoryLabels } from "../../lib/templates";
import { useRequireAuth } from "../../lib/useRequireAuth";

type CreatorTemplate = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  style?: string | null;
  is_public?: boolean;
  is_active?: boolean;
  thumbnail_url?: string | null;
  updated_at?: string;
};

export default function CreatorTemplatesPage() {
  const { ready: authReady } = useRequireAuth({ requireCreator: true });
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<CreatorTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [publishTemplate, setPublishTemplate] = useState<CreatorTemplate | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const reloadTemplates = async () => {
    const res = await api.get<CreatorTemplate[]>("/api/templates/mine/list");
    if (res.success && Array.isArray(res.data)) {
      setTemplates(res.data);
    }
  };

  useEffect(() => {
    if (!authReady) return;
    let mounted = true;

    const load = async () => {
      try {
        const res = await api.get<CreatorTemplate[]>("/api/templates/mine/list");
        if (!mounted) return;
        if (!res.success) {
          setError(res.error || "Gagal memuat template creator");
          return;
        }
        setTemplates(Array.isArray(res.data) ? res.data : []);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Terjadi kesalahan saat memuat halaman");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [authReady]);

  const handleRevoke = async (id: string) => {
    if (
      !window.confirm(
        "Unpublish template ini? Akan disembunyikan dari katalog publik, tapi masih bisa diedit."
      )
    ) {
      return;
    }
    setRevokingId(id);
    try {
      const res = await api.patch(`/api/templates/${id}`, { is_public: false });
      if (!res.success) {
        window.alert(res.error || "Gagal unpublish");
        return;
      }
      await reloadTemplates();
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <main className="landing-root flex min-h-screen flex-col bg-[#f7f6f3] text-primary">
      <PublishTemplateModal
        open={publishTemplate != null}
        template={publishTemplate}
        onClose={() => setPublishTemplate(null)}
        onPublished={() => void reloadTemplates()}
      />
      <Navbar />

      {!authReady ? (
        <div className="flex flex-1 items-center justify-center px-5 py-32">
          <p className="text-sm text-primary/45">Memeriksa sesi…</p>
        </div>
      ) : (
      <div className="flex flex-1 flex-col">
        <section className="px-5 pb-8 pt-36 sm:px-8 lg:px-14 lg:pt-40">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary/40">
                Creator
              </p>
              <h1
                className="mt-4 max-w-[14ch] text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[0.95] tracking-[-0.035em] text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Template Anda
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary/50">
                Kelola, edit, dan publikasikan template untuk katalog Stundea.
              </p>
            </div>
            <Link
              href="/creator/templates/new"
              className="landing-btn landing-btn-primary shrink-0"
            >
              Buat template
            </Link>
          </div>
        </section>

        <section className="flex-1 px-5 pb-20 sm:px-8 lg:px-14 lg:pb-28">
          <div className="mx-auto max-w-[1200px]">
            {loading ? (
              <p className="border-t border-primary/8 py-12 text-sm text-primary/45">
                Memuat template…
              </p>
            ) : error ? (
              <p className="border-l-2 border-primary/20 py-4 pl-4 text-sm leading-relaxed text-primary/60">
                {error}
              </p>
            ) : templates.length === 0 ? (
              <div className="border-t border-primary/8 py-16">
                <h2
                  className="text-2xl font-medium tracking-[-0.02em] text-primary"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Belum ada template
                </h2>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-primary/50">
                  Mulai dengan membuat template pertama Anda.
                </p>
                <Link
                  href="/creator/templates/new"
                  className="landing-btn landing-btn-primary mt-8 inline-flex"
                >
                  Buat template pertama
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-primary/8 border-t border-primary/8">
                {templates.map((tpl) => {
                  const category =
                    templateCategoryLabels[tpl.category ?? ""] ||
                    tpl.category ||
                    "—";
                  const style =
                    styleLabels[tpl.style ?? ""] || tpl.style || "—";

                  return (
                    <li
                      key={tpl.id}
                      className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h2
                            className="text-xl font-medium tracking-[-0.02em] text-primary"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {tpl.name}
                          </h2>
                          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary/35">
                            {tpl.is_public ? "Public" : "Private"}
                            <span className="mx-1.5 text-primary/20">·</span>
                            {tpl.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-primary/45">/{tpl.slug}</p>
                        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
                          {category}
                          <span className="mx-2 text-primary/20">·</span>
                          {style}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <Link
                          href={`/creator/templates/${tpl.id}/edit`}
                          className="landing-btn landing-btn-primary !px-4 !py-2 text-sm"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/templates/preview/${tpl.slug}`}
                          className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm"
                        >
                          Lihat
                        </Link>
                        {!tpl.is_public && (
                          <button
                            type="button"
                            onClick={() => setPublishTemplate(tpl)}
                            className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm"
                          >
                            Publish
                          </button>
                        )}
                        {tpl.is_public && (
                          <button
                            type="button"
                            disabled={revokingId === tpl.id}
                            onClick={() => void handleRevoke(tpl.id)}
                            className="landing-btn landing-btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
                          >
                            {revokingId === tpl.id ? "…" : "Unpublish"}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
      )}

      <Footer />
    </main>
  );
}
