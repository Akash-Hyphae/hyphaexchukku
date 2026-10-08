import React from 'react';
import { FutureSection } from '../components/FutureSection.tsx';
import { FutureGoalItem } from '../types/index.ts';

interface FuturePageProps {
  goals: FutureGoalItem[];
}

export const FuturePage: React.FC<FuturePageProps> = ({ goals }) => {
  return (
    <div className="py-24 px-6 max-w-5xl mx-auto">
      <FutureSection goals={goals} />
    </div>
  );
};
