import { KakaoPosition, RouteCoordinate } from "@/types/types";

// 기본적으로 카카오맵 Position 형식으로 받기
export function getCurrentPosition(): Promise<KakaoPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

// 필요한 경우 RouteCoordinate 형식으로 받는 함수도 추가
export function getCurrentPositionAsRouteCoordinate(): Promise<RouteCoordinate> {
  return getCurrentPosition().then((position) => ({
    latitude: position.lat.toString(),
    longitude: position.lng.toString(),
  }));
}
