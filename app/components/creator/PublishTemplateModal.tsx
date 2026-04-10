"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import { styleLabels, templateCategoryLabels } from "../../lib/templates";

/** Relative to `NEXT_PUBLIC_API_URL` (see `app/lib/api.ts`). */
const THUMBNAIL_UPLOAD_PATH = "/api/upload/thumbnail";

export type PublishTemplateSnapshot = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  style?: string | null;
  thumbnail_url?: string | null;
};

async function compressThumbnail(dataUrl: string, maxWidth = 1200, quality = 0.88): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const mimeMatch = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      const originalMime = mimeMatch?.[1] || "image/jpeg";
      const outputMime = originalMime === "image/png" ? "image/png" : "image/jpeg";
      resolve(canvas.toDataURL(outputMime, outputMime === "image/jpeg" ? quality : 1));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Same shape as POST /api/upload/images (backend expects an `images` array). */
type ThumbnailUploadResult = { originalFileName?: string; url: string };

export type PublishTemplateModalProps = {
  open: boolean;
  template: PublishTemplateSnapshot | null;
  onClose: () => void;
  onPublished: () => void;
};

export default function PublishTemplateModal({
  open,
  template,
  onClose,
  onPublished,
}: PublishTemplateModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("wedding");
  const [style, setStyle] = useState("elegant");
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const [newThumbnailDataUrl, setNewThumbnailDataUrl] = useState<string | null>(null);
  const [newThumbnailName, setNewThumbnailName] = useState("");

  useEffect(() => {
    if (!open || !template) return;
    setError(null);
    setNewThumbnailDataUrl(null);
    setNewThumbnailName("");
    setName(template.name || "");
    setDescription(template.description ?? "");
    setCategory(template.category ?? "wedding");
    setStyle(template.style ?? "elegant");
    setExistingThumbnailUrl(template.thumbnail_url ?? null);
  }, [open, template]);

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setNewThumbnailDataUrl(dataUrl);
      setNewThumbnailName(file.name || "thumbnail.jpg");
    } catch {
      setError("Could not read image file.");
    }
    e.target.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!template?.id || !name.trim()) {
      setError("Template name is required.");
      return;
    }
    if (!newThumbnailDataUrl && !existingThumbnailUrl) {
      setError("Upload a thumbnail before publishing.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      let thumbnailUrl = existingThumbnailUrl;

      if (newThumbnailDataUrl) {
        const compressed = await compressThumbnail(newThumbnailDataUrl);
        const ext =
          newThumbnailName.toLowerCase().endsWith(".png") || compressed.startsWith("data:image/png")
            ? "png"
            : "jpg";
        const fileName = newThumbnailName.replace(/\.[^.]+$/, "") || "thumbnail";
        const uploadRes = await api.post<ThumbnailUploadResult[]>(THUMBNAIL_UPLOAD_PATH, {
          images: [
            {
              base64Image: compressed,
              fileName: `${fileName}.${ext}`,
            },
          ],
        });
        if (!uploadRes.success || !uploadRes.data?.length) {
          setError(uploadRes.success === false ? uploadRes.error : "Thumbnail upload failed");
          setSubmitting(false);
          return;
        }
        const url = uploadRes.data[0]?.url;
        if (!url) {
          setError("Invalid thumbnail upload response.");
          setSubmitting(false);
          return;
        }
        thumbnailUrl = url;
      }

      const patchRes = await api.patch(`/api/templates/${template.id}`, {
        name: name.trim(),
        description: description.trim() || null,
        category: category.trim() || null,
        thumbnail_url: thumbnailUrl,
        is_public: true,
        is_active: true,
      });

      if (!patchRes.success) {
        setError(patchRes.error || "Failed to publish template");
        setSubmitting(false);
        return;
      }

      onPublished();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !template) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-template-title"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 id="publish-template-title" className="text-lg font-semibold text-primary">
            Publish template
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-muted hover:text-primary text-2xl leading-none px-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">{error}</div>
          )}

          <p className="text-sm text-muted">
            Review the details below. The template will be <strong>public</strong> after you publish.
          </p>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Kategori acara</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
            >
              {Object.entries(templateCategoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Gaya visual</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
            >
              {Object.entries(styleLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Thumbnail</label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePickFile} />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: "#42768E" }}
              >
                Choose image
              </button>
              {(newThumbnailDataUrl || existingThumbnailUrl) && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={newThumbnailDataUrl || existingThumbnailUrl || ""}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted mt-1">
              A thumbnail is required to publish. Upload uses your API base URL (NEXT_PUBLIC_API_URL) +{" "}
              {THUMBNAIL_UPLOAD_PATH}.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-border rounded-full text-sm font-medium text-primary hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light disabled:opacity-60"
            >
              {submitting ? "Publishing…" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
