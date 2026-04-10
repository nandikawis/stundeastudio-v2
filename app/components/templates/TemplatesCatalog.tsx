"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateGrid from "./TemplateGrid";
import { mockTemplates } from "../../lib/templates";
import { mapPublicTemplateToTemplate, type PublicTemplateRow } from "../../lib/catalogTemplates";
import type { Template } from "../../lib/templates";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function TemplatesCatalog() {
  const [apiTemplates, setApiTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/templates`, { credentials: "omit" });
        const json = (await res.json().catch(() => null)) as {
          success?: boolean;
          data?: PublicTemplateRow[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!res.ok || json?.success === false) {
          setFetchError(json?.error || res.statusText || "Gagal memuat template");
          setApiTemplates([]);
          return;
        }
        const rows = Array.isArray(json?.data) ? json.data : [];
        setApiTemplates(rows.map((r) => mapPublicTemplateToTemplate(r)));
        setFetchError(null);
      } catch {
        if (!cancelled) {
          setFetchError("Gagal memuat template dari server");
          setApiTemplates([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const merged = useMemo(() => {
    const apiSlugs = new Set(apiTemplates.map((t) => t.slug));
    const rest = mockTemplates.filter((m) => !apiSlugs.has(m.slug));
    return [...apiTemplates, ...rest];
  }, [apiTemplates]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white py-16 text-center text-muted">
        Memuat template…
      </div>
    );
  }

  return (
    <div>
      {fetchError && (
        <p className="text-center text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl py-3 px-4 mb-8">
          {fetchError}. Menampilkan template bawaan.
        </p>
      )}
      <TemplateGrid templates={merged} />
    </div>
  );
}
