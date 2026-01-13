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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
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
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
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
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
          </>
        );

      case 'CoupleProfile':
        return (
          <>
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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
          </>
        );

      case 'InvitationMessage':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Message</label>
              <textarea
                value={componentData.message || ''}
                onChange={(e) => handleFieldUpdate('message', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                rows={4}
                placeholder="Merupakan suatu kebahagiaan..."
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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
          </>
        );

      case 'EventDetails':
        return (
          <>
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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
          </>
        );

      case 'CountdownTimer':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Target Date & Time</label>
              <input
                type="datetime-local"
                value={componentData.targetDate 
                  ? new Date(componentData.targetDate).toISOString().slice(0, 16)
                  : ''}
                onChange={(e) => handleFieldUpdate('targetDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Design</label>
              <select
                value={componentData.design || 'elegant-card'}
                onChange={(e) => handleFieldUpdate('design', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              >
                <option value="simple">Simple</option>
                <option value="elegant-card">Elegant Card</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Title Color"
                value={componentData.titleColor || '#1f2937'}
                onChange={(value) => handleFieldUpdate('titleColor', value)}
                defaultValue="#1f2937"
              />
            </div>
            <div className="mt-2">
              <ColorPicker
                label="Value Color"
                value={componentData.valueColor || '#1f2937'}
                onChange={(value) => handleFieldUpdate('valueColor', value)}
                defaultValue="#1f2937"
              />
            </div>
            <div className="mt-2">
              <ColorPicker
                label="Label Color"
                value={componentData.labelColor || '#6b7280'}
                onChange={(value) => handleFieldUpdate('labelColor', value)}
                defaultValue="#6b7280"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
          </>
        );

      case 'PhotoGalleryGrid':
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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
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
            <div className="mt-4 pt-4 border-t border-border">
              <ColorPicker
                label="Background Color"
                value={componentData.backgroundColor || ''}
                onChange={(value) => handleFieldUpdate('backgroundColor', value)}
                defaultValue=""
              />
            </div>
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

