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
      countdownDesign: 'elegant-card'
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
      message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan putra-putri kami.'
    }
  }
];

// Mock Templates Data - All using the same structure
export const mockTemplates: Template[] = [
  {
    id: 'modern-elegant-001',
    name: 'Modern Elegant',
    slug: 'modern-elegant-001',
    template_type: 'modern-elegant',
    category: 'modern',
    description: 'Desain modern dengan sentuhan elegan, cocok untuk pasangan yang menyukai gaya kontemporer',
    previewImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'John & Jane',
            date: '09 .01 .2026'
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'John & Jane',
            backgroundImages: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200'
            ]
          }),
          ...(section.id === 'image-carousel' && {
            images: [
              { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', alt: 'Photo 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', alt: 'Photo 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', alt: 'Photo 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 4' },
              { id: 'gallery-5', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 5' },
              { id: 'gallery-6', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 6' }
            ]
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#2d2d2d',
          accent: '#c9a87c',
          background: '#fafafa'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  // New mobile-first template inspired by Bayu & Nia structure
  {
    id: 'bayu-nia-mobile-001',
    name: 'Bayu & Nia Mobile',
    slug: 'bayu-nia-mobile-001',
    template_type: 'bayu-nia-mobile',
    category: 'elegant',
    description: 'Undangan mobile dengan struktur lengkap seperti contoh Bayu & Nia (cover, doa, profil, detail acara, countdown, galeri).',
    previewImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Bayu & Nia',
            date: '09 .01 .2026'
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Bayu & Nia',
            subtitle: 'The Wedding of',
            backgroundImages: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200'
            ]
          }),
          ...(section.id === 'quote-section' && {
            quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
            author: 'Rg Veda X.85.42.'
          }),
          ...(section.id === 'religious-greeting' && {
            greeting: 'Om Swastyastu',
            message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.'
          }),
          ...(section.id === 'groom-profile' && {
            name: 'Bayu',
            fullName: 'I Putu Bayu Hendrawan, S.T',
            relation: 'Anak pertama dari pasangan',
            parents: {
              father: 'I Nyoman Sudiana',
              mother: 'Ni Ketut Anik Meliani'
            },
            address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
            type: 'groom'
          }),
          ...(section.id === 'bride-profile' && {
            name: 'Nia',
            fullName: 'Ni Made Dania Pratiwi P',
            relation: 'Anak kedua dari pasangan',
            parents: {
              father: 'I Gede Wijana',
              mother: 'Ni Made Suati'
            },
            address: 'Br. Celuk, Kapal, Mengwi, Badung',
            type: 'bride'
          }),
          ...(section.id === 'event-details' && {
            invitationMessage: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.',
            eventDate: '2026-01-09',
            eventTime: '13:00 WITA - SELESAI',
            venueName: 'Desa Umabian, Kecamatan Marga, Tabanan'
          }),
          ...(section.id === 'image-carousel' && {
            countdownDesign: 'elegant-card',
            images: [
              { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', alt: 'Prewedding 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', alt: 'Prewedding 2', order: 2 },
              { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', alt: 'Prewedding 3', order: 3 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Bayu & Nia',
            message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.'
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
  {
    id: 'classic-romantic-002',
    name: 'Classic Romantic',
    slug: 'classic-romantic-002',
    template_type: 'classic-romantic',
    category: 'romantic',
    description: 'Tema romantis klasik dengan warna pastel yang lembut dan elegan',
    previewImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Ahmad & Siti',
            date: '15 .06 .2024'
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Ahmad & Siti',
            backgroundImages: [
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
              'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200'
            ]
          }),
          ...(section.id === 'image-carousel' && {
            images: [
              { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', alt: 'Photo 1', order: 1 },
              { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', alt: 'Photo 2', order: 2 }
            ]
          }),
          ...(section.id === 'photo-gallery' && {
            images: [
              { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 1' },
              { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 2' },
              { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 3' },
              { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 4' }
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Ahmad & Siti'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#8b5a3c',
          accent: '#d4a574',
          background: '#fff8f0'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  {
    id: 'minimalist-clean-003',
    name: 'Minimalist Clean',
    slug: 'minimalist-clean-003',
    template_type: 'minimalist-clean',
    category: 'minimalist',
    description: 'Desain minimalis yang bersih dan modern, fokus pada tipografi yang indah',
    previewImageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Michael & Sarah',
            date: '15 .06 .2024'
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Michael & Sarah',
            backgroundImages: [
              'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200'
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Michael & Sarah'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1a1a1a',
          accent: '#4a4a4a',
          background: '#ffffff'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  {
    id: 'elegant-gold-004',
    name: 'Elegant Gold',
    slug: 'elegant-gold-004',
    template_type: 'elegant-gold',
    category: 'elegant',
    description: 'Kemewahan dengan sentuhan emas, sempurna untuk acara mewah',
    previewImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'David & Maria',
            date: '20 .07 .2024'
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'David & Maria',
            backgroundImages: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
              'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200'
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'David & Maria'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#2d2d2d',
          accent: '#d4af37',
          background: '#fafafa'
        }
      }
    },
    isPremium: true,
    isActive: true
  },
  {
    id: 'rustic-nature-005',
    name: 'Rustic Nature',
    slug: 'rustic-nature-005',
    template_type: 'rustic-nature',
    category: 'rustic',
    description: 'Tema rustic dengan nuansa alam, cocok untuk pernikahan outdoor',
    previewImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'Ryan & Emma',
            date: '10 .08 .2024'
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'Ryan & Emma',
            backgroundImages: [
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200'
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'Ryan & Emma'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#5a4a3a',
          accent: '#8b7355',
          background: '#f5f1eb'
        }
      }
    },
    isPremium: false,
    isActive: true
  },
  {
    id: 'classic-luxury-006',
    name: 'Classic Luxury',
    slug: 'classic-luxury-006',
    template_type: 'classic-luxury',
    category: 'classic',
    description: 'Klasik dengan sentuhan mewah, timeless dan elegan',
    previewImageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=600&fit=crop',
    templateData: {
      type: 'standard',
      sections: createStandardTemplateStructure().map(section => ({
        ...section,
        defaultData: {
          ...section.defaultData,
          ...(section.id === 'cover-section' && {
            coupleNames: 'James & Emily',
            date: '25 .09 .2024'
          }),
          ...(section.id === 'hero-section' && {
            coupleNames: 'James & Emily',
            backgroundImages: [
              'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200',
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'
            ]
          }),
          ...(section.id === 'closing-section' && {
            coupleNames: 'James & Emily'
          })
        }
      })),
      metadata: {
        version: '1.0',
        responsive: true,
        defaultColors: {
          primary: '#1a1a1a',
          accent: '#c9a87c',
          background: '#ffffff'
        }
      }
    },
    isPremium: true,
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
