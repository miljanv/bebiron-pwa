'use client';

import { useId } from 'react';

type Props = {
  size?: number;
  variant?: 'default' | 'dark';
};

/** Bebiron app icon. 1:1 with the React Native SVG. */
export function AppIcon({ size = 80, variant = 'default' }: Props) {
  const gid = useId().replace(/:/g, '');
  const isDark = variant === 'dark';
  const bgStart = isDark ? '#6B7B6E' : '#A4C4D4';
  const bgEnd = '#8B9B8E';
  const moonMask = isDark ? '#6B7B6E' : '#A4C4D4';
  const faceColor = '#8B9B8E';
  const radius = size * 0.22;

  return (
    <div
      className="overflow-hidden shadow-brand"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={bgStart} />
            <stop offset="1" stopColor={bgEnd} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gid})`} />
        <circle cx="50" cy="45" r="22" fill="white" opacity={0.95} />
        <circle cx="58" cy="45" r="20" fill={moonMask} />
        <circle cx="44" cy="42" r="2" fill={faceColor} opacity={0.6} />
        <circle cx="52" cy="42" r="2" fill={faceColor} opacity={0.6} />
        <path
          d="M 43 48 Q 48 51 53 48"
          stroke={faceColor}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          opacity={0.6}
        />
        <circle cx="68" cy="30" r="2" fill="white" opacity={0.8} />
        <circle cx="75" cy="50" r="1.5" fill="white" opacity={0.7} />
        <circle cx="28" cy="35" r="1.5" fill="white" opacity={0.7} />
        <circle cx="32" cy="58" r="2" fill="white" opacity={0.8} />
      </svg>
    </div>
  );
}
