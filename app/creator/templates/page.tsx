"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PublishTemplateModal from "../../components/creator/PublishTemplateModal";
import { api } from "../../lib/api";
import { styleLabels, templateCategoryLabels } from "../../lib/templates";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CreatorTemplatesPage() {
  const router = useRouter();
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
    let mounted = true;

    const load = async () => {
      try {
        const sessionRes = await fetch(`${API_URL}/api/auth/check-session`, {
          credentials: "include",
        });
        const sessionJson = await sessionRes.json().catch(() => null);

        if (!sessionJson?.success) {
          router.replace("/login");
          return;
        }

        let role = String(sessionJson?.data?.user?.role || "").toLowerCase();
        if (!role) {
          const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
            credentials: "include",
          });
          const profileJson = await profileRes.json().catch(() => null);
          role = String(profileJson?.data?.role || "").toLowerCase();
        }

        if (role !== "creator") {
          router.replace("/");
          return;
        }

        const res = await api.get<CreatorTemplate[]>("/api/templates/mine/list");
        if (!mounted) return;
        if (!res.success) {
          setError(res.error || "Gagal memuat template creator");
          return;
        }
        setTemplates(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Terjadi kesalahan saat memuat halaman");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleRevoke = async (id: string) => {
    if (
      !window.confirm(
        "Unpublish this template? It will be hidden from the public catalog but you can still edit it."
      )
    ) {
      return;
    }
    setRevokingId(id);
    try {
      const res = await api.patch(`/api/templates/${id}`, { is_public: false });
      if (!res.success) {
        window.alert(res.error || "Failed to revoke publication");
        return;
      }
      await reloadTemplates();
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <PublishTemplateModal
        open={publishTemplate != null}
        template={publishTemplate}
        onClose={() => setPublishTemplate(null)}
        onPublished={() => void reloadTemplates()}
      />
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Template Creator</h1>
              <p className="text-muted mt-2">Kelola template Anda dan buat template baru.</p>
            </div>
            <Link
              href="/creator/templates/new"
              className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-all"
            >
              Buat Template
            </Link>
          </div>

          {loading ? (
            <div className="rounded-xl border border-border bg-white p-6 text-muted">Memuat template...</div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-6">{error}</div>
          ) : templates.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center">
              <p className="text-primary font-medium">Belum ada template</p>
              <p className="text-muted mt-1">Mulai dengan membuat template pertama Anda.</p>
              <Link
                href="/creator/templates/new"
                className="inline-block mt-4 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-all"
              >
                Buat Template Pertama
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {templates.map((tpl) => (
                <div key={tpl.id} className="rounded-xl border border-border bg-white p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-primary">{tpl.name}</p>
                    <p className="text-sm text-muted mt-1">/{tpl.slug}</p>
                    <p className="text-xs text-muted mt-2">
                      {templateCategoryLabels[tpl.category ?? ""] || tpl.category || "—"} •{" "}
                      {styleLabels[tpl.style ?? ""] || tpl.style || "—"} • {tpl.is_public ? "Public" : "Private"} •{" "}
                      {tpl.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      href={`/creator/templates/${tpl.id}/edit`}
                      className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-all"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/templates/preview/${tpl.slug}`}
                      className="px-4 py-2 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary/10 transition-all"
                    >
                      Lihat
                    </Link>
                    {!tpl.is_public && (
                      <button
                        type="button"
                        onClick={() => setPublishTemplate(tpl)}
                        className="px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:opacity-90 transition-all"
                      >
                        Publish
                      </button>
                    )}
                    {tpl.is_public && (
                      <button
                        type="button"
                        disabled={revokingId === tpl.id}
                        onClick={() => void handleRevoke(tpl.id)}
                        className="px-4 py-2 border border-amber-700/40 text-amber-900 bg-amber-50 rounded-full text-sm font-medium hover:bg-amber-100 transition-all disabled:opacity-50"
                      >
                        {revokingId === tpl.id ? "Revoking…" : "Revoke"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

