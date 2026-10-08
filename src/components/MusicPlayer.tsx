import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext.tsx';
import { Volume2, VolumeX, Play, Pause, Music as MusicIcon } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { isPlaying, togglePlay, volume, setVolume, trackTitle, trackArtist, isEnabled } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <div className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#E3D3C5] rounded-full shadow-lg p-2 flex items-center transition-all duration-300">
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#A84B3D] hover:bg-[#8F3C30] text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-xs"
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        {/* Track Title and Toggle */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 cursor-pointer hidden sm:flex flex-col text-left"
        >
          <span className="font-serif text-xs font-semibold text-[#3D251E] truncate max-w-[140px]">
            {trackTitle}
          </span>
          <span className="text-[10px] text-[#8F7266] font-sans truncate max-w-[140px]">
            {isPlaying ? 'Playing melody...' : 'Click to listen'}
          </span>
        </div>

        {/* Volume Slider on Expanded or Hover */}
        {isExpanded && (
          <div className="flex items-center pl-2 pr-3 border-l border-[#E3D3C5] gap-2 animate-in fade-in duration-200">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.4)}
              className="text-[#6B5349] hover:text-[#3D251E] p-1"
            >
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-[#E3D3C5] rounded-lg appearance-none cursor-pointer accent-[#A84B3D]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
