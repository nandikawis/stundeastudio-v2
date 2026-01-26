# Editor Current State Documentation

This document describes the current state of the Stundea Studio wedding invitation editor as of the latest implementation. This is a section-based editor (NOT a free-form Canva-like editor with absolute positioning).

## Editor Architecture

### Section-Based Editor
- The editor displays a fixed sequence of predefined sections
- Users click on a section to choose from a gallery of design variants for that specific section type
- The editor renders sections 1:1 with the preview (no overlapping/cropping issues)
- The editor directly manipulates `ProjectData` (page_structure, component_data) rather than using a separate editor state
- Sections are rendered using `TemplateRenderer` directly in the editor

### Editor Layout
- **Left Sidebar**: Event Data panel (for editing project-level event details)
- **Right Sidebar**: Section Properties Panel (for editing content and styles of the currently selected section)
- **Main Canvas**: Displays all sections with hover overlay showing "Edit Content" and "Change Design" buttons
- **No Navbar**: The editor page does not have a navbar

## Available Sections/Components

All sections support:
- Background color customization and background images
- Various text color customizations
- Top and bottom curve dividers with customizable colors and styles
- Decorative flowers with 4 style options (red, beage, pink, white)

1. **CoverSection**
   - Background color and background image
   - Date text + color
   - Couple names + color
   - Quote + color
   - Guest name display
   - "Buka Undangan" button with hidden content reveal
   - Top and bottom curve dividers with customizable colors and styles

2. **HeroSection**
   - Background color and background image
   - Background images (slideshow with Ken Burns effect)
   - Subtitle + color
   - Couple names + color
   - Quote + color
   - Top and bottom curve dividers with customizable colors and styles

3. **QuoteSection**
   - Background color and background image
   - Quote text + color
   - Author text + color
   - Optional decorative image
   - Top and bottom curve dividers with customizable colors and styles

4. **ReligiousGreeting**
   - Background color and background image
   - Greeting text + color (e.g., "Om Swastyastu")
   - Message text + color
   - Optional decorative image
   - Top and bottom curve dividers with customizable colors and styles

5. **CoupleProfile** (can be used for both groom and bride)
   - Background color and background image
   - Name + color
   - Full name + color
   - Relation + color
   - Father's name + color
   - Mother's name + color
   - Address + color
   - Profile image with 15 container style options:
     - Circular (3 styles), Rounded (3 styles), Oval (3 styles), Hexagon (3 styles), Square (3 styles)
   - Glow color customization (for glow effect styles)
   - Top and bottom curve dividers with customizable colors and styles

6. **EventDetails**
   - Background color and background image
   - 6 design variants: card, elegant-split, modern-minimal, timeline-vertical, badge-accent, framed-classic
   - Event date (overrides project-level)
   - Date month/year color (in left column date counter)
   - Date day color (in left column date counter)
   - Title color ("Resepsi")
   - Event time + color (overrides project-level)
   - Venue name + color (overrides project-level)
   - Venue address + color (overrides project-level)
   - Google Maps link (optional)
   - Map button (always visible):
     - Customizable text
     - Customizable background color
     - Customizable text color
   - Card color customization (varies by design):
     - Card Header Color (for card, badge-accent, elegant-split)
     - Card Body Color (for card, badge-accent, elegant-split)
     - Card Background Color (for other designs)
     - Card Opacity (transparency control)
   - Closing message + color
   - Closing text ("Om Shanti...") + color
   - Top and bottom curve dividers with customizable colors and styles
   - **Note**: The invitation message is now integrated into this section, displayed above the event card

7. **ImageCarousel**
   - Background color and background image
   - Images (URLs, one per line)
   - Autoplay toggle
   - Autoplay interval
   - Shows dots and arrows
   - Placeholder shapes when empty in editor mode
   - **Date & Message Section** (between carousel and countdown):
     - Date text + color (appears on right side of horizontal line)
     - Message text + color (appears below the line and date)
     - Line color automatically matches date color
   - **Countdown Timer** (below carousel, optional):
     - Target date/time picker
     - Design options: "simple", "elegant-card", "minimal"
     - Value color (the countdown numbers)
     - Label color (Hari, Jam, Menit, Detik)
     - Card background color (for elegant-card design only)
     - Compact elegant-card design (4 columns, no title, mobile-optimized)
   - Top and bottom curve dividers with customizable colors and styles

