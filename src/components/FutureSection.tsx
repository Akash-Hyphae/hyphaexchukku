import React from 'react';
import { FutureGoalItem } from '../types/index.ts';
import { Compass, Sunrise, Sparkles, MapPin, CheckCircle2, Circle } from 'lucide-react';

interface FutureSectionProps {
  goals: FutureGoalItem[];
}

export const FutureSection: React.FC<FutureSectionProps> = ({ goals }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sunrise':
        return <Sunrise className="w-4 h-4 text-[#C97A53]" />;
      case 'Travel':
        return <MapPin className="w-4 h-4 text-[#A84B3D]" />;
      case 'Experiences':
        return <Compass className="w-4 h-4 text-[#7A6357]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#B58548]" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium tracking-tight">
          Things We Haven’t Done Yet
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#7D5A4F] font-sans">
          A bucket list for our tomorrows, one dream at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {goals.map((goal, idx) => (
          <div
            key={goal._id}
            className="bg-[#FFFDF9] rounded-xl p-6 sm:p-7 paper-shadow border border-[#EBE0D5] flex flex-col justify-between group hover:border-[#D5BCAD] transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#8F7266]">
                  {getCategoryIcon(goal.category)}
                  <span>{goal.category}</span>
                  {goal.targetDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{goal.targetDate}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  {goal.completed ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#A89387]">
                      <Circle className="w-3.5 h-3.5" />
                      Dreaming
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#3D251E] font-medium leading-snug">
                {goal.title}
              </h3>

              <p className="mt-2 text-sm text-[#614A42] leading-relaxed font-sans">
                {goal.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F2E8E0] flex items-center justify-between text-xs text-[#9C8276]">
              <span>Dream #{idx + 1}</span>
              <span className="font-handwriting text-base text-[#A84B3D]">someday soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
