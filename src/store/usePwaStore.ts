import { create } from "zustand";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAStore {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setIsInstallable: (installable: boolean) => void;
  resetPrompt: () => void;
}

export const usePWAStore = create<PWAStore>((set) => ({
  deferredPrompt: null,
  isInstallable: false,
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setIsInstallable: (installable) => set({ isInstallable: installable }),
  resetPrompt: () => set({ deferredPrompt: null, isInstallable: false }),
}));
