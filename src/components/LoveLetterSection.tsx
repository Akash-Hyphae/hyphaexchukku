import React from 'react';
import { LoveLetterItem } from '../types/index.ts';
import { Heart, Feather } from 'lucide-react';

interface LoveLetterSectionProps {
  letter: LoveLetterItem | null;
}

export const LoveLetterSection: React.FC<LoveLetterSectionProps> = ({ letter }) => {
  if (!letter) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-[#3D251E]">A letter is being written with ink and heart…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Parchment Container */}
      <div className="relative bg-[#FFFDF9] rounded-xl p-8 sm:p-14 paper-shadow border border-[#EBE0D5] overflow-hidden">
        
        {/* Subtle Watermark Motif */}
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
          <Feather className="w-24 h-24 text-[#8E5A48]" />
        </div>

        {/* Top Header */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-[#F0E6DD]">
          <div className="w-12 h-12 rounded-full bg-[#FAF3EC] border border-[#E3CEBE] flex items-center justify-center text-[#A84B3D] mb-3">
            <Heart className="w-5 h-5 fill-[#A84B3D]/30" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
            {letter.title}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-xs text-[#8F7266] uppercase tracking-widest font-sans">
            <span>{letter.date}</span>
            {letter.mood && (
              <>
                <span aria-hidden="true">·</span>
                <span>Mood: {letter.mood}</span>
              </>
            )}
          </div>
        </div>

        {/* Letter Body */}
        <div className="py-8 text-[#4A352D] font-serif text-lg sm:text-xl leading-relaxed whitespace-pre-line tracking-wide">
          {letter.content}
        </div>

        {/* Handcrafted Signoff */}
        <div className="pt-6 border-t border-[#F0E6DD] flex justify-between items-end">
          <div className="text-xs text-[#9C8276] font-sans">
            Sealed with love & memories
          </div>
          <div className="text-right">
            <p className="font-handwriting text-3xl sm:text-4xl text-[#A84B3D] tracking-wide">
              Yours always, Hyphae
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
