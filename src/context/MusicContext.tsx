import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { publicApi } from '../services/api.ts';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (v: number) => void;
  trackTitle: string;
  trackArtist: string;
  isEnabled: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  const [trackTitle, setTrackTitle] = useState('Our Soft Melody');
  const [trackArtist, setTrackArtist] = useState('Chukku × Hyphae');
  const [musicUrl, setMusicUrl] = useState('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
  const [isEnabled, setIsEnabled] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    publicApi.getSettings().then(res => {
      if (res.success && res.data) {
        setIsEnabled(res.data.musicEnabled);
        if (res.data.musicTrackTitle) setTrackTitle(res.data.musicTrackTitle);
        if (res.data.musicTrackArtist) setTrackArtist(res.data.musicTrackArtist);
        if (res.data.musicUrl) setMusicUrl(res.data.musicUrl);
        if (res.data.volume !== undefined) setVolumeState(res.data.volume);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    } else {
      audioRef.current.src = musicUrl;
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [musicUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || !isEnabled) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio play request was interrupted or prevented by browser:', err);
      });
    }
  };

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        volume,
        setVolume,
        trackTitle,
        trackArtist,
        isEnabled
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
