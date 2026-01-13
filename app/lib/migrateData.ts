// Migration utility to convert old data structure to new EditorElement format

import { ProjectData, ComponentConfig } from "./mockData";
import { EditorElement, DEFAULT_CANVAS_WIDTH, DEFAULT_ELEMENT_WIDTH, DEFAULT_ELEMENT_HEIGHT } from "./editorState";

export interface MigratedProjectData extends Omit<ProjectData, 'page_structure' | 'component_data'> {
  elements: EditorElement[];
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Converts old ProjectData format to new EditorElement format
 */
export function migrateProjectData(project: ProjectData): MigratedProjectData {
  const elements: EditorElement[] = [];
  let currentY = 50; // Starting Y position
  const spacing = 20; // Spacing between elements

  // Sort components by order
  const sortedComponents = [...project.page_structure].sort((a, b) => a.order - b.order);

  sortedComponents.forEach((componentConfig, index) => {
    const componentData = project.component_data[componentConfig.id] || {};
    
    // Determine element dimensions based on component type and data
    let width = componentData.width || DEFAULT_ELEMENT_WIDTH;
    let height = componentData.height || DEFAULT_ELEMENT_HEIGHT;
    
    // Type-specific defaults (mobile width: 375px)
    switch (componentConfig.type) {
      case 'BlankSection':
      case 'Hero':
        width = componentData.width || 340; // 375 - 35px padding
        height = componentData.height || 400;
        break;
      case 'CountdownTimer':
        width = 340;
        height = 150;
        break;
      case 'ImageCarousel':
        width = 340;
        height = 400;
        break;
      case 'CoverSection':
        width = 340;
        height = 600;
        break;
      case 'HeroSection':
        width = 340;
        height = 500;
        break;
      case 'QuoteSection':
        width = 340;
        height = 150;
        break;
      case 'ReligiousGreeting':
        width = 340;
        height = 200;
        break;
      case 'CoupleProfile':
        width = 340;
        height = 350;
        break;
      case 'InvitationMessage':
        width = 340;
        height = 250;
        break;
      case 'EventDetails':
        width = 340;
        height = 300;
        break;
      case 'PhotoGalleryGrid':
        width = 340;
        height = 400;
        break;
      case 'ClosingSection':
        width = 340;
        height = 150;
        break;
      default:
        width = componentData.width || DEFAULT_ELEMENT_WIDTH;
        height = componentData.height || DEFAULT_ELEMENT_HEIGHT;
    }

    // Calculate X position (center on canvas)
    const x = (DEFAULT_CANVAS_WIDTH - width) / 2;

    // Create EditorElement
    const element: EditorElement = {
      id: componentConfig.id,
      type: mapComponentTypeToElementType(componentConfig.type),
      x: componentData.x !== undefined ? componentData.x : x,
      y: componentData.y !== undefined ? componentData.y : currentY,
      width: componentData.width || width,
      height: componentData.height || height,
      rotation: componentData.rotation || 0,
      locked: componentConfig.type === 'ImageCarousel' || componentConfig.type === 'PhotoGalleryGrid',
      styles: extractStyles(componentConfig.type, componentData),
      content: extractContent(componentConfig.type, componentData),
      zIndex: index,
    };

    elements.push(element);

    // Update currentY for next element (if not using absolute positioning)
    if (componentData.y === undefined) {
      currentY += height + spacing;
    }
  });

  return {
    ...project,
    elements,
    canvasWidth: DEFAULT_CANVAS_WIDTH,
    canvasHeight: Math.max(currentY + 100, 1200), // Ensure minimum height
  };
}

/**
 * Maps old component types to new EditorElement types
 */
function mapComponentTypeToElementType(type: string): EditorElement['type'] {
  const typeMap: Record<string, EditorElement['type']> = {
    'BlankSection': 'blank',
    'Hero': 'section',
    'CountdownTimer': 'countdown',
    'ImageCarousel': 'carousel',
    'PhotoGalleryGrid': 'photo-gallery',
    'CoverSection': 'cover',
    'HeroSection': 'hero-section',
    'QuoteSection': 'quote',
    'ReligiousGreeting': 'religious-greeting',
    'CoupleProfile': 'couple-profile',
    'InvitationMessage': 'invitation-message',
    'EventDetails': 'event-details',
    'ClosingSection': 'closing',
  };

  return typeMap[type] || 'section';
}

/**
 * Extracts styles from component data
 */
function extractStyles(type: string, componentData: any): EditorElement['styles'] {
  const styles: EditorElement['styles'] = {};

  // Extract common styles
  if (componentData.backgroundColor) styles.backgroundColor = componentData.backgroundColor;
  if (componentData.color) styles.color = componentData.color;
  if (componentData.fontSize) styles.fontSize = componentData.fontSize;
  if (componentData.fontFamily) styles.fontFamily = componentData.fontFamily;
  if (componentData.fontWeight) styles.fontWeight = componentData.fontWeight;
  if (componentData.textAlign) styles.textAlign = componentData.textAlign;
  if (componentData.borderRadius) styles.borderRadius = componentData.borderRadius;
  if (componentData.opacity !== undefined) styles.opacity = componentData.opacity;

  return Object.keys(styles).length > 0 ? styles : undefined;
}

/**
 * Extracts content from component data
 */
function extractContent(type: string, componentData: any): any {
  switch (type) {
    case 'CountdownTimer':
      return {
        targetDate: componentData.targetDate || new Date().toISOString(),
      };
    case 'ImageCarousel':
    case 'PhotoGalleryGrid':
      return {
        images: componentData.images || [],
      };
    case 'QuoteSection':
      return {
        quote: componentData.quote || '',
        author: componentData.author || '',
        imageUrl: componentData.imageUrl || '',
      };
    case 'ReligiousGreeting':
      return {
        greeting: componentData.greeting || '',
        message: componentData.message || '',
        imageUrl: componentData.imageUrl || '',
      };
    case 'InvitationMessage':
      return {
        message: componentData.message || '',
      };
    case 'EventDetails':
      return {
        eventDate: componentData.eventDate || '',
        eventTime: componentData.eventTime || '',
        venueName: componentData.venueName || '',
      };
    case 'ClosingSection':
      return {
        coupleNames: componentData.coupleNames || '',
        message: componentData.message || '',
      };
    case 'CoverSection':
      return {
        date: componentData.date || '',
        coupleNames: componentData.coupleNames || '',
        quote: componentData.quote || '',
      };
    case 'HeroSection':
      return {
        backgroundImages: componentData.backgroundImages || [],
        subtitle: componentData.subtitle || '',
        coupleNames: componentData.coupleNames || '',
        quote: componentData.quote || '',
      };
    case 'CoupleProfile':
      return {
        name: componentData.name || '',
        fullName: componentData.fullName || '',
        relation: componentData.relation || '',
        parents: componentData.parents || {},
        address: componentData.address || '',
        imageUrl: componentData.imageUrl || componentData.image || '',
        imagePosition: componentData.imagePosition || {},
        type: componentData.type || 'groom',
      };
    default:
      return componentData.content || componentData;
  }
}

/**
 * Gets default text for text-based components
 */
function getDefaultTextForType(type: string): string {
  const defaults: Record<string, string> = {
    'QuoteSection': 'Love is composed of a single soul inhabiting two bodies.',
    'ReligiousGreeting': 'Bismillahirrahmanirrahim',
    'InvitationMessage': 'You are cordially invited to our wedding celebration.',
    'EventDetails': 'Event Details',
    'ClosingSection': 'Thank you for your presence',
  };

  return defaults[type] || '';
}

/**
 * Migrates multiple projects
 */
export function migrateProjects(projects: Record<string, ProjectData>): Record<string, MigratedProjectData> {
  const migrated: Record<string, MigratedProjectData> = {};
  
  Object.entries(projects).forEach(([key, project]) => {
    migrated[key] = migrateProjectData(project);
  });

  return migrated;
}

