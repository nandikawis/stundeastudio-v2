/** Minimal defaults when inserting a section in the editor. */

export type AddableSectionType =
  | "HeroSection"
  | "QuoteSection"
  | "ReligiousGreeting"
  | "CoupleProfile"
  | "EventDetails"
  | "PhotoGalleryGrid"
  | "ClosingSection"
  | "ImageCarousel"
  | "CountdownTimer"
  | "RsvpSection"
  | "BlankSection";

export const ADDABLE_SECTIONS: Array<{
  type: AddableSectionType;
  label: string;
  description: string;
}> = [
  {
    type: "HeroSection",
    label: "Hero",
    description: "Foto & nama pasangan",
  },
  {
    type: "QuoteSection",
    label: "Quote",
    description: "Kutipan atau ayat",
  },
  {
    type: "ReligiousGreeting",
    label: "Ucapan agama",
    description: "Salam & undangan formal",
  },
  {
    type: "CoupleProfile",
    label: "Profil pasangan",
    description: "Profil mempelai",
  },
  {
    type: "EventDetails",
    label: "Detail acara",
    description: "Waktu, tempat, pesan",
  },
  {
    type: "ImageCarousel",
    label: "Carousel",
    description: "Slideshow, countdown & pesan",
  },
  {
    type: "PhotoGalleryGrid",
    label: "Galeri",
    description: "Grid foto",
  },
  {
    type: "CountdownTimer",
    label: "Countdown",
    description: "Hitung mundur hari H",
  },
  {
    type: "RsvpSection",
    label: "RSVP",
    description: "Konfirmasi kehadiran tamu",
  },
  {
    type: "ClosingSection",
    label: "Closing",
    description: "Penutup & ucapan terima kasih",
  },
  {
    type: "BlankSection",
    label: "Blank",
    description: "Section kosong",
  },
];

export function getSectionTypeLabel(type: string): string {
  const fromAddable = ADDABLE_SECTIONS.find((s) => s.type === type);
  if (fromAddable) return fromAddable.label;
  switch (type) {
    case "CoverSection":
      return "Cover";
    case "Hero":
      return "Hero";
    case "HeroImage":
      return "Hero image";
    case "TitleSection":
      return "Judul";
    case "CoupleNames":
      return "Nama pasangan";
    default:
      return type.replace(/Section$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
  }
}

export function getSectionDefaults(type: string): Record<string, unknown> {
  switch (type) {
    case "HeroSection":
      return {
        subtitle: "The Wedding of",
        coupleNames: "John & Jane",
        quote:
          "Bertemu denganmu adalah takdir, menjadi temanmu adalah pilihan, tapi jatuh cinta denganmu benar-benar di luar dayaku.",
        backgroundImages: [],
        showBottomCurve: true,
        curveColor: "#ffffff",
      };
    case "QuoteSection":
      return {
        quote:
          "Ihaiva stam mā vi yaustam, Visvām āyur vyasnutam. Krindantau putrair naptrbhih, Modamānau sve grhe.\n\nWahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak pernah terpisahkan.",
        author: "Rg Veda X.85.42.",
        backgroundColor: "#ffffff",
      };
    case "ReligiousGreeting":
      return {
        greeting: "Om Swastyastu",
        message:
          "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.",
        backgroundColor: "#1e3a5f",
        showTopCurve: true,
        topCurveColor: "#ffffff",
      };
    case "CoupleProfile":
      return {
        name: "John",
        fullName: "John Doe",
        relation: "Anak pertama dari pasangan",
        parents: { father: "Father Name", mother: "Mother Name" },
        address: "Address here",
        type: "groom",
        backgroundColor: "#ffffff",
      };
    case "EventDetails":
      return {
        invitationMessage:
          "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu.",
        backgroundColor: "#ffffff",
      };
    case "ImageCarousel":
      return {
        images: [],
        countdownDesign: "elegant-card",
        countdownTargetDate: "2026-12-31T08:00:00.000Z",
        dateMessageDate: "31.12.2026",
        dateMessageText:
          "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu di hari yang berbahagia.",
        dateMessageDateAlign: "center",
        dateMessageTextAlign: "center",
        backgroundColor: "#ffffff",
      };
    case "PhotoGalleryGrid":
      return {
        columns: 2,
        images: [],
        backgroundColor: "#ffffff",
      };
    case "CountdownTimer":
      return {
        targetDate: "2026-12-31T08:00:00.000Z",
        design: "elegant-card",
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        backgroundColor: "#ffffff",
      };
    case "ClosingSection":
      return {
        coupleNames: "John & Jane",
        message:
          "Terima kasih atas ucapan, doa, dan kesediaannya untuk datang di acara pernikahan putra-putri kami.",
        designerCredit: "Invitation by Stundea Studio",
        backgroundColor: "#ffffff",
      };
    case "RsvpSection":
      return {
        title: "Konfirmasi Kehadiran",
        subtitle:
          "Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan acara.",
        backgroundColor: "#ffffff",
        design: "classic",
        designId: "rsvp-classic",
      };
    case "BlankSection":
      return {
        backgroundColor: "#ffffff",
      };
    default:
      return {};
  }
}
