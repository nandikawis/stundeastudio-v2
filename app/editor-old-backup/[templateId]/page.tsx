"use client";

import { useState, useEffect, use } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from "@dnd-kit/core";
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  arrayMove 
} from "@dnd-kit/sortable";
import { mockTemplates } from "../../lib/templates";
import { ProjectData, ComponentConfig } from "../../lib/mockData";
import TemplateRenderer from "../../components/invitation/TemplateRenderer";
import { componentRegistry } from "../../components/invitation";
import ResizableComponent from "../../components/invitation/ResizableComponent";

export default function EditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = use(params);
  const template = mockTemplates.find((t) => t.slug === resolvedParams.templateId);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!project || !over || active.id === over.id) return;

    const oldIndex = project.page_structure.findIndex(c => c.id === active.id);
    const newIndex = project.page_structure.findIndex(c => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newStructure = arrayMove(project.page_structure, oldIndex, newIndex);

    // Update orders
    const updatedStructure = newStructure.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    const updatedProject = {
      ...project,
      page_structure: updatedStructure,
      updated_at: new Date().toISOString()
    };

    setProject(updatedProject);
    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(updatedProject));
  };

  // Initialize project from template
  useEffect(() => {
    if (!template) return;

    const savedProject = localStorage.getItem(`project-${resolvedParams.templateId}`);
    
    if (savedProject) {
      setProject(JSON.parse(savedProject));
    } else {
      const newProject: ProjectData = {
        id: `project-${Date.now()}`,
        user_id: "user-1",
        template_type: template.template_type || template.slug,
        name: `${template.name} - My Project`,
        slug: `${template.slug}-${Date.now()}`,
        status: "draft",
        page_structure: template.templateData.sections.map((section) => ({
          id: section.id,
          type: section.componentType || section.type,
          order: section.order,
          config: section.defaultData || {}
        })),
        component_data: template.templateData.sections.reduce((acc, section) => {
          acc[section.id] = section.defaultData || {};
          return acc;
        }, {} as Record<string, any>),
        is_active: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProject(newProject);
      localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(newProject));
    }
  }, [template, resolvedParams.templateId]);

  const updateComponentData = (componentId: string, data: any) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      component_data: {
        ...project.component_data,
        [componentId]: {
          ...project.component_data[componentId],
          ...data
        }
      },
      updated_at: new Date().toISOString()
    };

    setProject(updatedProject);
    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(updatedProject));
  };

  const handleComponentResize = (componentId: string, width: number, height: number) => {
    if (!project) return;
    updateComponentData(componentId, { width, height });
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        component_data: {
          ...prev.component_data,
          [componentId]: {
            ...prev.component_data[componentId],
            width,
            height
          }
        }
      };
    });
  };

  const handleComponentPositionChange = (componentId: string, x: number, y: number) => {
    if (!project) return;
    updateComponentData(componentId, { x, y });
  };

  const addComponent = (componentType: string, parentId?: string) => {
    if (!project) return;

    const newId = `comp-${Date.now()}`;
    const newComponent: ComponentConfig = {
      id: newId,
      type: componentType,
      order: parentId 
        ? (project.component_data[parentId]?.children?.length || 0) + 1
        : project.page_structure.length + 1,
      config: {}
    };

    // Get default data based on component type
    let defaultData: any = {};
    if (componentType === "BlankSection") {
      defaultData = { width: 800, height: 600, children: [] };
    } else if (componentType === "Hero") {
      defaultData = { width: 800, height: 600, children: [], backgroundImages: [] };
    } else if (componentType === "CountdownTimer") {
      defaultData = { targetDate: new Date().toISOString() };
    } else if (componentType === "ImageCarousel") {
      defaultData = { images: [] };
    }

    // If adding to a parent (BlankSection or Hero), add position and dimensions for free positioning
    if (parentId && !['BlankSection', 'Hero'].includes(componentType)) {
      defaultData = {
        ...defaultData,
        x: Math.floor(Math.random() * 300), // Random initial position
        y: Math.floor(Math.random() * 200),
        width: defaultData.width || 200,
        height: defaultData.height || 100
      };
    }

    const updatedProject = {
      ...project,
      page_structure: parentId 
        ? project.page_structure // Don't add to page_structure if nested
        : [...project.page_structure, newComponent],
      component_data: {
        ...project.component_data,
        [newId]: defaultData,
        // If adding to a parent (BlankSection), add to its children array
        ...(parentId ? {
          [parentId]: {
            ...project.component_data[parentId],
            children: [
              ...(project.component_data[parentId]?.children || []),
              newComponent
            ]
          }
        } : {})
      },
      updated_at: new Date().toISOString()
    };

    setProject(updatedProject);
    setSelectedComponentId(newId);
    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(updatedProject));
  };

  const deleteComponent = (componentId: string) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      page_structure: project.page_structure.filter(c => c.id !== componentId),
      component_data: Object.fromEntries(
        Object.entries(project.component_data).filter(([key]) => key !== componentId)
      ),
      updated_at: new Date().toISOString()
    };

    // Reorder remaining components
    updatedProject.page_structure = updatedProject.page_structure.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setProject(updatedProject);
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(updatedProject));
  };

  const selectedComponent = project?.page_structure.find(c => c.id === selectedComponentId);
  const selectedComponentData = selectedComponentId ? project?.component_data[selectedComponentId] : null;

  // Editor Canvas Component with Drag & Drop
  const EditorCanvas = ({ 
    project, 
    selectedComponentId, 
    onSelectComponent,
    onDeleteComponent
  }: { 
    project: ProjectData; 
    selectedComponentId: string | null;
    onSelectComponent: (id: string) => void;
    onDeleteComponent: (id: string) => void;
  }) => {
    const sortedComponents = [...project.page_structure].sort((a, b) => a.order - b.order);
    const componentIds = sortedComponents.map(c => c.id);

    const handleCanvasClick = () => {
      onSelectComponent("");
      setActiveParentId(null);
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
          <div className="min-h-screen bg-background" onClick={handleCanvasClick}>
            {sortedComponents.map((componentConfig) => {
              const Component = componentRegistry[componentConfig.type];
              
              if (!Component) return null;

              const componentData = project.component_data[componentConfig.id] || {};
              
              // Special handling for container components (BlankSection, Hero)
              if (componentConfig.type === "BlankSection" || componentConfig.type === "Hero") {
                const containerProps = {
                  ...componentConfig.config,
                  ...componentData,
                  isEditable: true,
                  children: componentData.children || [],
                  componentData: componentData.children?.reduce((acc: any, child: ComponentConfig) => {
                    acc[child.id] = project.component_data[child.id] || {};
                    return acc;
                  }, {} as Record<string, any>) || {},
                  projectData: {
                    eventDate: project.event_date,
                    eventTime: project.event_time,
                    venueName: project.venue_name,
                    venueAddress: project.venue_address,
                  },
                  onSelectComponent: (id: string) => {
                    setActiveParentId(componentConfig.id);
                    onSelectComponent(id);
                  },
                  onDeleteComponent: (id: string) => {
                    if (!project) return;
                    const updatedChildren = (componentData.children || []).filter((c: ComponentConfig) => c.id !== id);
                    const updatedComponentData = { ...project.component_data };
                    delete updatedComponentData[id];
                    updatedComponentData[componentConfig.id] = {
                      ...componentData,
                      children: updatedChildren
                    };
                    setProject({
                      ...project,
                      component_data: updatedComponentData
                    });
                    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify({
                      ...project,
                      component_data: updatedComponentData
                    }));
                  },
                  onResize: handleComponentResize,
                  onPositionChange: handleComponentPositionChange,
                  selectedComponentId: activeParentId === componentConfig.id ? selectedComponentId : null,
                  onUpdate: (field: string, value: any) => {
                    // Handle nested component updates
                    if (field.startsWith('children_')) {
                      const [, childId, childField] = field.split('_');
                      const childData = project.component_data[childId] || {};
                      updateComponentData(childId, { ...childData, [childField]: value });
                    } else {
                      updateComponentData(componentConfig.id, { [field]: value });
                    }
                  },
                  width: componentData.width,
                  height: componentData.height
                };

                return (
                  <ResizableComponent
                    key={componentConfig.id}
                    componentId={componentConfig.id}
                    isSelected={selectedComponentId === componentConfig.id}
                    onSelect={(id) => {
                      onSelectComponent(id);
                      setActiveParentId(id);
                    }}
                    onDelete={onDeleteComponent}
                    onResize={handleComponentResize}
                    defaultWidth={componentData.width}
                    defaultHeight={componentData.height}
                  >
                    <Component {...containerProps} />
                  </ResizableComponent>
                );
              }

              const props = {
                ...componentConfig.config,
                ...componentData,
                eventDate: project.event_date,
                eventTime: project.event_time,
                venueName: project.venue_name,
                venueAddress: project.venue_address,
                isEditable: true,
                onUpdate: (field: string, value: any) => {
                  updateComponentData(componentConfig.id, { [field]: value });
                },
                width: componentData.width,
                height: componentData.height
              };

              return (
                <ResizableComponent
                  key={componentConfig.id}
                  componentId={componentConfig.id}
                  isSelected={selectedComponentId === componentConfig.id}
                  onSelect={(id) => {
                    onSelectComponent(id);
                    setActiveParentId(null);
                  }}
                  onDelete={onDeleteComponent}
                  onResize={handleComponentResize}
                  defaultWidth={componentData.width}
                  defaultHeight={componentData.height}
                >
                  <Component {...props} />
                </ResizableComponent>
              );
            })}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && project ? (
            <div className="opacity-50 bg-white rounded-lg shadow-lg p-4 max-w-md">
              {(() => {
                const sorted = [...project.page_structure].sort((a, b) => a.order - b.order);
                const comp = sorted.find(c => c.id === activeId);
                if (!comp) return null;
                const Component = componentRegistry[comp.type];
                if (!Component) return null;
                const componentData = project.component_data[comp.id] || {};
                const props = {
                  ...comp.config,
                  ...componentData,
                  eventDate: project.event_date,
                  eventTime: project.event_time,
                  venueName: project.venue_name,
                  venueAddress: project.venue_address,
                };
                return <Component {...props} />;
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  };

  if (!template || !project) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-16 pb-16 text-center">
          <p className="text-muted">Loading...</p>
        </div>
      </main>
    );
  }

  if (isPreviewMode) {
    return (
      <main className="min-h-screen bg-background">
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
        <div className="pt-16">
          <TemplateRenderer project={project} />
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
            <h1 className="text-lg font-semibold text-primary">{project.name}</h1>
            <span className="px-2 py-1 bg-accent/10 text-accent-dark text-xs rounded-full">
              {template.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewMode(true)}
              className="px-4 py-2 border border-border text-primary rounded-full text-sm hover:bg-background transition-all"
            >
              Preview
            </button>
            <button
              onClick={() => {
                localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(project));
                alert("Project saved!");
              }}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-light transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 flex h-[calc(100vh-5rem)]">
        {/* Left Sidebar - Component Library */}
        <div className="w-64 border-r border-border bg-white overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-primary mb-2">Add Components</h3>
            {activeParentId && selectedComponentId === activeParentId && (
              <div className="mb-2 px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                Adding to: {project?.component_data[activeParentId]?.type === "Hero" ? "Hero" : "Blank Section"}
              </div>
            )}
            <p className="text-xs text-muted mb-4">
              {activeParentId && selectedComponentId === activeParentId 
                ? "Components will be added inside the selected section"
                : "Click to add to page"}
            </p>
            <div className="space-y-2">
              {Object.keys(componentRegistry).filter(name => 
                !['HeroImage', 'TitleSection', 'CoupleNames'].includes(name)
              ).map((componentName) => (
                <button
                  key={componentName}
                  onClick={() => addComponent(componentName, 
                    (activeParentId && selectedComponentId === activeParentId) ? activeParentId : undefined
                  )}
                  className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {componentName.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
              <button
                onClick={() => addComponent("BlankSection")}
                className="w-full text-left px-3 py-2 rounded-lg border-2 border-dashed border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Blank Section
              </button>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8" onClick={() => { setSelectedComponentId(null); setActiveParentId(null); }}>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden min-h-[800px]">
            <EditorCanvas 
              project={project} 
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
              onDeleteComponent={deleteComponent}
            />
          </div>
        </div>

        {/* Right Sidebar - Properties Panel (Simplified - Only Countdown Timer and Image Uploads) */}
        <div className="w-80 border-l border-border bg-white overflow-y-auto">
          <div className="p-4">
            {selectedComponentId && selectedComponent && selectedComponentData ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-primary">Properties</h3>
                  <button
                    onClick={() => { setSelectedComponentId(null); setActiveParentId(null); }}
                    className="text-muted hover:text-primary text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="text-xs text-muted mb-2">
                    {selectedComponent.type}
                  </div>
                  
                  {/* CountdownTimer Properties */}
                  {selectedComponent.type === "CountdownTimer" && (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Target Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={selectedComponentData.targetDate ? new Date(selectedComponentData.targetDate).toISOString().slice(0, 16) : ""}
                        onChange={(e) => updateComponentData(selectedComponentId, { targetDate: new Date(e.target.value).toISOString() })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                      />
                    </div>
                  )}

                  {/* ImageCarousel Properties - Image Upload */}
                  {selectedComponent.type === "ImageCarousel" && (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Image URLs (one per line)
                      </label>
                      <textarea
                        value={Array.isArray(selectedComponentData.images) 
                          ? selectedComponentData.images.map((img: any) => img.url || img).join('\n')
                          : ""}
                        onChange={(e) => {
                          const urls = e.target.value.split('\n').filter(url => url.trim());
                          updateComponentData(selectedComponentId, { 
                            images: urls.map((url, index) => ({ url, alt: `Image ${index + 1}`, order: index + 1 }))
                          });
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                        rows={6}
                        placeholder="https://image1.jpg&#10;https://image2.jpg"
                      />
                      <p className="text-xs text-muted mt-2">
                        Paste image URLs, one per line. Images will appear in the carousel.
                      </p>
                    </div>
                  )}

                  {/* PhotoGalleryGrid Properties - Image Upload */}
                  {selectedComponent.type === "PhotoGalleryGrid" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Columns</label>
                        <select
                          value={selectedComponentData.columns || 2}
                          onChange={(e) => updateComponentData(selectedComponentId, { columns: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                        >
                          <option value={2}>2 Columns</option>
                          <option value={3}>3 Columns</option>
                          <option value={4}>4 Columns</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Image URLs (one per line)
                        </label>
                        <textarea
                          value={Array.isArray(selectedComponentData.images) 
                            ? selectedComponentData.images.map((img: any) => img.url || img).join('\n')
                            : ""}
                          onChange={(e) => {
                            const urls = e.target.value.split('\n').filter(url => url.trim());
                            updateComponentData(selectedComponentId, { 
                              images: urls.map((url, index) => ({ id: `gallery-${index}`, url, alt: `Gallery ${index + 1}` }))
                            });
                          }}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                          rows={8}
                          placeholder="https://image1.jpg&#10;https://image2.jpg"
                        />
                        <p className="text-xs text-muted mt-2">
                          Paste image URLs, one per line. Images will appear in the grid.
                        </p>
                      </div>
                    </>
                  )}

                  {/* HeroSection Background Images */}
                  {selectedComponent.type === "HeroSection" && (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Background Images (URLs, one per line)
                      </label>
                      <textarea
                        value={Array.isArray(selectedComponentData.backgroundImages) 
                          ? selectedComponentData.backgroundImages.join('\n') 
                          : ""}
                        onChange={(e) => updateComponentData(selectedComponentId, { 
                          backgroundImages: e.target.value.split('\n').filter(url => url.trim()) 
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                        rows={4}
                        placeholder="https://image1.jpg&#10;https://image2.jpg"
                      />
                    </div>
                  )}

                  {/* Other components show info message */}
                  {!['CountdownTimer', 'ImageCarousel', 'PhotoGalleryGrid', 'HeroSection'].includes(selectedComponent.type) && (
                    <div className="text-center py-4 text-sm text-muted">
                      <p>Click on text elements to edit them directly.</p>
                      <p className="mt-2 text-xs">This component doesn't require properties.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted text-sm">Select a component to view properties</p>
                <p className="text-xs text-muted mt-2">Properties panel shows settings for timers and image uploads</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
