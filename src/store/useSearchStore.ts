// store/useSearchStore.ts
import { create } from "zustand";

interface SearchState {
  query: string;
  searchTerm: string;
  searchHistory: string[];
  setQuery: (query: string) => void;
  submitSearch: () => void;
  removeHistoryItem: (item: string) => void;
  clearHistory: () => void;
  initializeHistory: () => void;
  setSearchTerm: (term: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  searchHistory: [],
  setQuery: (query) => set({ query }),
  submitSearch: () => {
    const { query, searchHistory } = get();
    if (!query.trim()) return;

    const newHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, 10);

    if (typeof window !== "undefined") {
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
    set({ searchTerm: query, searchHistory: newHistory });
  },
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
