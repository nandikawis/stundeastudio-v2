// Mock data structure matching database schema
// This will be replaced with API calls later

export interface ComponentConfig {
  id: string;
  type: string;
  order: number;
  config?: Record<string, any>;
}

export interface ProjectData {
  id: string;
  user_id: string;
  template_type?: string;
  template_slug?: string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  page_structure: ComponentConfig[];
  component_data: Record<string, any>;
  event_date?: string;
  event_time?: string;
  venue_name?: string;
  venue_address?: string;
  venue_coordinates?: { lat: number; lng: number };
  background_music_url?: string;
  is_active: boolean;
  published_at?: string;
  expires_at?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  rsvp_status: 'pending' | 'attending' | 'not_attending' | 'maybe';
  number_of_guests: number;
}

// Mock Projects - Updated with new structure
export const mockProjects: Record<string, ProjectData> = {
  'project-1': {
    id: 'project-1',
    user_id: 'user-1',
    template_type: 'modern-elegant',
    name: 'Bayu & Nia Wedding',
    slug: 'bayu-nia-wedding',
    status: 'published',
    page_structure: [
      {
        id: 'comp-1',
        type: 'CoverSection',
        order: 1,
        config: {}
      },
      {
        id: 'comp-2',
        type: 'HeroSection',
        order: 2,
        config: {}
      },
      {
        id: 'comp-3',
        type: 'QuoteSection',
        order: 3,
        config: {}
      },
      {
        id: 'comp-4',
        type: 'ReligiousGreeting',
        order: 4,
        config: {}
      },
      {
        id: 'comp-5',
        type: 'CoupleProfile',
        order: 5,
        config: { type: 'groom' }
      },
      {
        id: 'comp-6',
        type: 'CoupleProfile',
        order: 6,
        config: { type: 'bride' }
      },
      {
        id: 'comp-8',
        type: 'EventDetails',
        order: 8,
        config: {}
      },
      {
        id: 'comp-10',
        type: 'ImageCarousel',
        order: 10,
        config: {}
      },
      {
        id: 'comp-11',
        type: 'PhotoGalleryGrid',
        order: 11,
        config: { columns: 2 }
      },
      {
        id: 'comp-12',
        type: 'ClosingSection',
        order: 12,
        config: {}
      }
    ],
    component_data: {
      'comp-1': {
        date: '09 .01 .2026',
        coupleNames: 'Bayu & Nia',
        quote: 'Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.'
      },
      'comp-2': {
        backgroundImages: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200'
        ],
        subtitle: 'The Wedding of',
        coupleNames: 'Bayu & Nia',
        quote: 'Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.'
      },
      'comp-3': {
        quote: 'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
        author: 'Rg Veda X.85.42.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
      },
      'comp-4': {
        greeting: 'Om Swastyastu',
        message: 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
      },
      'comp-5': {
        name: 'Bayu',
        fullName: 'I Putu Bayu Hendrawan, S.T',
        relation: 'Anak pertama dari pasangan',
        parents: {
          father: 'I Nyoman Sudiana',
          mother: 'Ni Ketut Anik Meliani'
        },
        address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        imagePosition: { x: '-80px', y: '-220px', size: '170%' },
        type: 'groom'
      },
      'comp-6': {
        name: 'Nia',
        fullName: 'Ni Made Dania Pratiwi P',
        relation: 'Anak kedua dari pasangan',
        parents: {
          father: 'I Gede Wijana',
          mother: 'Ni Made Suati'
        },
        address: 'Br. Celuk, Kapal, Kec. Mengwi, Kab. Badung, Bali',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
        imagePosition: { x: '-110px', y: '-240px', size: '190%' },
        type: 'bride'
      },
      'comp-7': {
        message: 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.'
      },
      'comp-8': {
        eventDate: '2026-01-09',
        eventTime: '13:00 WITA - SELESAI',
        venueName: 'Desa Umabian, Kecamatan Marga, Tabanan'
      },
      'comp-9': {
        targetDate: '2026-01-09T13:00:00Z'
      },
      'comp-10': {
        images: [
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', alt: 'Photo 1', order: 1 },
          { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', alt: 'Photo 2', order: 2 },
          { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', alt: 'Photo 3', order: 3 }
        ]
      },
      'comp-11': {
        images: [
          { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 1' },
          { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 2' },
          { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 3' },
          { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', alt: 'Gallery 4' },
          { id: 'gallery-5', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', alt: 'Gallery 5' },
          { id: 'gallery-6', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600', alt: 'Gallery 6' }
        ]
      },
      'comp-12': {
        coupleNames: 'Bayu & Nia',
        message: 'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan putra-putri kami.'
      }
    },
    event_date: '2026-01-09T13:00:00Z',
    event_time: '13:00',
    venue_name: 'Desa Umabian, Kecamatan Marga',
    venue_address: 'Tabanan, Bali',
    is_active: true,
    view_count: 0,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
    },
  // New project wired to the new Bayu & Nia mobile template
  'project-bayu-nia-mobile-001': {
    id: 'project-bayu-nia-mobile-001',
    user_id: 'user-1',
    template_type: 'bayu-nia-mobile',
    name: 'Bayu & Nia Mobile',
    slug: 'bayu-nia-mobile-001',
    status: 'draft',
    page_structure: [
      {
        id: 'bn-comp-1',
        type: 'CoverSection',
        order: 1,
        config: {}
      },
      {
        id: 'bn-comp-2',
        type: 'HeroSection',
        order: 2,
        config: {}
      },
      {
        id: 'bn-comp-3',
        type: 'QuoteSection',
        order: 3,
        config: {}
      },
      {
        id: 'bn-comp-4',
        type: 'ReligiousGreeting',
        order: 4,
        config: {}
      },
      {
        id: 'bn-comp-5',
        type: 'CoupleProfile',
        order: 5,
        config: { type: 'groom' }
      },
      {
        id: 'bn-comp-6',
        type: 'CoupleProfile',
        order: 6,
        config: { type: 'bride' }
      },
      {
        id: 'bn-comp-8',
        type: 'EventDetails',
        order: 8,
        config: {}
      },
      {
        id: 'bn-comp-10',
        type: 'ImageCarousel',
        order: 10,
        config: {}
      },
      {
        id: 'bn-comp-11',
        type: 'PhotoGalleryGrid',
        order: 11,
        config: { columns: 2 }
      },
      {
        id: 'bn-comp-12',
        type: 'ClosingSection',
        order: 12,
        config: {}
      }
    ],
    component_data: {
      'bn-comp-1': {
        date: '09 .01 .2026',
        coupleNames: 'Bayu & Nia',
        quote:
          'Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.'
      },
      'bn-comp-2': {
        backgroundImages: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200'
        ],
        subtitle: 'The Wedding of',
        coupleNames: 'Bayu & Nia',
        quote:
          'Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.'
      },
      'bn-comp-3': {
        quote:
          'Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.',
        author: 'Rg Veda X.85.42.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
      },
      'bn-comp-4': {
        greeting: 'Om Swastyastu',
        message:
          'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
      },
      'bn-comp-5': {
        name: 'Bayu',
        fullName: 'I Putu Bayu Hendrawan, S.T',
        relation: 'Anak pertama dari pasangan',
        parents: {
          father: 'I Nyoman Sudiana',
          mother: 'Ni Ketut Anik Meliani'
        },
        address: 'Perum. Wahyu Geraha No.41, Br. Tengah, Buduk, Badung',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        imagePosition: { x: '-80px', y: '-220px', size: '170%' },
        type: 'groom'
      },
      'bn-comp-6': {
        name: 'Nia',
        fullName: 'Ni Made Dania Pratiwi P',
        relation: 'Anak kedua dari pasangan',
        parents: {
          father: 'I Gede Wijana',
          mother: 'Ni Made Suati'
        },
        address: 'Br. Celuk, Kapal, Kec. Mengwi, Kab. Badung, Bali',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
        imagePosition: { x: '-110px', y: '-240px', size: '190%' },
        type: 'bride'
      },
      'bn-comp-7': {
        message:
          'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.'
      },
      'bn-comp-8': {
        eventDate: '2026-01-09',
        eventTime: '13:00 WITA - SELESAI',
        venueName: 'Desa Umabian, Kecamatan Marga, Tabanan'
      },
      'bn-comp-9': {
        targetDate: '2026-01-09T13:00:00Z'
      },
      'bn-comp-10': {
        images: [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
            alt: 'Prewedding 1',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
            alt: 'Prewedding 2',
            order: 2
          },
          {
            url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
            alt: 'Prewedding 3',
            order: 3
          }
        ]
      },
      'bn-comp-11': {
        images: [
          {
            id: 'gallery-1',
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
            alt: 'Gallery 1'
          },
          {
            id: 'gallery-2',
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
            alt: 'Gallery 2'
          },
          {
            id: 'gallery-3',
            url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600',
            alt: 'Gallery 3'
          },
          {
            id: 'gallery-4',
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
            alt: 'Gallery 4'
          },
          {
            id: 'gallery-5',
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
            alt: 'Gallery 5'
          },
          {
            id: 'gallery-6',
            url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600',
            alt: 'Gallery 6'
          }
        ]
      },
      'bn-comp-12': {
        coupleNames: 'Bayu & Nia',
        message:
          'Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan kami.'
      }
    },
    event_date: '2026-01-09T13:00:00Z',
    event_time: '13:00',
    venue_name: 'Desa Umabian, Kecamatan Marga',
    venue_address: 'Tabanan, Bali',
    is_active: true,
    view_count: 0,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  }
};

// Mock Guests
export const mockGuests: Record<string, Guest[]> = {
  'project-1': [
    {
      id: 'guest-1',
      project_id: 'project-1',
      name: 'STTKalpika',
      slug: 'sttkalpika',
      email: 'guest@example.com',
      rsvp_status: 'pending',
      number_of_guests: 1
    }
  ]
};

// Helper functions
export function getProjectBySlug(slug: string): ProjectData | undefined {
  return Object.values(mockProjects).find(p => p.slug === slug);
}

export function getProjectById(id: string): ProjectData | undefined {
  return mockProjects[id];
}

export function getGuestsByProjectId(projectId: string): Guest[] {
  return mockGuests[projectId] || [];
}

export function getGuestBySlug(projectId: string, guestSlug: string): Guest | undefined {
  const guests = getGuestsByProjectId(projectId);
  return guests.find(g => g.slug === guestSlug);
}

// Export migrated data using the new EditorElement format
// This can be used by the new Canva-like editor architecture
export { migrateProjectData, migrateProjects } from "./migrateData";