8. **PhotoGalleryGrid**
    - Background color and background image
    - Customizable title (text and color)
    - Images grid
    - Column count (2 or 3)
    - Placeholder shapes when empty in editor mode
    - Lightbox modal for image viewing
    - Top and bottom curve dividers with customizable colors and styles

9. **ClosingSection**
    - Background color and background image
    - Couple names + color
    - Thank you message + color
    - Designer credit + color
    - Social media links (WhatsApp, Instagram)
    - Optional background audio player
    - Top and bottom curve dividers with customizable colors and styles

## Features Implemented

### 1. Background Customization
- ✅ All sections can have their background color changed
- ✅ All sections support background images via URL
- ✅ "Color"/"No Color" toggle for background color (more visible and intuitive)
- ✅ Color picker available in properties panel for all sections
- ✅ Background color and image are stored in component_data
- ✅ When background color is set, it overrides default gradients/solid colors
- ✅ When both background image and color are set, color acts as a 50% opacity overlay

### 2. Text Color Customization
- ✅ All text elements in all sections have color controls
- ✅ ColorPicker component used throughout
- ✅ Colors are stored in component_data
- ✅ Default colors maintained when not customized

### 3. Curve Dividers
- ✅ All sections support top and bottom curve dividers
- ✅ Three curve styles available: "gentle", "wave", "smooth"
- ✅ Curve colors are customizable
- ✅ "Add Divider" and "Delete" buttons (instead of checkboxes) for better UX
- ✅ Curves use SVG paths with customizable colors
- ✅ Curves are non-interactive (pointer-events-none) to allow editor overlay interaction
- ✅ When both dividers and decorative flowers are active, proper spacing is maintained using margin (not padding) to prevent section size reduction

### 4. PhotoGalleryGrid Enhancements
- ✅ "Photo Gallery" title is customizable (text and color)
- ✅ Title color can be changed independently

### 5. CoupleProfile Image Container Styles
- ✅ Multiple image container style options:
  - **Circular**: Classic, Gradient Border, Glow Effect
  - **Rounded**: Elegant Frame, Modern Gradient, Glow Effect
  - **Oval**: Vintage Frame, Classic Frame, Glow Effect
  - **Hexagon**: Glow Effect, Classic Frame, Modern Dark
  - **Square**: Framed, Elegant Dark, Glow Effect
- ✅ Glow effect styles have customizable glow color
- ✅ All styles use modern, classic, elegant color palette (gold, brown, beige, gray)
- ✅ 3 styles per category (15 total styles)

### 6. EventDetails Design Variants
- ✅ 6 design styles available:
  - **Card Style**: Horizontal split with dark left (date) and white right (details)
  - **Elegant Split**: Vertical split layout
  - **Modern Minimal**: Clean minimal design
  - **Timeline Vertical**: Timeline-style vertical layout
  - **Badge Accent**: Badge-style with header and body sections
  - **Framed Classic**: Classic framed design
- ✅ Card color customization:
  - **Card Header Color**: For header/top section (used in card, badge-accent, elegant-split)
  - **Card Body Color**: For content area (used in card, badge-accent, elegant-split)
  - **Card Background Color**: For single-color designs (modern-minimal, timeline-vertical, framed-classic)
  - **Card Opacity**: Transparency control (0-1 range)
- ✅ All designs optimized for mobile screen (375px width)

### 7. EventDetails Map Button
- ✅ Map button always visible below all EventDetails card designs
- ✅ Google Maps link input (optional)
- ✅ Map button text is customizable
- ✅ Map button background color is customizable
- ✅ Map button text color is customizable
- ✅ Button is always active (not disabled even without link)
- ✅ Falls back to venueCoordinates if Google Maps link not provided

