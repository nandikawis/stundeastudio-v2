"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { mockTemplates } from "../../lib/templates";
import { mockProjects, ProjectData } from "../../lib/mockData";
import TemplateRenderer from "../../components/invitation/TemplateRenderer";
import SectionEditor from "../../components/editor/SectionEditor";
import SectionPropertiesPanel from "../../components/editor/SectionPropertiesPanel";
import { api } from "../../lib/api";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isProjectId(param: string): boolean {
  return UUID_REGEX.test(param);
}

// Compress image to reduce payload size
function compressImage(dataUrl: string, maxWidth = 1920, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      
      // Resize if too large
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      // Preserve original image format where possible to keep things like PNG transparency.
      const header = dataUrl.split(",")[0] || "";
      const mimeMatch = header.match(/data:(.*?);base64/);
      const originalMime = mimeMatch?.[1] || "image/jpeg";
      const outputMime = originalMime === "image/png" ? "image/png" : "image/jpeg";
      const compressedDataUrl = canvas.toDataURL(outputMime, outputMime === "image/jpeg" ? quality : 1.0);
      resolve(compressedDataUrl);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function dbRowToProjectData(row: Record<string, unknown>): ProjectData {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    template_type: row.template_type != null ? String(row.template_type) : undefined,
    template_slug: row.template_slug != null ? String(row.template_slug) : undefined,
    name: String(row.name),
    slug: String(row.slug),
    status: (row.status as ProjectData["status"]) ?? "draft",
    page_structure: Array.isArray(row.page_structure) ? row.page_structure as ProjectData["page_structure"] : [],
    component_data: row.component_data && typeof row.component_data === "object" ? row.component_data as Record<string, unknown> : {},
    event_date: row.event_date != null ? String(row.event_date) : undefined,
    event_time: row.event_time != null ? String(row.event_time) : undefined,
    venue_name: row.venue_name != null ? String(row.venue_name) : undefined,
    venue_address: row.venue_address != null ? String(row.venue_address) : undefined,
    venue_coordinates: row.venue_coordinates as ProjectData["venue_coordinates"],
    background_music_url: row.background_music_url != null ? String(row.background_music_url) : undefined,
    is_active: Boolean(row.is_active ?? true),
    published_at: row.published_at != null ? String(row.published_at) : undefined,
    expires_at: row.expires_at != null ? String(row.expires_at) : undefined,
    view_count: Number(row.view_count ?? 0),
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  };
}

