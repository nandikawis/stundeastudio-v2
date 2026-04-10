"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { api } from "../../../lib/api";
import { mockTemplates, styleLabels, templateCategoryLabels } from "../../../lib/templates";

type SourceTemplateOption = {
  slug: string;
  name: string;
  category: string;
  page_structure: Array<{ id: string; type: string; order: number; config: Record<string, unknown> }>;
  component_data: Record<string, unknown>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function toSourceTemplateOptions(): SourceTemplateOption[] {
  return mockTemplates
    .filter((t) => t.templateData?.sections?.length)
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      category: t.category,
      page_structure: t.templateData.sections.map((section) => ({
        id: section.id,
        type: section.componentType,
        order: section.order,
        config: {},
      })),
      component_data: t.templateData.sections.reduce((acc, section) => {
        acc[section.id] = section.defaultData || {};
        return acc;
      }, {} as Record<string, unknown>),
    }));
}

export default function CreatorNewTemplatePage() {
  const router = useRouter();
  const sources = useMemo(() => toSourceTemplateOptions(), []);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("wedding");
  const [style, setStyle] = useState("elegant");
  const [sourceSlug, setSourceSlug] = useState(sources[0]?.slug || "");

  useEffect(() => {
    let mounted = true;

    const guard = async () => {
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
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void guard();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama template wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const source = sources.find((s) => s.slug === sourceSlug);
      const res = await api.post<{ id: string; slug: string }>("/api/templates", {
        name: name.trim(),
        description: description.trim() || null,
        category: category.trim() || null,
        style: style.trim() || null,
        is_public: false,
        is_active: true,
        page_structure: source?.page_structure ?? [],
        component_data: source?.component_data ?? {},
      });

      if (!res.success) {
        setError(res.error || "Gagal membuat template.");
        return;
      }

      router.push("/creator/templates");
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat membuat template.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Buat Template Baru</h1>
          <p className="text-muted mb-8">
            Buat template dari struktur yang sudah ada. Template disimpan sebagai <strong>private</strong> hingga Anda
            menerbitkannya dari halaman Template Saya.
          </p>

          {loading ? (
            <div className="rounded-xl border border-border bg-white p-6 text-muted">Memuat akses creator...</div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 space-y-5">
              {error && <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-primary mb-2">Nama Template</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Modern Garden"
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Deskripsi singkat template"
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Kategori acara</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  >
                    {Object.entries(templateCategoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Gaya visual</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  >
                    {Object.entries(styleLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">Ambil struktur dari</label>
                <select
                  value={sourceSlug}
                  onChange={(e) => setSourceSlug(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                >
                  {sources.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name} ({s.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-all disabled:opacity-60"
                >
                  {submitting ? "Menyimpan..." : "Simpan Template"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/creator/templates")}
                  className="px-5 py-2.5 border border-border rounded-full text-sm font-medium text-primary hover:bg-background transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

