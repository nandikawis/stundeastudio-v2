"use client";

import { useState, useEffect, use } from "react";
import { mockTemplates } from "../../lib/templates";
import { mockProjects, ProjectData } from "../../lib/mockData";
import TemplateRenderer from "../../components/invitation/TemplateRenderer";
import SectionEditor from "../../components/editor/SectionEditor";
import SectionPropertiesPanel from "../../components/editor/SectionPropertiesPanel";

export default function EditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = use(params);
  const template = mockTemplates.find((t) => t.slug === resolvedParams.templateId);
  
  // Editor state - using ProjectData directly
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Initialize from template/project
  useEffect(() => {
    if (!template) return;

    // Try to load saved project
    const savedProjectKey = `project-${resolvedParams.templateId}`;
    const saved = localStorage.getItem(savedProjectKey);
    
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        // If it has page_structure, it's ProjectData format
        if (savedData.page_structure) {
          setProject(savedData as ProjectData);
        } else if (savedData.project) {
          setProject(savedData.project as ProjectData);
        }
      } catch (e) {
        console.error("Error loading saved project:", e);
      }
    } else {
      // Load from mock data if available
      const projectKey = `project-${resolvedParams.templateId}`;
      const mockProject = mockProjects[projectKey];
      if (mockProject) {
        setProject(mockProject);
      } else if (template.templateData?.sections) {
        // Create project from template
        const newProject: ProjectData = {
          id: `project-${resolvedParams.templateId}`,
          user_id: 'user-1',
          template_type: template.template_type || template.slug,
          name: template.name,
          slug: template.slug,
          status: 'draft',
          page_structure: template.templateData.sections.map((section, index) => ({
            id: section.id,
            type: section.componentType,
            order: section.order,
            config: {}
          })),
          component_data: template.templateData.sections.reduce((acc, section) => {
            acc[section.id] = section.defaultData || {};
            return acc;
          }, {} as Record<string, any>),
          is_active: false,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProject(newProject);
      }
    }
  }, [template, resolvedParams.templateId]);

  // Handle project update
  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setProject(updatedProject);
    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(updatedProject));
  };

  // Handle section field update
  const handleSectionFieldUpdate = (sectionId: string, field: string, value: any) => {
    if (!project) return;
    
    const updatedProject = { ...project };
    updatedProject.component_data[sectionId] = {
      ...updatedProject.component_data[sectionId],
      [field]: value
    };
    
    handleProjectUpdate(updatedProject);
  };

  // Save to localStorage
  const saveProject = () => {
    if (!project) return;
    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(project));
  };

  // Preview mode
  if (isPreviewMode && project) {
    return (
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
                <TemplateRenderer project={project} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-primary">{project?.name || template?.name || "Editor"}</h1>
            {template && (
              <span className="px-2 py-1 bg-accent/10 text-accent-dark text-xs rounded-full">
                {template.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewMode(true)}
              className="px-4 py-2 border border-border text-primary rounded-full text-sm hover:bg-background transition-all"
            >
              Preview
            </button>
            <button
              onClick={saveProject}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-light transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 flex h-[calc(100vh-5rem)]">
        {/* Left Sidebar - Event Data */}
        <div className="w-64 border-r border-border bg-white overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-primary mb-4">Event Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Event Date</label>
                <input
                  type="date"
                  value={project?.event_date ? new Date(project.event_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (!project) return;
                    const updatedProject = { ...project, event_date: e.target.value ? new Date(e.target.value).toISOString() : undefined };
                    handleProjectUpdate(updatedProject);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Event Time</label>
                <input
                  type="time"
                  value={project?.event_time || ''}
                  onChange={(e) => {
                    if (!project) return;
                    const updatedProject = { ...project, event_time: e.target.value || undefined };
                    handleProjectUpdate(updatedProject);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Venue Name</label>
                <input
                  type="text"
                  value={project?.venue_name || ''}
                  onChange={(e) => {
                    if (!project) return;
                    const updatedProject = { ...project, venue_name: e.target.value || undefined };
                    handleProjectUpdate(updatedProject);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Venue Address</label>
                <textarea
                  value={project?.venue_address || ''}
                  onChange={(e) => {
                    if (!project) return;
                    const updatedProject = { ...project, venue_address: e.target.value || undefined };
                    handleProjectUpdate(updatedProject);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  rows={2}
                />
              </div>
            </div>
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
              componentData={project.component_data[selectedSectionId] || {}}
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
  );
}
