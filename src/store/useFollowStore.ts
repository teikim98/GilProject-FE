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
    const currentDistanceMeters = currentDistance;
    const totalDistanceMeters = totalDistance * 1000;
    const percent = (currentDistanceMeters / totalDistanceMeters) * 100;

    set({
      progressPercent: Math.min(percent, 100),
      remainingDistance: totalDistanceMeters - currentDistanceMeters,
    });
  },

  updateStatus: (status: Partial<FollowState>) => {
    const currentState = get();
    const newState = { ...status };

    // 현재 거리가 업데이트되면 자동으로 진행률도 업데이트
    if (status.currentDistance !== undefined && currentState.originalRoute) {
      const totalDistance = currentState.originalRoute.routeData.distance;
      const percent = (status.currentDistance / (totalDistance * 1000)) * 100;
      newState.progressPercent = Math.min(percent, 100);
      newState.remainingDistance =
        totalDistance * 1000 - status.currentDistance;
    }

    set(newState);
  },

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
