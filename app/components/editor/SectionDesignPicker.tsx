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
      name: 'Simple',
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
    },
    {
      id: 'cover-framed-card',
      name: 'Framed Card',
      preview: 'cover-framed-card',
      componentType: 'CoverSection',
      defaultData: {
        design: 'framed-card',
        backgroundColor: '#0b0b0b',
        coupleNamesColor: '#c4a574',
      }
    },
    {
      id: 'cover-fullbleed',
      name: 'Full Bleed Overlay',
      preview: 'cover-fullbleed',
      componentType: 'CoverSection',
      defaultData: { design: 'fullbleed' }
    },
    {
      id: 'cover-arch',
      name: 'Arch Portrait',
      preview: 'cover-arch',
      componentType: 'CoverSection',
      defaultData: {
        design: 'arch',
        backgroundColor: '#f7f6f3',
        coupleNamesColor: '#c4a574',
      }
    },
    {
      id: 'cover-docked',
      name: 'Docked Sheet',
      preview: 'cover-docked',
      componentType: 'CoverSection',
      defaultData: {
        design: 'docked',
        coupleNamesColor: '#c4a574',
      }
    }
  ],
  'HeroSection': [
    {
      id: 'hero-classic',
      name: 'Classic',
      preview: 'hero-classic',
      componentType: 'HeroSection',
      defaultData: { design: 'classic' }
    },
    {
      id: 'hero-centered',
      name: 'Cinematic Center',
      preview: 'hero-centered',
      componentType: 'HeroSection',
      defaultData: {
        design: 'centered',
        coupleNamesColor: '#c4a574',
      }
    },
    {
      id: 'hero-split',
      name: 'Split Panel',
      preview: 'hero-split',
      componentType: 'HeroSection',
      defaultData: {
        design: 'split',
        backgroundColor: '#f7f6f3',
        coupleNamesColor: '#c4a574',
      }
    },
    {
      id: 'hero-inset',
      name: 'Inset Frame',
      preview: 'hero-inset',
      componentType: 'HeroSection',
      defaultData: {
        design: 'inset',
        backgroundColor: '#f7f6f3',
      }
    },
    {
      id: 'hero-lockup',
      name: 'Editorial Lockup',
      preview: 'hero-lockup',
      componentType: 'HeroSection',
      defaultData: {
        design: 'lockup',
        subtitleAlign: 'left',
        coupleNamesAlign: 'left',
        quoteAlign: 'left',
      }
    },
    {
      id: 'hero-immersive',
      name: 'Immersive',
      preview: 'hero-immersive',
      componentType: 'HeroSection',
      defaultData: {
        design: 'immersive',
        showTopCurve: false,
        showBottomCurve: false,
      }
    }
  ],
  'QuoteSection': [
    {
      id: 'quote-classic',
      name: 'Classic',
      preview: 'quote-classic',
      componentType: 'QuoteSection',
      defaultData: { design: 'classic' }
    },
    {
      id: 'quote-editorial',
      name: 'Editorial',
      preview: 'quote-editorial',
      componentType: 'QuoteSection',
      defaultData: { design: 'editorial', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'quote-framed',
      name: 'Framed Verse',
      preview: 'quote-framed',
      componentType: 'QuoteSection',
      defaultData: { design: 'framed', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'quote-pullquote',
      name: 'Pull Quote',
      preview: 'quote-pullquote',
      componentType: 'QuoteSection',
      defaultData: { design: 'pullquote', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'quote-verse',
      name: 'Double Rule',
      preview: 'quote-verse',
      componentType: 'QuoteSection',
      defaultData: { design: 'verse', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'quote-bar',
      name: 'Accent Bar',
      preview: 'quote-bar',
      componentType: 'QuoteSection',
      defaultData: {
        design: 'bar',
        backgroundColor: '#f7f6f3',
        quoteAlign: 'left',
        secondaryQuoteAlign: 'left',
        authorAlign: 'left',
      }
    }
  ],
  'ReligiousGreeting': [
    {
      id: 'greeting-classic',
      name: 'Classic',
      preview: 'greeting-classic',
      componentType: 'ReligiousGreeting',
      defaultData: { design: 'classic' }
    },
    {
      id: 'greeting-editorial',
      name: 'Editorial Right',
      preview: 'greeting-editorial',
      componentType: 'ReligiousGreeting',
      defaultData: {
        design: 'editorial',
        backgroundColor: '#f7f6f3',
        greetingAlign: 'right',
        messageAlign: 'right',
      }
    },
    {
      id: 'greeting-framed',
      name: 'Soft Card',
      preview: 'greeting-framed',
      componentType: 'ReligiousGreeting',
      defaultData: { design: 'framed', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'greeting-rule',
      name: 'Gold Rule',
      preview: 'greeting-rule',
      componentType: 'ReligiousGreeting',
      defaultData: { design: 'rule', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'greeting-banner',
      name: 'Dark Banner',
      preview: 'greeting-banner',
      componentType: 'ReligiousGreeting',
      defaultData: { design: 'banner', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'greeting-split',
      name: 'Split Stack',
      preview: 'greeting-split',
      componentType: 'ReligiousGreeting',
      defaultData: {
        design: 'split',
        backgroundColor: '#f7f6f3',
        greetingAlign: 'left',
        messageAlign: 'left',
      }
    }
  ],
  'ImageCarousel': [
    {
      id: 'carousel-classic',
      name: 'Classic',
      preview: 'carousel-classic',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'classic' }
    },
    {
      id: 'carousel-framed',
      name: 'Polaroid Frame',
      preview: 'carousel-framed',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'framed', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'carousel-filmstrip',
      name: 'Filmstrip',
      preview: 'carousel-filmstrip',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'filmstrip', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'carousel-landscape',
      name: 'Cinematic',
      preview: 'carousel-landscape',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'landscape', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'carousel-inset',
      name: 'Album Inset',
      preview: 'carousel-inset',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'inset', backgroundColor: '#f7f6f3' }
    },
    {
      id: 'carousel-peek',
      name: 'Side Peek',
      preview: 'carousel-peek',
      componentType: 'ImageCarousel',
      defaultData: { carouselDesign: 'peek', backgroundColor: '#f7f6f3' }
    }
  ],
  'PhotoGalleryGrid': [
    {
      id: 'gallery-1',
      name: 'Two Column',
      preview: 'gallery-2col',
      componentType: 'PhotoGalleryGrid',
      defaultData: { design: 'two', columns: 2, backgroundColor: '#f7f6f3' }
    },
    {
      id: 'gallery-2',
      name: 'Three Column',
      preview: 'gallery-3col',
      componentType: 'PhotoGalleryGrid',
      defaultData: { design: 'three', columns: 3, backgroundColor: '#f7f6f3' }
    },
    {
      id: 'gallery-mosaic',
      name: 'Album Mosaic',
      preview: 'gallery-mosaic',
      componentType: 'PhotoGalleryGrid',
      defaultData: { design: 'mosaic', columns: 2, backgroundColor: '#f7f6f3' }
    },
    {
      id: 'gallery-framed',
      name: 'Gold Frame',
      preview: 'gallery-framed',
      componentType: 'PhotoGalleryGrid',
      defaultData: { design: 'framed', columns: 2, backgroundColor: '#f7f6f3' }
    }
  ],
  'ClosingSection': [
    {
      id: 'closing-classic',
      name: 'Night Close',
      preview: 'closing-classic',
      componentType: 'ClosingSection',
      defaultData: {
        design: 'classic',
        backgroundColor: '#1f1d1a',
        coupleNamesAlign: 'center',
        messageAlign: 'center',
        designerCreditAlign: 'center',
        coupleNamesColor: '#c4a574',
        messageColor: 'rgba(247,246,243,0.82)',
        designerCreditColor: 'rgba(247,246,243,0.5)',
      }
    },
    {
      id: 'closing-cream',
      name: 'Soft Cream',
      preview: 'closing-cream',
      componentType: 'ClosingSection',
      defaultData: {
        design: 'cream',
        backgroundColor: '#f7f6f3',
        coupleNamesAlign: 'center',
        messageAlign: 'center',
        designerCreditAlign: 'center',
        coupleNamesColor: '#1f1d1a',
        messageColor: '#6b6258',
        designerCreditColor: '#8a8178',
      }
    },
    {
      id: 'closing-editorial',
      name: 'Editorial Sign-off',
      preview: 'closing-editorial',
      componentType: 'ClosingSection',
      defaultData: {
        design: 'editorial',
        backgroundColor: '#f7f6f3',
        coupleNamesAlign: 'left',
        messageAlign: 'left',
        designerCreditAlign: 'left',
        coupleNamesColor: '#1f1d1a',
        messageColor: '#6b6258',
        designerCreditColor: '#8a8178',
      }
    },
    {
      id: 'closing-framed',
      name: 'Gold Card',
      preview: 'closing-framed',
      componentType: 'ClosingSection',
      defaultData: {
        design: 'framed',
        backgroundColor: '#f7f6f3',
        coupleNamesAlign: 'center',
        messageAlign: 'center',
        designerCreditAlign: 'center',
        coupleNamesColor: '#1f1d1a',
        messageColor: '#6b6258',
        designerCreditColor: '#8a8178',
      }
    }
  ],
  'KadoDigitalSection': [
    {
      id: 'kado-classic',
      name: 'Account Cards',
      preview: 'kado-classic',
      componentType: 'KadoDigitalSection',
      defaultData: {
        design: 'classic',
        designId: 'kado-classic',
        backgroundColor: '#f7f6f3',
        titleAlign: 'center',
        messageAlign: 'center',
        titleColor: '#1f1d1a',
        messageColor: '#6b6258',
      }
    },
    {
      id: 'kado-editorial',
      name: 'Editorial Ledger',
      preview: 'kado-editorial',
      componentType: 'KadoDigitalSection',
      defaultData: {
        design: 'editorial',
        designId: 'kado-editorial',
        backgroundColor: '#f7f6f3',
        titleAlign: 'left',
        messageAlign: 'left',
        titleColor: '#1f1d1a',
        messageColor: '#6b6258',
      }
    },
    {
      id: 'kado-framed',
      name: 'Gold Envelope',
      preview: 'kado-framed',
      componentType: 'KadoDigitalSection',
      defaultData: {
        design: 'framed',
        designId: 'kado-framed',
        backgroundColor: '#f7f6f3',
        titleAlign: 'center',
        messageAlign: 'center',
        titleColor: '#1f1d1a',
        messageColor: '#6b6258',
      }
    },
    {
      id: 'kado-night',
      name: 'Night Envelope',
      preview: 'kado-night',
      componentType: 'KadoDigitalSection',
      defaultData: {
        design: 'night',
        designId: 'kado-night',
        backgroundColor: '#1f1d1a',
        titleAlign: 'center',
        messageAlign: 'center',
        titleColor: '#c4a574',
        messageColor: 'rgba(247,246,243,0.78)',
      }
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
      name: 'Simple',
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
    },
    {
      id: 'couple-collage',
      name: 'Overlapping Collage',
      preview: 'couple-collage',
      componentType: 'CoupleProfile',
      defaultData: {
        design: 'collage',
        backgroundColor: '#f7f6f3',
      }
    },
    {
      id: 'couple-editorial',
      name: 'Editorial Overlap',
      preview: 'couple-editorial',
      componentType: 'CoupleProfile',
      defaultData: {
        design: 'editorial',
        backgroundColor: '#f7f6f3',
      }
    },
    {
      id: 'couple-caption',
      name: 'Caption Card',
      preview: 'couple-caption',
      componentType: 'CoupleProfile',
      defaultData: {
        design: 'caption',
        backgroundColor: '#f7f6f3',
      }
    },
    {
      id: 'couple-folio',
      name: 'Side Folio',
      preview: 'couple-folio',
      componentType: 'CoupleProfile',
      defaultData: {
        design: 'folio',
        backgroundColor: '#f7f6f3',
      }
    }
  ],
  'RsvpSection': [
    {
      id: 'rsvp-classic',
      name: 'Classic',
      preview: 'rsvp-classic',
      componentType: 'RsvpSection',
      defaultData: { design: 'classic', designId: 'rsvp-classic' }
    },
    {
      id: 'rsvp-card',
      name: 'Card',
      preview: 'rsvp-card',
      componentType: 'RsvpSection',
      defaultData: { design: 'card', designId: 'rsvp-card' }
    },
    {
      id: 'rsvp-minimal',
      name: 'Minimal',
      preview: 'rsvp-minimal',
      componentType: 'RsvpSection',
      defaultData: { design: 'minimal', designId: 'rsvp-minimal' }
    },
    {
      id: 'rsvp-soft',
      name: 'Soft',
      preview: 'rsvp-soft',
      componentType: 'RsvpSection',
      defaultData: { design: 'soft', designId: 'rsvp-soft' }
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
            className={`p-3 border-2 rounded-lg text-left transition-[border-color,background-color,transform] duration-100 ease-out active:scale-[0.98] ${
              currentDesign === design.id
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent hover:bg-background'
            }`}
          >
            <DesignThumb preview={design.preview} />
            <p className="text-sm font-medium text-primary">{design.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DesignThumb({ preview }: { preview: string }) {
  const frame = "relative mb-2 h-28 w-full overflow-hidden rounded-md";

  switch (preview) {
    case 'cover-simple':
      return (
        <div className={`${frame} bg-neutral-800 p-3`}>
          <div className="mx-auto mt-6 h-2 w-16 rounded-full bg-white/50" />
          <div className="mx-auto mt-2 h-3 w-24 rounded-full bg-white/80" />
          <div className="mx-auto mt-8 h-5 w-20 rounded-full border border-white/40" />
        </div>
      );
    case 'cover-with-container':
      return (
        <div className={`${frame} bg-neutral-800 p-3`}>
          <div className="mx-auto mt-1 h-10 w-10 rounded-full bg-white/25" />
          <div className="mx-auto mt-2 h-3 w-20 rounded-full bg-white/80" />
          <div className="mx-auto mt-6 h-5 w-20 rounded-full border border-white/40" />
        </div>
      );
    case 'cover-framed-card':
      return (
        <div className={`${frame} bg-[#0b0b0b] p-3`}>
          <div className="mx-auto h-[52px] w-[42px] rounded-lg bg-neutral-500" />
          <div className="mx-auto mt-2 h-2.5 w-16 rounded-full bg-[#c4a574]" />
          <div className="mx-auto mt-3 h-5 w-[72px] rounded-xl bg-[#c4a574]" />
        </div>
      );
    case 'cover-fullbleed':
      return (
        <div className={`${frame} bg-neutral-500`}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          <div className="relative p-3 pt-4">
            <div className="mx-auto h-1.5 w-14 rounded-full bg-white/60" />
            <div className="mx-auto mt-2 h-3 w-20 rounded-full bg-white" />
            <div className="mx-auto mt-10 h-5 w-[76px] rounded-full bg-white" />
          </div>
        </div>
      );
    case 'cover-arch':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto h-[58px] w-[38px] bg-neutral-400" style={{ borderRadius: '999px 999px 8px 8px' }} />
          <div className="mx-auto mt-2 h-2.5 w-16 rounded-full bg-[#c4a574]" />
          <div className="mx-auto mt-2 h-4 w-[70px] rounded-full bg-neutral-900" />
        </div>
      );
    case 'cover-docked':
      return (
        <div className={`${frame} bg-neutral-500`}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="relative px-3 pt-3">
            <div className="mx-auto h-2.5 w-16 rounded-full bg-[#c4a574]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-[#f7f6f3] px-3 pb-2 pt-2">
            <div className="mx-auto h-2 w-14 rounded-full bg-neutral-400" />
            <div className="mx-auto mt-1.5 h-4 w-[64px] rounded-full bg-neutral-900" />
          </div>
        </div>
      );
    case 'hero-classic':
      return (
        <div className={`${frame} bg-neutral-500`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-2 px-3">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-white/70" />
            <div className="mx-auto mt-1.5 h-3 w-20 rounded-full bg-white" />
          </div>
        </div>
      );
    case 'hero-centered':
      return (
        <div className={`${frame} bg-neutral-500`}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative flex h-full flex-col items-center justify-center">
            <div className="h-1.5 w-12 rounded-full bg-white/60" />
            <div className="mt-2 h-3 w-20 rounded-full bg-[#c4a574]" />
            <div className="mt-2 h-px w-8 bg-white/50" />
          </div>
        </div>
      );
    case 'hero-split':
      return (
        <div className={`${frame} bg-[#f7f6f3]`}>
          <div className="h-[58%] bg-neutral-500" />
          <div className="flex flex-col items-center px-3 pt-2">
            <div className="h-2 w-16 rounded-full bg-[#c4a574]" />
            <div className="mt-1.5 h-1.5 w-20 rounded-full bg-neutral-300" />
          </div>
        </div>
      );
    case 'hero-inset':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="relative mx-auto h-[72px] w-[52px] overflow-hidden rounded-lg bg-neutral-500">
            <div className="absolute inset-x-0 bottom-1.5 mx-auto h-2 w-10 rounded-full bg-white" />
          </div>
        </div>
      );
    case 'hero-lockup':
      return (
        <div className={`${frame} bg-neutral-500`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="relative flex h-full flex-col justify-center px-3">
            <div className="h-1.5 w-10 rounded-full bg-white/60" />
            <div className="mt-2 h-3 w-16 rounded-full bg-white" />
            <div className="mt-2 h-px w-6 bg-[#c4a574]" />
          </div>
        </div>
      );
    case 'hero-immersive':
      return (
        <div className={`${frame} bg-neutral-500`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
          <div className="absolute inset-x-0 bottom-2 px-3">
            <div className="mx-auto h-1 w-10 rounded-full bg-white/50" />
            <div className="mx-auto mt-1.5 h-2.5 w-16 rounded-full bg-white" />
            <div className="mx-auto mt-1.5 h-px w-6 bg-white/40" />
          </div>
        </div>
      );
    case 'carousel-classic':
      return (
        <div className={`${frame} bg-neutral-400`}>
          <div className="absolute inset-x-3 bottom-3 flex justify-center gap-1">
            <div className="h-1 w-4 rounded-full bg-white" />
            <div className="h-1 w-1.5 rounded-full bg-white/50" />
            <div className="h-1 w-1.5 rounded-full bg-white/50" />
          </div>
        </div>
      );
    case 'carousel-framed':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="h-[72px] bg-neutral-400 shadow-sm" />
          <div className="h-4 bg-white" />
        </div>
      );
    case 'carousel-filmstrip':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="h-[58px] bg-neutral-400" />
          <div className="mt-1.5 flex justify-center gap-1">
            <div className="h-4 w-4 bg-neutral-500 ring-1 ring-[#c4a574]" />
            <div className="h-4 w-4 bg-neutral-300" />
            <div className="h-4 w-4 bg-neutral-300" />
          </div>
        </div>
      );
    case 'carousel-landscape':
      return (
        <div className={`${frame} bg-[#f7f6f3]`}>
          <div className="relative mt-6 h-10 bg-neutral-500">
            <div className="absolute inset-y-0 left-0 w-4 bg-black/30" />
            <div className="absolute inset-y-0 right-0 w-4 bg-black/30" />
          </div>
          <div className="mt-2 flex justify-center gap-1">
            <div className="h-1 w-4 rounded-full bg-[#c4a574]" />
            <div className="h-1 w-1.5 rounded-full bg-[#c4a574]/40" />
          </div>
        </div>
      );
    case 'carousel-inset':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="border border-[#c4a574]/50 p-1">
            <div className="h-[68px] border border-[#c4a574]/30 bg-neutral-400" />
          </div>
        </div>
      );
    case 'carousel-peek':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="flex h-full items-center">
            <div className="h-16 w-3.5 bg-neutral-300 opacity-50" />
            <div className="mx-1 h-[88%] flex-1 border border-[#c4a574]/40 bg-neutral-500 shadow-sm" />
            <div className="h-16 w-3.5 bg-neutral-300 opacity-50" />
          </div>
        </div>
      );
    case 'gallery-2col':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="grid grid-cols-2 gap-1">
            <div className="aspect-square bg-neutral-400" />
            <div className="aspect-square bg-neutral-500" />
            <div className="aspect-square bg-neutral-500" />
            <div className="aspect-square bg-neutral-400" />
          </div>
        </div>
      );
    case 'gallery-3col':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`aspect-square ${i % 2 === 0 ? "bg-neutral-400" : "bg-neutral-500"}`} />
            ))}
          </div>
        </div>
      );
    case 'gallery-mosaic':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="grid grid-cols-2 gap-1">
            <div className="col-span-2 h-12 bg-neutral-500" />
            <div className="h-8 bg-neutral-400" />
            <div className="h-8 bg-neutral-500" />
          </div>
        </div>
      );
    case 'gallery-framed':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="border border-[#c4a574]/50 p-0.5">
              <div className="h-12 bg-neutral-400" />
            </div>
            <div className="border border-[#c4a574]/50 p-0.5">
              <div className="h-12 bg-neutral-500" />
            </div>
          </div>
        </div>
      );
    case 'closing-classic':
      return (
        <div className={`${frame} bg-[#1f1d1a] p-3`}>
          <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-[#c4a574]/70" />
          <div className="mx-auto mt-2 h-2.5 w-16 rounded-full bg-[#c4a574]" />
          <div className="mx-auto mt-2 h-px w-8 bg-[#c4a574]" />
          <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-white/35" />
        </div>
      );
    case 'closing-cream':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-[#c4a574]/70" />
          <div className="mx-auto mt-2 h-2.5 w-16 rounded-full bg-neutral-800" />
          <div className="mx-auto mt-2 h-px w-8 bg-[#c4a574]" />
          <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-neutral-300" />
        </div>
      );
    case 'closing-editorial':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mt-3 h-1 w-8 rounded-full bg-[#c4a574]/70" />
          <div className="mt-2 h-3 w-16 rounded-full bg-neutral-800" />
          <div className="mt-3 border-l-2 border-[#c4a574] pl-2">
            <div className="h-1.5 w-16 rounded-full bg-neutral-300" />
            <div className="mt-1 h-1.5 w-12 rounded-full bg-neutral-300" />
          </div>
        </div>
      );
    case 'closing-framed':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto h-[76px] w-[72px] border border-[#c4a574]/50 p-1.5">
            <div className="flex h-full flex-col items-center justify-center border border-[#c4a574]/30 bg-white">
              <div className="h-2 w-10 rounded-full bg-neutral-800" />
              <div className="mt-1.5 h-px w-6 bg-[#c4a574]" />
              <div className="mt-1.5 h-1 w-8 rounded-full bg-neutral-300" />
            </div>
          </div>
        </div>
      );
    case 'quote-classic':
      return (
        <div className={`${frame} bg-white p-3`}>
          <div className="mx-auto mb-2 h-6 w-5 rounded-sm bg-neutral-200" />
          <div className="mx-auto h-2 w-20 rounded-full bg-neutral-400" />
          <div className="mx-auto mt-1.5 h-1.5 w-16 rounded-full bg-neutral-300" />
        </div>
      );
    case 'quote-editorial':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto h-2.5 w-[72px] rounded-full bg-neutral-800" />
          <div className="mx-auto mt-2 h-px w-8 bg-[#c4a574]" />
          <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-neutral-300" />
        </div>
      );
    case 'quote-framed':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto h-[72px] w-[70px] border border-[#c4a574]/50 p-2">
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-neutral-400" />
            <div className="mx-auto mt-1.5 h-1.5 w-8 rounded-full bg-neutral-300" />
          </div>
        </div>
      );
    case 'quote-pullquote':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto text-center text-2xl leading-none text-[#c4a574]/40" style={{ fontFamily: 'Georgia, serif' }}>“</div>
          <div className="mx-auto mt-1 h-2 w-16 rounded-full bg-neutral-700" />
          <div className="mx-auto mt-1.5 h-1.5 w-12 rounded-full bg-neutral-300" />
        </div>
      );
    case 'quote-verse':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto h-px w-10 bg-[#c4a574]" />
          <div className="mx-auto mt-0.5 h-px w-6 bg-[#c4a574]" />
          <div className="mx-auto mt-3 h-2 w-16 rounded-full bg-neutral-700" />
          <div className="mx-auto mt-3 h-px w-6 bg-[#c4a574]" />
          <div className="mx-auto mt-0.5 h-px w-10 bg-[#c4a574]" />
        </div>
      );
    case 'quote-bar':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mt-4 border-l-2 border-[#c4a574] pl-2">
            <div className="h-2 w-16 rounded-full bg-neutral-800" />
            <div className="mt-1.5 h-1.5 w-14 rounded-full bg-neutral-300" />
            <div className="mt-1 h-1.5 w-10 rounded-full bg-neutral-300" />
          </div>
        </div>
      );
    case 'greeting-classic':
      return (
        <div className={`${frame} bg-white p-3`}>
          <div className="mx-auto mt-4 h-3 w-20 rounded-full bg-neutral-800" />
          <div className="mx-auto mt-2 h-1.5 w-24 rounded-full bg-neutral-300" />
          <div className="mx-auto mt-1 h-1.5 w-20 rounded-full bg-neutral-300" />
        </div>
      );
    case 'greeting-editorial':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="ml-auto mt-4 h-3 w-16 rounded-full bg-neutral-800" />
          <div className="ml-auto mt-2 h-1.5 w-20 rounded-full bg-neutral-300" />
          <div className="ml-auto mt-1 h-1.5 w-14 rounded-full bg-neutral-300" />
        </div>
      );
    case 'greeting-framed':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto h-[76px] w-[78px] rounded-xl bg-white p-2 shadow-sm">
            <div className="mx-auto mt-3 h-2 w-12 rounded-full bg-neutral-800" />
            <div className="mx-auto mt-2 h-1.5 w-14 rounded-full bg-neutral-300" />
          </div>
        </div>
      );
    case 'greeting-rule':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-[#c4a574]" />
          <div className="mx-auto mt-2 h-2.5 w-16 rounded-full bg-neutral-800" />
          <div className="mx-auto mt-2 h-px w-8 bg-[#c4a574]" />
          <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-neutral-300" />
        </div>
      );
    case 'greeting-banner':
      return (
        <div className={`${frame} bg-[#f7f6f3]`}>
          <div className="flex h-[52%] items-center justify-center bg-[#1f1d1a]">
            <div className="h-2 w-14 rounded-full bg-[#f7f6f3]" />
          </div>
          <div className="px-3 pt-2">
            <div className="mx-auto h-1.5 w-16 rounded-full bg-neutral-300" />
          </div>
        </div>
      );
    case 'greeting-split':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mt-3 h-3 w-16 rounded-full bg-neutral-800" />
          <div className="mt-3 border-l-2 border-[#c4a574] pl-2">
            <div className="h-1.5 w-[4.5rem] rounded-full bg-neutral-300" />
            <div className="mt-1 h-1.5 w-12 rounded-full bg-neutral-300" />
          </div>
        </div>
      );
    case 'couple-simple':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-4`}>
          <div className="mx-auto mt-4 h-3 w-20 rounded-full bg-neutral-800" />
          <div className="mx-auto mt-2 h-2 w-28 rounded-full bg-neutral-300" />
          <div className="mx-auto mt-1 h-2 w-24 rounded-full bg-neutral-300" />
        </div>
      );
    case 'couple-container':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mx-auto h-10 w-10 rounded-full bg-neutral-400" />
          <div className="mx-auto mt-2 h-2.5 w-16 rounded-full bg-neutral-800" />
          <div className="mx-auto mt-1.5 h-2 w-24 rounded-full bg-neutral-300" />
        </div>
      );
    case 'couple-collage':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="relative h-full">
            <div className="absolute left-2 top-1 h-16 w-12 bg-neutral-400 shadow-sm" />
            <div className="absolute bottom-3 right-3 h-9 w-9 bg-neutral-600" />
          </div>
        </div>
      );
    case 'couple-editorial':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="relative h-full">
            <div className="absolute left-1 top-1 h-[72px] w-11 bg-neutral-400" />
            <div className="absolute bottom-2 right-1 w-16">
              <div className="ml-auto h-2 w-12 rounded-full bg-neutral-800" />
              <div className="ml-auto mt-1 h-1.5 w-10 rounded-full bg-neutral-300" />
            </div>
          </div>
        </div>
      );
    case 'couple-caption':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="relative mx-auto h-16 w-14 rounded-lg bg-neutral-400" />
          <div className="relative mx-auto -mt-3 w-[72px] rounded-md bg-white py-1.5 shadow-sm">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-neutral-800" />
          </div>
        </div>
      );
    case 'couple-folio':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-3`}>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-16 w-11 bg-neutral-400" />
            <div className="min-w-0 flex-1">
              <div className="h-1.5 w-8 rounded-full bg-neutral-300" />
              <div className="mt-1.5 h-2 w-12 rounded-full bg-neutral-800" />
              <div className="mt-1.5 h-px w-5 bg-[#c4a574]" />
              <div className="mt-1.5 h-1.5 w-10 rounded-full bg-neutral-300" />
            </div>
          </div>
        </div>
      );
    case 'kado-classic':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div
            className="relative mx-auto mt-3 h-[52px] w-[84px] overflow-hidden rounded-md"
            style={{ background: "linear-gradient(125deg, #3d3d3d, #111)" }}
          >
            <div className="absolute left-1.5 top-1.5 h-2 w-3 rounded-[2px] bg-[#c4a574]" />
            <div className="absolute bottom-3 left-1.5 right-1.5 h-1 rounded-full bg-white/80" />
            <div className="absolute bottom-1.5 left-1.5 h-1 w-8 rounded-full bg-white/40" />
          </div>
        </div>
      );
    case 'kado-editorial':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="mt-2 h-1.5 w-10 rounded-full bg-neutral-800" />
          <div
            className="relative mt-2 h-[48px] w-[78px] overflow-hidden rounded-md"
            style={{ background: "linear-gradient(125deg, #3d3d3d, #111)" }}
          >
            <div className="absolute left-1.5 top-1.5 h-2 w-3 rounded-[2px] bg-[#c4a574]" />
            <div className="absolute bottom-2 left-1.5 right-1.5 h-1 rounded-full bg-white/80" />
          </div>
        </div>
      );
    case 'kado-framed':
      return (
        <div className={`${frame} bg-[#f7f6f3] p-2`}>
          <div className="mx-auto mt-2 border border-[#c4a574]/50 p-1">
            <div className="flex h-[68px] items-center justify-center border border-[#c4a574]/30 bg-white">
              <div
                className="relative h-[36px] w-[58px] overflow-hidden rounded-sm"
                style={{ background: "linear-gradient(125deg, #3d3d3d, #111)" }}
              >
                <div className="absolute left-1 top-1 h-1.5 w-2.5 rounded-[1px] bg-[#c4a574]" />
                <div className="absolute bottom-1.5 left-1 right-1 h-0.5 rounded-full bg-white/80" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'kado-night':
      return (
        <div className={`${frame} bg-[#1f1d1a] p-2`}>
          <div
            className="relative mx-auto mt-3 h-[52px] w-[84px] overflow-hidden rounded-md ring-1 ring-[#c4a574]/40"
            style={{ background: "linear-gradient(125deg, #4a3f2e, #161412)" }}
          >
            <div className="absolute left-1.5 top-1.5 h-2 w-3 rounded-[2px] bg-[#c4a574]" />
            <div className="absolute bottom-3 left-1.5 right-1.5 h-1 rounded-full bg-white/80" />
            <div className="absolute bottom-1.5 left-1.5 h-1 w-8 rounded-full bg-white/40" />
          </div>
        </div>
      );
    default:
      return (
        <div className="mb-2 flex h-24 w-full items-center justify-center rounded bg-gray-100">
          <span className="text-xs text-muted">{preview}</span>
        </div>
      );
  }
}

