import { create } from "zustand";

type LocationStore = {
  selectedLocation: "내 현재위치" | "집 주변" | "검색결과";
  setSelectedLocation: (
    location: "내 현재위치" | "집 주변" | "검색결과"
  ) => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  selectedLocation: "내 현재위치",
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
