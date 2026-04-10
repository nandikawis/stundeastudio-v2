import type { ProjectData } from "./mockData";
import type { Template, TemplateSection } from "./templates";

/** Build draft project from a built-in mock template (for preview / editor bootstrap). */
export function buildProjectDataFromMockTemplate(t: Template): ProjectData {
  const sections = t.templateData?.sections;
  if (!sections?.length) {
    throw new Error("Template has no sections");
  }
  return {
    id: `project-${t.slug}`,
    user_id: "user-1",
    template_type: t.template_type || t.slug,
    template_slug: t.slug,
    name: t.name,
    slug: t.slug,
    status: "draft",
    page_structure: sections.map((section) => ({
      id: section.id,
      type: section.componentType,
      order: section.order,
      config: {},
    })),
    component_data: sections.reduce((acc, section) => {
      acc[section.id] = section.defaultData || {};
      return acc;
    }, {} as Record<string, unknown>),
    is_active: false,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/** Row from GET /api/templates or GET /api/templates/:idOrSlug */
export type PublicTemplateRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  /** Visual style — raw string from API / DB */
  style?: string | null;
  thumbnail_url?: string | null;
  page_structure?: Array<{
    id: string;
    type: string;
    order: number;
    config?: Record<string, unknown>;
  }>;
  component_data?: Record<string, unknown>;
  is_active?: boolean;
  is_public?: boolean;
};

const DEFAULT_TEMPLATE_CATEGORY = "wedding";
const DEFAULT_TEMPLATE_STYLE = "elegant";

/** Occasion / event type — trim only; preserve casing from API */
export function normalizeTemplateCategory(raw: string | null | undefined): string {
  const v = (raw ?? "").trim();
  return v || DEFAULT_TEMPLATE_CATEGORY;
}

/** Visual style — trim only; preserve casing from API for public display */
export function normalizeTemplateStyle(raw: string | null | undefined): string {
  const v = (raw ?? "").trim();
  return v || DEFAULT_TEMPLATE_STYLE;
}

export function mapPublicTemplateToTemplate(row: PublicTemplateRow): Template {
  const page_structure = Array.isArray(row.page_structure) ? row.page_structure : [];
  const component_data =
    row.component_data && typeof row.component_data === "object" ? row.component_data : {};
  const sections: TemplateSection[] = page_structure.map((ps) => ({
    id: ps.id,
    type: String(ps.type || "section").toLowerCase(),
    componentType: ps.type,
    order: ps.order,
    defaultData: (component_data[ps.id] as Record<string, unknown>) || {},
  }));
  const thumb = row.thumbnail_url?.trim() || "";
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    template_type: row.slug,
    category: normalizeTemplateCategory(row.category),
    style: normalizeTemplateStyle(row.style),
    description: row.description?.trim() || "Undangan digital",
    previewImageUrl: thumb,
    thumbnailUrl: thumb,
    templateData: {
      type: "catalog",
      sections,
      metadata: {
        version: "1",
        responsive: true,
        defaultColors: { primary: "#1a1a1a", accent: "#b49549", background: "#fafafa" },
      },
    },
    isPremium: false,
    isActive: row.is_active !== false,
    useThumbnailCardPreview: Boolean(thumb),
  };
}

export function buildProjectDataFromTemplateApiRow(row: PublicTemplateRow, param: string): ProjectData {
  const page_structure = Array.isArray(row.page_structure) ? row.page_structure : [];
  const component_data =
    row.component_data && typeof row.component_data === "object" ? row.component_data : {};
  return {
    id: `project-${param}`,
    user_id: "user-1",
    template_type: row.slug,
    template_slug: row.slug,
    name: row.name,
    slug: row.slug,
    status: "draft",
    page_structure: page_structure.map((section) => ({
      id: section.id,
      type: section.type,
      order: section.order,
      config:
        section.config && typeof section.config === "object" ? section.config : {},
    })),
    component_data: { ...component_data },
    is_active: false,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