### 8. Decorative Flowers (All Sections)
- ✅ All sections support decorative flowers feature
- ✅ Flowers appear in top-left and bottom-right corners
- ✅ Four style options: "red", "beage", "pink", "white"
- ✅ Style selector in properties panel (similar to curve dividers)
- ✅ "Add Flowers" / "Delete" buttons for enabling/disabling
- ✅ When both dividers and flowers are active:
  - Top flowers move down slightly (1rem margin) when top divider is active
  - Bottom flowers move up slightly (1rem margin) when bottom divider is active
  - Content has margin (not padding) to prevent overlap without reducing section size
- ✅ Flowers use PNG images from `/public/decorative/` folder
- ✅ Flowers are non-interactive (pointer-events-none, z-index 5) to allow editor interaction

### 9. Text Wrapping
- ✅ All text elements across all sections have word-wrapping enabled
- ✅ Global CSS rule ensures text wraps within container width
- ✅ Prevents horizontal overflow on mobile screens
- ✅ Long text without line breaks automatically wraps to next line
- ✅ Applied to: paragraphs, headings, spans, and divs in all sections

### 10. Section-Based Editing
- ✅ Users click sections to edit them
- ✅ Right sidebar shows properties panel for selected section
- ✅ Left sidebar shows event data (project-level)
- ✅ "Edit Content" button appears on hover
- ✅ "Change Design" button opens design picker modal

### 11. Template Structure
- All templates follow a consistent structure based on the provided HTML example
- Default template: `bayu-nia-mobile-001` mirrors the provided HTML structure
- Sections are rendered in order based on `page_structure` array

### 12. Data Storage
- Project data structure: `ProjectData` with:
  - `page_structure`: Array of `ComponentConfig` (defines section order and types)
  - `component_data`: Object mapping section IDs to their data (all customizations stored here)
  - Project-level fields: `event_date`, `event_time`, `venue_name`, `venue_address`
- Component-level data overrides project-level data when present

## Editor Workflow

1. User opens editor for a template
2. Canvas displays all sections in order
3. User hovers over a section to see "Edit Content" and "Change Design" buttons
4. Clicking "Edit Content" opens the properties panel on the right
5. Properties panel shows all editable fields for that section (content + colors)
6. Clicking "Change Design" opens design picker modal to choose section design variant
7. Changes are saved to `component_data` for that section
8. Preview mode shows the invitation exactly as it will appear to guests

## Technical Implementation

### Key Files
- `app/editor/[templateId]/page.tsx` - Main editor page
- `app/components/editor/SectionEditor.tsx` - Manages section rendering and interaction
- `app/components/editor/SectionPropertiesPanel.tsx` - Properties editing panel
- `app/components/editor/SectionDesignPicker.tsx` - Design variant picker
- `app/components/editor/ColorPicker.tsx` - Reusable color picker component
- `app/components/invitation/TemplateRenderer.tsx` - Renders sections for both editor and preview
- `app/components/invitation/*.tsx` - All section components
- `app/lib/curveHelpers.tsx` - Curve divider rendering helpers (renderTopCurve, renderBottomCurve)
- `app/lib/flowerHelpers.tsx` - Decorative flowers rendering and margin calculation helpers

### Data Flow
- Editor state: `ProjectData` stored in React state
- Updates: `onUpdateProject` callback updates the entire project
- Section selection: `selectedSectionId` and `onSelectSection` manage selection
- Component data: All customizations stored in `project.component_data[sectionId]`

## Important Notes

1. **This is NOT a Canva-like editor**: We previously tried a free-form editor with absolute positioning (editor-v2), but the user requested a section-based approach instead.

2. **Mobile-First Design**: Invitations are designed for mobile viewing (375px width)

3. **1:1 Preview Match**: The editor canvas renders exactly the same as the preview, ensuring no surprises

4. **Color System**: All colors use hex values, stored as strings in component_data

