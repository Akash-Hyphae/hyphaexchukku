import React from 'react';
import { PersonalCardItem, SiteSettings } from '../types/index.ts';
import { PersonalCard } from '../components/PersonalCard.tsx';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';
import { Heart, Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface ChukkuPageProps {
  cards: PersonalCardItem[];
  settings: SiteSettings;
}

export const ChukkuPage: React.FC<ChukkuPageProps> = ({ cards, settings }) => {
  const { isAuthenticated } = useAuth();
  const loveCards = cards.filter(c => c.category === 'Things I Love About You');
  const littleThingsCards = cards.filter(c => c.category !== 'Things I Love About You');

  return (
    <div className="py-24 px-6 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[#A84B3D] uppercase mb-3">
          <Heart className="w-3.5 h-3.5 fill-[#A84B3D]" />
          <span>Dedicated To My Favorite Person</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#3D251E] font-medium leading-tight">
          This is Chukku.
        </h1>
        <p className="mt-4 font-serif text-xl sm:text-2xl text-[#6B5349] italic">
          “{settings.chukkuIntro}”
        </p>

        {isAuthenticated && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                sessionStorage.setItem('admin_target_tab', 'chukku');
                window.location.href = '/admin';
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Chukku Cards in Admin</span>
            </button>
          </div>
        )}
      </div>

      {/* Large Featured Photograph */}
      <div className="max-w-3xl mx-auto mb-20 bg-[#FFFDF9] p-5 sm:p-7 rounded-2xl paper-shadow border border-[#EBE0D5]">
        <div className="aspect-16/10 rounded-xl overflow-hidden bg-[#F5ECE3]">
          <ImageWithFallback
            src={settings.chukkuFeaturedImage || 'WhatsApp Image 2026-10-08 at 4.25.23 PM (1).jpeg'}
            alt="Chukku's Special Day"
            title="Chukku · In Her Radiance"
            subtitle="My day ❤️"
            className="w-full h-full"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="font-handwriting text-2xl text-[#523A31]">
            “{settings.chukkuFeaturedQuote || 'The girl who turns ordinary days into poetry.'}”
          </p>
        </div>
      </div>

      {/* Section 1: Things I Love About You */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
            Things I Love About You
          </h2>
          <p className="mt-2 text-sm text-[#7D5A4F] font-sans">
            A few reasons out of a million why my heart beats only for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {loveCards.map(card => (
            <PersonalCard key={card._id} card={card} />
          ))}
        </div>
      </section>

      {/* Section 2: Little Things */}
      <section>
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-sans tracking-widest text-[#8F7266] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C97A53]" />
            <span>Cherished Details</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
            The Little Things
          </h2>
          <p className="mt-2 text-sm text-[#7D5A4F] font-sans">
            The quiet, goofy, everyday habits that make you uniquely Chukku.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {littleThingsCards.map(card => (
            <PersonalCard key={card._id} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
};
