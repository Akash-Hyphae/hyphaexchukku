import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Heart } from 'lucide-react';
import { GalleryImage } from '../types/index.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext
}) => {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) onNext();
    if (diff < -50) onPrev();
    touchStartX.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.title}
      className="fixed inset-0 z-50 bg-[#1A1210]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-[#E8D6CB] hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Button */}
      <button
        onClick={onPrev}
        className="absolute left-4 sm:left-8 z-40 text-[#E8D6CB] hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Previous Photo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 sm:right-8 z-40 text-[#E8D6CB] hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Next Photo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content Container */}
      <div className="max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row items-center bg-[#251A18] rounded-xl overflow-hidden border border-[#422F2A] shadow-2xl">
        {/* Photo Display */}
        <div className="w-full md:w-3/5 h-[45vh] md:h-[75vh] bg-[#140D0C] flex items-center justify-center relative">
          <ImageWithFallback
            src={currentImage.imageUrl}
            alt={currentImage.title}
            title={currentImage.title}
            subtitle={currentImage.location || currentImage.date}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Narrative & Details */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-[#F4ECE6] overflow-y-auto max-h-[35vh] md:max-h-[75vh]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E8A598] font-sans tracking-widest uppercase mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#E8A598]" />
              <span>{currentImage.category}</span>
              <span aria-hidden="true">·</span>
              <span>{currentIndex + 1} of {images.length}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium leading-snug">
              {currentImage.title}
            </h2>

            {currentImage.caption && (
              <p className="mt-4 text-sm sm:text-base text-[#D4C3B8] leading-relaxed font-sans">
                {currentImage.caption}
              </p>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-[#422F2A] space-y-2 text-xs text-[#A89387]">
            {currentImage.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C28C7E]" />
                <span>{currentImage.date}</span>
              </div>
            )}
            {currentImage.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C28C7E]" />
                <span>{currentImage.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
