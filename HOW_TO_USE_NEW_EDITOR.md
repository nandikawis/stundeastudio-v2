# How to Use the New Canva-like Editor

## Access the Editor

The new editor is available at:
```
/editor-v2/[templateId]
```

For example, to edit the "modern-elegant" template:
```
http://localhost:3000/editor-v2/modern-elegant
```

## Features

### 1. **Fixed-Size Canvas**
- Canvas size: 800x1200px (default)
- All elements are absolutely positioned
- Zoom and pan to navigate

### 2. **Drag & Drop**
- Click and drag any element to move it
- Elements update position in real-time

### 3. **Resize**
- Select an element to see resize handles
- Drag handles to resize
- Images are locked to aspect ratio by default

### 4. **Rotate**
- Select an element
- Use the rotation handle to rotate (0-360 degrees)

### 5. **Zoom**
- Use zoom buttons (+/-) in the toolbar
- Or use Ctrl/Cmd + mouse wheel
- Click "Reset" to return to 100%

### 6. **Pan**
- Use middle mouse button to pan the canvas
- Or use the zoom/pan controls

### 7. **Add Elements**
- Click buttons in the left sidebar to add elements:
  - 📝 Text
  - 🖼️ Image
  - ⬜ Shape
  - ⏰ Countdown
  - 🎠 Carousel
  - 📦 Section

### 8. **Edit Properties**
- Select an element to see properties panel
- Edit position (X, Y)
- Edit dimensions (Width, Height)
- Edit rotation (0-360 degrees)
- For text elements: Edit text content

### 9. **Delete Elements**
- Select an element
- Click "Delete Element" button in properties panel

### 10. **Save**
- Click "Save" button in toolbar
- Project is saved to localStorage
- Automatically saves after each edit

## Data Migration

The editor automatically migrates old format data to the new format:
- Old format: `page_structure` + `component_data`
- New format: `elements` array with x, y, width, height, rotation

## Keyboard Shortcuts

- **Ctrl/Cmd + Mouse Wheel**: Zoom in/out
- **Middle Mouse Button**: Pan canvas

## Architecture

The new editor uses:
- **Canvas Component**: Fixed-size container with zoom/pan
- **MoveableElement**: Wraps elements with Moveable.js for interactions
- **ElementRenderer**: Renders element content from JSON state
- **Editor State**: All geometry stored in JSON (x, y, width, height, rotation)

## Next Steps

To integrate this with your existing editor:
1. Test the new editor at `/editor-v2/[templateId]`
2. Compare with old editor at `/editor/[templateId]`
3. Once satisfied, you can replace the old editor or run both in parallel

