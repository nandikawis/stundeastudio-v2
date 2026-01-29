import TemplateRenderer from "@/app/components/invitation/TemplateRenderer";
import {
  getProjectBySlug,
  getProjectById,
  type ProjectData,
} from "@/app/lib/mockData";

// Static preview page for the Modern Elegant template using mock project data
export default function ModernElegantTemplatePage() {
  // Prefer a modern-elegant style project if available, otherwise fall back to project-1
  const candidateProject: ProjectData | undefined =
    getProjectBySlug("bayu-nia-wedding") ??
    getProjectBySlug("bayu-nia-mobile-001") ??
    getProjectById("project-1");

  if (!candidateProject) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted">
          Preview data for the Modern Elegant template is not available.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <TemplateRenderer project={candidateProject} />
    </main>
  );
}


