import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback.tsx';

interface HeroProps {
  headline: string;
  subtitle: string;
  buttonText: string;
  featuredImageUrl: string;
  onEnterStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  headline,
  subtitle,
  buttonText,
  featuredImageUrl,
  onEnterStory
}) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Romantic Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          
          {/* Step 1: Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="font-handwriting text-2xl sm:text-3xl text-[#A84B3D] tracking-wide">
              Hey, you.
            </span>
            <span className="w-8 h-px bg-[#A84B3D]/40" />
          </motion.div>

          {/* Step 2: Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#3D251E] font-medium leading-[1.15] tracking-tight"
          >
            {headline || 'Welcome to our little universe.'}
          </motion.h1>

          {/* Step 3: Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.0 }}
            className="text-base sm:text-lg text-[#6B5349] font-sans mt-4 max-w-xl leading-relaxed font-normal"
          >
            {subtitle || 'A tiny corner of the internet that belongs to us.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.3 }}
            className="my-5 flex items-center gap-3 text-xs tracking-widest text-[#8F7266] uppercase"
          >
            <span>Handcrafted with all my love</span>
            <span aria-hidden="true">·</span>
            <span>Est. Forever</span>
          </motion.div>

          {/* Step 5: Enter Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-2"
          >
            <button
              onClick={onEnterStory}
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-[#FFF9F5] font-sans text-sm font-medium tracking-wide rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span>{buttonText || 'Enter our story →'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: Handcrafted Polaroid Photograph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 1.5 }}
          transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
          className="lg:col-span-5 flex justify-center z-10"
        >
          <div className="relative group max-w-sm w-full">
            {/* Scrapbook Tape Accent */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#EFE6DC]/90 backdrop-blur-xs border border-[#DFD3C6] rotate-1 shadow-xs z-20 pointer-events-none opacity-85" />
            
            {/* Polaroid Frame */}
            <div className="bg-[#FFFDF9] p-4 sm:p-5 pb-8 rounded-sm polaroid-shadow border border-[#ECE0D4] transform transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
              <div className="aspect-4/5 overflow-hidden rounded-xs bg-[#F7EFE7]">
                <ImageWithFallback
                  src={featuredImageUrl || 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg'}
                  alt="Chukku & Hyphae"
                  title="Chukku × Hyphae"
                  subtitle="Looking Up At You"
                  className="w-full h-full"
                />
              </div>

              {/* Handwritten note on bottom of polaroid */}
              <div className="mt-4 text-center">
                <p className="font-handwriting text-xl text-[#523A31] tracking-wide">
                  “I made a little world for you.”
                </p>
                <p className="text-[11px] font-sans text-[#997E72] mt-0.5 tracking-wider uppercase">
                  US · CAFE MEMORY
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
