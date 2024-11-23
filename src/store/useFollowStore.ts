import { create } from "zustand";
import { KakaoPosition, Pin, Post, RouteCoordinate } from "@/types/types";

interface FollowState {
  isFollowing: boolean;
  followedPath: KakaoPosition[];
  currentPosition: KakaoPosition | null;
  elapsedTime: number;
  currentSpeed: number;
  currentDistance: number;
  remainingDistance: number;
  progressPercent: number;
  isCompleted: boolean;
  watchId: number | null;
  startTime: number | null;
  originalRoute: Post | null;

  setOriginalRoute: (route: Post) => void;
  startFollowing: () => void;
  stopFollowing: () => void;
  updatePosition: (position: KakaoPosition) => void;
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

  setOriginalRoute: (route: Post) =>
    set({
      originalRoute: route,
      remainingDistance: route.pathResDTO.distance * 1000, // km to m conversion
    }),

  startFollowing: () => {
    const state = get();
    set({
      isFollowing: true,
      startTime: Date.now(),
      followedPath: [],
      elapsedTime: 0,
      currentDistance: 0,
      remainingDistance: state.originalRoute
        ? state.originalRoute.pathResDTO.distance * 1000
        : 0,
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

  updatePosition: (position: KakaoPosition) => {
    const { followedPath, startTime, originalRoute } = get();
    const newPath = [...followedPath, position];

    set({
      currentPosition: position,
      followedPath: newPath,
      elapsedTime: startTime ? (Date.now() - startTime) / 1000 : 0,
    });

    if (originalRoute) {
      const totalDistance = originalRoute.pathResDTO.distance;
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

    if (status.isCompleted) {
      newState.progressPercent = 100;
      newState.currentDistance = currentState.originalRoute
        ? currentState.originalRoute.pathResDTO.distance * 1000
        : 0;
      newState.remainingDistance = 0;
    } else if (
      status.currentDistance !== undefined &&
      currentState.originalRoute
    ) {
      const totalDistanceMeters =
        currentState.originalRoute.pathResDTO.distance * 1000;
      const currentDistanceMeters = status.currentDistance;

      const percent = (currentDistanceMeters / totalDistanceMeters) * 100;
      newState.progressPercent = Math.min(Math.max(0, percent), 100);
      newState.remainingDistance = totalDistanceMeters - currentDistanceMeters;
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
