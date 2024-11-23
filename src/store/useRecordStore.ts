import { create } from "zustand";
import { Pin, RouteCoordinate } from "@/types/types";

interface RecordState {
  isRecording: boolean;
  pathPositions: RouteCoordinate[];
  pins: Pin[]; // markers -> pins
  recordStartTime: number | null;

  startRecording: () => void;
  stopRecording: () => void;
  addPathPosition: (position: RouteCoordinate) => void;
  addPin: (pin: Pin) => void; // addMarker -> addPin
  loadSavedPath: () => void;
  resetRecord: () => void;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  isRecording: false,
  pathPositions: [],
  pins: [], // markers -> pins
  recordStartTime: null,

  startRecording: () =>
    set({
      isRecording: true,
      recordStartTime: Date.now(),
    }),

  stopRecording: () => {
    const { pathPositions, pins } = get();
    if (pathPositions.length > 0) {
      localStorage.setItem(
        "savedPath",
        JSON.stringify({ path: pathPositions, pins }) // markers -> pins
      );
      document.cookie = "has-temp-path=true;path=/";
    }
    set({ isRecording: false });
  },

  addPathPosition: (position: RouteCoordinate) =>
    set((state) => ({
      pathPositions: [...state.pathPositions, position],
    })),

  addPin: (
    pin: Pin // addMarker -> addPin
  ) =>
    set((state) => ({
      pins: [...state.pins, pin], // markers -> pins
    })),

  loadSavedPath: () => {
    const savedData = localStorage.getItem("savedPath");
    if (savedData) {
      const { path, pins } = JSON.parse(savedData); // markers -> pins
      set({
        pathPositions: path,
        pins: pins, // markers -> pins
      });
    }
  },

  resetRecord: () => {
    localStorage.removeItem("savedPath");
    document.cookie = "has-temp-path=false;path=/;max-age=0";
    set({
      pathPositions: [],
      pins: [], // markers -> pins
    });
  },
}));
