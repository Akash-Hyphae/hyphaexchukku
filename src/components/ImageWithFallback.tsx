import React, { useState } from 'react';
import { Heart, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  subtitle?: string;
  polaroid?: boolean;
  priority?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  title,
  subtitle,
  polaroid = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalize image source path
  const resolveSrc = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    let path = url;
    if (!url.startsWith('/uploads/') && !url.startsWith('/photos/')) {
      // Check if filename
      path = `/photos/${encodeURIComponent(url)}`;
    }
    return apiUrl ? `${apiUrl}${path.startsWith('/') ? path : `/${path}`}` : path;
  };

  const currentSrc = resolveSrc(src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!hasError && currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}

      {/* Romantic Handcrafted Watercolor Fallback if image fails or hasn't loaded */}
      {(!currentSrc || hasError || !isLoaded) && (
        <div
          className={`w-full h-full min-h-[180px] flex flex-col items-center justify-center p-6 text-center select-none transition-opacity duration-500 ${
            isLoaded && !hasError ? 'opacity-0 absolute inset-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            background: 'linear-gradient(135deg, #F9EDE6 0%, #F5E5DC 50%, #EEDBCE 100%)'
          }}
        >
          {/* Subtle paper grain circles */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#8E5A48_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2]/80 backdrop-blur-xs border border-[#E3CEBE] flex items-center justify-center mb-3 shadow-xs">
              <Heart className="w-6 h-6 text-[#A84B3D] fill-[#E8A598]/40 animate-pulse" />
            </div>

            <p className="font-serif text-lg font-medium text-[#4A2D24] tracking-wide max-w-[85%] leading-snug">
              {title || alt || 'Our Memory'}
            </p>

            {subtitle && (
              <span className="font-handwriting text-sm text-[#7D5A4F] mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B67352]" />
                {subtitle}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
