import React from 'react';
import { PersonalCardItem, SiteSettings } from '../types/index.ts';
import { PersonalCard } from '../components/PersonalCard.tsx';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';
import { Heart, Compass, BookHeart, Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HyphaePageProps {
  cards: PersonalCardItem[];
  settings: SiteSettings;
}

export const HyphaePage: React.FC<HyphaePageProps> = ({ cards, settings }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-24 px-6 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[#8F7266] uppercase mb-3">
          <BookHeart className="w-3.5 h-3.5 text-[#A84B3D]" />
          <span>My Words For You</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#3D251E] font-medium leading-tight">
          This is Hyphae.
        </h1>
        <p className="mt-4 font-serif text-xl sm:text-2xl text-[#6B5349] italic">
          “{settings.hyphaeIntro}”
        </p>

        {isAuthenticated && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                sessionStorage.setItem('admin_target_tab', 'hyphae');
                window.location.href = '/admin';
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Hyphae Cards in Admin</span>
            </button>
          </div>
        )}
      </div>

      {/* Large Featured Photograph */}
      <div className="max-w-3xl mx-auto mb-20 bg-[#FFFDF9] p-5 sm:p-7 rounded-2xl paper-shadow border border-[#EBE0D5]">
        <div className="aspect-16/10 rounded-xl overflow-hidden bg-[#F5ECE3]">
          <ImageWithFallback
            src={settings.hyphaeFeaturedImage || 'WhatsApp Image 2026-10-08 at 4.22.29 PM.jpeg'}
            alt="Hyphae by the Sunny Lake"
            title="Hyphae · By The Shimmering Water"
            subtitle="Smiling with sunshine and warmth"
            className="w-full h-full"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="font-handwriting text-2xl text-[#523A31]">
            “{settings.hyphaeFeaturedQuote || 'I found everything I ever searched for the day you looked back at me.'}”
          </p>
        </div>
      </div>

      {/* Narrative Cards */}
      <section className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map(card => (
            <PersonalCard key={card._id} card={card} variant="featured" />
          ))}
        </div>
      </section>

      {/* Heartfelt Note from Hyphae */}
      <div className="mt-20 p-8 sm:p-12 rounded-xl bg-[#FAF0E8] border border-[#E8D4C5] text-center max-w-2xl mx-auto">
        <Heart className="w-6 h-6 text-[#A84B3D] fill-[#A84B3D]/30 mx-auto mb-4" />
        <p className="font-serif text-xl sm:text-2xl text-[#3D251E] leading-relaxed">
          “{settings.hyphaePersonalNote || 'I may not always find the perfect poetic words, but everything in this website, every line of code, every saved picture—it was all created so you know how deeply you are loved.'}”
        </p>
        <p className="font-handwriting text-2xl text-[#8E5A48] mt-4">
          — Hyphae
        </p>
      </div>
    </div>
  );
};
