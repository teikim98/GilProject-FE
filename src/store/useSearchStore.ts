import { create } from "zustand";
interface SearchState {
  query: string;
  searchHistory: string[];
  setQuery: (query: string) => void;
  setSearchHistory: (history: string[]) => void; // 추가
  removeHistoryItem: (item: string) => void;
  clearHistory: () => void;
  initializeHistory: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  searchHistory: [],
  setQuery: (query) => set({ query }),
  setSearchHistory: (history) => set({ searchHistory: history }), // 추가
  removeHistoryItem: (item) =>
    set((state) => {
      const newHistory = state.searchHistory.filter((h) => h !== item);
      if (typeof window !== "undefined") {
        localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      }
      return { searchHistory: newHistory };
    }),
  clearHistory: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("searchHistory");
    }
    set({ searchHistory: [] });
  },
  initializeHistory: () => {
    if (typeof window !== "undefined") {
      const savedHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );
      set({ searchHistory: savedHistory });
    }
  },
}));