5. **Image Handling**: Images are stored as URLs (not uploaded - that's backend responsibility)

6. **Event Data Hierarchy**: Component-level event data (in EventDetails section) overrides project-level event data

7. **Background Image Overlay**: When both background image and background color are set, the color acts as a 50% opacity overlay on top of the image

8. **Curve Dividers**: All sections support top and bottom curve dividers with 3 style options (gentle, wave, smooth). Curves are SVG-based and use `pointer-events-none` to allow editor overlay interaction.

9. **Z-Index Management**: Editor overlay buttons (Edit Content, Change Design) use `z-50` to ensure they're always clickable above decorative elements like curves.

10. **Map Button**: The EventDetails map button is always visible and active, even without a Google Maps link. It uses customizable text, background color, and text color.

11. **Decorative Flowers**: All sections support decorative flowers with 4 style options (red, beage, pink, white). Flowers are positioned in top-left and bottom-right corners using PNG images from `/public/decorative/`. When both dividers and flowers are active, flowers adjust position (top flowers move down 1rem, bottom flowers move up 1rem) to prevent overlap. Content uses margin (not padding) to maintain section size while preventing overlap.

12. **Text Wrapping**: All text elements across all sections have word-wrapping enabled via global CSS (`app/globals.css`) and inline styles (`break-words` class, `word-wrap`, `overflow-wrap`, `max-width: 100%`) to prevent horizontal overflow on mobile screens. Long text without manual line breaks automatically wraps to the next line.

13. **Section Consolidation**: The InvitationMessage section was removed and integrated into EventDetails (appears above the event card). The CountdownTimer section was removed and integrated into ImageCarousel (appears below the carousel with date/message section between them).

## What Works

- ✅ Section selection and editing
- ✅ Background color and background image for all sections
- ✅ "Color"/"No Color" toggle for background color
- ✅ Text color changes for all text elements
- ✅ Content editing (all text fields)
- ✅ Design variant selection
- ✅ Top and bottom curve dividers for all sections (with customizable colors and styles)
- ✅ "Add Divider"/"Delete" buttons for curve controls
- ✅ PhotoGalleryGrid title customization (text and color)
- ✅ CoupleProfile image container styles (15 options with glow effects)
- ✅ EventDetails design variants (6 designs with card color customization)
- ✅ EventDetails map button (always visible, customizable text and colors)
- ✅ EventDetails invitation message (integrated above event card)
- ✅ Decorative flowers for all sections (4 style options: red, beage, pink, white)
- ✅ ImageCarousel countdown timer (below carousel, 3 designs, compact elegant-card)
- ✅ ImageCarousel date & message section (between carousel and countdown)
- ✅ Text wrapping across all sections (prevents horizontal overflow)
- ✅ Event data editing (project-level)
- ✅ Preview mode
- ✅ Component-level data overrides project-level data

## Template Structure

All templates follow a **standard 9-section structure** in a fixed order. This structure is consistent across all templates and matches the original design requirements. The sections are:

1. **CoverSection** (Order: 1)
   - Invitation cover with date, couple names, quote
   - "Buka Undangan" button with hidden content reveal
   - Dark gradient background by default

2. **HeroSection** (Order: 2)
   - Full-screen hero with background images slideshow
   - Couple names and quote overlay
   - SVG curve divider at bottom

3. **QuoteSection** (Order: 3)
   - Sanskrit quote with Indonesian translation
   - Author attribution
   - Optional decorative image

4. **ReligiousGreeting** (Order: 4)
   - Religious greeting (e.g., "Om Swastyastu")
   - Invitation message
   - Optional decorative image
   - SVG curve divider at top

5. **CoupleProfile - Groom** (Order: 5)
   - Groom's profile with circular photo
   - Name, full name, relation
   - Parents' names
   - Address
   - Config: `{ type: 'groom' }`

6. **CoupleProfile - Bride** (Order: 6)
   - Bride's profile with circular photo
   - Name, full name, relation
   - Parents' names
   - Address
   - Config: `{ type: 'bride' }`

7. **EventDetails** (Order: 7)
   - **Invitation message** (displayed above the event card) - integrated from removed InvitationMessage section
   - Multiple design variants (card, elegant-split, modern-minimal, timeline-vertical, badge-accent, framed-classic)
   - Date counter (month/year and day)
   - Event time, venue name, venue address
   - Map button with coordinates
   - Closing message and "Om Shanti" text
   - Customizable card colors and transparency

8. **ImageCarousel** (Order: 8)
   - Image slideshow/carousel
   - Autoplay support
   - Navigation dots and arrows
   - **Date & Message Section** (between carousel and countdown):
     - Horizontal line with date on the right
     - Message text below the line
     - Line color automatically matches date color
   - **Countdown Timer** (below carousel, optional) - integrated from removed CountdownTimer section:
     - 3 design options: "simple", "elegant-card", "minimal"
     - Elegant-card design: compact 4-column layout, no title, customizable card background color
     - Target date/time picker
     - Customizable value, label, and card colors
   - Default: empty images array

9. **PhotoGalleryGrid** (Order: 9)
    - Grid layout for photos
    - Default: 2 columns
    - Lightbox modal for viewing
    - Config: `{ columns: 2 }`

10. **ClosingSection** (Order: 10)
    - Thank you message
    - Couple names
    - Designer credit
    - Social media links (WhatsApp, Instagram)
    - Optional background audio player
    - SVG curve divider at top
    - Dark gradient background by default

### Data Structure

The template structure is stored in `page_structure` array with each section having:
- `id`: Unique identifier for the section
- `type`: Component type name (e.g., "CoverSection", "HeroSection")
- `order`: Display order (1-9)
- `config`: Section-specific configuration (e.g., `{ type: 'groom' }` for CoupleProfile)

All customization data is stored in `component_data[sectionId]` object, which contains:
- Content fields (text, images, etc.)
- Color customizations (backgroundColor, text colors)
- Section-specific settings
- Decorative flowers settings (`decorativeFlowers`, `flowerStyle`)

**Recent Changes**:
- **InvitationMessage section removed**: The invitation message is now integrated into EventDetails section, displayed above the event card
- **CountdownTimer section removed**: The countdown timer is now integrated into ImageCarousel section, displayed below the carousel
- **Decorative Flowers**: All sections now support decorative flowers with 4 style options (red, beage, pink, white)
- **Text Wrapping**: All text elements have word-wrapping enabled to prevent horizontal overflow on mobile screens
- **Spacing Fix**: When both dividers and decorative flowers are active, margin is used (not padding) to maintain section size while preventing overlap

## Current State

The editor is fully functional for customizing invitation content and styles. All sections support comprehensive color customization (backgrounds and text). The section-based approach provides a structured, user-friendly editing experience that matches the preview exactly. All templates use the same 9-section structure described above.

## Recent Updates (Latest Session)

### Section Consolidation
1. **InvitationMessage → EventDetails**: The invitation message section was removed and integrated into EventDetails, appearing above the event card in all design variants.

2. **CountdownTimer → ImageCarousel**: The countdown timer section was removed and integrated into ImageCarousel, appearing below the carousel with full customization options.

### New Features
1. **Decorative Flowers**:
   - Available for all sections
   - 4 style options: red, beage, pink, white
   - Positioned in top-left and bottom-right corners
   - When both dividers and flowers are active, flowers adjust position (top flowers move down, bottom flowers move up) to prevent overlap
   - Content uses margin (not padding) to maintain section size while preventing overlap

2. **ImageCarousel Enhancements**:
   - Date & Message section between carousel and countdown timer
   - Countdown timer below carousel (3 designs: simple, elegant-card, minimal)
   - Elegant-card countdown: compact 4-column layout, no title, customizable card background color

3. **Text Wrapping**:
   - Global CSS rule ensures all text wraps within container width
   - Prevents horizontal overflow on mobile screens
   - Applied to all paragraphs, headings, and text elements

### Technical Details
- **Helper Files**:
  - `app/lib/flowerHelpers.tsx`: Decorative flowers rendering and margin calculation
  - `app/lib/curveHelpers.tsx`: Curve divider rendering
- **Section Count**: Reduced from 11 to 9 sections after consolidation
- **Template Structure**: Updated to reflect new section order (1-9 instead of 1-11)

