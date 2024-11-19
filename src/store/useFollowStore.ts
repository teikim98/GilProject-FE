import { create } from "zustand";
import { Position, MarkerData, Post } from "@/types/types";

interface FollowState {
  isFollowing: boolean;
  followedPath: Position[];
  currentPosition: Position | null;
  elapsedTime: number;
  currentSpeed: number;
  currentDistance: number;
  remainingDistance: number;
  progressPercent: number;
  isCompleted: boolean;
  watchId: number | null;
  startTime: number | null;
  originalRoute: Post | null;

  // Actions
  setOriginalRoute: (route: Post) => void;
  startFollowing: () => void;
  stopFollowing: () => void;
  updatePosition: (position: Position) => void;
  updateProgress: (totalDistance: number) => void;
  updateStatus: (status: Partial<FollowState>) => void;
  resetStatus: () => void;
}

export const useFollowStore = create<FollowState>((set, get) => ({
  isFollowing: false,
  followedPath: [],
  currentPosition: null,
  elapsedTime: 0,
  currentSpeed: 0,
  currentDistance: 0,
  remainingDistance: 0,
  progressPercent: 0,
  isCompleted: false,
  watchId: null,
  startTime: null,
  originalRoute: null,

  setOriginalRoute: (route: Post) => set({ originalRoute: route }),

  startFollowing: () => {
    set({
      isFollowing: true,
      startTime: Date.now(),
      followedPath: [],
      elapsedTime: 0,
      currentDistance: 0,
      isCompleted: false,
      progressPercent: 0,
    });
  },

  stopFollowing: () => {
    const { watchId } = get();
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    set({
      isFollowing: false,
      watchId: null,
      startTime: null,
    });
  },

  updatePosition: (position: Position) => {
    const { followedPath, startTime, originalRoute } = get();
    const newPath = [...followedPath, position];

    set({
      currentPosition: position,
      followedPath: newPath,
      elapsedTime: startTime ? (Date.now() - startTime) / 1000 : 0,
    });

    if (originalRoute) {
      const totalDistance = originalRoute.routeData.distance;
      get().updateProgress(totalDistance);
    }
  },

  updateProgress: (totalDistance: number) => {
    const { currentDistance } = get();
    const percent = Math.min((currentDistance / totalDistance) * 100, 100);
    set({ progressPercent: Number(percent.toFixed(1)) });
  },

  updateStatus: (status) => set(status),

  resetStatus: () =>
    set({
      isFollowing: false,
      followedPath: [],
      currentPosition: null,
      elapsedTime: 0,
      currentSpeed: 0,
      currentDistance: 0,
      remainingDistance: 0,
      progressPercent: 0,
      isCompleted: false,
      watchId: null,
      startTime: null,
      originalRoute: null,
    }),
}));
