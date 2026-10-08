import React from 'react';

export const FloatingParticles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Soft warm light orbs */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-[#FCE8DC]/50 blur-3xl" />
      <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-[#F9DFD8]/45 blur-3xl" />
      <div className="absolute bottom-[15%] left-[25%] w-80 h-80 rounded-full bg-[#EFE0D3]/50 blur-3xl" />

      {/* Subtle stardust elements */}
      <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#C28C7E]/40 animate-pulse" />
      <div className="absolute top-[65%] left-[10%] w-2 h-2 rounded-full bg-[#D19D8E]/30 animate-pulse" style={{ animationDelay: '1.2s' }} />
      <div className="absolute top-[80%] right-[35%] w-1.5 h-1.5 rounded-full bg-[#C28C7E]/40 animate-pulse" style={{ animationDelay: '2.5s' }} />
    </div>
  );
};
