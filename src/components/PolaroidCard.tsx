import React from 'react';
import { GalleryImage } from '../types/index.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { MapPin, Calendar } from 'lucide-react';

interface PolaroidCardProps {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({ image, index, onClick }) => {
  // Subtle rotation patterns for an authentic scrapbook album feel
  const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-0.5', 'rotate-1.5'];
  const rotationClass = rotations[index % rotations.length];

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer select-none transition-all duration-500 hover:rotate-0 hover:scale-[1.02] hover:z-20 ${rotationClass}`}
    >
      <div className="bg-[#FFFDF9] p-4 pb-6 rounded-xs polaroid-shadow border border-[#EBE0D5] flex flex-col transition-shadow duration-300 group-hover:shadow-xl">
        
        {/* Photo Container */}
        <div className="aspect-4/5 overflow-hidden rounded-xs bg-[#F5ECE3] relative">
          <ImageWithFallback
            src={image.imageUrl}
            alt={image.title}
            title={image.title}
            subtitle={image.location}
            className="w-full h-full transform transition-transform duration-700 group-hover:scale-105"
          />

          {/* Discreet hover indicator */}
          <div className="absolute inset-0 bg-[#3D251E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <span className="text-xs uppercase tracking-widest text-white font-sans bg-[#3D251E]/70 px-3 py-1 rounded-full backdrop-blur-xs">
              View Memory
            </span>
          </div>
        </div>

        {/* Polaroid Footer */}
        <div className="mt-4 flex flex-col">
          <h3 className="font-serif text-lg font-medium text-[#3D251E] group-hover:text-[#A84B3D] transition-colors leading-tight">
            {image.title}
          </h3>

          {image.caption && (
            <p className="font-handwriting text-base text-[#6B5349] mt-1 line-clamp-2 leading-tight">
              {image.caption}
            </p>
          )}

          {/* Clean unboxed metadata with dot separators */}
          <div className="mt-2.5 pt-2.5 border-t border-[#F0E6DD] flex items-center gap-2 text-[11px] text-[#8F7266] font-sans tracking-wide">
            {image.date && <span>{image.date}</span>}
            {image.date && image.location && <span aria-hidden="true">·</span>}
            {image.location && <span>{image.location}</span>}
          </div>
        </div>

      </div>
    </div>
  );
};
