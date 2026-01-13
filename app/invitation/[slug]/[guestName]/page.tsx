import { notFound } from "next/navigation";
import { use } from "react";
import { getProjectBySlug, getGuestBySlug } from "@/app/lib/mockData";
import TemplateRenderer from "@/app/components/invitation/TemplateRenderer";

export default function PersonalizedInvitationPage({
  params,
}: {
  params: Promise<{ slug: string; guestName: string }>;
}) {
  const resolvedParams = use(params);
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project || project.status !== "published" || !project.is_active) {
    notFound();
  }

  // Get guest by slug
  const guest = getGuestBySlug(project.id, resolvedParams.guestName);

  return (
    <div className="min-h-screen bg-background">
      <TemplateRenderer project={project} guestName={guest?.name} />
    </div>
  );
}

