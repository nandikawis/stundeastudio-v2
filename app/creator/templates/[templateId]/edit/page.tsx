"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import SectionEditor from "../../../../components/editor/SectionEditor";
import SectionPropertiesPanel from "../../../../components/editor/SectionPropertiesPanel";
import TemplateRenderer from "../../../../components/invitation/TemplateRenderer";
import { api } from "../../../../lib/api";
import type { ProjectData } from "../../../../lib/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type TemplateApiData = {
  id: string;
  slug: string;
  name: string;
  page_structure: ProjectData["page_structure"];
  component_data: Record<string, unknown>;
  updated_at?: string;
};

type SectionPreview = {
  backgroundImageUrl?: string;
  backgroundImages?: Array<{ url: string; alt?: string; order?: number }>;
  imageUrl?: string;
  images?: { url: string; alt?: string; order?: number }[];
  logoUrl?: string;
};

function toEditorProject(tpl: TemplateApiData): ProjectData {
  return {
    id: tpl.id,
    user_id: "creator",
    template_type: tpl.slug,
    template_slug: tpl.slug,
    name: tpl.name || "Untitled Template",
    slug: tpl.slug,
    status: "draft",
    page_structure: Array.isArray(tpl.page_structure) ? tpl.page_structure : [],
    component_data: tpl.component_data && typeof tpl.component_data === "object" ? tpl.component_data : {},
    is_active: true,
    view_count: 0,
    created_at: tpl.updated_at || new Date().toISOString(),
    updated_at: tpl.updated_at || new Date().toISOString(),
  };
}

