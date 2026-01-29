import { notFound } from "next/navigation";
import TemplateRenderer from "@/app/components/invitation/TemplateRenderer";
import { api } from "@/app/lib/api";
import { ProjectData } from "@/app/lib/mockData";

function dbRowToProjectData(row: Record<string, unknown>): ProjectData {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    template_type: row.template_type != null ? String(row.template_type) : undefined,
    template_slug: row.template_slug != null ? String(row.template_slug) : undefined,
    name: String(row.name),
    slug: String(row.slug),
    status: (row.status as ProjectData["status"]) ?? "draft",
    page_structure: Array.isArray(row.page_structure)
      ? (row.page_structure as ProjectData["page_structure"])
      : [],
    component_data:
      row.component_data && typeof row.component_data === "object"
        ? (row.component_data as Record<string, unknown>)
        : {},
    event_date: row.event_date != null ? String(row.event_date) : undefined,
    event_time: row.event_time != null ? String(row.event_time) : undefined,
    venue_name: row.venue_name != null ? String(row.venue_name) : undefined,
    venue_address: row.venue_address != null ? String(row.venue_address) : undefined,
    venue_coordinates: row.venue_coordinates as ProjectData["venue_coordinates"],
    background_music_url:
      row.background_music_url != null ? String(row.background_music_url) : undefined,
    is_active: Boolean(row.is_active ?? true),
    published_at: row.published_at != null ? String(row.published_at) : undefined,
    expires_at: row.expires_at != null ? String(row.expires_at) : undefined,
    view_count: Number(row.view_count ?? 0),
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ projectId: string; projectSlug: string }>;
}) {
  const { projectId } = await params;

  const res = await api.get<Record<string, unknown>>(`/api/projects/${projectId}`);
  if (!res.success || !res.data) {
    notFound();
  }

  const project = dbRowToProjectData(res.data);

  return (
    <div className="min-h-screen bg-background">
      <TemplateRenderer project={project} />
    </div>
  );
}

