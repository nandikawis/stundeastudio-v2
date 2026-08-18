"use client";

import { useRouter } from "next/navigation";
import HeroSection, {
  normalizeHeroBackgroundImages,
} from "../invitation/HeroSection";
import { Template, getTemplateHeroDefaultData } from "../../lib/templates";

interface TemplateCardProps {
  template: Template;
}

function buildHeroPreviewProps(data: Record<string, unknown>) {
  const backgroundImages = normalizeHeroBackgroundImages(data.backgroundImages);

  return {
    subtitle: typeof data.subtitle === "string" ? data.subtitle : undefined,
    coupleNames: typeof data.coupleNames === "string" ? data.coupleNames : undefined,
    quote: typeof data.quote === "string" ? data.quote : undefined,
    backgroundImages,
    subtitleColor: typeof data.subtitleColor === "string" ? data.subtitleColor : undefined,
    coupleNamesColor: typeof data.coupleNamesColor === "string" ? data.coupleNamesColor : undefined,
    quoteColor: typeof data.quoteColor === "string" ? data.quoteColor : undefined,
    subtitleAlign: (typeof data.subtitleAlign === "string"
      ? data.subtitleAlign
      : "center") as "left" | "center" | "right" | "justify",
    coupleNamesAlign: (typeof data.coupleNamesAlign === "string"
      ? data.coupleNamesAlign
      : "center") as "left" | "center" | "right" | "justify",
    quoteAlign: (typeof data.quoteAlign === "string"
      ? data.quoteAlign
      : "center") as "left" | "center" | "right" | "justify",
    backgroundColor: typeof data.backgroundColor === "string" ? data.backgroundColor : undefined,
    curveColor: typeof data.curveColor === "string" ? data.curveColor : undefined,
    topCurveColor: typeof data.topCurveColor === "string" ? data.topCurveColor : undefined,
    showTopCurve: typeof data.showTopCurve === "boolean" ? data.showTopCurve : true,
    showBottomCurve: typeof data.showBottomCurve === "boolean" ? data.showBottomCurve : true,
    topCurveStyle: (typeof data.topCurveStyle === "string" ? data.topCurveStyle : "gentle") as
      | "gentle"
      | "wave"
      | "smooth",
    bottomCurveStyle: (typeof data.bottomCurveStyle === "string" ? data.bottomCurveStyle : "gentle") as
      | "gentle"
      | "wave"
      | "smooth",
    decorativeFlowers: data.decorativeFlowers === true,
    flowerStyle: (typeof data.flowerStyle === "string" ? data.flowerStyle : "beage") as
      | "red"
      | "beage"
      | "pink"
      | "white",
  };
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();

  const handleOpenPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/templates/preview/${template.slug}`);
  };

  const heroRaw = getTemplateHeroDefaultData(template);
  const heroProps = buildHeroPreviewProps(heroRaw ?? {});
  const showThumbnail =
    template.useThumbnailCardPreview === true && Boolean(template.thumbnailUrl?.trim());

  const category = template.category.trim() || "—";
  const style = template.style.trim() || "—";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenPreview}
      onKeyDown={(e) => e.key === "Enter" && handleOpenPreview(e as unknown as React.MouseEvent)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-primary/25 active:scale-[0.99]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0c0c0c]">
        {showThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.thumbnailUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 select-none">
            <HeroSection previewMode {...heroProps} />
          </div>
        )}

        {template.isPremium && (
          <p className="absolute right-4 top-4 z-20 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90">
            Premium
          </p>
        )}

        <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-start bg-gradient-to-t from-black/45 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100">
          <span className="text-sm font-medium text-white">Lihat template</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="text-xl font-medium tracking-[-0.02em] text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {template.name}
          </h3>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-primary/50">
          {template.description}
        </p>
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-primary/35">
          {category}
          <span className="mx-2 text-primary/20">·</span>
          {style}
        </p>
      </div>
    </article>
  );
}
