// Editor State Types - Canva-like architecture
// All elements use absolute positioning with x, y, width, height, rotation

export interface EditorElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'countdown' | 'carousel' | 'section' | 'blank' | 'cover' | 'hero-section' | 'quote' | 'religious-greeting' | 'couple-profile' | 'invitation-message' | 'event-details' | 'photo-gallery' | 'closing';
  x: number;        // Absolute position in canvas coordinates
  y: number;        // Absolute position in canvas coordinates
  width: number;    // Element width
  height: number;   // Element height
  rotation: number; // Rotation in degrees (0-360)
  locked?: boolean; // Lock aspect ratio (for images)
  styles?: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: number;
    opacity?: number;
    [key: string]: any;
  };
  content?: {
    // Text content
    text?: string;
    
    // CountdownTimer
    targetDate?: string;
    design?: "simple" | "elegant-card" | "minimal";
    
    // ImageCarousel
    images?: Array<{ url: string; alt?: string; order?: number }>;
    autoplay?: boolean;
    autoplayInterval?: number;
    showDots?: boolean;
    showArrows?: boolean;
    
    // Image
    url?: string;
    alt?: string;
    
    // Hero/BlankSection (container components)
    backgroundImages?: Array<string>;
    children?: string[]; // Array of child element IDs
    
    [key: string]: any; // Allow other content types
  };
  zIndex?: number;  // Stacking order
}

export interface EditorState {
  elements: EditorElement[];
  canvasWidth: number;  // Fixed canvas width (default: 800px)
  canvasHeight: number; // Fixed canvas height (default: 1200px)
  zoom: number;         // Zoom level (0.5 to 2.0, default: 1.0)
  panX: number;         // Pan offset X (default: 0)
  panY: number;         // Pan offset Y (default: 0)
  selectedElementId: string | null;
}

// Default canvas dimensions for wedding invitations (mobile width)
export const DEFAULT_CANVAS_WIDTH = 375; // Mobile width
export const DEFAULT_CANVAS_HEIGHT = 1200;

// Default element dimensions
export const DEFAULT_ELEMENT_WIDTH = 200;
export const DEFAULT_ELEMENT_HEIGHT = 100;

// Helper functions
export function createElement(
  type: EditorElement['type'],
  x: number,
  y: number,
  options?: {
    width?: number;
    height?: number;
    rotation?: number;
    locked?: boolean;
    content?: any;
    styles?: EditorElement['styles'];
  }
): EditorElement {
  return {
    id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    x,
    y,
    width: options?.width || DEFAULT_ELEMENT_WIDTH,
    height: options?.height || DEFAULT_ELEMENT_HEIGHT,
    rotation: options?.rotation || 0,
    locked: options?.locked || (type === 'image'),
    styles: options?.styles || {},
    content: options?.content,
    zIndex: 0,
  };
}

export function updateElement(
  elements: EditorElement[],
  id: string,
  updates: Partial<EditorElement>
): EditorElement[] {
  return elements.map(el => 
    el.id === id ? { ...el, ...updates } : el
  );
}

export function deleteElement(
  elements: EditorElement[],
  id: string
): EditorElement[] {
  return elements.filter(el => el.id !== id);
}

export function getElement(
  elements: EditorElement[],
  id: string
): EditorElement | undefined {
  return elements.find(el => el.id === id);
}

