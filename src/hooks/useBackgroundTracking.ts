"use client";

import { useEffect } from "react";
import { KakaoPosition } from "@/types/types";

interface UseBackgroundTrackingProps {
  isTracking: boolean;
  trackingType: "RECORDING" | "FOLLOWING";
  onLocationUpdate: (position: KakaoPosition, speed?: number) => void;
  onBackgroundLocations?: (locations: KakaoPosition[]) => void;
}

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
}

export function useBackgroundTracking({
  isTracking,
  trackingType,
  onLocationUpdate,
  onBackgroundLocations,
}: UseBackgroundTrackingProps) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Service Worker 등록
    navigator.serviceWorker
      .register("/worker/location-worker.js")
      .catch(console.error);

    // 메시지 수신 핸들러
    const messageHandler = (event: MessageEvent) => {
      const { type, location, locations } = event.data;

      if (type === "LOCATION_UPDATE") {
        onLocationUpdate(location.position, location.speed);
      } else if (
        type === "RECORDED_LOCATIONS" ||
        type === "FOLLOWED_LOCATIONS"
      ) {
        onBackgroundLocations?.(locations.map((loc: any) => loc.position));
      }
    };

    navigator.serviceWorker.addEventListener("message", messageHandler);

    // 위치 추적 시작
    if (isTracking) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({
          type: `START_${trackingType}`,
        });

        // 위치 추적 설정
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const locationData: LocationData = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed,
            };

            registration.active?.postMessage({
              type: "LOCATION_UPDATE",
              data: locationData,
            });
          },
          (error) => console.error("Location error:", error),
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
          registration.active?.postMessage({
            type: "STOP_TRACKING",
          });
        };
      });
    }

    return () => {
      navigator.serviceWorker.removeEventListener("message", messageHandler);
    };
  }, [isTracking, trackingType, onLocationUpdate, onBackgroundLocations]);
}
