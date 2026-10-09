import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api.ts';
import { X, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { GalleryImage } from '../types/index.ts';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedImage: GalleryImage) => void;
  defaultPrivate?: boolean;
  initialData?: GalleryImage | null;
}

const CATEGORIES = ['All', 'Us', 'Favorites', 'Adventures', 'Random Moments', 'Special Days'];

// Known real photos uploaded by the user to quickly assign
const PRESET_PHOTOS = [
  { filename: 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg', label: 'Cafe Mirror Loving Gaze' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg', label: 'Cheek Kiss & Soft Smile' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.25.30 PM (3).jpeg', label: 'Hallway Mirror In Hoodie' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.25.25 PM (1).jpeg', label: 'Tender Kiss with Hand on Face' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.25.30 PM (2).jpeg', label: 'Hallway Mirror Kiss' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.25.23 PM (1).jpeg', label: 'Chukku Solo "My Day"' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.22.31 PM (2).jpeg', label: 'Lake Pichola Boat Ride' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.22.29 PM.jpeg', label: 'Hyphae Lake Portrait' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.22.31 PM (1).jpeg', label: 'Yellow Attire Couple Selfie' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.25.15 PM.jpeg', label: 'Midnight Birthday Cake Cutting' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.22.26 PM.jpeg', label: 'Video Call Screenshot' },
  { filename: 'WhatsApp Image 2026-10-08 at 4.25.29 PM (1).jpeg', label: 'Under Warm Cafe Lights' }
];

export const PhotoUploaderModal: React.FC<PhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultPrivate = false,
  initialData = null
}) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_PHOTOS[0].filename);
  const [useUploadFile, setUseUploadFile] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<any>('Us');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'draft'>(
    defaultPrivate ? 'private' : 'public'
  );
  const [privateNote, setPrivateNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCaption(initialData.caption || '');
      setLocation(initialData.location || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setCategory(initialData.category || 'Us');
      setVisibility(
        initialData.isPrivate ? 'private' : initialData.isPublished ? 'public' : 'draft'
      );
      setPrivateNote(initialData.privateNote || '');
      setSelectedPreset(initialData.imageUrl || PRESET_PHOTOS[0].filename);
      setUseUploadFile(false);
      setUploadedFile(null);
      setPreviewUrl('');
    } else {
      setTitle('');
      setCaption('');
      setLocation('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Us');
      setVisibility(defaultPrivate ? 'private' : 'public');
      setPrivateNote('');
      setSelectedPreset(PRESET_PHOTOS[0].filename);
      setUseUploadFile(false);
      setUploadedFile(null);
      setPreviewUrl('');
    }
  }, [initialData, defaultPrivate, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUseUploadFile(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let finalImageUrl = selectedPreset;

      if (useUploadFile && uploadedFile) {
        const uploadRes = await adminApi.uploadPhoto(uploadedFile);
        if (uploadRes.success) {
          finalImageUrl = uploadRes.imageUrl;
        }
      }

      const isPrivate = visibility === 'private';
      const isPublished = visibility === 'public';

      if (initialData) {
        const res = await adminApi.updateGalleryImage(initialData._id, {
          imageUrl: finalImageUrl,
          title,
          caption,
          location,
          date,
          category,
          isPrivate,
          isPublished,
          privateNote
        });
        if (res.success) {
          onSuccess(res.data);
          onClose();
        }
      } else {
        const res = await adminApi.createGalleryImage({
          imageUrl: finalImageUrl,
          title,
          caption,
          location,
          date,
          category,
          isPrivate,
          isPublished,
          privateNote
        });

        if (res.success) {
          onSuccess(res.data);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] border border-[#E3D3C5] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8F7266] hover:text-[#3D251E] p-1.5 rounded-full hover:bg-[#EFE6DC]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="font-serif text-2xl text-[#3D251E] font-medium">
            {initialData ? 'Edit Photo Memory' : defaultPrivate ? 'Add Secret Photo to Vault' : 'Add Photo Memory'}
          </h2>
          <p className="text-xs text-[#7D5A4F] font-sans mt-0.5">
            {initialData
              ? 'Update caption, date, location, category, and privacy settings.'
              : 'Select one of the uploaded WhatsApp photos or upload directly from your device.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* Photo Source Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
              Photo Source
            </label>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => setUseUploadFile(false)}
                className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  !useUploadFile
                    ? 'border-[#A84B3D] bg-[#F7EFE9] text-[#A84B3D] font-medium'
                    : 'border-[#E0D0C4] bg-white text-[#6B5349]'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Our Uploaded Photos</span>
              </button>

              <button
                type="button"
                onClick={() => setUseUploadFile(true)}
                className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  useUploadFile
                    ? 'border-[#A84B3D] bg-[#F7EFE9] text-[#A84B3D] font-medium'
                    : 'border-[#E0D0C4] bg-white text-[#6B5349]'
                }`}
              >
                <Upload className="w-4 h-4 shrink-0" />
                <span>Upload From Device</span>
              </button>
            </div>

            {!useUploadFile ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto border border-[#E0D0C4] rounded-lg p-2 bg-white">
                {PRESET_PHOTOS.map(p => (
                  <div
                    key={p.filename}
                    onClick={() => setSelectedPreset(p.filename)}
                    className={`p-2 rounded-md flex items-center justify-between cursor-pointer transition-colors ${
                      selectedPreset === p.filename ? 'bg-[#F5ECE3] text-[#A84B3D] font-medium' : 'hover:bg-[#FAF7F2] text-[#5C453C]'
                    }`}
                  >
                    <span className="truncate pr-2">{p.label}</span>
                    {selectedPreset === p.filename && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#D5BCAD] rounded-lg p-4 text-center bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="modal-photo-upload"
                />
                <label
                  htmlFor="modal-photo-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <Upload className="w-6 h-6 text-[#A84B3D]" />
                  <span className="font-medium text-[#3D251E]">Click to choose an image</span>
                  <span className="text-[10px] text-[#8F7266]">JPG, PNG, WEBP up to 25MB</span>
                </label>
                {uploadedFile && (
                  <p className="mt-2 text-[#A84B3D] font-semibold truncate">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5A433A] uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Under The Golden Sunset"
              className="w-full px-3 py-2 bg-white border border-[#E0D0C4] rounded-lg text-sm text-[#3D251E] focus:outline-hidden focus:border-[#A84B3D]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5A433A] uppercase tracking-wider mb-1">
              Caption / Little Memory
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this moment so special..."
              className="w-full px-3 py-2 bg-white border border-[#E0D0C4] rounded-lg text-sm text-[#3D251E] focus:outline-hidden focus:border-[#A84B3D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5A433A] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E0D0C4] rounded-lg text-sm text-[#3D251E] focus:outline-hidden focus:border-[#A84B3D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5A433A] uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Udaipur, Lake Pichola"
                className="w-full px-3 py-2 bg-white border border-[#E0D0C4] rounded-lg text-sm text-[#3D251E] focus:outline-hidden focus:border-[#A84B3D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5A433A] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E0D0C4] rounded-lg text-sm text-[#3D251E] focus:outline-hidden focus:border-[#A84B3D]"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A433A] uppercase tracking-wider mb-1">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#E0D0C4] rounded-lg text-sm text-[#3D251E] focus:outline-hidden focus:border-[#A84B3D]"
              >
                <option value="public">PUBLIC (Visible on website)</option>
                <option value="private">PRIVATE (Private Vault only)</option>
                <option value="draft">DRAFT (Not published yet)</option>
              </select>
            </div>
          </div>

          {visibility === 'private' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#E11D48] uppercase tracking-wider mb-1">
                Private Vault Secret Note
              </label>
              <textarea
                rows={2}
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                placeholder="Personal thought only visible inside the Private Vault..."
                className="w-full px-3 py-2 bg-[#FFF1F2] border border-[#FECDD3] rounded-lg text-sm text-[#881337] focus:outline-hidden focus:border-[#E11D48]"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-[#D5BCAD] text-[#614A42] hover:bg-[#EFE6DC] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[#A84B3D] hover:bg-[#8F3C30] text-white font-medium shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Photograph' : 'Save Photograph'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
