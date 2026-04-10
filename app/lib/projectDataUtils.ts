/** Strip legacy background keys and migrate backgroundImageUrl → backgroundImages */
export function stripLegacyBackgroundKeys(
  componentData: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  Object.entries(componentData).forEach(([sectionId, sectionData]) => {
    if (typeof sectionData === "object" && sectionData !== null) {
      const data = sectionData as Record<string, unknown>;
      const { backgroundImageUrl, backgroundImageName, ...rest } = data;
      const hasArray = Array.isArray(data.backgroundImages) && data.backgroundImages.length > 0;
      if (typeof backgroundImageUrl === "string" && backgroundImageUrl.trim() && !hasArray) {
        rest.backgroundImages = [
          {
            url: backgroundImageUrl.trim(),
            alt: (backgroundImageName as string) || "Background Image",
            order: 1,
          },
        ];
      }
      out[sectionId] = rest;
    } else {
      out[sectionId] = sectionData;
    }
  });
  return out;
}
