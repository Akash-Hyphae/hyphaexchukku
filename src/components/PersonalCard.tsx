import React from 'react';
import { PersonalCardItem } from '../types/index.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { Heart } from 'lucide-react';

interface PersonalCardProps {
  card: PersonalCardItem;
  variant?: 'featured' | 'standard';
}

export const PersonalCard: React.FC<PersonalCardProps> = ({ card, variant = 'standard' }) => {
  return (
    <div className="bg-[#FFFDF9] rounded-lg paper-shadow border border-[#EBE0D5] overflow-hidden flex flex-col group hover:border-[#D5BCAD] hover:-translate-y-1 transition-all duration-300">
      {card.imageUrl && (
        <div className={`w-full overflow-hidden bg-[#F5ECE3] ${variant === 'featured' ? 'aspect-16/10' : 'aspect-4/3'}`}>
          <ImageWithFallback
            src={card.imageUrl}
            alt={card.title}
            title={card.title}
            subtitle={card.category}
            className="w-full h-full transform transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {card.category && (
            <div className="flex items-center gap-1.5 text-xs text-[#A84B3D] font-sans tracking-widest uppercase font-medium mb-2">
              <Heart className="w-3 h-3 fill-[#A84B3D]" />
              <span>{card.category}</span>
            </div>
          )}

          <h3 className="font-serif text-2xl text-[#3D251E] font-medium leading-snug">
            {card.title}
          </h3>

          <p className="mt-3 text-sm sm:text-base text-[#614A42] leading-relaxed font-sans font-normal">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
};
