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
      id: 'cover-1',
      name: 'Classic Cover',
      preview: 'cover-classic',
      componentType: 'CoverSection',
      defaultData: {}
    },
    {
      id: 'cover-2',
      name: 'Elegant Cover',
      preview: 'cover-elegant',
      componentType: 'CoverSection',
      defaultData: {}
    }
  ],
  'HeroSection': [
    {
      id: 'hero-1',
      name: 'Full Screen Hero',
      preview: 'hero-fullscreen',
      componentType: 'HeroSection',
      defaultData: {}
    },
    {
      id: 'hero-2',
      name: 'Centered Hero',
      preview: 'hero-centered',
      componentType: 'HeroSection',
      defaultData: {}
    }
  ],
  'QuoteSection': [
    {
      id: 'quote-1',
      name: 'With Image',
      preview: 'quote-image',
      componentType: 'QuoteSection',
      defaultData: {}
    },
    {
      id: 'quote-2',
      name: 'Text Only',
      preview: 'quote-text',
      componentType: 'QuoteSection',
      defaultData: {}
    }
  ],
  'CountdownTimer': [
    {
      id: 'countdown-1',
      name: 'Elegant Card',
      preview: 'countdown-elegant',
      componentType: 'CountdownTimer',
      defaultData: { design: 'elegant-card' }
    },
    {
      id: 'countdown-2',
      name: 'Simple',
      preview: 'countdown-simple',
      componentType: 'CountdownTimer',
      defaultData: { design: 'simple' }
    },
    {
      id: 'countdown-3',
      name: 'Minimal',
      preview: 'countdown-minimal',
      componentType: 'CountdownTimer',
      defaultData: { design: 'minimal' }
    }
  ],
  'ImageCarousel': [
    {
      id: 'carousel-1',
      name: 'Standard Carousel',
      preview: 'carousel-standard',
      componentType: 'ImageCarousel',
      defaultData: {}
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

