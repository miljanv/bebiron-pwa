'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { ACCENT_PALETTE, ACCENT_STORAGE_KEY, DEFAULT_ACCENT } from '@/constants';

type AccentState = {
  accentColor: string;
  setAccentColor: (hex: string) => void;
};

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export const useAccentStore = create<AccentState>()(
  persist(
    (set) => ({
      accentColor: DEFAULT_ACCENT,
      setAccentColor: (hex) => {
        if (isValidHex(hex)) set({ accentColor: hex });
      },
    }),
    {
      name: ACCENT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const accentPalette = ACCENT_PALETTE;