// Compress image to reduce payload size
async function compressImage(dataUrl: string, maxWidth = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mimeMatch = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      const originalMime = mimeMatch?.[1] || "image/jpeg";
      const outputMime = originalMime === "image/png" ? "image/png" : "image/jpeg";
      const compressedDataUrl = canvas.toDataURL(outputMime, outputMime === "image/jpeg" ? quality : 1.0);
      resolve(compressedDataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function CreatorTemplateEditPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<Record<string, SectionPreview>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // Creator guard
        const sessionRes = await fetch(`${API_URL}/api/auth/check-session`, { credentials: "include" });
        const sessionJson = await sessionRes.json().catch(() => null);
        if (!sessionJson?.success) {
          router.replace("/login");
          return;
        }
        let role = String(sessionJson?.data?.user?.role || "").toLowerCase();
        if (!role) {
          const profileRes = await fetch(`${API_URL}/api/auth/profile`, { credentials: "include" });
          const profileJson = await profileRes.json().catch(() => null);
          role = String(profileJson?.data?.role || "").toLowerCase();
        }
        if (role !== "creator") {
          router.replace("/");
          return;
        }

        const res = await api.get<TemplateApiData>(`/api/templates/${resolvedParams.templateId}`);
        if (!mounted) return;
        if (!res.success || !res.data) {
          setError(res.success === false ? res.error : "Template tidak ditemukan");
          return;
        }
        setProject(toEditorProject(res.data));
      } catch (e: any) {
        if (mounted) setError(e?.message || "Gagal memuat template");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resolvedParams.templateId, router]);

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setProject(updatedProject);
  };

  const handleSectionFieldUpdate = (sectionId: string, field: string, value: any) => {
    if (!project) return;

    if (value === "" || (Array.isArray(value) && value.length === 0)) {
      setPreviewImages((prev) => {
        const sectionPreview = prev[sectionId];
        if (!sectionPreview) return prev;
        const rest: SectionPreview = {};
        if (field !== "backgroundImageUrl" && sectionPreview.backgroundImageUrl !== undefined) rest.backgroundImageUrl = sectionPreview.backgroundImageUrl;
        if (field !== "backgroundImages" && sectionPreview.backgroundImages !== undefined) rest.backgroundImages = sectionPreview.backgroundImages;
        if (field !== "imageUrl" && sectionPreview.imageUrl !== undefined) rest.imageUrl = sectionPreview.imageUrl;
        if (field !== "images" && sectionPreview.images !== undefined) rest.images = sectionPreview.images;
        if (field !== "logoUrl" && sectionPreview.logoUrl !== undefined) rest.logoUrl = sectionPreview.logoUrl;
        if (Object.keys(rest).length === 0) {
          const { [sectionId]: _, ...restSections } = prev;
          return restSections;
        }
        return { ...prev, [sectionId]: rest };
      });
    }

    if (typeof value === 'string' && value.startsWith("data:")) {
      setPreviewImages((prev) => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          [field]: value,
        },
      }));
      return;
    }

    if (Array.isArray(value) && value.length > 0 && typeof value[0]?.url === "string" && value[0].url.startsWith("data:")) {
      setPreviewImages((prev) => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          [field]: value,
        },
      }));
      return;
    }

    const updatedProject: ProjectData = {
      ...project,
      component_data: {
        ...project.component_data,
        [sectionId]: {
          ...project.component_data[sectionId],
          [field]: value,
        },
      },
    };
    handleProjectUpdate(updatedProject);
  };

  const getMergedComponentData = (sectionId: string) => {
    if (!project) return {};
    const baseData = project.component_data[sectionId] || {};
    const previewData = previewImages[sectionId];
    if (!previewData) return baseData;
    return {
      ...baseData,
      ...(previewData.backgroundImages !== undefined ? { backgroundImages: previewData.backgroundImages } : {}),
      ...(previewData.imageUrl !== undefined ? { imageUrl: previewData.imageUrl } : {}),
      ...(previewData.images !== undefined ? { images: previewData.images } : {}),
      ...(previewData.logoUrl !== undefined ? { logoUrl: previewData.logoUrl } : {}),
    };
  };

  const extractDataUrls = (): Array<{ dataUrl: string; fileName: string }> => {
    const dataUrls: Array<{ dataUrl: string; fileName: string }> = [];

    Object.entries(previewImages).forEach(([sectionId, preview]) => {
      if (Array.isArray(preview.backgroundImages)) {
        preview.backgroundImages.forEach((img, idx) => {
          if (img.url?.startsWith("data:")) dataUrls.push({ dataUrl: img.url, fileName: `bg-${sectionId}-${idx}.jpg` });
        });
      }
      if (preview.imageUrl?.startsWith("data:")) dataUrls.push({ dataUrl: preview.imageUrl, fileName: `img-${sectionId}.jpg` });
      if (Array.isArray(preview.images)) {
        preview.images.forEach((img, idx) => {
          if (img.url?.startsWith("data:")) dataUrls.push({ dataUrl: img.url, fileName: `img-${sectionId}-${idx}.jpg` });
        });
      }
      if (preview.logoUrl?.startsWith("data:")) dataUrls.push({ dataUrl: preview.logoUrl, fileName: `logo-${sectionId}.jpg` });
    });

    return dataUrls;
  };

  const replaceDataUrls = (componentData: Record<string, unknown>, urlMap: Map<string, string>) => {
    const replaced = { ...componentData };
    Object.keys(replaced).forEach((sectionId) => {
      const sectionData = replaced[sectionId];
      if (typeof sectionData === "object" && sectionData !== null) {
        const updated: Record<string, unknown> = { ...(sectionData as Record<string, unknown>) };
        Object.keys(updated).forEach((field) => {
          const value = updated[field];
          if (typeof value === "string" && urlMap.has(value)) {
            updated[field] = urlMap.get(value);
          } else if (Array.isArray(value)) {
            updated[field] = value.map((item) => {
              if (typeof item === "object" && item !== null && typeof (item as { url?: string }).url === "string" && urlMap.has((item as { url: string }).url)) {
                return { ...item, url: urlMap.get((item as { url: string }).url) };
              }
              return item;
            });
          }
        });
        replaced[sectionId] = updated;
      }
    });
    return replaced;
  };

  const saveTemplate = async () => {
    if (!project) return;
    setIsSaving(true);
    setSaveStatus("idle");
    setError(null);
    try {
      const dataUrls = extractDataUrls();
      const urlMap = new Map<string, string>();

      if (dataUrls.length > 0) {
        const compressedImages = await Promise.all(
          dataUrls.map(async ({ dataUrl, fileName }) => ({
            base64Image: await compressImage(dataUrl),
            fileName,
            originalDataUrl: dataUrl,
          }))
        );
        const uploadRes = await api.post<Array<{ originalFileName: string; url: string }>>("/api/upload/images", {
          images: compressedImages.map(({ base64Image, fileName }) => ({ base64Image, fileName })),
        });
        if (!uploadRes.success || !uploadRes.data) {
          setSaveStatus("error");
          setError(uploadRes.success === false ? uploadRes.error : "Gagal upload gambar");
          setIsSaving(false);
          return;
        }
        compressedImages.forEach(({ originalDataUrl }, idx) => {
          if (uploadRes.data?.[idx]) urlMap.set(originalDataUrl, uploadRes.data[idx].url);
        });
      }

      let updatedComponentData = project.component_data;
      if (urlMap.size > 0) {
        updatedComponentData = replaceDataUrls(project.component_data, urlMap);
      }

      const mergedComponentData = { ...updatedComponentData } as Record<string, unknown>;
      Object.entries(previewImages).forEach(([sectionId, preview]) => {
        if (!mergedComponentData[sectionId]) mergedComponentData[sectionId] = {};
        const sectionData = mergedComponentData[sectionId] as Record<string, unknown>;
        if (preview.backgroundImages) {
          sectionData.backgroundImages = preview.backgroundImages.map((img) => ({ ...img, url: urlMap.get(img.url) || img.url }));
        }
        if (preview.imageUrl) sectionData.imageUrl = urlMap.get(preview.imageUrl) || preview.imageUrl;
        if (preview.images) {
          sectionData.images = preview.images.map((img) => ({ ...img, url: urlMap.get(img.url) || img.url }));
        }
        if (preview.logoUrl) sectionData.logoUrl = urlMap.get(preview.logoUrl) || preview.logoUrl;
      });

      const payload = {
        name: project.name,
        page_structure: project.page_structure,
        component_data: mergedComponentData,
      };

      const res = await api.patch<TemplateApiData>(`/api/templates/${project.id}`, payload);
      if (!res.success) {
        setSaveStatus("error");
        setError(res.error || "Gagal menyimpan template");
        setIsSaving(false);
        return;
      }

      setPreviewImages({});
      setProject((prev) => (prev ? { ...prev, component_data: mergedComponentData } : prev));
      setSaveStatus("saved");
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e: any) {
      setSaveStatus("error");
      setError(e?.message || "Terjadi kesalahan saat menyimpan template");
    } finally {
      setIsSaving(false);
    }
  };

  const rightPanelSection = useMemo(
    () => (selectedSectionId && project ? project.page_structure.find((s) => s.id === selectedSectionId) : null),
    [project, selectedSectionId]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 max-w-4xl mx-auto px-4 text-muted">Memuat editor template...</div>
      </main>
    );
  }

  if (error && !project) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 max-w-4xl mx-auto px-4">
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-5">{error}</div>
        </div>
      </main>
    );
  }

  if (!project) return null;

  if (isPreviewMode) {
    return (
      <main className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="font-semibold text-primary">Preview Template: {project.name}</h2>
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-light transition-all"
            >
              Kembali ke Editor
            </button>
          </div>
        </div>
        <div className="pt-16">
          <TemplateRenderer project={project} isPreview />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/creator/templates")}
              className="px-3 py-1.5 border border-border text-primary rounded-full text-sm hover:bg-background transition-all"
            >
              Kembali
            </button>
            <input
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg text-sm min-w-[280px]"
              placeholder="Nama template"
            />
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === "saved" && <span className="text-sm text-green-600">Tersimpan</span>}
            {saveStatus === "error" && <span className="text-sm text-red-600">Gagal</span>}
            <button
              onClick={() => setIsPreviewMode(true)}
              className="px-4 py-2 border border-border text-primary rounded-full text-sm hover:bg-background transition-all"
            >
              Preview
            </button>
            <button
              onClick={saveTemplate}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-light transition-all disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan Template"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-gray-100">
          <div className="flex justify-center items-start px-2 pb-4 pt-6 sm:px-4 sm:py-8">
            <div className="w-full max-w-[375px] bg-white shadow-lg">
              <SectionEditor
                project={project}
                onUpdateProject={handleProjectUpdate}
                onSelectSection={setSelectedSectionId}
                selectedSectionId={selectedSectionId}
                eventData={{
                  eventDate: project.event_date,
                  eventTime: project.event_time,
                  venueName: project.venue_name,
                  venueAddress: project.venue_address,
                }}
                previewImages={previewImages}
              />
            </div>
          </div>
        </div>

        <div className="hidden min-h-0 w-80 shrink-0 overflow-y-auto overscroll-y-contain border-l border-border bg-white lg:flex lg:flex-col">
          {rightPanelSection ? (
            <SectionPropertiesPanel
              section={rightPanelSection}
              componentData={getMergedComponentData(rightPanelSection.id)}
              onUpdate={handleSectionFieldUpdate}
              onClose={() => setSelectedSectionId(null)}
            />
          ) : (
            <div className="p-4 text-center text-sm text-muted">Pilih section untuk edit konten template.</div>
          )}
        </div>
      </div>
    </main>
  );
}

