import React from 'react';
import { GalleryGrid } from '../components/GalleryGrid.tsx';
import { GalleryImage } from '../types/index.ts';
import { Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface GalleryPageProps {
  images: GalleryImage[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  images,
  selectedCategory,
  onSelectCategory
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[#8F7266] uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C97A53]" />
          <span>Our Visual Keepsakes</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#3D251E] font-medium leading-tight">
          Our Gallery
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#6B5349] font-sans">
          Click any polaroid to see it in full size and read the little memory behind the frame.
        </p>

        {isAuthenticated && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                sessionStorage.setItem('admin_target_tab', 'gallery');
                window.location.href = '/admin';
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Photos in Admin</span>
            </button>
          </div>
        )}
      </div>

      <GalleryGrid
        images={images}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </div>
  );
};
