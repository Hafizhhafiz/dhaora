import React, { useState } from 'react';
import { CameraOff, Image as ImageIcon } from 'lucide-react';

/**
 * Image component that handles missing files gracefully.
 * - Prevents 404 network storms if hasImage is false
 * - Displays a clean dark-themed placeholder
 * - Uses native loading="lazy"
 */
export default function ImageWithFallback({
  src,
  alt = 'Citra',
  className = '',
  containerClassName = '',
  hasImage = true,
  isSynthetic = false,
  fallbackText = 'Citra tidak tersedia',
  showThumbnail = false
}) {
  const [error, setError] = useState(false);

  // If known missing or error has occurred, render clean placeholder
  if (!src || !hasImage || error) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800 rounded text-slate-500 select-none p-1.5 text-center ${containerClassName || className}`}
        title={isSynthetic ? 'Sesi pengujian sistem (citra uji tidak disimpan permanen)' : fallbackText}
      >
        <CameraOff className="w-4 h-4 mb-1 text-slate-600 shrink-0" />
        <span className="text-[10px] leading-tight font-medium text-slate-400">
          {fallbackText}
        </span>
        {isSynthetic && (
          <span className="mt-0.5 text-[8px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
            Uji Sistem
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={`${className}`}
    />
  );
}
