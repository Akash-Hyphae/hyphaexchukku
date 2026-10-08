import React from 'react';
import { GalleryGrid } from '../components/GalleryGrid.tsx';
import { GalleryImage } from '../types/index.ts';
import { Sparkles } from 'lucide-react';

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
      </div>

      <GalleryGrid
        images={images}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </div>
  );
};
