// Mock template data structure
// This will be replaced with Supabase API calls later

export interface TemplateSection {
  id: string;
  type: string;
  componentType: string; // The actual component type to use
  order: number;
  defaultData?: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  template_type?: string; // For compatibility with editor
  category: 'modern' | 'classic' | 'romantic' | 'minimalist' | 'elegant' | 'rustic';
  description: string;
  previewImageUrl: string;
  thumbnailUrl: string;
  templateData: {
    type: string;
    sections: TemplateSection[];
    metadata: {
      version: string;
      responsive: boolean;
      defaultColors: {
        primary: string;
        accent: string;
        background: string;
      };
    };
  };
  isPremium: boolean;
  isActive: boolean;
}

/** Default data for the hero section of a template (for listing previews). */
export function getTemplateHeroDefaultData(template: Template): Record<string, unknown> | null {
  const hero = template.templateData?.sections?.find(
    (s) => s.componentType === "HeroSection" || s.id === "hero-section"
  );
  return hero?.defaultData ? { ...hero.defaultData } : null;
}

// Standard template structure - all templates use this same structure
const createStandardTemplateStructure = (): TemplateSection[] => [
  {
    id: 'cover-section',
    type: 'cover',
    componentType: 'CoverSection',
    order: 1,
    defaultData: {
      date: '09 .01 .2026',
      coupleNames: 'John & Jane',
      quote: 'Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.'
    }
  },
  {
    id: 'hero-section',
    type: 'hero',
    componentType: 'HeroSection',
    order: 2,
    defaultData: {
      subtitle: 'The Wedding of',
      coupleNames: 'John & Jane',
      quote: 'Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.',
      backgroundImages: []
    }
  },
  {
    id: 'quote-section',
    type: 'quote',
    componentType: 'QuoteSection',
    order: 3,
    defaultData: {
      quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
      author: 'Rg Veda X.85.42.'
    }
  },
  {
    id: 'religious-greeting',
    type: 'greeting',
    componentType: 'ReligiousGreeting',
    order: 4,
    defaultData: {
      greeting: 'Om Swastyastu',
      message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
    }
  },
  {
    id: 'groom-profile',
    type: 'profile',
    componentType: 'CoupleProfile',
    order: 5,
    defaultData: {
      name: 'John',
      fullName: 'John Doe',
      relation: 'Anak pertama dari pasangan',
      parents: {
        father: 'Father Name',
        mother: 'Mother Name'
      },
      address: 'Address here',
      type: 'groom'
    }
  },
  {
    id: 'bride-profile',
    type: 'profile',
    componentType: 'CoupleProfile',
    order: 6,
    defaultData: {
      name: 'Jane',
      fullName: 'Jane Doe',
      relation: 'Anak kedua dari pasangan',
      parents: {
        father: 'Father Name',
        mother: 'Mother Name'
      },
      address: 'Address here',
      type: 'bride'
    }
  },
  {
    id: 'event-details',
    type: 'event',
    componentType: 'EventDetails',
    order: 7,
    defaultData: {
      invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.'
    }
  },
  {
    id: 'image-carousel',
    type: 'carousel',
    componentType: 'ImageCarousel',
    order: 8,
    defaultData: {
      images: [],
      countdownDesign: 'elegant-card',
      countdownTargetDate: '2026-12-31T08:00:00.000Z',
      dateMessageDate: '31.12.2026',
      dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
      dateMessageDateAlign: 'center',
      dateMessageTextAlign: 'center'
    }
  },
  {
    id: 'photo-gallery',
    type: 'gallery',
    componentType: 'PhotoGalleryGrid',
    order: 9,
    defaultData: {
      columns: 2,
      images: []
    }
  },
  {
    id: 'closing-section',
    type: 'closing',
    componentType: 'ClosingSection',
    order: 10,
    defaultData: {
      coupleNames: 'John & Jane',
      message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan putra-putri kami.',
      designerCredit: 'Invitation by Stundea Studio'
    }
  }
];

