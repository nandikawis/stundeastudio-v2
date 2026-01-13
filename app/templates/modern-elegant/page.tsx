import TemplateRenderer from "@/app/components/invitation/TemplateRenderer";
import { ProjectData } from "@/app/lib/mockData";

interface ModernElegantTemplateProps {
  project: ProjectData;
  guestName?: string;
}

// This is a template component - it uses the TemplateRenderer
// In the future, you can customize this template's layout/styling
export default function ModernElegantTemplate({ project, guestName }: ModernElegantTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <TemplateRenderer project={project} guestName={guestName} />
    </div>
  );
}

