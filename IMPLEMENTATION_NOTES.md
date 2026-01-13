# Implementation Notes - Canva-like Editor Architecture

## Status

I've created the foundational architecture for a Canva-like editor:

### ✅ Completed

1. **Editor State Types** (`app/lib/editorState.ts`)
   - `EditorElement` interface with x, y, width, height, rotation
   - `EditorState` interface
   - Helper functions for creating/updating elements

2. **Canvas Component** (`app/components/editor/Canvas.tsx`)
   - Fixed-size container
   - Zoom support (mouse wheel with Cmd/Ctrl)
   - Pan support (middle mouse button)

3. **Element Renderer** (`app/components/editor/ElementRenderer.tsx`)
   - Data-driven rendering from JSON state
   - Supports text, image, shape, countdown, carousel, section types

4. **Moveable Element** (`app/components/editor/MoveableElement.tsx`)
   - Integration with Moveable.js
   - Handles drag, resize, rotate
   - Updates state on interaction end

### ⚠️ Next Steps

To fully integrate this architecture, you need to:

1. **Create a new editor page** that uses the new architecture
   - Replace the current editor page with one that uses Canvas + MoveableElement
   - Migrate existing project data to the new EditorElement format

2. **Migrate existing data structure**
   - Convert `page_structure` and `component_data` to `EditorElement[]`
   - Update mock data to use new format

3. **Integrate with existing components**
   - Adapt existing invitation components (CountdownTimer, ImageCarousel, etc.) to work with ElementRenderer
   - Or create new renderers for these component types

## Migration Strategy

The new architecture is **additive** - you can:
- Keep the existing editor as-is
- Create a new route (e.g., `/editor-v2/[templateId]`) to test the new architecture
- Gradually migrate features
- Once stable, replace the old editor

## Key Differences

### Old Architecture
- Mix of absolute positioning and layout-based components
- Custom drag/resize handlers
- DOM-based state inference
- Responsive layout

### New Architecture
- Fixed-size canvas (800x1200px)
- All elements absolutely positioned
- Data-driven rendering (state → render)
- Moveable.js for interactions
- Visual zoom only

## Recommendations

Given the complexity of this refactor, I recommend:

1. **Start with a prototype** - Create a simple test page with the new architecture
2. **Migrate incrementally** - Convert one component type at a time
3. **Keep both systems** - Run old and new editors in parallel during migration
4. **Test thoroughly** - Ensure all interactions work correctly

Would you like me to:
- Create a prototype editor page using the new architecture?
- Create migration utilities to convert old data to new format?
- Start integrating specific component types?