// Mock Templates Data - variants (same page structure, different design combinations).
// Original six (001–006): each template uses a dedicated pair of Unsplash photo IDs only (no image shared across 001–006).
// Templates 007+ may reuse other pools; 011–012 use their own pairs.
export const mockTemplates: Template[] = [
  // 1. Elegant – cover with image, profiles with image, event card, countdown elegant-card, carousel framed
  {
    id: 'elegant-001',
    name: 'Elegant',
    slug: 'elegant-001',
    template_type: 'elegant',
    category: 'elegant',
    description: 'Undangan elegan dengan cover & profil berfoto, countdown kartu, carousel framed.',
    previewImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Albert & Rose',
            date: '09 .01 .2026',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
            imageStyle: 'circular',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Albert & Rose',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
              'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'white'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Albert',
            fullName: 'Albert Wijaya',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Rose',
            fullName: 'Rose Dewi',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-01-09',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'card'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'framed',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#c9a87c',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Albert & Rose',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#2d2d2d',
          accent: '#c9a87c',
          background: '#ffffff'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 2. Classic – cover simple, profiles simple (no image), event card, countdown simple
  {
    id: 'classic-002',
    name: 'Classic',
    slug: 'classic-002',
    template_type: 'classic',
    category: 'classic',
    description: 'Tema klasik: cover dan profil tanpa foto, countdown sederhana, carousel filmstrip.',
    previewImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'James & Emma',
            date: '09 .01 .2026',
            design: 'simple',
            decorativeFlowers: false
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'James & Emma',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200',
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'grey-and-white'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'James',
            fullName: 'James Wilson',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'simple'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Emma',
            fullName: 'Emma Davis',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'simple'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-01-09',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'card'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'simple',
            carouselDesign: 'filmstrip',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            images: [
              { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'James & Emma',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#2d2d2d',
          accent: '#8b7355',
          background: '#fafafa'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 3. Refined (elegant-split event, landscape carousel) – cover with image, profiles with image, event elegant-split, countdown elegant-card
  {
    id: 'refined-003',
    name: 'Refined',
    slug: 'refined-003',
    template_type: 'refined',
    category: 'elegant',
    description: 'Cover & profil dengan foto, detail acara gaya split, countdown kartu, carousel landscape.',
    previewImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'David & Maria',
            date: '09 .01 .2026',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop',
            imageStyle: 'circular',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'David & Maria',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'pink-and-yellow'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'David',
            fullName: 'David Martinez',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Maria',
            fullName: 'Maria Santos',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-01-09',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'elegant-split'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'landscape',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#6b7280',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'David & Maria',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1f2937',
          accent: '#6b7280',
          background: '#ffffff'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 4. Minimal – cover simple, profiles simple, event modern-minimal, countdown minimal
  {
    id: 'minimal-004',
    name: 'Minimal',
    slug: 'minimal-004',
    template_type: 'minimal',
    category: 'minimalist',
    description: 'Tanpa foto di cover & profil, countdown minimal, detail acara modern-minimal, carousel framed.',
    previewImageUrl: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Alex & Sarah',
            date: '09 .01 .2026',
            design: 'simple',
            decorativeFlowers: false
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Alex & Sarah',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=1200',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'white-teraccota'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Alex',
            fullName: 'Alex Thompson',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'simple'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Sarah',
            fullName: 'Sarah Lee',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'simple'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-01-09',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'modern-minimal'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'filmstrip',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#c9a87c',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=800', alt: 'Prewedding 3', order: 3 }
              
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Alex & Sarah',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1a1a1a',
          accent: '#4b5563',
          background: '#ffffff'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 5. Romantic (more decorative flowers: cover + religious greeting) – cover with image, profiles with image, event card, countdown elegant-card (warm images)
  {
    id: 'romantic-005',
    name: 'Romantic',
    slug: 'romantic-005',
    template_type: 'romantic',
    category: 'romantic',
    description: 'Nuansa romantis dengan banyak dekorasi bunga, cover & profil berfoto, carousel filmstrip.',
    previewImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Ryan & Lily',
            date: '09 .01 .2026',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
            imageStyle: 'circular',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Ryan & Lily',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'pink-love'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.',
            decorativeFlowers: true
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Ryan',
            fullName: 'Ryan Cooper',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Lily',
            fullName: 'Lily Anderson',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-01-09',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'card'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'filmstrip',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#c9a87c',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Ryan & Lily',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#4a3728',
          accent: '#c9a87c',
          background: '#fff8f0'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 6. Modern (more decorative flowers: cover + religious greeting) – cover simple, profiles with image, event timeline-vertical, countdown simple
  {
    id: 'modern-006',
    name: 'Modern',
    slug: 'modern-006',
    template_type: 'modern',
    category: 'modern',
    description: 'Tema modern dengan dekorasi bunga, profil berfoto, detail acara timeline vertikal, carousel landscape.',
    previewImageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Daniel & Sophie',
            date: '09 .01 .2026',
            design: 'simple',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Daniel & Sophie',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200',
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'pink-bouquet'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.',
            decorativeFlowers: true
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Daniel',
            fullName: 'Daniel Chen',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Sophie',
            fullName: 'Sophie Kim',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-01-09',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'timeline-vertical'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'simple',
            carouselDesign: 'landscape',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            images: [
              { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Daniel & Sophie',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1f2937',
          accent: '#3b82f6',
          background: '#ffffff'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 7. Blossom – warm palette, cover & profiles with new stock photos, card event, framed carousel
  {
    id: 'blossom-007',
    name: 'Blossom',
    slug: 'blossom-007',
    template_type: 'blossom',
    category: 'romantic',
    description: 'Nuansa lembut dengan foto prewedding baru, countdown kartu elegan, carousel framed.',
    previewImageUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Ethan & Clara',
            date: '14 .06 .2026',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=1200&fit=crop',
            imageStyle: 'circular',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Ethan & Clara',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200',
              'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'pink-and-yellow'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Ethan',
            fullName: 'Ethan Pratama',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Clara',
            fullName: 'Clara Santoso',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-06-14',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'card'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'framed',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#b8860b',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-b7-1', url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600', alt: 'Gallery 1' },
              { id: 'gallery-b7-2', url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600', alt: 'Gallery 2' },
              { id: 'gallery-b7-3', url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600', alt: 'Gallery 3' },
              { id: 'gallery-b7-4', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Ethan & Clara',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#3d2914',
          accent: '#b8860b',
          background: '#fffaf5'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 8. Mist – cool minimalist, simple cover & profiles, modern-minimal event, filmstrip carousel
  {
    id: 'mist-008',
    name: 'Mist',
    slug: 'mist-008',
    template_type: 'mist',
    category: 'minimalist',
    description: 'Tema kabut: hero foto baru, tanpa foto di cover & profil, countdown minimal, filmstrip.',
    previewImageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Noah & Mia',
            date: '22 .08 .2026',
            design: 'simple',
            decorativeFlowers: false
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Noah & Mia',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200',
              'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'grey-and-white'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Noah',
            fullName: 'Noah Hartono',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'simple'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Mia',
            fullName: 'Mia Putri',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'simple'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-08-22',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'modern-minimal'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'simple',
            carouselDesign: 'filmstrip',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            images: [
              { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-m8-1', url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600', alt: 'Gallery 1' },
              { id: 'gallery-m8-2', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600', alt: 'Gallery 2' },
              { id: 'gallery-m8-3', url: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600', alt: 'Gallery 3' },
              { id: 'gallery-m8-4', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Noah & Mia',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1e293b',
          accent: '#64748b',
          background: '#f8fafc'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 9. Verdant – elegant-split event, landscape carousel, cover & profiles with new portraits
  {
    id: 'verdant-009',
    name: 'Verdant',
    slug: 'verdant-009',
    template_type: 'verdant',
    category: 'elegant',
    description: 'Hijau garden: detail acara split, carousel landscape, foto couple & galeri baru.',
    previewImageUrl: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Lucas & Nina',
            date: '03 .11 .2026',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=1200&fit=crop',
            imageStyle: 'circular',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Lucas & Nina',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200',
              'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'white'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Lucas',
            fullName: 'Lucas Aditya',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Nina',
            fullName: 'Nina Kusuma',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-11-03',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'elegant-split'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'landscape',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#2f5d50',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-v9-1', url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600', alt: 'Gallery 1' },
              { id: 'gallery-v9-2', url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600', alt: 'Gallery 2' },
              { id: 'gallery-v9-3', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600', alt: 'Gallery 3' },
              { id: 'gallery-v9-4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Lucas & Nina',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1a2e28',
          accent: '#2f5d50',
          background: '#f4faf7'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 10. Ember – timeline event, decorative flowers, profiles with new photos, landscape carousel
  {
    id: 'ember-010',
    name: 'Ember',
    slug: 'ember-010',
    template_type: 'ember',
    category: 'modern',
    description: 'Modern hangat: timeline vertikal, bunga dekoratif, hero & galeri dengan foto baru.',
    previewImageUrl: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Oliver & Hazel',
            date: '19 .02 .2026',
            design: 'simple',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Oliver & Hazel',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=1200',
              'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'pink-bouquet'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.',
            decorativeFlowers: true
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Oliver',
            fullName: 'Oliver Wijaya',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Hazel',
            fullName: 'Hazel Anggraini',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-02-19',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'timeline-vertical'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'simple',
            carouselDesign: 'landscape',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            images: [
              { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-e10-1', url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600', alt: 'Gallery 1' },
              { id: 'gallery-e10-2', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600', alt: 'Gallery 2' },
              { id: 'gallery-e10-3', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600', alt: 'Gallery 3' },
              { id: 'gallery-e10-4', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Oliver & Hazel',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#422006',
          accent: '#c2410c',
          background: '#fffbeb'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 11. Aurora – warm sunset tones, dedicated image pair only for this template
  {
    id: 'aurora-011',
    name: 'Aurora',
    slug: 'aurora-011',
    template_type: 'aurora',
    category: 'romantic',
    description: 'Nuansa senja: foto unik per template, countdown kartu, carousel landscape.',
    previewImageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Marcus & Elena',
            date: '28 .09 .2026',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
            imageStyle: 'circular',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Marcus & Elena',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200',
              'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'pink-love'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Marcus',
            fullName: 'Marcus Aditya',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Elena',
            fullName: 'Elena Putri',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-09-28',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'card'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'landscape',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#b45309',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-a11-1', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600', alt: 'Gallery 1' },
              { id: 'gallery-a11-2', url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600', alt: 'Gallery 2' },
              { id: 'gallery-a11-3', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600', alt: 'Gallery 3' },
              { id: 'gallery-a11-4', url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Marcus & Elena',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#431407',
          accent: '#ea580c',
          background: '#fff7ed'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // 12. Dusk – cool garden pair, unique to this slug (not used in 001–006)
  {
    id: 'dusk-012',
    name: 'Dusk',
    slug: 'dusk-012',
    template_type: 'dusk',
    category: 'elegant',
    description: 'Garden dusk aesthetic dengan sepasang foto khusus, event elegant-split, carousel framed.',
    previewImageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Felix & Diana',
            date: '12 .05 .2026',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&h=1200&fit=crop',
            imageStyle: 'circular',
            decorativeFlowers: true
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Felix & Diana',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200',
              'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.',
            quoteDecorativeStyle: 'white'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Felix',
            fullName: 'Felix Nugraha',
            relation: 'Anak pertama dari pasangan',
            parents: { father: 'I Nyoman Sudiana', mother: 'Ni Ketut Anik Meliani' },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Diana',
            fullName: 'Diana Sari',
            relation: 'Anak kedua dari pasangan',
            parents: { father: 'I Gede Wijana', mother: 'Ni Made Suati' },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride',
            design: 'with-container',
            imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600',
            imageStyle: 'circular'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-05-12',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan',
            design: 'elegant-split'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            carouselDesign: 'framed',
            countdownTargetDate: '2026-12-31T08:00:00.000Z',
            dateMessageDate: '31.12.2026',
            dateMessageText: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.',
            dateMessageDateAlign: 'center',
            dateMessageTextAlign: 'center',
            countdownCardColor: '#4c1d95',
            countdownLabelColor: '#ffffff',
            images: [
              { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-d12-1', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600', alt: 'Gallery 1' },
              { id: 'gallery-d12-2', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600', alt: 'Gallery 2' },
              { id: 'gallery-d12-3', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600', alt: 'Gallery 3' },
              { id: 'gallery-d12-4', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Felix & Diana',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.',
            designerCredit: 'Invitation by Stundea Studio'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1e1b4b',
          accent: '#7c3aed',
          background: '#faf5ff'
        }
      }
    },
    isPremium: false,
    isActive: true
  }
];

// Category labels
export const categoryLabels: Record<string, string> = {
  modern: 'Modern',
  classic: 'Klasik',
  romantic: 'Romantis',
  minimalist: 'Minimalis',
  elegant: 'Elegan',
  rustic: 'Rustic'
};

// Get all unique categories
export const getAllCategories = (): string[] => {
  return Array.from(new Set(mockTemplates.map(t => t.category)));
};

// Filter templates by category
export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return mockTemplates;
  return mockTemplates.filter(t => t.category === category);
};

// Search templates
export const searchTemplates = (query: string): Template[] => {
  const lowerQuery = query.toLowerCase();
  return mockTemplates.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
  );
};
