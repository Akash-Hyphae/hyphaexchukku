import React, { useState } from 'react';
import { GalleryImage } from '../types/index.ts';
import { PolaroidCard } from './PolaroidCard.tsx';
import { GalleryLightbox } from './GalleryLightbox.tsx';
import { Sparkles } from 'lucide-react';

interface GalleryGridProps {
  images: GalleryImage[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading?: boolean;
}

const CATEGORIES = ['All', 'Us', 'Favorites', 'Adventures', 'Random Moments', 'Special Days'];

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  selectedCategory,
  onSelectCategory,
  isLoading = false
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  return (
    <div className="w-full">
      {/* Category Segmented Control */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex items-center p-1 bg-[#F0E6DD]/70 rounded-full border border-[#E3D3C5]">
          {CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-1.5 text-xs font-sans tracking-wide rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#3D251E] text-white shadow-xs font-medium'
                    : 'text-[#6B5349] hover:text-[#3D251E]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredImages.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#EFE6DD] flex items-center justify-center text-[#A84B3D] mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="font-serif text-2xl text-[#3D251E] font-medium">
            Our memories are waiting to be added.
          </p>
          <p className="text-sm font-sans text-[#7D5A4F] mt-1">
            Every day with you is another page in our story.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredImages.map((image, index) => (
            <PolaroidCard
              key={image._id}
              image={image}
              index={index}
              onClick={() => handleOpenLightbox(index)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
