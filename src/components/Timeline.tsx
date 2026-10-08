import React from 'react';
import { TimelineEvent } from '../types/index.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { MapPin, Calendar, Heart, Quote } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-[#3D251E]">Our story is still being written…</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto py-8 px-4">
      {/* Central Romantic Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#E0D0C4] via-[#C99C8D] to-[#E0D0C4] transform -translate-x-1/2" />

      <div className="space-y-12 sm:space-y-16">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={event._id}
              className={`relative flex flex-col md:flex-row items-start ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Central Node Pin */}
              <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-[#FAF7F2] border-2 border-[#A84B3D] flex items-center justify-center shadow-xs">
                <Heart className="w-3.5 h-3.5 text-[#A84B3D] fill-[#A84B3D]" />
              </div>

              {/* Event Content Box */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                <div className="bg-[#FFFDF9] p-6 sm:p-7 rounded-lg paper-shadow border border-[#EBE0D5] relative group hover:border-[#D5BCAD] transition-colors">
                  
                  {/* Date & Location Header */}
                  <div className="flex items-center gap-3 text-xs text-[#8F7266] font-sans tracking-wider uppercase mb-2">
                    <span className="flex items-center gap-1 font-semibold text-[#A84B3D]">
                      <Calendar className="w-3.5 h-3.5" />
                      {event.date}
                    </span>
                    {event.location && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#3D251E] font-medium leading-tight">
                    {event.title}
                  </h3>

                  {/* Optional Image */}
                  {event.imageUrl && (
                    <div className="mt-4 rounded-md overflow-hidden aspect-16/10 bg-[#F5ECE3] border border-[#EAE0D6]">
                      <ImageWithFallback
                        src={event.imageUrl}
                        alt={event.title}
                        title={event.title}
                        subtitle={event.location}
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="mt-4 text-sm sm:text-base text-[#5C453C] leading-relaxed font-sans font-normal">
                    {event.description}
                  </p>

                  {/* Romantic Quote */}
                  {event.quote && (
                    <div className="mt-4 pt-4 border-t border-[#F2E8E0] flex items-start gap-2 text-[#7D5A4F]">
                      <Quote className="w-4 h-4 text-[#A84B3D]/60 shrink-0 mt-0.5" />
                      <p className="font-handwriting text-lg italic leading-snug">
                        “{event.quote}”
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Empty placeholder on the other side for spacing */}
              <div className="hidden md:block w-1/2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
