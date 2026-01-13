# Canva-like Editor Architecture

## Core Principles

1. **Fixed-size Canvas**: Canvas has fixed dimensions (e.g., 800x1200px for wedding invitations)
2. **Data-Driven Rendering**: All elements rendered from JSON state, never inferred from DOM
3. **Absolute Positioning**: All elements use x, y, width, height, rotation from state
4. **State Updates Drive Rendering**: Interactions update state → state drives rendering
5. **Visual Zoom Only**: Zoom applies CSS transform scale, never modifies element dimensions

## Architecture Layers

### 1. Editor State Layer (`app/lib/editorState.ts`)
- Stores all element geometry: `{ id, type, x, y, width, height, rotation, styles }`
- Single source of truth for element positions/dimensions
- Immutable updates

### 2. Canvas Component (`app/components/editor/Canvas.tsx`)
- Fixed-size container (e.g., 800x1200px)
- Handles zoom (CSS transform scale)
- Handles pan (translate)
- Provides coordinate system for interactions

### 3. Element Renderer (`app/components/editor/ElementRenderer.tsx`)
- Renders elements from state (data-driven)
- Uses absolute positioning from state values
- No layout inference

### 4. Interaction Layer (`app/components/editor/MoveableElement.tsx`)
- Wraps elements with Moveable.js
- Handles drag/resize/rotate interactions
- Updates state on interaction end

### 5. Editor Page (`app/editor/[templateId]/page.tsx`)
- Orchestrates state, canvas, and interactions
- Handles selection, undo/redo, etc.

## Data Structure

```typescript
interface EditorElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'countdown' | 'carousel' | 'section';
  x: number;        // Absolute position in canvas coordinates
  y: number;        // Absolute position in canvas coordinates
  width: number;    // Element width
  height: number;   // Element height
  rotation: number; // Rotation in degrees (0-360)
  styles: {
    // Element-specific styles
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    // ... etc
  };
  content: any;     // Type-specific content (text, image URLs, etc.)
  locked?: boolean; // Lock aspect ratio (for images)
}

interface EditorState {
  elements: EditorElement[];
  canvasWidth: number;  // Fixed canvas width (e.g., 800)
  canvasHeight: number; // Fixed canvas height (e.g., 1200)
  zoom: number;         // Zoom level (0.5 to 2.0)
  panX: number;         // Pan offset X
  panY: number;         // Pan offset Y
  selectedElementId: string | null;
}
```

## Interaction Rules

1. **Drag**: Updates `x` and `y` in state
2. **Resize**: Updates `width` and `height` in state (and `x`, `y` if resizing from left/top)
3. **Rotate**: Updates `rotation` in state (0-360 degrees)
4. **Images**: Lock aspect ratio by default
5. **Text**: Width-only resize (height auto), no scale transform
6. **Snap**: Snap to center and edges (handled by Moveable)

## Implementation Plan

1. Install Moveable.js
2. Create editor state types and utilities
3. Create Canvas component (fixed size, zoom, pan)
4. Create ElementRenderer (data-driven rendering)
5. Create MoveableElement wrapper (interactions)
6. Refactor editor page to use new architecture
7. Update data structure and migration

