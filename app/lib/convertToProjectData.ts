// Convert EditorElement[] back to ProjectData format for TemplateRenderer
import { EditorElement } from "./editorState";
import { ProjectData, ComponentConfig } from "./mockData";

export function convertElementsToProjectData(
  elements: EditorElement[],
  baseProject: Partial<ProjectData> = {}
): ProjectData {
  const page_structure: ComponentConfig[] = [];
  const component_data: Record<string, any> = {};

  // Sort elements by y position (top to bottom)
  const sortedElements = [...elements].sort((a, b) => a.y - b.y);

  sortedElements.forEach((element, index) => {
    const componentConfig: ComponentConfig = {
      id: element.id,
      type: mapElementTypeToComponentType(element.type),
      order: index + 1,
      config: {},
    };

    page_structure.push(componentConfig);

    // Convert element to component_data format
    const data: any = {
      width: element.width,
      height: element.height,
      x: element.x,
      y: element.y,
      rotation: element.rotation,
      ...element.content,
    };

    // Merge styles into component data
    if (element.styles) {
      Object.assign(data, element.styles);
    }

    component_data[element.id] = data;
  });

  return {
    id: baseProject.id || 'preview-project',
    user_id: baseProject.user_id || 'preview-user',
    template_type: baseProject.template_type || 'modern-elegant',
    name: baseProject.name || 'Preview Project',
    slug: baseProject.slug || 'preview',
    status: baseProject.status || 'draft',
    page_structure,
    component_data,
    event_date: baseProject.event_date,
    event_time: baseProject.event_time,
    venue_name: baseProject.venue_name,
    venue_address: baseProject.venue_address,
    is_active: baseProject.is_active || false,
    view_count: 0,
    created_at: baseProject.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapElementTypeToComponentType(type: EditorElement['type']): string {
  const typeMap: Record<EditorElement['type'], string> = {
    'text': 'QuoteSection', // Default to QuoteSection for text
    'image': 'HeroImage',
    'shape': 'BlankSection',
    'carousel': 'ImageCarousel',
    'section': 'HeroSection',
    'blank': 'BlankSection',
    // New Bayu & Nia style components
    'cover': 'CoverSection',
    'hero-section': 'HeroSection',
    'quote': 'QuoteSection',
    'religious-greeting': 'ReligiousGreeting',
    'couple-profile': 'CoupleProfile',
    'event-details': 'EventDetails',
    'photo-gallery': 'PhotoGalleryGrid',
    'closing': 'ClosingSection',
  };

  return typeMap[type] || 'BlankSection';
}

