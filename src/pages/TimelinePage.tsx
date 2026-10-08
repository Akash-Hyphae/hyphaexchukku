import React from 'react';
import { Timeline } from '../components/Timeline.tsx';
import { TimelineEvent } from '../types/index.ts';
import { Clock } from 'lucide-react';

interface TimelinePageProps {
  events: TimelineEvent[];
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ events }) => {
  return (
    <div className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[#8F7266] uppercase mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Our Milestone Story</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#3D251E] font-medium leading-tight">
          OUR STORY
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#6B5349] font-sans">
          From the beginning to today, and all the countless tomorrows ahead.
        </p>
      </div>

      <Timeline events={events} />
    </div>
  );
};
