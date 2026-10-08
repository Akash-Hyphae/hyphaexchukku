import React from 'react';
import { LoveLetterSection } from '../components/LoveLetterSection.tsx';
import { LoveLetterItem } from '../types/index.ts';

interface LoveLetterPageProps {
  letter: LoveLetterItem | null;
}

export const LoveLetterPage: React.FC<LoveLetterPageProps> = ({ letter }) => {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#3D251E] font-medium leading-tight">
          A Letter For You
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#6B5349] font-sans">
          Words written straight from the heart, sealed forever.
        </p>
      </div>

      <LoveLetterSection letter={letter} />
    </div>
  );
};
