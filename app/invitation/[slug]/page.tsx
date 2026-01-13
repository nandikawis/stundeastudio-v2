import { notFound } from "next/navigation";
import { use } from "react";
import { getProjectBySlug } from "@/app/lib/mockData";
import TemplateRenderer from "@/app/components/invitation/TemplateRenderer";

export default function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project || project.status !== "published" || !project.is_active) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <TemplateRenderer project={project} />
    </div>
  );
}

