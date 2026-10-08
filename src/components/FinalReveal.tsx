import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback.tsx';

interface FinalRevealProps {
  title: string;
  message: string;
  imageUrl: string;
}

export const FinalReveal: React.FC<FinalRevealProps> = ({
  title,
  message,
  imageUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    // Gentle confetti celebration with warm pastel colors
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#E8A598', '#A84B3D', '#F4D3C6', '#FAF7F2']
    });
  };

  return (
    <section className="max-w-3xl mx-auto py-16 px-4 text-center">
      <div className="bg-[#FFFDF9] rounded-2xl p-8 sm:p-12 paper-shadow border border-[#EBE0D5] relative overflow-hidden">
        
        <div className="w-12 h-12 rounded-full bg-[#FAF0E8] border border-[#E8D4C5] flex items-center justify-center text-[#A84B3D] mx-auto mb-4">
          <Heart className="w-5 h-5 fill-[#A84B3D]" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
          {title || 'One Last Thing…'}
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#7D5A4F] font-sans max-w-md mx-auto">
          Before you go, there is a small whisper I kept saved just for this moment.
        </p>

        {!isOpen ? (
          <div className="mt-8">
            <button
              onClick={handleOpen}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white rounded-full font-sans text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <span>Open it</span>
              <Heart className="w-4 h-4 fill-white" />
            </button>
          </div>
        ) : (
          <div className="mt-8 pt-8 border-t border-[#F0E6DD] animate-in fade-in zoom-in-95 duration-500">
            {imageUrl && (
              <div className="max-w-md mx-auto aspect-4/3 rounded-xl overflow-hidden shadow-md mb-6 bg-[#F5ECE3] border border-[#E8DDD2]">
                <ImageWithFallback
                  src={imageUrl}
                  alt="Our Final Memory"
                  title="Chukku × Hyphae"
                  subtitle="Forever & Always"
                  className="w-full h-full"
                />
              </div>
            )}

            <p className="font-serif text-xl sm:text-2xl text-[#3D251E] leading-relaxed max-w-xl mx-auto italic">
              “{message}”
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#9C8276] uppercase tracking-widest font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#C97A53]" />
              <span>In every universe, always you</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C97A53]" />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
