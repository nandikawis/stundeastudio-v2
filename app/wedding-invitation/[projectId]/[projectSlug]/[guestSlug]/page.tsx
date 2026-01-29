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

export default async function PersonalizedWeddingInvitationPage({
  params,
}: {
  params: Promise<{ projectId: string; projectSlug: string; guestSlug: string }>;
}) {
  const { projectId, guestSlug } = await params;

  // Use public, unauthenticated endpoint for published invitations
  const res = await api.get<Record<string, unknown>>(
    `/api/projects/public/${projectId}`
  );
  if (!res.success || !res.data) {
    // Show a simple error instead of triggering a 404 so we can see what's wrong
    return (
      <div className="min-h-screen flex items-center justify-center bg-background ">
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-white shadow-lg text-center">
          <h1 className="text-lg font-semibold text-red-600 mb-2">Tidak bisa memuat undangan</h1>
          <p className="text-sm text-gray-700 mb-2">
            Terjadi error saat mengambil data proyek dengan ID:
          </p>
          <code className="block text-xs bg-gray-100 px-2 py-1 rounded mb-3 break-all">
            {projectId}
          </code>
          <p className="text-xs text-gray-500 mb-3">
            Detail error: {("error" in res && typeof res.error === "string") ? res.error : "Unknown error"}
          </p>
          <p className="text-xs text-gray-500">
            Guest slug: <code className="bg-gray-100 px-1 py-0.5 rounded">{guestSlug}</code>
          </p>
        </div>
      </div>
    );
  }

  const project = dbRowToProjectData(res.data);

  // Only allow access to published projects on the public wedding-invitation URL
  if (project.status !== "published") {
    const isArchived = project.status === "archived";
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-white shadow-lg text-center">
          <h1 className="text-lg font-semibold text-primary mb-2">
            {isArchived ? "Undangan telah diarsipkan" : "Undangan belum dipublikasikan"}
          </h1>
          <p className="text-sm text-gray-600">
            {isArchived
              ? "Undangan ini telah diarsipkan oleh pemilik. Link tidak lagi aktif."
              : "Undangan ini belum dipublikasikan oleh pemilik. Silakan cek kembali nanti atau hubungi pemilik undangan."}
          </p>
        </div>
      </div>
    );
  }

  // Derive a display name directly from the guest slug
  const guestDisplayNameFromSlug = decodeURIComponent(guestSlug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      <TemplateRenderer
        project={project}
        guestName={guestDisplayNameFromSlug}
        isStandaloneInvitation
      />
    </div>
  );
}

