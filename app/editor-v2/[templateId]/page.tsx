"use client";

import { useState, useEffect, use, useRef } from "react";
import { mockTemplates } from "../../lib/templates";
import { migrateProjectData } from "../../lib/migrateData";
import { mockProjects } from "../../lib/mockData";
import { EditorElement, updateElement, deleteElement, createElement } from "../../lib/editorState";
import { convertElementsToProjectData } from "../../lib/convertToProjectData";
import Canvas from "../../components/editor/Canvas";
import ElementRenderer from "../../components/editor/ElementRenderer";
import MoveableElement from "../../components/editor/MoveableElement";
import TemplateRenderer from "../../components/invitation/TemplateRenderer";
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from "../../lib/editorState";

export default function EditorV2Page({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = use(params);
  const template = mockTemplates.find((t) => t.slug === resolvedParams.templateId);
  
  // Editor state
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [canvasWidth] = useState(DEFAULT_CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(DEFAULT_CANVAS_HEIGHT);
  const [project, setProject] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize from template/project
  useEffect(() => {
    if (!template) return;

    // Try to load saved project, or migrate from template
    const savedProjectKey = `project-${resolvedParams.templateId}`;
    const saved = localStorage.getItem(savedProjectKey);
    
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        // If it's old format, migrate it
        if (savedData.page_structure) {
          const migrated = migrateProjectData(savedData);
          setElements(migrated.elements);
          setCanvasHeight(migrated.canvasHeight);
          setProject(savedData); // Keep original project data for event info
        } else if (savedData.elements) {
          // Already in new format
          setElements(savedData.elements);
          setCanvasHeight(savedData.canvasHeight || DEFAULT_CANVAS_HEIGHT);
          setProject(savedData.project || null);
        }
      } catch (e) {
        console.error("Error loading saved project:", e);
      }
    } else {
      // Load from mock data if available
      const projectKey = `project-${resolvedParams.templateId}`;
      const mockProject = mockProjects[projectKey];
      if (mockProject) {
        const migrated = migrateProjectData(mockProject);
        setElements(migrated.elements);
        setCanvasHeight(migrated.canvasHeight);
        setProject(mockProject);
      }
    }
  }, [template, resolvedParams.templateId]);

  // Save to localStorage
  const saveProject = () => {
    const projectData = {
      elements,
      canvasWidth,
      canvasHeight,
      zoom,
      panX,
      panY,
      project, // Keep project metadata
    };
    localStorage.setItem(`project-${resolvedParams.templateId}`, JSON.stringify(projectData));
  };

  // Handle element update
  const handleElementUpdate = (id: string, updates: Partial<EditorElement>) => {
    setElements(prev => updateElement(prev, id, updates));
    saveProject();
  };

  // Handle element selection
  const handleSelectElement = (id: string) => {
    setSelectedElementId(id);
  };

  // Handle canvas click (deselect)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };

  // Add new element
  const handleAddElement = (type: EditorElement['type']) => {
    const newElement = createElement(type, canvasWidth / 2 - 100, canvasHeight / 2 - 50, {
      width: type === 'text' ? 300 : 200,
      height: type === 'text' ? 100 : 200,
    });
    setElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    saveProject();
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    if (confirm("Are you sure you want to delete this element?")) {
      setElements(prev => deleteElement(prev, id));
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
      saveProject();
    }
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  // Convert elements to project data for preview
  const previewProject = project && elements.length > 0 
    ? convertElementsToProjectData(elements, project)
    : null;

  // Preview mode
  if (isPreviewMode && previewProject) {
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
          <TemplateRenderer project={previewProject} />
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
            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(prev => Math.max(0.25, prev - 0.1))}
                className="px-3 py-1 border border-border text-primary rounded-full text-sm hover:bg-background transition-all"
              >
                -
              </button>
              <span className="text-sm w-16 text-center text-muted">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="px-3 py-1 border border-border text-primary rounded-full text-sm hover:bg-background transition-all"
              >
                +
              </button>
            </div>
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
        {/* Left Sidebar - Component Library */}
        <div className="w-64 border-r border-border bg-white overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-primary mb-2">Add Elements</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleAddElement('text')}
                className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Text
              </button>
              <button
                onClick={() => handleAddElement('image')}
                className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Image
              </button>
              <button
                onClick={() => handleAddElement('shape')}
                className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Shape
              </button>
              <button
                onClick={() => handleAddElement('countdown')}
                className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Countdown Timer
              </button>
              <button
                onClick={() => handleAddElement('carousel')}
                className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Image Carousel
              </button>
              <button
                onClick={() => handleAddElement('section')}
                className="w-full text-left px-3 py-2 rounded-lg border-2 border-dashed border-border hover:bg-background hover:border-accent transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Blank Section
              </button>
            </div>

            {/* Event Data Panel */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-semibold text-primary mb-4">Event Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Event Date</label>
                  <input
                    type="date"
                    value={project?.event_date ? new Date(project.event_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const updatedProject = { ...project, event_date: e.target.value ? new Date(e.target.value).toISOString() : undefined };
                      setProject(updatedProject);
                      saveProject();
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
                      const updatedProject = { ...project, event_time: e.target.value || undefined };
                      setProject(updatedProject);
                      saveProject();
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
                      const updatedProject = { ...project, venue_name: e.target.value || undefined };
                      setProject(updatedProject);
                      saveProject();
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Venue Address</label>
                  <textarea
                    value={project?.venue_address || ''}
                    onChange={(e) => {
                      const updatedProject = { ...project, venue_address: e.target.value || undefined };
                      setProject(updatedProject);
                      saveProject();
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8" onClick={handleCanvasClick}>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden min-h-[800px]">
            <Canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              zoom={zoom}
              panX={panX}
              panY={panY}
              onZoomChange={setZoom}
              onPanChange={(x, y) => {
                setPanX(x);
                setPanY(y);
              }}
            >
              {elements.map((element) => (
                <MoveableElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  containerRef={canvasRef}
                  onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                  onSelect={() => handleSelectElement(element.id)}
                  zoom={zoom}
                >
                  <ElementRenderer
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onClick={() => handleSelectElement(element.id)}
                    eventData={{
                      eventDate: project?.event_date,
                      eventTime: project?.event_time,
                      venueName: project?.venue_name,
                      venueAddress: project?.venue_address,
                    }}
                  />
                </MoveableElement>
              ))}
            </Canvas>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-border bg-white overflow-y-auto">
          <div className="p-4">
            {selectedElement ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-primary">Properties</h3>
                  <button
                    onClick={() => setSelectedElementId(null)}
                    className="text-muted hover:text-primary text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="text-xs text-muted mb-2">
                    {selectedElement.type}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">X Position</label>
                    <input
                      type="number"
                      value={selectedElement.x}
                      onChange={(e) => handleElementUpdate(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Y Position</label>
                    <input
                      type="number"
                      value={selectedElement.y}
                      onChange={(e) => handleElementUpdate(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Width</label>
                    <input
                      type="number"
                      value={selectedElement.width}
                      onChange={(e) => handleElementUpdate(selectedElement.id, { width: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Height</label>
                    <input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) => handleElementUpdate(selectedElement.id, { height: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Rotation</label>
                    <input
                      type="number"
                      value={selectedElement.rotation}
                      onChange={(e) => handleElementUpdate(selectedElement.id, { rotation: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                      min="0"
                      max="360"
                    />
                  </div>

                  {selectedElement.type === 'text' && (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Text</label>
                      <textarea
                        value={selectedElement.content?.text || ''}
                        onChange={(e) => handleElementUpdate(selectedElement.id, {
                          content: { ...selectedElement.content, text: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                        rows={3}
                      />
                    </div>
                  )}

                  {selectedElement.type === 'countdown' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Target Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={selectedElement.content?.targetDate 
                            ? new Date(selectedElement.content.targetDate).toISOString().slice(0, 16)
                            : ''}
                          onChange={(e) => handleElementUpdate(selectedElement.id, {
                            content: { 
                              ...selectedElement.content, 
                              targetDate: e.target.value ? new Date(e.target.value).toISOString() : undefined
                            }
                          })}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Design</label>
                        <select
                          value={selectedElement.content?.design || 'elegant-card'}
                          onChange={(e) => handleElementUpdate(selectedElement.id, {
                            content: { 
                              ...selectedElement.content, 
                              design: e.target.value as "simple" | "elegant-card" | "minimal"
                            }
                          })}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                        >
                          <option value="simple">Simple</option>
                          <option value="elegant-card">Elegant Card</option>
                          <option value="minimal">Minimal</option>
                        </select>
                      </div>
                    </>
                  )}

                  {selectedElement.type === 'carousel' && (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Image URLs (one per line)
                      </label>
                      <textarea
                        value={Array.isArray(selectedElement.content?.images) 
                          ? selectedElement.content.images.map((img: any) => img.url || img).join('\n')
                          : ""}
                        onChange={(e) => {
                          const urls = e.target.value.split('\n').filter(url => url.trim());
                          handleElementUpdate(selectedElement.id, { 
                            content: {
                              ...selectedElement.content,
                              images: urls.map((url, index) => ({ url, alt: `Image ${index + 1}`, order: index + 1 }))
                            }
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

                  {selectedElement.type === 'image' && (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Image URL</label>
                      <input
                        type="text"
                        value={selectedElement.content?.url || ''}
                        onChange={(e) => handleElementUpdate(selectedElement.id, {
                          content: { ...selectedElement.content, url: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  {/* Other elements show info message */}
                  {!['text', 'countdown', 'carousel', 'image'].includes(selectedElement.type) && (
                    <div className="text-center py-4 text-sm text-muted">
                      <p>Click on text elements to edit them directly.</p>
                      <p className="mt-2 text-xs">This element doesn't require properties.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted text-sm">Select an element to view properties</p>
                <p className="text-xs text-muted mt-2">Properties panel shows settings for elements</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