export default function EditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const param = resolvedParams.templateId;
  const template = !isProjectId(param) ? mockTemplates.find((t) => t.slug === param) : null;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  type SectionPreview = {
    backgroundImageUrl?: string;
    backgroundImages?: Array<{ url: string; alt?: string; order?: number }>;
    imageUrl?: string;
    images?: { url: string; alt?: string; order?: number }[];
    logoUrl?: string;
  };
  const [previewImages, setPreviewImages] = useState<Record<string, SectionPreview>>({});
  const musicInputRef = useRef<HTMLInputElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load: by project id (API) or by template slug (localStorage / mock / build from template)
  useEffect(() => {
    setLoadError(null);

    if (isProjectId(param)) {
      (async () => {
        const res = await api.get<Record<string, unknown>>(`/api/projects/${param}`);
        if (res.success && res.data) {
          let projectData = dbRowToProjectData(res.data);
          const templateSlug = projectData.template_slug ?? projectData.template_type;
          const hasEmptyStructure = !projectData.page_structure?.length;
          if (hasEmptyStructure && templateSlug) {
            const t = mockTemplates.find((x) => x.slug === templateSlug);
            if (t?.templateData?.sections) {
              projectData = {
                ...projectData,
                template_type: t.template_type ?? t.slug,
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
              };
            }
          }
          setProject(projectData);
        } else {
          setLoadError(res.success === false ? res.error : "Project not found");
        }
      })();
      return;
    }

    const t = mockTemplates.find((x) => x.slug === param);
    if (!t) {
      setLoadError("Template not found");
      return;
    }

    const savedProjectKey = `project-${param}`;
    const saved = typeof window !== "undefined" ? localStorage.getItem(savedProjectKey) : null;
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        if (savedData.page_structure) {
          setProject(savedData as ProjectData);
          return;
        }
        if (savedData.project) {
          setProject(savedData.project as ProjectData);
          return;
        }
      } catch (e) {
        console.error("Error loading saved project:", e);
      }
    }

    const projectKey = `project-${param}`;
    const mockProject = mockProjects[projectKey];
    if (mockProject) {
      setProject(mockProject);
      return;
    }
    if (t.templateData?.sections) {
      const newProject: ProjectData = {
        id: projectKey,
        user_id: "user-1",
        template_type: t.template_type || t.slug,
        name: t.name,
        slug: t.slug,
        status: "draft",
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
        is_active: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProject(newProject);
    }
  }, [param]);

  // Strip legacy background keys and migrate backgroundImageUrl → backgroundImages
  const stripLegacyBackgroundKeys = (componentData: Record<string, unknown>): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    Object.entries(componentData).forEach(([sectionId, sectionData]) => {
      if (typeof sectionData === "object" && sectionData !== null) {
        const data = sectionData as Record<string, unknown>;
        const { backgroundImageUrl, backgroundImageName, ...rest } = data;
        const hasArray = Array.isArray(data.backgroundImages) && data.backgroundImages.length > 0;
        if (typeof backgroundImageUrl === "string" && backgroundImageUrl.trim() && !hasArray) {
          rest.backgroundImages = [{ url: backgroundImageUrl.trim(), alt: (backgroundImageName as string) || "Background Image", order: 1 }];
        }
        out[sectionId] = rest;
      } else {
        out[sectionId] = sectionData;
      }
    });
    return out;
  };

  const persistProject = async (updatedProject: ProjectData) => {
    if (isProjectId(updatedProject.id)) {
      setSaveStatus("saving");
      const componentDataToSave = stripLegacyBackgroundKeys(updatedProject.component_data);
      const res = await api.patch<Record<string, unknown>>(`/api/projects/${updatedProject.id}`, {
        name: updatedProject.name,
        slug: updatedProject.slug,
        status: updatedProject.status,
        page_structure: updatedProject.page_structure,
        component_data: componentDataToSave,
        event_date: updatedProject.event_date,
        event_time: updatedProject.event_time,
        venue_name: updatedProject.venue_name,
        venue_address: updatedProject.venue_address,
        venue_coordinates: updatedProject.venue_coordinates,
        background_music_url: updatedProject.background_music_url ?? null,
      });
      if (res.success) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } else if (typeof window !== "undefined") {
      localStorage.setItem(`project-${param}`, JSON.stringify(updatedProject));
    }
  };

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setProject(updatedProject);
    if (isProjectId(updatedProject.id)) {
      // Check if there are any data URLs in previewImages - if so, skip auto-save
      // (images will be uploaded only on explicit "Simpan" click)
      const hasDataUrls = Object.values(previewImages).some((preview) => {
        return (
          (preview.backgroundImageUrl?.startsWith("data:") ?? false) ||
          (Array.isArray(preview.backgroundImages) && preview.backgroundImages.some((img) => img.url?.startsWith("data:"))) ||
          (preview.imageUrl?.startsWith("data:") ?? false) ||
          (Array.isArray(preview.images) && preview.images.some((img) => img.url?.startsWith("data:"))) ||
          (preview.logoUrl?.startsWith("data:") ?? false)
        );
      });
      
      if (!hasDataUrls) {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => persistProject(updatedProject), 800);
      }
    } else if (typeof window !== "undefined") {
      // For mock/local template editing, keep storing in localStorage
      localStorage.setItem(`project-${param}`, JSON.stringify(updatedProject));
    }
  };

  // Handle section field update
  const handleSectionFieldUpdate = (sectionId: string, field: string, value: any) => {
    if (!project) return;

    // Handle deletion: empty string or empty array should clear both previewImages and component_data
    if (value === "" || (Array.isArray(value) && value.length === 0)) {
      // Clear from previewImages
      setPreviewImages((prev) => {
        const sectionPreview = prev[sectionId];
        if (!sectionPreview) return prev;
        
        // Create new object without the deleted field
        const rest: SectionPreview = {};
        if (field !== "backgroundImageUrl" && sectionPreview.backgroundImageUrl !== undefined) {
          rest.backgroundImageUrl = sectionPreview.backgroundImageUrl;
        }
        if (field !== "backgroundImages" && sectionPreview.backgroundImages !== undefined) {
          rest.backgroundImages = sectionPreview.backgroundImages;
        }
        if (field !== "imageUrl" && sectionPreview.imageUrl !== undefined) {
          rest.imageUrl = sectionPreview.imageUrl;
        }
        if (field !== "images" && sectionPreview.images !== undefined) {
          rest.images = sectionPreview.images;
        }
        if (field !== "logoUrl" && sectionPreview.logoUrl !== undefined) {
          rest.logoUrl = sectionPreview.logoUrl;
        }
        
        if (Object.keys(rest).length === 0) {
          // Remove section entry if no other preview fields
          const { [sectionId]: _, ...restSections } = prev;
          return restSections;
        }
        return {
          ...prev,
          [sectionId]: rest,
        };
      });

      // Clear from component_data; when clearing backgroundImages, also remove legacy keys
      const previousSectionData = project.component_data[sectionId] || {};
      const newSectionData: Record<string, unknown> = {
        ...(previousSectionData as Record<string, unknown>),
        [field]: value,
      };
      if (field === "backgroundImages") {
        delete newSectionData.backgroundImageUrl;
        delete newSectionData.backgroundImageName;
      }

      const updatedProject: ProjectData = {
        ...project,
        component_data: {
          ...project.component_data,
          [sectionId]: newSectionData,
        },
      };
      handleProjectUpdate(updatedProject);

      // For destructive clears on single-image fields, persist immediately
      if (isProjectId(updatedProject.id) && (field === "backgroundImages" || field === "imageUrl" || field === "logoUrl")) {
        // Fire and forget – no need to await here
        void persistProject(updatedProject);
      }
      return;
    }

    // 1) If this is a single image data URL (backgrounds, profile images, etc.),
    // store it only in preview state so we don't fill localStorage with base64.
    if (typeof value === "string" && value.startsWith("data:")) {
      setPreviewImages((prev) => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          [field]: value,
        },
      }));
      return;
    }

    // 2) If this is an array of images with data URLs (carousel, gallery),
    // keep the whole array in preview state.
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

    // 3) Otherwise it's normal data (text, colors, real URLs, etc.) → persist in project.
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

  // Extract all data URLs from previewImages and component_data
  const extractDataUrls = (): Array<{ dataUrl: string; fileName: string; sectionId: string; field: string; isArray?: boolean; index?: number }> => {
    if (!project) return [];
    
    const dataUrls: Array<{ dataUrl: string; fileName: string; sectionId: string; field: string; isArray?: boolean; index?: number }> = [];
    
    // Extract from previewImages
    Object.entries(previewImages).forEach(([sectionId, preview]) => {
      if (Array.isArray(preview.backgroundImages)) {
        preview.backgroundImages.forEach((img, idx) => {
          if (img.url?.startsWith("data:")) {
            dataUrls.push({
              dataUrl: img.url,
              fileName: `bg-${sectionId}-${idx}.jpg`,
              sectionId,
              field: "backgroundImages",
              isArray: true,
              index: idx,
            });
          }
        });
      }
      if (preview.imageUrl?.startsWith("data:")) {
        dataUrls.push({
          dataUrl: preview.imageUrl,
          fileName: `img-${sectionId}.jpg`,
          sectionId,
          field: "imageUrl",
        });
      }
      if (Array.isArray(preview.images)) {
        preview.images.forEach((img, idx) => {
          if (img.url?.startsWith("data:")) {
            dataUrls.push({
              dataUrl: img.url,
              fileName: `img-${sectionId}-${idx}.jpg`,
              sectionId,
              field: "images",
              isArray: true,
              index: idx,
            });
          }
        });
      }
      if (preview.logoUrl?.startsWith("data:")) {
        dataUrls.push({
          dataUrl: preview.logoUrl,
          fileName: `logo-${sectionId}.jpg`,
          sectionId,
          field: "logoUrl",
        });
      }
    });
    
    // Extract from component_data (in case some data URLs slipped through)
    Object.entries(project.component_data || {}).forEach(([sectionId, data]) => {
      if (typeof data === "object" && data !== null) {
        Object.entries(data as Record<string, unknown>).forEach(([field, value]) => {
          if (typeof value === "string" && value.startsWith("data:")) {
            dataUrls.push({
              dataUrl: value,
              fileName: `comp-${sectionId}-${field}.jpg`,
              sectionId,
              field,
            });
          } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null && typeof (value[0] as { url?: string }).url === "string" && (value[0] as { url: string }).url.startsWith("data:")) {
            value.forEach((img: unknown, idx: number) => {
              if (typeof img === "object" && img !== null && typeof (img as { url?: string }).url === "string" && (img as { url: string }).url.startsWith("data:")) {
                dataUrls.push({
                  dataUrl: (img as { url: string }).url,
                  fileName: `comp-${sectionId}-${field}-${idx}.jpg`,
                  sectionId,
                  field,
                  isArray: true,
                  index: idx,
                });
              }
            });
          }
        });
      }
    });
    
    return dataUrls;
  };

  // Replace data URLs with storage URLs in component_data
  const replaceDataUrls = (
    componentData: Record<string, unknown>,
    urlMap: Map<string, string>
  ): Record<string, unknown> => {
    const replaced = { ...componentData };
    Object.keys(replaced).forEach((sectionId) => {
      const sectionData = replaced[sectionId];
      if (typeof sectionData === "object" && sectionData !== null) {
        const updated: Record<string, unknown> = { ...sectionData as Record<string, unknown> };
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

  const saveProject = async () => {
    if (!project) return;
    
    const isUnsavedTemplate = !isProjectId(project.id);

    if (isProjectId(project.id) || isUnsavedTemplate) {
      setIsSaving(true);
      setSaveSuccess(false);
      setSaveStatus("saving");
      
      try {
        // Extract all data URLs
        const dataUrls = extractDataUrls();
        
        // Upload images if there are any
        let urlMap = new Map<string, string>();
        if (dataUrls.length > 0) {
          const compressedImages = await Promise.all(
            dataUrls.map(async ({ dataUrl, fileName }) => ({
              base64Image: await compressImage(dataUrl),
              fileName,
              originalDataUrl: dataUrl,
            }))
          );
          
          const uploadRes = await api.post<Array<{ originalFileName: string; url: string }>>("/api/upload/images", {
            images: compressedImages.map(({ base64Image, fileName }) => ({
              base64Image,
              fileName,
            })),
          });
          
          if (!uploadRes.success || !uploadRes.data) {
            setSaveStatus("error");
            setIsSaving(false);
            return;
          }
          
          compressedImages.forEach(({ originalDataUrl }, idx) => {
            if (uploadRes.data && uploadRes.data[idx]) {
              urlMap.set(originalDataUrl, uploadRes.data[idx].url);
            }
          });
        }
        
        let updatedComponentData = project.component_data;
        if (urlMap.size > 0) {
          updatedComponentData = replaceDataUrls(project.component_data, urlMap);
        }
        
        const mergedComponentData = { ...updatedComponentData };
        Object.entries(previewImages).forEach(([sectionId, preview]) => {
          if (!mergedComponentData[sectionId]) {
            mergedComponentData[sectionId] = {};
          }
          const sectionData = mergedComponentData[sectionId] as Record<string, unknown>;
          if (preview.backgroundImages) {
            sectionData.backgroundImages = preview.backgroundImages.map((img) => ({
              ...img,
              url: urlMap.get(img.url) || img.url,
            }));
          }
          if (preview.imageUrl) {
            sectionData.imageUrl = urlMap.get(preview.imageUrl) || preview.imageUrl;
          }
          if (preview.images) {
            sectionData.images = preview.images.map((img) => ({
              ...img,
              url: urlMap.get(img.url) || img.url,
            }));
          }
          if (preview.logoUrl) {
            sectionData.logoUrl = urlMap.get(preview.logoUrl) || preview.logoUrl;
          }
        });
        
        const finalComponentData = stripLegacyBackgroundKeys(mergedComponentData);
        const updatedProject: ProjectData = {
          ...project,
          component_data: finalComponentData,
        };
        
        if (isUnsavedTemplate) {
          // First save: create project via API; after this, auto-save will be used
          const createRes = await api.post<{ id: string } | Record<string, unknown>>("/api/projects", {
            template_slug: param,
            name: updatedProject.name,
            page_structure: updatedProject.page_structure,
            component_data: finalComponentData,
            event_date: updatedProject.event_date ?? undefined,
            event_time: updatedProject.event_time ?? undefined,
            venue_name: updatedProject.venue_name ?? undefined,
            venue_address: updatedProject.venue_address ?? undefined,
            venue_coordinates: updatedProject.venue_coordinates ?? undefined,
          });
          if (!createRes.success || !createRes.data) {
            setSaveStatus("error");
            setIsSaving(false);
            return;
          }
          const newId = String((createRes.data as { id: string }).id);
          setPreviewImages({});
          setProject({ ...updatedProject, id: newId });
          setSaveStatus("saved");
          setSaveSuccess(true);
          setIsSaving(false);
          setTimeout(() => {
            setSaveSuccess(false);
            setSaveStatus("idle");
          }, 3000);
          router.replace(`/editor/${newId}`);
          return;
        }
        
        await persistProject(updatedProject);
        setPreviewImages({});
        setProject(updatedProject);
        setSaveStatus("saved");
        setSaveSuccess(true);
        setIsSaving(false);
        setTimeout(() => {
          setSaveSuccess(false);
          setSaveStatus("idle");
        }, 3000);
      } catch (error) {
        console.error("Error saving project:", error);
        setSaveStatus("error");
        setIsSaving(false);
      }
    } else if (typeof window !== "undefined") {
      localStorage.setItem(`project-${param}`, JSON.stringify(project));
    }
  };

  if (loadError) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-muted mb-4">{loadError}</p>
          <a href="/projects" className="text-primary underline">Kembali ke Proyek Saya</a>
        </div>
      </main>
    );
  }

  // Save modal overlay
  const SaveModal = () => {
    if (!isSaving && !saveSuccess) return null;
    
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          {isSaving ? (
            <div className="text-center">
              {/* Loading spinner */}
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-primary mb-2">Menyimpan Proyek...</h3>
              <p className="text-sm text-muted mb-4">
                Mohon tunggu, jangan tutup halaman ini
              </p>
              <div className="space-y-2 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Mengunggah gambar...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <span>Menyimpan perubahan...</span>
                </div>
              </div>
            </div>
          ) : saveSuccess ? (
            <div className="text-center">
              {/* Success icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-primary mb-2">Berhasil Disimpan!</h3>
              <p className="text-sm text-muted mb-4">
                Proyek Anda telah berhasil disimpan
              </p>
              <button
                onClick={() => {
                  setSaveSuccess(false);
                  setSaveStatus("idle");
                }}
                className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-colors"
              >
                Tutup
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  // Preview mode
  if (isPreviewMode && project) {
    return (
      <>
        <SaveModal />
        <main className="min-h-screen bg-gray-100">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="font-semibold text-primary">Preview Mode</h2>
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-light transition-all"
            >
              Exit Preview
            </button>
          </div>
        </div>
        <div className="pt-16 pb-8">
          {/* Mobile Preview Container */}
          <div className="flex justify-center items-start min-h-[calc(100vh-4rem)]">
            <div className="w-[375px] bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border-[10px] border-gray-800">
              {/* Mobile Status Bar */}
              <div className="h-6 bg-gray-800 flex items-center justify-center">
                <div className="w-32 h-1.5 bg-gray-600 rounded-full"></div>
              </div>
              {/* Mobile Screen */}
              <div className="overflow-y-auto" style={{ height: 'calc(100vh - 4rem - 2.5rem)', maxHeight: '800px' }}>
                <TemplateRenderer project={project} isPreview />
              </div>
            </div>
          </div>
        </div>
      </main>
      </>
    );
  }

  return (
    <>
      <SaveModal />
      <main className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={project?.name ?? ""}
                placeholder={template?.name ?? "Nama Proyek"}
                onChange={(e) => {
                  if (!project) return;
                  const updated: ProjectData = { ...project, name: e.target.value };
                  handleProjectUpdate(updated);
                }}
                className="text-lg font-semibold text-primary bg-transparent border-b border-transparent focus:border-accent focus:outline-none px-1 py-0.5"
                style={{ fontFamily: "var(--font-playfair)" }}
              />
            </div>
            {(template ?? project?.template_slug) && (
              <span className="px-2 py-1 bg-accent/10 text-accent-dark text-xs rounded-full">
                {template?.name ?? project?.template_slug ?? ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === "saving" && <span className="text-sm text-muted">Menyimpan...</span>}
            {saveStatus === "saved" && <span className="text-sm text-green-600">Tersimpan</span>}
            {saveStatus === "error" && <span className="text-sm text-red-600">Gagal menyimpan</span>}
            <button
              onClick={() => setIsPreviewMode(true)}
              className="px-4 py-2 border border-border text-primary rounded-full text-sm hover:bg-background transition-all"
            >
              Preview
            </button>
            <button
              onClick={saveProject}
              disabled={saveStatus === "saving"}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-light transition-all disabled:opacity-50"
            >
              {project && !isProjectId(project.id) ? "Simpan Proyek" : "Simpan"}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 flex h-[calc(100vh-5rem)]">
        {/* Left Sidebar - Background Music */}
        <div className="w-64 border-r border-border bg-white overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-primary mb-4">Background Music</h3>
            <p className="text-xs text-muted mb-3">
              Unggah musik latar untuk undangan ini. Musik akan diputar di halaman undangan.
            </p>
            {project?.background_music_url ? (
              <div className="space-y-3">
                <audio controls className="w-full">
                  <source src={project.background_music_url} type="audio/mpeg" />
                </audio>
                <button
                  type="button"
                  onClick={async () => {
                    if (!project) return;
                    // Set to undefined for local state (so UI updates immediately)
                    const updatedProject: ProjectData = { ...project, background_music_url: undefined };
                    // Update local state
                    setProject(updatedProject);
                    // Persist immediately with explicit null so backend clears the field
                    if (isProjectId(updatedProject.id)) {
                      await persistProject(updatedProject);
                    }
                  }}
                  className="text-xs text-red-600 underline"
                >
                  Hapus musik
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary mb-1">
                  Unggah file audio
                </label>
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !project) return;

                    const reader = new FileReader();
                    reader.onload = async () => {
                      try {
                        const base64 = reader.result as string;
                        const res = await api.post<{ url: string }>("/api/upload/audio", {
                          base64Audio: base64,
                          fileName: file.name,
                        });
                        if (res.success && res.data?.url) {
                          const updatedProject: ProjectData = {
                            ...project,
                            background_music_url: res.data.url,
                          };
                          handleProjectUpdate(updatedProject);
                        }
                      } catch (err) {
                        console.error("Failed to upload audio", err);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => musicInputRef.current?.click()}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: "#42768E" }}
                >
                  Pilih Musik Latar
                </button>
                <p className="text-[11px] text-muted">
                  Format yang didukung: MP3, OGG, dll. Disarankan &lt; 5MB.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center - Canvas (1:1 with Preview) */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="flex justify-center items-start py-8">
            <div className="w-[375px] bg-white shadow-lg">
              {project ? (
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
              ) : (
                <div className="p-8 text-center text-muted">
                  <p>Loading project...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-border bg-white overflow-y-auto">
          {selectedSectionId && project ? (
            <SectionPropertiesPanel
              section={project.page_structure.find(s => s.id === selectedSectionId)!}
              componentData={(() => {
                const baseData = project.component_data[selectedSectionId] || {};
                const previewData = previewImages[selectedSectionId];
                if (!previewData) return baseData;
                
                // Merge preview data, ensuring empty values override base data
                return {
                  ...baseData,
                  ...(previewData.backgroundImages !== undefined ? { backgroundImages: previewData.backgroundImages } : {}),
                  ...(previewData.imageUrl !== undefined ? { imageUrl: previewData.imageUrl } : {}),
                  ...(previewData.images !== undefined ? { images: previewData.images } : {}),
                  ...(previewData.logoUrl !== undefined ? { logoUrl: previewData.logoUrl } : {}),
                };
              })()}
              onUpdate={handleSectionFieldUpdate}
              onClose={() => setSelectedSectionId(null)}
            />
          ) : (
            <div className="p-4">
              <div className="text-center py-8">
                <h3 className="font-semibold text-primary mb-2">Section Editor</h3>
                <p className="text-muted text-sm mb-4">
                  Click on any section to edit its content
                </p>
                <div className="text-left space-y-2 text-xs text-muted">
                  <p>• Hover over sections to see edit buttons</p>
                  <p>• Click "Edit Content" to edit text and data</p>
                  <p>• Click "Change Design" to change section design</p>
                  <p>• Editor matches preview 1:1</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    </>
  );
}
