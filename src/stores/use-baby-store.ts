'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type BabyState = {
  selectedBabyId: string | null;
  setSelectedBabyId: (id: string | null) => void;
};

export const useBabyStore = create<BabyState>()(
  persist(
    (set) => ({
      selectedBabyId: null,
      setSelectedBabyId: (id) => set({ selectedBabyId: id }),
    }),
    {
      name: 'bebiron_selected_baby',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
