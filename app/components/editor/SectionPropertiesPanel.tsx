"use client";

import { ProjectData, ComponentConfig } from "../../lib/mockData";
import ColorPicker from "./ColorPicker";

interface SectionPropertiesPanelProps {
  section: ComponentConfig;
  componentData: Record<string, any>;
  onUpdate: (sectionId: string, field: string, value: any) => void;
  onClose: () => void;
}

export default function SectionPropertiesPanel({
  section,
  componentData,
  onUpdate,
  onClose
}: SectionPropertiesPanelProps) {
  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate(section.id, field, value);
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
  const renderBackgroundSection = () => (
    <div className="mt-4 pt-4 border-t border-border">
      <div>
        <label className="block text-sm font-medium text-primary mb-2">Background Image URL</label>
        <input
          type="text"
          value={componentData.backgroundImageUrl || ''}
          onChange={(e) => handleFieldUpdate('backgroundImageUrl', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
          placeholder="https://..."
        />
        <p className="text-xs text-muted mt-1">Background image for the entire section</p>
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

  const renderFields = () => {
    switch (section.type) {
      case 'CoverSection':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Date</label>
              <input
                type="text"
                value={componentData.date || ''}
                onChange={(e) => handleFieldUpdate('date', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="09 .01 .2026"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.dateColor || '#ffffff'}
                  onChange={(value) => handleFieldUpdate('dateColor', value)}
                  defaultValue="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Couple Names</label>
              <input
                type="text"
                value={componentData.coupleNames || ''}
                onChange={(e) => handleFieldUpdate('coupleNames', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Bayu & Nia"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.coupleNamesColor || '#ffffff'}
                  onChange={(value) => handleFieldUpdate('coupleNamesColor', value)}
                  defaultValue="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Quote</label>
              <textarea
                value={componentData.quote || ''}
                onChange={(e) => handleFieldUpdate('quote', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={4}
                placeholder="Bertemu denganmu adalah takdir..."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.quoteColor || '#ffffff'}
                  onChange={(value) => handleFieldUpdate('quoteColor', value)}
                  defaultValue="#ffffff"
                />
              </div>
            </div>
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
          </>
        );

      case 'HeroSection':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Subtitle</label>
              <input
                type="text"
                value={componentData.subtitle || ''}
                onChange={(e) => handleFieldUpdate('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="The Wedding of"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.subtitleColor || '#ffffff'}
                  onChange={(value) => handleFieldUpdate('subtitleColor', value)}
                  defaultValue="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Couple Names</label>
              <input
                type="text"
                value={componentData.coupleNames || ''}
                onChange={(e) => handleFieldUpdate('coupleNames', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Bayu & Nia"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.coupleNamesColor || '#ffffff'}
                  onChange={(value) => handleFieldUpdate('coupleNamesColor', value)}
                  defaultValue="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Quote</label>
              <textarea
                value={componentData.quote || ''}
                onChange={(e) => handleFieldUpdate('quote', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={4}
                placeholder="Bertemu denganmu adalah takdir..."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.quoteColor || '#ffffff'}
                  onChange={(value) => handleFieldUpdate('quoteColor', value)}
                  defaultValue="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Background Images (URLs, one per line)</label>
              <textarea
                value={Array.isArray(componentData.backgroundImages) 
                  ? componentData.backgroundImages.join('\n')
                  : ''}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter(url => url.trim());
                  handleFieldUpdate('backgroundImages', urls);
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={4}
                placeholder="https://image1.jpg&#10;https://image2.jpg"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-primary">Top Curve Divider</label>
                {componentData.showTopCurve !== false ? (
                  <button
                    onClick={() => handleFieldUpdate('showTopCurve', false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-md text-sm font-medium transition-all"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => handleFieldUpdate('showTopCurve', true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-md text-sm font-medium transition-all"
                    type="button"
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-md text-sm font-medium transition-all"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => handleFieldUpdate('showBottomCurve', true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-md text-sm font-medium transition-all"
                    type="button"
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
                        value={componentData.curveColor || '#ffffff'}
                        onChange={(e) => handleFieldUpdate('curveColor', e.target.value)}
                        className="w-10 h-10 border border-border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={componentData.curveColor || '#ffffff'}
                        onChange={(e) => handleFieldUpdate('curveColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
          </>
        );

      case 'QuoteSection':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Quote</label>
              <textarea
                value={componentData.quote || ''}
                onChange={(e) => handleFieldUpdate('quote', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={6}
                placeholder="Ihaiva stam mā vi yaustam..."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.quoteColor || '#374151'}
                  onChange={(value) => handleFieldUpdate('quoteColor', value)}
                  defaultValue="#374151"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Author</label>
              <input
                type="text"
                value={componentData.author || ''}
                onChange={(e) => handleFieldUpdate('author', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Rg Veda X.85.42."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.authorColor || '#6b7280'}
                  onChange={(value) => handleFieldUpdate('authorColor', value)}
                  defaultValue="#6b7280"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Image URL</label>
              <input
                type="text"
                value={componentData.imageUrl || ''}
                onChange={(e) => handleFieldUpdate('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="https://..."
              />
              <p className="text-xs text-muted mt-1">Decorative image displayed above the quote</p>
            </div>
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            <div className="mt-4 pt-4 border-t border-border">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Background Image URL</label>
                <input
                  type="text"
                  value={componentData.backgroundImageUrl || ''}
                  onChange={(e) => handleFieldUpdate('backgroundImageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="https://..."
                />
                <p className="text-xs text-muted mt-1">Background image for the entire section</p>
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
          </>
        );

      case 'ReligiousGreeting':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Greeting</label>
              <input
                type="text"
                value={componentData.greeting || ''}
                onChange={(e) => handleFieldUpdate('greeting', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Om Swastyastu"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.greetingColor || '#1f2937'}
                  onChange={(value) => handleFieldUpdate('greetingColor', value)}
                  defaultValue="#1f2937"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Message</label>
              <textarea
                value={componentData.message || ''}
                onChange={(e) => handleFieldUpdate('message', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={4}
                placeholder="Atas Asung Kertha Wara Nugraha..."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.messageColor || '#374151'}
                  onChange={(value) => handleFieldUpdate('messageColor', value)}
                  defaultValue="#374151"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Image URL</label>
              <input
                type="text"
                value={componentData.imageUrl || ''}
                onChange={(e) => handleFieldUpdate('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="https://..."
              />
            </div>
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
          </>
        );

      case 'CoupleProfile':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Design Style</label>
              <select
                value={componentData.design || 'with-container'}
                onChange={(e) => handleFieldUpdate('design', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              >
                <option value="simple">Simple (No Container)</option>
                <option value="with-container">With Image Container</option>
              </select>
              <p className="text-xs text-muted mt-1">Choose whether to use image container styles</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Name</label>
              <input
                type="text"
                value={componentData.name || ''}
                onChange={(e) => handleFieldUpdate('name', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Bayu"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.nameColor || '#1f2937'}
                  onChange={(value) => handleFieldUpdate('nameColor', value)}
                  defaultValue="#1f2937"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Full Name</label>
              <input
                type="text"
                value={componentData.fullName || ''}
                onChange={(e) => handleFieldUpdate('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="I Putu Bayu Hendrawan, S.T"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.fullNameColor || '#374151'}
                  onChange={(value) => handleFieldUpdate('fullNameColor', value)}
                  defaultValue="#374151"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Relation</label>
              <input
                type="text"
                value={componentData.relation || ''}
                onChange={(e) => handleFieldUpdate('relation', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Anak pertama dari pasangan"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.relationColor || '#4b5563'}
                  onChange={(value) => handleFieldUpdate('relationColor', value)}
                  defaultValue="#4b5563"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Father's Name</label>
              <input
                type="text"
                value={componentData.parents?.father || ''}
                onChange={(e) => handleFieldUpdate('parents', { ...componentData.parents, father: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="I Nyoman Sudiana"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.fatherNameColor || '#374151'}
                  onChange={(value) => handleFieldUpdate('fatherNameColor', value)}
                  defaultValue="#374151"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Mother's Name</label>
              <input
                type="text"
                value={componentData.parents?.mother || ''}
                onChange={(e) => handleFieldUpdate('parents', { ...componentData.parents, mother: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Ni Ketut Anik Meliani"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.motherNameColor || '#374151'}
                  onChange={(value) => handleFieldUpdate('motherNameColor', value)}
                  defaultValue="#374151"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Address</label>
              <textarea
                value={componentData.address || ''}
                onChange={(e) => handleFieldUpdate('address', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={2}
                placeholder="Perum. Wahyu Geraha No.41..."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.addressColor || '#4b5563'}
                  onChange={(value) => handleFieldUpdate('addressColor', value)}
                  defaultValue="#4b5563"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Image URL</label>
              <input
                type="text"
                value={componentData.imageUrl || ''}
                onChange={(e) => handleFieldUpdate('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="https://..."
              />
            </div>
            {componentData.design === 'with-container' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Image Container Style</label>
                  <select
                    value={componentData.imageStyle || 'circular'}
                    onChange={(e) => handleFieldUpdate('imageStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
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
                  <p className="text-xs text-muted mt-1">Choose an eye-catching style for the profile image</p>
                </div>
                {(componentData.imageStyle === 'circular-glow' || 
                  componentData.imageStyle === 'rounded-glow' || 
                  componentData.imageStyle === 'oval-glow' || 
                  componentData.imageStyle === 'hexagon-glow' || 
                  componentData.imageStyle === 'square-glow') && (
                  <div className="mt-4">
                    <ColorPicker
                      label="Glow Color"
                      value={componentData.glowColor || '#b49549'}
                      onChange={(value) => handleFieldUpdate('glowColor', value)}
                      defaultValue="#b49549"
                    />
                    <p className="text-xs text-muted mt-1">Customize the glow effect color</p>
                  </div>
                )}
              </>
            )}
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
          </>
        );

      case 'EventDetails':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Invitation Message</label>
              <p className="text-xs text-muted mb-2">This message will appear above the event card in this section</p>
              <textarea
                value={componentData.invitationMessage || ''}
                onChange={(e) => handleFieldUpdate('invitationMessage', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={4}
                placeholder="Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa restu."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Message Color"
                  value={componentData.invitationMessageColor || '#374151'}
                  onChange={(value) => handleFieldUpdate('invitationMessageColor', value)}
                  defaultValue="#374151"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Event Date</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Event Time</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Title Color</label>
              <ColorPicker
                label="Color"
                value={componentData.titleColor || '#1f2937'}
                onChange={(value) => handleFieldUpdate('titleColor', value)}
                defaultValue="#1f2937"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Venue Name</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Venue Address</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Google Maps Link</label>
              <input
                type="text"
                value={componentData.googleMapsLink || ''}
                onChange={(e) => handleFieldUpdate('googleMapsLink', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="https://maps.google.com/?q=..."
              />
              <p className="text-xs text-muted mt-1">Google Maps link for the map button below the card</p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary mb-2">Map Button Text</label>
              <input
                type="text"
                value={componentData.mapButtonText || 'Petunjuk Arah'}
                onChange={(e) => handleFieldUpdate('mapButtonText', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Petunjuk Arah"
              />
              <p className="text-xs text-muted mt-1">Text displayed on the map button</p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary mb-2">Map Button Background Color</label>
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
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary mb-2">Map Button Text Color</label>
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
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <label className="block text-sm font-medium text-primary mb-2">Design Style</label>
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
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <label className="block text-sm font-medium text-primary mb-2">Closing Message</label>
              <textarea
                value={componentData.closingMessage || ''}
                onChange={(e) => handleFieldUpdate('closingMessage', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={2}
                placeholder="Atas kehadiran dan doa restunya..."
              />
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-muted">Color:</label>
                <input
                  type="color"
                  value={componentData.closingMessageColor || '#374151'}
                  onChange={(e) => handleFieldUpdate('closingMessageColor', e.target.value)}
                  className="w-8 h-8 border border-border rounded cursor-pointer"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary mb-2">Closing Text (Om Shanti...)</label>
              <input
                type="text"
                value={componentData.closingText || ''}
                onChange={(e) => handleFieldUpdate('closingText', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Om Shanti Shanti Shanti Om"
              />
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-muted">Color:</label>
                <input
                  type="color"
                  value={componentData.closingTextColor || '#1f2937'}
                  onChange={(e) => handleFieldUpdate('closingTextColor', e.target.value)}
                  className="w-8 h-8 border border-border rounded cursor-pointer"
                />
              </div>
            </div>
            {(componentData.design === 'badge-accent' || componentData.design === 'card' || componentData.design === 'elegant-split') ? (
              <div className="mt-4 pt-4 border-t border-border">
                <label className="block text-sm font-medium text-primary mb-2">Card Header Color</label>
                <div className="flex items-center gap-2">
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
                <label className="block text-sm font-medium text-primary mb-2 mt-3">Card Body Color</label>
                <div className="flex items-center gap-2">
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
            ) : (
              <div className="mt-4 pt-4 border-t border-border">
                <label className="block text-sm font-medium text-primary mb-2">Card Background Color</label>
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
            )}
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
          </>
        );

      case 'ImageCarousel':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Images (URLs, one per line)</label>
              <textarea
                value={Array.isArray(componentData.images) 
                  ? componentData.images.map((img: any) => img.url || img).join('\n')
                  : ''}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter(url => url.trim());
                  handleFieldUpdate('images', urls.map((url, index) => ({ url, alt: `Image ${index + 1}`, order: index + 1 })));
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={6}
                placeholder="https://image1.jpg&#10;https://image2.jpg"
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm font-medium text-primary">
                <input
                  type="checkbox"
                  checked={componentData.autoplay !== false}
                  onChange={(e) => handleFieldUpdate('autoplay', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-accent rounded"
                />
                Autoplay
              </label>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-primary mb-2">Autoplay Interval (ms)</label>
              <input
                type="number"
                value={componentData.autoplayInterval || 5000}
                onChange={(e) => handleFieldUpdate('autoplayInterval', parseInt(e.target.value) || 5000)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              />
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-primary mb-4">Countdown Timer</h3>
              <p className="text-xs text-muted mb-4">The countdown timer will appear below the carousel</p>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Target Date & Time</label>
                <input
                  type="datetime-local"
                  value={componentData.countdownTargetDate 
                    ? new Date(componentData.countdownTargetDate).toISOString().slice(0, 16)
                    : ''}
                  onChange={(e) => handleFieldUpdate('countdownTargetDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-primary mb-2">Design</label>
                <select
                  value={componentData.countdownDesign || 'elegant-card'}
                  onChange={(e) => handleFieldUpdate('countdownDesign', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                >
                  <option value="simple">Simple</option>
                  <option value="elegant-card">Elegant Card</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              <div className="mt-4">
                <ColorPicker
                  label="Title Color"
                  value={componentData.countdownTitleColor || '#1f2937'}
                  onChange={(value) => handleFieldUpdate('countdownTitleColor', value)}
                  defaultValue="#1f2937"
                />
              </div>
              <div className="mt-2">
                <ColorPicker
                  label="Value Color"
                  value={componentData.countdownValueColor || '#1f2937'}
                  onChange={(value) => handleFieldUpdate('countdownValueColor', value)}
                  defaultValue="#1f2937"
                />
              </div>
              <div className="mt-2">
                <ColorPicker
                  label="Label Color"
                  value={componentData.countdownLabelColor || '#6b7280'}
                  onChange={(value) => handleFieldUpdate('countdownLabelColor', value)}
                  defaultValue="#6b7280"
                />
              </div>
              {componentData.countdownDesign === 'elegant-card' && (
                <div className="mt-2">
                  <ColorPicker
                    label="Card Background Color"
                    value={componentData.countdownCardColor || '#ffffff'}
                    onChange={(value) => handleFieldUpdate('countdownCardColor', value)}
                    defaultValue="#ffffff"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-primary mb-4">Date & Message Section</h3>
              <p className="text-xs text-muted mb-4">This section appears between the carousel and countdown timer</p>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Date</label>
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
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-primary mb-2">Message</label>
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
              </div>
            </div>
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
          </>
        );

      case 'PhotoGalleryGrid':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Title</label>
              <input
                type="text"
                value={componentData.title || 'Photo Gallery'}
                onChange={(e) => handleFieldUpdate('title', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Photo Gallery"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.titleColor || '#1f2937'}
                  onChange={(value) => handleFieldUpdate('titleColor', value)}
                  defaultValue="#1f2937"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Images (URLs, one per line)</label>
              <textarea
                value={Array.isArray(componentData.images) 
                  ? componentData.images.map((img: any) => img.url || img).join('\n')
                  : ''}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter(url => url.trim());
                  handleFieldUpdate('images', urls.map((url, index) => ({ id: `gallery-${index + 1}`, url, alt: `Gallery ${index + 1}` })));
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={6}
                placeholder="https://image1.jpg&#10;https://image2.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Columns</label>
              <select
                value={componentData.columns || 2}
                onChange={(e) => handleFieldUpdate('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
              </select>
            </div>
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
          </>
        );

      case 'ClosingSection':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Couple Names</label>
              <input
                type="text"
                value={componentData.coupleNames || ''}
                onChange={(e) => handleFieldUpdate('coupleNames', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Bayu & Nia"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.coupleNamesColor || '#ffffff'}
                  onChange={(value) => handleFieldUpdate('coupleNamesColor', value)}
                  defaultValue="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Message</label>
              <textarea
                value={componentData.message || ''}
                onChange={(e) => handleFieldUpdate('message', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={4}
                placeholder="Terima kasih atas ucapan..."
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.messageColor || '#e5e7eb'}
                  onChange={(value) => handleFieldUpdate('messageColor', value)}
                  defaultValue="#e5e7eb"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Designer Credit</label>
              <input
                type="text"
                value={componentData.designerCredit || ''}
                onChange={(e) => handleFieldUpdate('designerCredit', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="Invitation by Putri Grafika"
              />
              <div className="mt-2">
                <ColorPicker
                  label="Color"
                  value={componentData.designerCreditColor || '#b3b3b3'}
                  onChange={(value) => handleFieldUpdate('designerCreditColor', value)}
                  defaultValue="#b3b3b3"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">WhatsApp Link</label>
              <input
                type="text"
                value={componentData.socialLinks?.whatsapp || ''}
                onChange={(e) => handleFieldUpdate('socialLinks', { ...componentData.socialLinks, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="https://wa.me/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Instagram Link</label>
              <input
                type="text"
                value={componentData.socialLinks?.instagram || ''}
                onChange={(e) => handleFieldUpdate('socialLinks', { ...componentData.socialLinks, instagram: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Audio URL</label>
              <input
                type="text"
                value={componentData.audioUrl || ''}
                onChange={(e) => handleFieldUpdate('audioUrl', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="https://..."
              />
            </div>
            {renderDecorativeFlowersSection()}
            {renderCurveDividers()}
            {renderBackgroundSection()}
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

