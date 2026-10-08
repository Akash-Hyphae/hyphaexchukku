import React from 'react';
import { Hero } from '../components/Hero.tsx';
import { GalleryGrid } from '../components/GalleryGrid.tsx';
import { Timeline } from '../components/Timeline.tsx';
import { FinalReveal } from '../components/FinalReveal.tsx';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';
import { GalleryImage, TimelineEvent, SiteSettings } from '../types/index.ts';
import { ArrowRight, Heart, Sparkles, BookOpen, Clock } from 'lucide-react';

interface HomePageProps {
  settings: SiteSettings;
  galleryImages: GalleryImage[];
  timelineEvents: TimelineEvent[];
  onNavigate: (tab: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  galleryImages,
  timelineEvents,
  onNavigate,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="w-full">
      {/* 1. Cinematic Hero */}
      <Hero
        headline={settings.heroHeadline}
        subtitle={settings.heroSubtitle}
        buttonText={settings.heroButtonText}
        featuredImageUrl={settings.featuredImageUrl}
        onEnterStory={() => {
          const el = document.getElementById('featured-memory');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Featured Memory */}
      <section id="featured-memory" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-sans tracking-widest text-[#A84B3D] uppercase mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#A84B3D]" />
            <span>Featured Memory</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
            The Moment Time Stood Still
          </h2>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 paper-shadow border border-[#EBE0D5] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 aspect-4/3 rounded-xl overflow-hidden bg-[#F5ECE3] shadow-xs">
            <ImageWithFallback
              src="WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg"
              alt="Cheek Kiss & Sweet Smiles"
              title="Quiet Whispers"
              subtitle="Closed eyes, infinite joy"
              className="w-full h-full"
            />
          </div>

          <div className="md:col-span-5 flex flex-col justify-center">
            <span className="font-handwriting text-2xl text-[#A84B3D]">
              “Just us, nothing else.”
            </span>
            <p className="mt-4 font-serif text-lg text-[#4A352D] leading-relaxed">
              Whenever we take these quick selfies, it reminds me that the best parts of life are not the loud stages—they are the quiet seconds where you lean in and just smile.
            </p>
            <div className="mt-6 pt-6 border-t border-[#F0E6DD] flex items-center justify-between text-xs text-[#8F7266]">
              <span>Captured with love</span>
              <button
                onClick={() => onNavigate('gallery')}
                className="text-[#A84B3D] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Story (Timeline Preview) */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#EAE0D6]">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-sans tracking-widest text-[#8F7266] uppercase mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Our Journey</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
            Chapters We Have Written
          </h2>
          <p className="mt-2 text-sm text-[#7D5A4F] font-sans">
            From our first shy conversation to the memories we made together.
          </p>
        </div>

        <Timeline events={timelineEvents.slice(0, 4)} />

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('timeline')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FAF7F2] border border-[#D5BCAD] hover:bg-[#F3E8DE] text-[#3D251E] text-xs font-sans font-medium tracking-wider uppercase rounded-full transition-all cursor-pointer shadow-xs"
          >
            <span>Read Complete Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. Selected Photographs (Gallery Preview) */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[#EAE0D6]">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-sans tracking-widest text-[#8F7266] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C97A53]" />
            <span>The Gallery</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
            Frames of Our Hearts
          </h2>
          <p className="mt-2 text-sm text-[#7D5A4F] font-sans">
            Every photo is a preserved heartbeat.
          </p>
        </div>

        <GalleryGrid
          images={galleryImages.slice(0, 6)}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('gallery')}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#3D251E] hover:bg-[#2B1914] text-white text-xs font-sans font-medium tracking-widest uppercase rounded-full transition-all cursor-pointer shadow-md"
          >
            <span>Explore All Photographs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. A Little Something / Dual Perspectives Teaser */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#EAE0D6]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chukku card */}
          <div
            onClick={() => onNavigate('chukku')}
            className="bg-[#FFFDF9] rounded-xl p-8 paper-shadow border border-[#EBE0D5] group cursor-pointer hover:border-[#A84B3D] transition-all duration-300"
          >
            <span className="font-handwriting text-2xl text-[#A84B3D]">To Chukku</span>
            <h3 className="font-serif text-2xl text-[#3D251E] font-medium mt-1">
              Things I Love About You
            </h3>
            <p className="mt-3 text-sm text-[#6B5349] leading-relaxed">
              Your laugh, your pouts, the way you make every simple hour feel like holiday morning. Explore the page dedicated just to you.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-sans text-[#A84B3D] font-medium tracking-wide">
              <span>View Chukku’s Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hyphae card */}
          <div
            onClick={() => onNavigate('hyphae')}
            className="bg-[#FFFDF9] rounded-xl p-8 paper-shadow border border-[#EBE0D5] group cursor-pointer hover:border-[#A84B3D] transition-all duration-300"
          >
            <span className="font-handwriting text-2xl text-[#A84B3D]">From Hyphae</span>
            <h3 className="font-serif text-2xl text-[#3D251E] font-medium mt-1">
              My Side of the Story
            </h3>
            <p className="mt-3 text-sm text-[#6B5349] leading-relaxed">
              The promises I keep in my heart, the adventures I am preparing for us, and the confessions I don't say out loud enough.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-sans text-[#A84B3D] font-medium tracking-wide">
              <span>View Hyphae’s Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Surprise Section */}
      <FinalReveal
        title={settings.finalSurpriseTitle}
        message={settings.finalSurpriseMessage}
        imageUrl={settings.finalSurpriseImage}
      />

      {/* 7. Final Teaser */}
      <div className="py-16 text-center select-none">
        <p className="font-handwriting text-3xl sm:text-4xl text-[#7D5A4F] tracking-wide">
          “There is still more to this story…”
        </p>
      </div>
    </div>
  );
};
