"use client";

import { useRef, useState } from "react";
import { ProjectData, ComponentConfig } from "../../lib/mockData";
import ColorPicker from "./ColorPicker";

interface SectionPropertiesPanelProps {
  section: ComponentConfig;
  componentData: Record<string, any>;
  onUpdate: (sectionId: string, field: string, value: any) => void;
  onClose: () => void;
}

// Image file item interface for the capsule UI
interface ImageFileItem {
  url: string;
  name: string;
  file?: File;
}

// Reusable ImageFilePicker component matching the design
interface ImageFilePickerProps {
  images: ImageFileItem[];
  onImagesChange: (images: ImageFileItem[]) => void;
  multiple?: boolean;
  label?: string;
}

function ImageFilePicker({ images, onImagesChange, multiple = true, label = "Choose Image" }: ImageFilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems: ImageFileItem[] = [];
    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file);
      newItems.push({
        url: dataUrl,
        name: file.name,
        file: file,
      });
    }

    if (multiple) {
      onImagesChange([...images, ...newItems]);
    } else {
      onImagesChange(newItems.slice(0, 1));
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-all hover:opacity-90"
        style={{ backgroundColor: "#42768E" }}
      >
        {label}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      {images.length > 0 && (
        <div className="mt-3 space-y-2">
          {images.map((item, index) => (
            <div
              key={index}
              className="flex items-center rounded-full overflow-hidden h-12"
              style={{ backgroundColor: "#42768E" }}
            >
              {/* Image thumbnail */}
              <div className="flex-shrink-0 w-16 h-12 bg-white border-r border-[#42768E] flex items-center justify-center overflow-hidden" style={{ borderWidth: '1px' }}>
                {item.url && item.url.trim() ? (
                  <img
                    src={item.url}
                    alt={item.name || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                    onError={(e) => {
                      // Replace with placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = document.createElement('span');
                        placeholder.className = 'text-xs text-[#42768E] font-medium';
                        placeholder.textContent = 'img';
                        parent.innerHTML = '';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <span className="text-xs text-[#42768E] font-medium">img</span>
                )}
              </div>
              {/* Image name */}
              <div className="flex-1 px-3 py-2 bg-white border-r border-[#42768E] min-w-0 h-full flex items-center" style={{ borderWidth: '1px' }}>
                <span className="text-sm text-[#42768E] truncate block">{item.name || `Image ${index + 1}`}</span>
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors mr-1"
                aria-label="Remove image"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Collapsible accordion section group
const SectionGroup = ({ 
  title, 
  children, 
  className = '',
  defaultOpen = true
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`mb-4 bg-background/50 rounded-lg border border-border/30 overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-background/80 transition-colors"
      >
        <h3 className="text-sm font-semibold text-primary">
          {title}
        </h3>
        <svg
          className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-5">
          {children}
        </div>
      )}
    </div>
  );
};

// Clean field wrapper with better spacing
const FieldGroup = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

// Clean label component
const FieldLabel = ({ 
  children, 
  required = false 
}: { 
  children: React.ReactNode; 
  required?: boolean;
}) => {
  return (
    <label className="block text-xs font-medium text-primary/80 mb-2 uppercase tracking-wide">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default function SectionPropertiesPanel({
  section,
  componentData,
  onUpdate,
  onClose
}: SectionPropertiesPanelProps) {
  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate(section.id, field, value);
  };

  // Helper: read a File as base64 data URL so we can
  // preview images immediately in the editor without a backend.
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper function to render curve divider controls
  const renderCurveDividers = () => (
    <>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-primary">Top Curve Divider</label>
          {componentData.showTopCurve !== false ? (
            <button
              onClick={() => handleFieldUpdate('showTopCurve', false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              type="button"
              title="Delete top curve divider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          ) : (
            <button
              onClick={() => handleFieldUpdate('showTopCurve', true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              type="button"
              title="Add top curve divider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Divider
            </button>
          )}
        </div>
        {componentData.showTopCurve !== false && (
          <>
            <div className="mt-2">
              <label className="block text-sm font-medium text-primary mb-2">Style</label>
              <select
                value={componentData.topCurveStyle || 'gentle'}
                onChange={(e) => handleFieldUpdate('topCurveStyle', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              >
                <option value="gentle">Gentle</option>
                <option value="wave">Wave</option>
                <option value="smooth">Smooth</option>
              </select>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-primary mb-2">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={componentData.topCurveColor || '#ffffff'}
                  onChange={(e) => handleFieldUpdate('topCurveColor', e.target.value)}
                  className="w-10 h-10 border border-border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={componentData.topCurveColor || '#ffffff'}
                  onChange={(e) => handleFieldUpdate('topCurveColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-primary">Bottom Curve Divider</label>
          {componentData.showBottomCurve !== false ? (
            <button
              onClick={() => handleFieldUpdate('showBottomCurve', false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              type="button"
              title="Delete bottom curve divider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          ) : (
            <button
              onClick={() => handleFieldUpdate('showBottomCurve', true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              type="button"
              title="Add bottom curve divider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Divider
            </button>
          )}
        </div>
        {componentData.showBottomCurve !== false && (
          <>
            <div className="mt-2">
              <label className="block text-sm font-medium text-primary mb-2">Style</label>
              <select
                value={componentData.bottomCurveStyle || 'gentle'}
                onChange={(e) => handleFieldUpdate('bottomCurveStyle', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              >
                <option value="gentle">Gentle</option>
                <option value="wave">Wave</option>
                <option value="smooth">Smooth</option>
              </select>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-primary mb-2">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={componentData.bottomCurveColor || '#ffffff'}
                  onChange={(e) => handleFieldUpdate('bottomCurveColor', e.target.value)}
                  className="w-10 h-10 border border-border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={componentData.bottomCurveColor || '#ffffff'}
                  onChange={(e) => handleFieldUpdate('bottomCurveColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  // Helper function to render decorative flowers controls
  const renderDecorativeFlowersSection = () => (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-primary">Decorative Flowers</label>
        {componentData.decorativeFlowers ? (
          <button
            onClick={() => handleFieldUpdate('decorativeFlowers', false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            type="button"
            title="Delete decorative flowers"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        ) : (
          <button
            onClick={() => handleFieldUpdate('decorativeFlowers', true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
            type="button"
            title="Add decorative flowers"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Flowers
          </button>
        )}
      </div>
      {componentData.decorativeFlowers && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-primary mb-2">Flower Style</label>
          <select
            value={componentData.flowerStyle || 'beage'}
            onChange={(e) => handleFieldUpdate('flowerStyle', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
          >
            <option value="red">Red</option>
            <option value="beage">Beage</option>
            <option value="pink">Pink</option>
            <option value="white">White</option>
          </select>
          <p className="text-xs text-muted mt-1">Choose the color theme for decorative flowers</p>
        </div>
      )}
    </div>
  );

  // Helper function to render background image and color controls
  const renderBackgroundSection = () => {
    // Normalize background image data to an array (like ImageCarousel),
    // but we only allow a single image in the UI.
    const rawArray = Array.isArray(componentData.backgroundImages)
      ? componentData.backgroundImages
      : componentData.backgroundImageUrl && componentData.backgroundImageUrl.trim()
        ? [{
            url: componentData.backgroundImageUrl,
            alt: componentData.backgroundImageName || 'Background Image',
            order: 1,
          }]
        : [];

    const firstBg = rawArray[0];
    const firstUrl =
      typeof firstBg === 'string'
        ? firstBg
        : (firstBg && typeof firstBg.url === 'string'
            ? firstBg.url
            : '');
    const firstAlt =
      typeof firstBg === 'string'
        ? undefined
        : firstBg && typeof firstBg.alt === 'string'
          ? firstBg.alt
          : undefined;

    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Background Image</label>
          <ImageFilePicker
            images={firstUrl
              ? [{
                  url: firstUrl,
                  name: firstAlt ||
                    (firstUrl.startsWith('data:')
                      ? 'Background Image'
                      : firstUrl.split('/').pop() || 'Background Image'),
                }]
              : []}
            onImagesChange={(items) => {
              if (items.length > 0) {
                const item = items[0];
                const nextArray = [{
                  url: item.url,
                  alt: item.name,
                  order: 1,
                }];

                // Store only backgroundImages (single source of truth)
                handleFieldUpdate('backgroundImages', nextArray);
              } else {
                handleFieldUpdate('backgroundImages', []);
              }
            }}
            multiple={false}
            label="Choose Image"
          />
          <p className="text-xs text-muted mt-1">Background image for the entire section (only one image allowed)</p>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-primary">Background Color</label>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-border">
              <button
                onClick={() => {
                  if (!componentData.backgroundColor) {
                    handleFieldUpdate('backgroundColor', '#ffffff');
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  componentData.backgroundColor 
                    ? 'bg-white text-primary shadow-sm border border-border' 
                    : 'text-muted hover:text-primary'
                }`}
                type="button"
              >
                Color
              </button>
              <button
                onClick={() => handleFieldUpdate('backgroundColor', '')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  !componentData.backgroundColor 
                    ? 'bg-white text-primary shadow-sm border border-border' 
                    : 'text-muted hover:text-primary'
                }`}
                type="button"
              >
                No Color
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={componentData.backgroundColor || '#ffffff'}
              onChange={(e) => handleFieldUpdate('backgroundColor', e.target.value)}
              className="w-10 h-10 border border-border rounded cursor-pointer"
            />
            <input
              type="text"
              value={componentData.backgroundColor || ''}
              onChange={(e) => handleFieldUpdate('backgroundColor', e.target.value)}
              placeholder="#ffffff"
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
            />
          </div>
          <p className="text-xs text-muted mt-1">If both image and color are set, color will overlay the image</p>
        </div>
      </div>
    );
  };

  const renderFields = () => {
    switch (section.type) {
      case 'CoverSection':
        return (
          <>
            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Date</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.date || ''}
                    onChange={(e) => handleFieldUpdate('date', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="09 .01 .2026"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.dateColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('dateColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.dateAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('dateAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Couple Names</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.coupleNames || ''}
                    onChange={(e) => handleFieldUpdate('coupleNames', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Bayu & Nia"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.coupleNamesColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('coupleNamesColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.coupleNamesAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('coupleNamesAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Greeting / Salam</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={componentData.quote || ''}
                    onChange={(e) => handleFieldUpdate('quote', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={3}
                    placeholder="Bertemu denganmu adalah takdir..."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.quoteColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('quoteColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.quoteAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('quoteAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Guest Location Text</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.guestLocationText || ''}
                    onChange={(e) => handleFieldUpdate('guestLocationText', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Di Tempat"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.guestLocationColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('guestLocationColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.guestBlockAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('guestBlockAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Design" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Design Style</FieldLabel>
                <select
                  value={componentData.design || 'simple'}
                  onChange={(e) => handleFieldUpdate('design', e.target.value)}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                >
                  <option value="simple">Simple (No Image Container)</option>
                  <option value="with-container">With Image Container</option>
                </select>
              </FieldGroup>

              {componentData.design === 'with-container' && (
                <>
                  <FieldGroup>
                    <FieldLabel>Cover Image</FieldLabel>
                    <ImageFilePicker
                      images={componentData.imageUrl && componentData.imageUrl.trim()
                        ? [{
                            url: componentData.imageUrl,
                            name: componentData.imageUrl.startsWith('data:')
                              ? (componentData.coverImageName || 'Cover Image')
                              : componentData.imageUrl.split('/').pop() || 'Cover Image',
                          }]
                        : []}
                      onImagesChange={(items) => {
                        if (items.length > 0) {
                          handleFieldUpdate('imageUrl', items[0].url);
                          if (items[0].url.startsWith('data:') && items[0].name) {
                            handleFieldUpdate('coverImageName', items[0].name);
                          }
                        } else {
                          handleFieldUpdate('imageUrl', '');
                          handleFieldUpdate('coverImageName', '');
                        }
                      }}
                      multiple={false}
                      label="Choose Cover Image"
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Image Container Style</FieldLabel>
                    <select
                      value={componentData.imageStyle || 'circular'}
                      onChange={(e) => handleFieldUpdate('imageStyle', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    >
                      <optgroup label="Circular">
                        <option value="circular">Circular - Classic</option>
                        <option value="circular-gradient">Circular - Gradient Border</option>
                        <option value="circular-glow">Circular - Glow Effect</option>
                      </optgroup>
                      <optgroup label="Rounded">
                        <option value="rounded-elegant">Rounded - Elegant Frame</option>
                        <option value="rounded-modern">Rounded - Modern Gradient</option>
                        <option value="rounded-glow">Rounded - Glow Effect</option>
                      </optgroup>
                      <optgroup label="Oval">
                        <option value="oval-vintage">Oval - Vintage Frame</option>
                        <option value="oval-classic">Oval - Classic Frame</option>
                        <option value="oval-glow">Oval - Glow Effect</option>
                      </optgroup>
                      <optgroup label="Hexagon">
                        <option value="hexagon-glow">Hexagon - Glow Effect</option>
                        <option value="hexagon-classic">Hexagon - Classic Frame</option>
                        <option value="hexagon-modern">Hexagon - Modern Dark</option>
                      </optgroup>
                      <optgroup label="Square">
                        <option value="square-frame">Square - Framed</option>
                        <option value="square-elegant">Square - Elegant Dark</option>
                        <option value="square-glow">Square - Glow Effect</option>
                      </optgroup>
                    </select>
                  </FieldGroup>

                  {(componentData.imageStyle === 'circular-glow' || 
                    componentData.imageStyle === 'rounded-glow' || 
                    componentData.imageStyle === 'oval-glow' || 
                    componentData.imageStyle === 'hexagon-glow' || 
                    componentData.imageStyle === 'square-glow') && (
                    <FieldGroup>
                      <FieldLabel>Glow Color</FieldLabel>
                      <ColorPicker
                        label=""
                        value={componentData.glowColor || '#b49549'}
                        onChange={(value) => handleFieldUpdate('glowColor', value)}
                        defaultValue="#b49549"
                      />
                    </FieldGroup>
                  )}
                </>
              )}
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'HeroSection':
        return (
          <>
            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Subtitle</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.subtitle || ''}
                    onChange={(e) => handleFieldUpdate('subtitle', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="The Wedding of"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.subtitleColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('subtitleColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.subtitleAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('subtitleAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Couple Names</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.coupleNames || ''}
                    onChange={(e) => handleFieldUpdate('coupleNames', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Bayu & Nia"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.coupleNamesColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('coupleNamesColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.coupleNamesAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('coupleNamesAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Quote</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={componentData.quote || ''}
                    onChange={(e) => handleFieldUpdate('quote', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={3}
                    placeholder="Bertemu denganmu adalah takdir..."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.quoteColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('quoteColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.quoteAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('quoteAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Background Images</FieldLabel>
                <ImageFilePicker
                  images={Array.isArray(componentData.backgroundImages)
                    ? componentData.backgroundImages.map((item: string | { url: string; alt?: string; order?: number }, index: number) => {
                        const url = typeof item === 'string' ? item : (item?.url || '');
                        const name = url.startsWith('data:') 
                          ? `Background ${index + 1}` 
                          : url.split('/').pop() || `Background ${index + 1}`;
                        return { url, name };
                      })
                    : []}
                  onImagesChange={(items) => {
                    handleFieldUpdate('backgroundImages', items.map(item => item.url));
                  }}
                  multiple={true}
                  label="Choose Image"
                />
                <p className="text-xs text-muted mt-2">
                  Selected images will be added to the slideshow and can be seen in the preview immediately.
                </p>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'QuoteSection':
        return (
          <>
            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Primary Quote (Sanskrit)</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={
                      componentData.primaryQuote ??
                      (componentData.quote
                        ? (componentData.quote as string).split('\n\n')[0] || ''
                        : '')
                    }
                    onChange={(e) => handleFieldUpdate('primaryQuote', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={4}
                    placeholder="Ihaiva stam mā vi yaustam..."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.quoteColor || '#374151'}
                        onChange={(value) => handleFieldUpdate('quoteColor', value)}
                        defaultValue="#374151"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.quoteAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('quoteAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Secondary Quote (Translation)</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={
                      componentData.secondaryQuote ??
                      (componentData.quote
                        ? (componentData.quote as string).split('\n\n')[1] || ''
                        : '')
                    }
                    onChange={(e) => handleFieldUpdate('secondaryQuote', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={4}
                    placeholder="Wahai pasangan suami-isteri..."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.secondaryQuoteColor || '#4b5563'}
                        onChange={(value) => handleFieldUpdate('secondaryQuoteColor', value)}
                        defaultValue="#4b5563"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.secondaryQuoteAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('secondaryQuoteAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Author</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.author || ''}
                    onChange={(e) => handleFieldUpdate('author', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Rg Veda X.85.42."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.authorColor || '#6b7280'}
                        onChange={(value) => handleFieldUpdate('authorColor', value)}
                        defaultValue="#6b7280"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.authorAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('authorAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Decorative Image</FieldLabel>
                <select
                  value={componentData.quoteDecorativeStyle || 'baby-bread'}
                  onChange={(e) => handleFieldUpdate('quoteDecorativeStyle', e.target.value)}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                >
                  <option value="baby-bread">Baby Bread</option>
                  <option value="grey-and-white">Grey and White</option>
                  <option value="pink-and-yellow">Pink and Yellow</option>
                  <option value="pink-bouquet">Pink Bouquet</option>
                  <option value="pink-love">Pink Love</option>
                  <option value="white-teraccota">White Teraccota</option>
                  <option value="white">White</option>
                </select>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'ReligiousGreeting':
        return (
          <>
            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Greeting</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.greeting || ''}
                    onChange={(e) => handleFieldUpdate('greeting', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Om Swastyastu"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.greetingColor || '#1f2937'}
                        onChange={(value) => handleFieldUpdate('greetingColor', value)}
                        defaultValue="#1f2937"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.greetingAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('greetingAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Message</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={componentData.message || ''}
                    onChange={(e) => handleFieldUpdate('message', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={3}
                    placeholder="Atas Asung Kertha Wara Nugraha..."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.messageColor || '#374151'}
                        onChange={(value) => handleFieldUpdate('messageColor', value)}
                        defaultValue="#374151"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.messageAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('messageAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'CoupleProfile':
        return (
          <>
            <SectionGroup title="Design" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Design Style</FieldLabel>
                <select
                  value={componentData.design || 'with-container'}
                  onChange={(e) => handleFieldUpdate('design', e.target.value)}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                >
                  <option value="simple">Simple (No Container)</option>
                  <option value="with-container">With Image Container</option>
                </select>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Name</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.name || ''}
                    onChange={(e) => handleFieldUpdate('name', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Bayu"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.nameColor || '#1f2937'}
                        onChange={(value) => handleFieldUpdate('nameColor', value)}
                        defaultValue="#1f2937"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.nameAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('nameAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Full Name</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.fullName || ''}
                    onChange={(e) => handleFieldUpdate('fullName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="I Putu Bayu Hendrawan, S.T"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.fullNameColor || '#374151'}
                        onChange={(value) => handleFieldUpdate('fullNameColor', value)}
                        defaultValue="#374151"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.fullNameAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('fullNameAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Relation</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.relation || ''}
                    onChange={(e) => handleFieldUpdate('relation', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Anak pertama dari pasangan"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.relationColor || '#4b5563'}
                        onChange={(value) => handleFieldUpdate('relationColor', value)}
                        defaultValue="#4b5563"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.relationAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('relationAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Father's Name</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.parents?.father || ''}
                    onChange={(e) => handleFieldUpdate('parents', { ...componentData.parents, father: e.target.value })}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="I Nyoman Sudiana"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.fatherNameColor || '#374151'}
                        onChange={(value) => handleFieldUpdate('fatherNameColor', value)}
                        defaultValue="#374151"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.fatherNameAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('fatherNameAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Mother's Name</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.parents?.mother || ''}
                    onChange={(e) => handleFieldUpdate('parents', { ...componentData.parents, mother: e.target.value })}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Ni Ketut Anik Meliani"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.motherNameColor || '#374151'}
                        onChange={(value) => handleFieldUpdate('motherNameColor', value)}
                        defaultValue="#374151"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.motherNameAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('motherNameAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Address</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={componentData.address || ''}
                    onChange={(e) => handleFieldUpdate('address', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={2}
                    placeholder="Perum. Wahyu Geraha No.41..."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.addressColor || '#4b5563'}
                        onChange={(value) => handleFieldUpdate('addressColor', value)}
                        defaultValue="#4b5563"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.addressAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('addressAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Image" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Profile Image</FieldLabel>
                <ImageFilePicker
                  images={componentData.imageUrl && componentData.imageUrl.trim()
                    ? [{
                        url: componentData.imageUrl,
                        name: componentData.imageUrl.startsWith('data:')
                          ? (componentData.profileImageName || 'Profile Image')
                          : componentData.imageUrl.split('/').pop() || 'Profile Image',
                      }]
                    : []}
                  onImagesChange={(items) => {
                    if (items.length > 0) {
                      handleFieldUpdate('imageUrl', items[0].url);
                      if (items[0].url.startsWith('data:') && items[0].name) {
                        handleFieldUpdate('profileImageName', items[0].name);
                      }
                    } else {
                      handleFieldUpdate('imageUrl', '');
                      handleFieldUpdate('profileImageName', '');
                    }
                  }}
                  multiple={false}
                  label="Choose Image"
                />
              </FieldGroup>

              {componentData.design === 'with-container' && (
                <>
                  <FieldGroup>
                    <FieldLabel>Image Container Style</FieldLabel>
                    <select
                      value={componentData.imageStyle || 'circular'}
                      onChange={(e) => handleFieldUpdate('imageStyle', e.target.value)}
                      className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    >
                      <optgroup label="Circular">
                        <option value="circular">Circular - Classic</option>
                        <option value="circular-gradient">Circular - Gradient Border</option>
                        <option value="circular-glow">Circular - Glow Effect</option>
                      </optgroup>
                      <optgroup label="Rounded">
                        <option value="rounded-elegant">Rounded - Elegant Frame</option>
                        <option value="rounded-modern">Rounded - Modern Gradient</option>
                        <option value="rounded-glow">Rounded - Glow Effect</option>
                      </optgroup>
                      <optgroup label="Oval">
                        <option value="oval-vintage">Oval - Vintage Frame</option>
                        <option value="oval-classic">Oval - Classic Frame</option>
                        <option value="oval-glow">Oval - Glow Effect</option>
                      </optgroup>
                      <optgroup label="Hexagon">
                        <option value="hexagon-glow">Hexagon - Glow Effect</option>
                        <option value="hexagon-classic">Hexagon - Classic Frame</option>
                        <option value="hexagon-modern">Hexagon - Modern Dark</option>
                      </optgroup>
                      <optgroup label="Square">
                        <option value="square-frame">Square - Framed</option>
                        <option value="square-elegant">Square - Elegant Dark</option>
                        <option value="square-glow">Square - Glow Effect</option>
                      </optgroup>
                    </select>
                  </FieldGroup>

                  {(componentData.imageStyle === 'circular-glow' || 
                    componentData.imageStyle === 'rounded-glow' || 
                    componentData.imageStyle === 'oval-glow' || 
                    componentData.imageStyle === 'hexagon-glow' || 
                    componentData.imageStyle === 'square-glow') && (
                    <FieldGroup>
                      <FieldLabel>Glow Color</FieldLabel>
                      <ColorPicker
                        label=""
                        value={componentData.glowColor || '#b49549'}
                        onChange={(value) => handleFieldUpdate('glowColor', value)}
                        defaultValue="#b49549"
                      />
                    </FieldGroup>
                  )}
                </>
              )}
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'EventDetails':
        return (
          <>
            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Invitation Message</FieldLabel>
                <p className="text-xs text-muted mb-2">This message will appear above the event card in this section</p>
                <textarea
                  value={componentData.invitationMessage || ''}
                  onChange={(e) => handleFieldUpdate('invitationMessage', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  rows={4}
                  placeholder="Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu."
                />
                <div className="mt-3 space-y-2">
                  <div>
                    <ColorPicker
                      label="Message Color"
                      value={componentData.invitationMessageColor || '#374151'}
                      onChange={(value) => handleFieldUpdate('invitationMessageColor', value)}
                      defaultValue="#374151"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.invitationMessageAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('invitationMessageAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Closing Message</FieldLabel>
                <textarea
                  value={componentData.closingMessage || ''}
                  onChange={(e) => handleFieldUpdate('closingMessage', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  rows={2}
                  placeholder="Atas kehadiran dan doa restunya..."
                />
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Color:</span>
                    <input
                      type="color"
                      value={componentData.closingMessageColor || '#374151'}
                      onChange={(e) => handleFieldUpdate('closingMessageColor', e.target.value)}
                      className="w-8 h-8 border border-border rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.closingMessageAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('closingMessageAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Closing Text (Om Shanti...)</FieldLabel>
                <input
                  type="text"
                  value={componentData.closingText || ''}
                  onChange={(e) => handleFieldUpdate('closingText', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="Om Shanti Shanti Shanti Om"
                />
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Color:</span>
                    <input
                      type="color"
                      value={componentData.closingTextColor || '#1f2937'}
                      onChange={(e) => handleFieldUpdate('closingTextColor', e.target.value)}
                      className="w-8 h-8 border border-border rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.closingTextAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('closingTextAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Event" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Event Date</FieldLabel>
                <input
                  type="date"
                  value={componentData.eventDate 
                    ? new Date(componentData.eventDate).toISOString().split('T')[0]
                    : componentData.eventDate || ''}
                  onChange={(e) => handleFieldUpdate('eventDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
                <p className="text-xs text-muted mt-1">This will override the project-level event date</p>
                <div className="mt-2">
                  <ColorPicker
                    label="Date Month/Year Color"
                    value={componentData.dateMonthYearColor || '#4b5563'}
                    onChange={(value) => handleFieldUpdate('dateMonthYearColor', value)}
                    defaultValue="#4b5563"
                  />
                </div>
                <div className="mt-2">
                  <ColorPicker
                    label="Date Day Color"
                    value={componentData.dateDayColor || '#1f2937'}
                    onChange={(value) => handleFieldUpdate('dateDayColor', value)}
                    defaultValue="#1f2937"
                  />
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Event Time</FieldLabel>
                <input
                  type="text"
                  value={componentData.eventTime || ''}
                  onChange={(e) => handleFieldUpdate('eventTime', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="13:00 WITA - SELESAI"
                />
                <p className="text-xs text-muted mt-1">This will override the project-level event time</p>
                <div className="mt-2">
                  <ColorPicker
                    label="Color"
                    value={componentData.eventTimeColor || '#374151'}
                    onChange={(value) => handleFieldUpdate('eventTimeColor', value)}
                    defaultValue="#374151"
                  />
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Title Color</FieldLabel>
                <ColorPicker
                  label="Color"
                  value={componentData.titleColor || '#1f2937'}
                  onChange={(value) => handleFieldUpdate('titleColor', value)}
                  defaultValue="#1f2937"
                />
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Venue" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Venue Name</FieldLabel>
                <input
                  type="text"
                  value={componentData.venueName || ''}
                  onChange={(e) => handleFieldUpdate('venueName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="Desa Umabian, Kecamatan Marga"
                />
                <p className="text-xs text-muted mt-1">This will override the project-level venue name</p>
                <div className="mt-2">
                  <ColorPicker
                    label="Color"
                    value={componentData.venueNameColor || '#374151'}
                    onChange={(value) => handleFieldUpdate('venueNameColor', value)}
                    defaultValue="#374151"
                  />
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Venue Address</FieldLabel>
                <textarea
                  value={componentData.venueAddress || ''}
                  onChange={(e) => handleFieldUpdate('venueAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  rows={2}
                  placeholder="Tabanan, Bali"
                />
                <p className="text-xs text-muted mt-1">This will override the project-level venue address</p>
                <div className="mt-2">
                  <ColorPicker
                    label="Color"
                    value={componentData.venueAddressColor || '#4b5563'}
                    onChange={(value) => handleFieldUpdate('venueAddressColor', value)}
                    defaultValue="#4b5563"
                  />
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Google Maps Link</FieldLabel>
                <input
                  type="text"
                  value={componentData.googleMapsLink || ''}
                  onChange={(e) => handleFieldUpdate('googleMapsLink', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="https://maps.google.com/?q=..."
                />
                <p className="text-xs text-muted mt-1">Google Maps link for the map button below the card</p>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Map Button" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Map Button Text</FieldLabel>
                <input
                  type="text"
                  value={componentData.mapButtonText || 'Petunjuk Arah'}
                  onChange={(e) => handleFieldUpdate('mapButtonText', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="Petunjuk Arah"
                />
                <p className="text-xs text-muted mt-1">Text displayed on the map button</p>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Map Button Background Color</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={componentData.mapButtonColor || '#111827'}
                    onChange={(e) => handleFieldUpdate('mapButtonColor', e.target.value)}
                    className="w-10 h-10 border border-border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={componentData.mapButtonColor || '#111827'}
                    onChange={(e) => handleFieldUpdate('mapButtonColor', e.target.value)}
                    placeholder="#111827"
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-muted mt-1">Background color of the map button</p>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Map Button Text Color</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={componentData.mapButtonTextColor || '#ffffff'}
                    onChange={(e) => handleFieldUpdate('mapButtonTextColor', e.target.value)}
                    className="w-10 h-10 border border-border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={componentData.mapButtonTextColor || '#ffffff'}
                    onChange={(e) => handleFieldUpdate('mapButtonTextColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-muted mt-1">Text color of the map button</p>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Card Design" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Design Style</FieldLabel>
                <select
                  value={componentData.design || 'card'}
                  onChange={(e) => handleFieldUpdate('design', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                >
                  <option value="card">Card Style</option>
                  <option value="elegant-split">Elegant Split</option>
                  <option value="modern-minimal">Modern Minimal</option>
                  <option value="timeline-vertical">Timeline Vertical</option>
                  <option value="badge-accent">Badge Accent</option>
                  <option value="framed-classic">Framed Classic</option>
                </select>
                <p className="text-xs text-muted mt-1">Choose a layout design for the event details</p>
              </FieldGroup>

              {(componentData.design === 'badge-accent' || componentData.design === 'card' || componentData.design === 'elegant-split') ? (
                <FieldGroup>
                  <FieldLabel>Card Header & Body Colors</FieldLabel>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted whitespace-nowrap">Header:</span>
                      <input
                        type="color"
                        value={componentData.cardHeaderColor || '#1f2937'}
                        onChange={(e) => handleFieldUpdate('cardHeaderColor', e.target.value)}
                        className="w-10 h-10 border border-border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={componentData.cardHeaderColor || '#1f2937'}
                        onChange={(e) => handleFieldUpdate('cardHeaderColor', e.target.value)}
                        placeholder="#1f2937"
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted whitespace-nowrap">Body:</span>
                      <input
                        type="color"
                        value={componentData.cardBodyColor || '#ffffff'}
                        onChange={(e) => handleFieldUpdate('cardBodyColor', e.target.value)}
                        className="w-10 h-10 border border-border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={componentData.cardBodyColor || '#ffffff'}
                        onChange={(e) => handleFieldUpdate('cardBodyColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-primary mb-2">Card Body Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={componentData.cardOpacity !== undefined ? componentData.cardOpacity : 0.95}
                        onChange={(e) => handleFieldUpdate('cardOpacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted mt-1">
                        <span>Transparent</span>
                        <span>{((componentData.cardOpacity !== undefined ? componentData.cardOpacity : 0.95) * 100).toFixed(0)}%</span>
                        <span>Opaque</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-1">Header color for top bar, body color for content area</p>
                  </div>
                </FieldGroup>
              ) : (
                <FieldGroup>
                  <FieldLabel>Card Background Color</FieldLabel>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={componentData.cardBackgroundColor || '#ffffff'}
                        onChange={(e) => handleFieldUpdate('cardBackgroundColor', e.target.value)}
                        className="w-10 h-10 border border-border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={componentData.cardBackgroundColor || '#ffffff'}
                        onChange={(e) => handleFieldUpdate('cardBackgroundColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-primary mb-2">Card Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={componentData.cardOpacity !== undefined ? componentData.cardOpacity : 0.95}
                        onChange={(e) => handleFieldUpdate('cardOpacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted mt-1">
                        <span>Transparent</span>
                        <span>{((componentData.cardOpacity !== undefined ? componentData.cardOpacity : 0.95) * 100).toFixed(0)}%</span>
                        <span>Opaque</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-1">Control the card background color and transparency</p>
                  </div>
                </FieldGroup>
              )}
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'ImageCarousel':
        return (
          <>
            <SectionGroup title="Images" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Carousel Images</FieldLabel>
                <ImageFilePicker
                  images={Array.isArray(componentData.images)
                    ? componentData.images.map((img: any, index: number) => {
                        const url = img.url || img;
                        const name = img.alt || img.name || (typeof url === 'string' && url.startsWith('data:') ? `Image ${index + 1}` : `Image ${index + 1}`);
                        return { url, name };
                      })
                    : []}
                  onImagesChange={(items) => {
                    handleFieldUpdate('images', items.map((item, index) => ({
                      url: item.url,
                      alt: item.name,
                      order: index + 1,
                    })));
                  }}
                  multiple={true}
                  label="Choose Image"
                />
                <p className="text-xs text-muted mt-2">
                  Selected images will immediately appear in the carousel preview.
                </p>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Carousel Settings" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Carousel Design</FieldLabel>
                <select
                  value={componentData.carouselDesign || 'classic'}
                  onChange={(e) => handleFieldUpdate('carouselDesign', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                >
                  <option value="classic">Classic (Full Width)</option>
                  <option value="framed">Framed Card</option>
                  <option value="filmstrip">Filmstrip Thumbnails</option>
                  <option value="landscape">Landscape</option>
                </select>
                <p className="text-xs text-muted mt-1">
                  Choose how the carousel images are styled and displayed.
                </p>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Autoplay</FieldLabel>
                <label className="flex items-center gap-2 text-sm font-medium text-primary">
                  <input
                    type="checkbox"
                    checked={componentData.autoplay !== false}
                    onChange={(e) => handleFieldUpdate('autoplay', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-accent rounded"
                  />
                  Autoplay
                </label>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Autoplay Interval (ms)</FieldLabel>
                <input
                  type="number"
                  value={componentData.autoplayInterval || 5000}
                  onChange={(e) => handleFieldUpdate('autoplayInterval', parseInt(e.target.value) || 5000)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Date & Message Section" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Date</FieldLabel>
                <input
                  type="text"
                  value={componentData.dateMessageDate || ''}
                  onChange={(e) => handleFieldUpdate('dateMessageDate', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="Minggu, 19 Mei 2024"
                />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted">Color:</span>
                  <input
                    type="color"
                    value={componentData.dateMessageDateColor || '#8b7355'}
                    onChange={(e) => handleFieldUpdate('dateMessageDateColor', e.target.value)}
                    className="w-8 h-8 border border-border rounded cursor-pointer"
                  />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                  <select
                    value={componentData.dateMessageDateAlign || 'center'}
                    onChange={(e) => handleFieldUpdate('dateMessageDateAlign', e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Message</FieldLabel>
                <textarea
                  value={componentData.dateMessageText || ''}
                  onChange={(e) => handleFieldUpdate('dateMessageText', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  rows={3}
                  placeholder="Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir..."
                />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted">Color:</span>
                  <input
                    type="color"
                    value={componentData.dateMessageTextColor || '#4a4a4a'}
                    onChange={(e) => handleFieldUpdate('dateMessageTextColor', e.target.value)}
                    className="w-8 h-8 border border-border rounded cursor-pointer"
                  />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                  <select
                    value={componentData.dateMessageTextAlign || 'center'}
                    onChange={(e) => handleFieldUpdate('dateMessageTextAlign', e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Countdown Timer" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Target Date & Time</FieldLabel>
                <input
                  type="datetime-local"
                  value={componentData.countdownTargetDate 
                    ? new Date(componentData.countdownTargetDate).toISOString().slice(0, 16)
                    : ''}
                  onChange={(e) => handleFieldUpdate('countdownTargetDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Design</FieldLabel>
                <select
                  value={componentData.countdownDesign || 'elegant-card'}
                  onChange={(e) => handleFieldUpdate('countdownDesign', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                >
                  <option value="simple">Simple</option>
                  <option value="elegant-card">Elegant Card</option>
                  <option value="minimal">Minimal</option>
                </select>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Countdown Colors</FieldLabel>
                <div className="space-y-2">
                  <ColorPicker
                    label="Title Color"
                    value={componentData.countdownTitleColor || '#1f2937'}
                    onChange={(value) => handleFieldUpdate('countdownTitleColor', value)}
                    defaultValue="#1f2937"
                  />
                  <ColorPicker
                    label="Value Color"
                    value={componentData.countdownValueColor || '#1f2937'}
                    onChange={(value) => handleFieldUpdate('countdownValueColor', value)}
                    defaultValue="#1f2937"
                  />
                  <ColorPicker
                    label="Label Color"
                    value={componentData.countdownLabelColor || '#6b7280'}
                    onChange={(value) => handleFieldUpdate('countdownLabelColor', value)}
                    defaultValue="#6b7280"
                  />
                  {componentData.countdownDesign === 'elegant-card' && (
                    <ColorPicker
                      label="Card Background Color"
                      value={componentData.countdownCardColor || '#ffffff'}
                      onChange={(value) => handleFieldUpdate('countdownCardColor', value)}
                      defaultValue="#ffffff"
                    />
                  )}
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Date & Message" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Date</FieldLabel>
                <input
                  type="text"
                  value={componentData.dateMessageDate || ''}
                  onChange={(e) => handleFieldUpdate('dateMessageDate', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="19.01.2026"
                />
                <div className="mt-2">
                  <ColorPicker
                    label="Date Color"
                    value={componentData.dateMessageDateColor || '#8b7355'}
                    onChange={(value) => handleFieldUpdate('dateMessageDateColor', value)}
                    defaultValue="#8b7355"
                  />
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Message</FieldLabel>
                <textarea
                  value={componentData.dateMessageText || ''}
                  onChange={(e) => handleFieldUpdate('dateMessageText', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  rows={4}
                  placeholder="Siang dan malam berganti begitu cepat..."
                />
                <div className="mt-2">
                  <ColorPicker
                    label="Text Color"
                    value={componentData.dateMessageTextColor || '#4a4a4a'}
                    onChange={(value) => handleFieldUpdate('dateMessageTextColor', value)}
                    defaultValue="#4a4a4a"
                  />
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'PhotoGalleryGrid':
        return (
          <>
            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Title</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.title || 'Photo Gallery'}
                    onChange={(e) => handleFieldUpdate('title', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Photo Gallery"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.titleColor || '#1f2937'}
                        onChange={(value) => handleFieldUpdate('titleColor', value)}
                        defaultValue="#1f2937"
                      />
                    </div>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Secondary Quote (Translation)</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={
                      componentData.secondaryQuote ??
                      (componentData.quote
                        ? (componentData.quote as string).split('\n\n')[1] || ''
                        : '')
                    }
                    onChange={(e) => handleFieldUpdate('secondaryQuote', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={4}
                    placeholder="Wahai pasangan suami-isteri..."
                  />
                  <p className="text-[11px] text-muted">
                    This text appears as the second paragraph under the primary quote.
                  </p>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Secondary Quote (Translation)</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={
                      componentData.secondaryQuote ??
                      (componentData.quote
                        ? (componentData.quote as string).split('\n\n')[1] || ''
                        : '')
                    }
                    onChange={(e) => handleFieldUpdate('secondaryQuote', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={4}
                    placeholder="Wahai pasangan suami-isteri..."
                  />
                  <p className="text-[11px] text-muted">
                    This text will appear below the Sanskrit quote and share the same alignment and color.
                  </p>
                </div>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Images" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Gallery Images</FieldLabel>
                <ImageFilePicker
                  images={Array.isArray(componentData.images)
                    ? componentData.images.map((img: any, index: number) => ({
                        url: img.url || img,
                        name: img.alt || img.name || `Gallery ${index + 1}`,
                      }))
                    : []}
                  onImagesChange={(items) => {
                    handleFieldUpdate('images', items.map((item, index) => ({
                      id: `gallery-${index + 1}`,
                      url: item.url,
                      alt: item.name,
                    })));
                  }}
                  multiple={true}
                  label="Choose Image"
                />
                <p className="text-xs text-muted mt-2">
                  Selected images will immediately appear in the gallery preview.
                </p>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Layout" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>Columns</FieldLabel>
                <select
                  value={componentData.columns || 2}
                  onChange={(e) => handleFieldUpdate('columns', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                >
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns</option>
                </select>
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      case 'ClosingSection':
        return (
          <>
            <SectionGroup title="Content" defaultOpen={true}>
              <FieldGroup>
                <FieldLabel>Couple Names</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.coupleNames || ''}
                    onChange={(e) => handleFieldUpdate('coupleNames', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Bayu & Nia"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.coupleNamesColor || '#ffffff'}
                        onChange={(value) => handleFieldUpdate('coupleNamesColor', value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.coupleNamesAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('coupleNamesAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Message</FieldLabel>
                <div className="space-y-3">
                  <textarea
                    value={componentData.message || ''}
                    onChange={(e) => handleFieldUpdate('message', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors resize-none"
                    rows={3}
                    placeholder="Terima kasih atas ucapan..."
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.messageColor || '#e5e7eb'}
                        onChange={(value) => handleFieldUpdate('messageColor', value)}
                        defaultValue="#e5e7eb"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.messageAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('messageAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Designer Credit</FieldLabel>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={componentData.designerCredit || ''}
                    onChange={(e) => handleFieldUpdate('designerCredit', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                    placeholder="Invitation by Putri Grafika"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Color:</span>
                    <div className="flex-1">
                      <ColorPicker
                        label=""
                        value={componentData.designerCreditColor || '#b3b3b3'}
                        onChange={(value) => handleFieldUpdate('designerCreditColor', value)}
                        defaultValue="#b3b3b3"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted whitespace-nowrap">Alignment:</span>
                    <select
                      value={componentData.designerCreditAlign || 'center'}
                      onChange={(e) => handleFieldUpdate('designerCreditAlign', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-border/60 rounded-md bg-background text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Logo Image</FieldLabel>
                <ImageFilePicker
                  images={componentData.logoUrl && componentData.logoUrl.trim()
                    ? [{
                        url: componentData.logoUrl,
                        name: componentData.logoUrl.startsWith('data:')
                          ? 'Logo'
                          : componentData.logoUrl.split('/').pop() || 'Logo',
                      }]
                    : []}
                  onImagesChange={(items) => {
                    if (items.length > 0) {
                      handleFieldUpdate('logoUrl', items[0].url);
                    } else {
                      handleFieldUpdate('logoUrl', '');
                    }
                  }}
                  multiple={false}
                  label="Upload Logo"
                />
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Social Links" defaultOpen={false}>
              <FieldGroup>
                <FieldLabel>WhatsApp Link</FieldLabel>
                <input
                  type="text"
                  value={componentData.socialLinks?.whatsapp || ''}
                  onChange={(e) => handleFieldUpdate('socialLinks', { ...componentData.socialLinks, whatsapp: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                  placeholder="https://wa.me/..."
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Instagram Link</FieldLabel>
                <input
                  type="text"
                  value={componentData.socialLinks?.instagram || ''}
                  onChange={(e) => handleFieldUpdate('socialLinks', { ...componentData.socialLinks, instagram: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-md bg-background focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-sm transition-colors"
                  placeholder="https://instagram.com/..."
                />
              </FieldGroup>
            </SectionGroup>

            <SectionGroup title="Background" defaultOpen={false}>
              {renderBackgroundSection()}
            </SectionGroup>

            <SectionGroup title="Decorations" defaultOpen={false}>
              {renderDecorativeFlowersSection()}
              {renderCurveDividers()}
            </SectionGroup>
          </>
        );

      default:
        return (
          <div className="text-center py-4 text-sm text-muted">
            <p>No editable fields for this section type.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-primary">Edit Section</h3>
        <button
          onClick={onClose}
          className="text-muted hover:text-primary text-xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="text-xs text-muted mb-4">
        {section.type}
      </div>
      <div className="space-y-4">
        {renderFields()}
      </div>
    </div>
  );
}

