'use client';

import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AnimatedLogo({ size = 'md', className = '' }: AnimatedLogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer rotating ring */}
      <div className="absolute inset-0 animate-spin-slow">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="2"
            strokeDasharray="10 5"
            className="animate-neon-flicker"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Middle pulsing circle */}
      <div className="absolute inset-0 flex items-center justify-center animate-glow-pulse">
        <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 opacity-80 animate-pulse-slow"></div>
      </div>

      {/* Inner AI brain icon */}
      <div className="absolute inset-0 flex items-center justify-center animate-bounce-slow">
        <svg
          className="w-1/2 h-1/2 text-white drop-shadow-lg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      {/* Floating particles */}
      {mounted && (
        <>
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-particle-float opacity-60" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-purple-400 rounded-full animate-particle-float opacity-60" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-particle-float opacity-60" style={{ animationDelay: '2s' }}></div>
        </>
      )}
    </div>
  );
}

