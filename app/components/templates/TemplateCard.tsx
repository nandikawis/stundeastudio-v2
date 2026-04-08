"use client";

import { useRouter } from "next/navigation";
import HeroSection, {
  normalizeHeroBackgroundImages,
} from "../invitation/HeroSection";
import { Template, getTemplateHeroDefaultData } from "../../lib/templates";
import { getAccessToken } from "../../lib/api";

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

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    router.push(`/editor/${template.slug}`);
  };

  const heroRaw = getTemplateHeroDefaultData(template);
  const heroProps = buildHeroPreviewProps(heroRaw ?? {});

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleUseTemplate}
      onKeyDown={(e) => e.key === "Enter" && handleUseTemplate(e as unknown as React.MouseEvent)}
      className="group relative block rounded-2xl overflow-hidden bg-white border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 cursor-pointer"
    >
      {/* Live HeroSection preview (scaled to card) */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 pointer-events-none select-none">
          <HeroSection previewMode {...heroProps} />
        </div>

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full shadow-sm">
              Premium
            </span>
          </div>
        )}

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/25 pointer-events-none">
          <div className="px-6 py-3 bg-white text-primary rounded-full font-medium text-sm shadow-lg">
            Gunakan Template
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-primary group-hover:text-accent-dark transition-colors">
            {template.name}
          </h3>
        </div>
        <p className="text-sm text-muted line-clamp-2 mb-3">
          {template.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-accent/10 text-accent-dark text-xs font-medium rounded-full">
            {template.category}
          </span>
        </div>
      </div>
    </div>
  );
}
