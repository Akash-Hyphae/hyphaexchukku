import React from 'react';
import { LoveLetterSection } from '../components/LoveLetterSection.tsx';
import { LoveLetterItem } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Edit2 } from 'lucide-react';

interface LoveLetterPageProps {
  letter: LoveLetterItem | null;
}

export const LoveLetterPage: React.FC<LoveLetterPageProps> = ({ letter }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#3D251E] font-medium leading-tight">
          A Letter For You
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#6B5349] font-sans">
          Words written straight from the heart, sealed forever.
        </p>

        {isAuthenticated && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                sessionStorage.setItem('admin_target_tab', 'love-letter');
                window.location.href = '/admin';
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit / Write Letters in Admin</span>
            </button>
          </div>
        )}
      </div>

      <LoveLetterSection letter={letter} />
    </div>
  );
};
