"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActiveTrack {
  title: string;
  artist: string;
}

interface AudioState {
  /** el usuario ya pasó el gate de autoplay */
  enabled: boolean;
  muted: boolean;
  /** sección cuyo track está (de)sonando */
  currentSectionId: string | null;
  currentTrack: ActiveTrack | null;
  transitioning: boolean;
  setEnabled: (enabled: boolean) => void;
  setMuted: (muted: boolean) => void;
  setActive: (sectionId: string | null, track: ActiveTrack | null) => void;
  setTransitioning: (value: boolean) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      enabled: false,
      muted: false,
      currentSectionId: null,
      currentTrack: null,
      transitioning: false,
      setEnabled: (enabled) => set({ enabled }),
      setMuted: (muted) => set({ muted }),
      setActive: (currentSectionId, currentTrack) =>
        set({ currentSectionId, currentTrack }),
      setTransitioning: (transitioning) => set({ transitioning }),
    }),
    {
      name: "surco-audio-v1",
      partialize: (s) => ({ enabled: s.enabled, muted: s.muted }),
    },
  ),
);
