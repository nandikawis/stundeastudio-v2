"use client";

interface DesignOption {
  id: string;
  name: string;
  preview: string; // URL or component name
  componentType: string;
  defaultData?: Record<string, any>;
}

interface SectionDesignPickerProps {
  sectionType: string;
  currentDesign?: string;
  onSelectDesign: (design: DesignOption) => void;
  onClose: () => void;
}

// Design variants for each section type
const designVariants: Record<string, DesignOption[]> = {
  'CoverSection': [
    {
      id: 'cover-simple',
      name: 'Simple (No Image Container)',
      preview: 'cover-simple',
      componentType: 'CoverSection',
      defaultData: { design: 'simple' }
    },
    {
      id: 'cover-with-container',
      name: 'With Image Container',
      preview: 'cover-with-container',
      componentType: 'CoverSection',
      defaultData: { design: 'with-container' }
    }
  ],
  'ImageCarousel': [
    {
      id: 'carousel-classic',
      name: 'Classic (Full Width)',
      preview: 'carousel-classic',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'classic' }
    },
    {
      id: 'carousel-framed',
      name: 'Framed Card',
      preview: 'carousel-framed',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'framed' }
    },
    {
      id: 'carousel-filmstrip',
      name: 'Filmstrip Thumbnails',
      preview: 'carousel-filmstrip',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'filmstrip' }
    },
    {
      id: 'carousel-landscape',
      name: 'Landscape',
      preview: 'carousel-landscape',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'landscape' }
    }
  ],
  'PhotoGalleryGrid': [
    {
      id: 'gallery-1',
      name: '2 Columns',
      preview: 'gallery-2col',
      componentType: 'PhotoGalleryGrid',
      defaultData: { columns: 2 }
    },
    {
      id: 'gallery-2',
      name: '3 Columns',
      preview: 'gallery-3col',
      componentType: 'PhotoGalleryGrid',
      defaultData: { columns: 3 }
    }
  ],
  'EventDetails': [
    {
      id: 'event-card',
      name: 'Card Style',
      preview: 'event-card',
      componentType: 'EventDetails',
      defaultData: { design: 'card' }
    },
    {
      id: 'event-elegant',
      name: 'Elegant Split',
      preview: 'event-elegant',
      componentType: 'EventDetails',
      defaultData: { design: 'elegant-split' }
    },
    {
      id: 'event-minimal',
      name: 'Modern Minimal',
      preview: 'event-minimal',
      componentType: 'EventDetails',
      defaultData: { design: 'modern-minimal' }
    },
    {
      id: 'event-timeline',
      name: 'Timeline Vertical',
      preview: 'event-timeline',
      componentType: 'EventDetails',
      defaultData: { design: 'timeline-vertical' }
    },
    {
      id: 'event-badge',
      name: 'Badge Accent',
      preview: 'event-badge',
      componentType: 'EventDetails',
      defaultData: { design: 'badge-accent' }
    },
    {
      id: 'event-framed',
      name: 'Framed Classic',
      preview: 'event-framed',
      componentType: 'EventDetails',
      defaultData: { design: 'framed-classic' }
    }
  ],
  'CoupleProfile': [
    {
      id: 'couple-simple',
      name: 'Simple (No Container)',
      preview: 'couple-simple',
      componentType: 'CoupleProfile',
      defaultData: { design: 'simple' }
    },
    {
      id: 'couple-container',
      name: 'With Image Container',
      preview: 'couple-container',
      componentType: 'CoupleProfile',
      defaultData: { design: 'with-container' }
    }
  ]
};

export default function SectionDesignPicker({
  sectionType,
  currentDesign,
  onSelectDesign,
  onClose
}: SectionDesignPickerProps) {
  const designs = designVariants[sectionType] || [];

  if (designs.length === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted">No design variants available for this section.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-light transition-all"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-primary">Choose Design</h3>
        <button
          onClick={onClose}
          className="text-muted hover:text-primary text-xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {designs.map((design) => (
          <button
            key={design.id}
            onClick={() => {
              onSelectDesign(design);
              onClose();
            }}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              currentDesign === design.id
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent hover:bg-background'
            }`}
          >
            <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
              <span className="text-xs text-muted">{design.name}</span>
            </div>
            <p className="text-sm font-medium text-primary">{design.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

