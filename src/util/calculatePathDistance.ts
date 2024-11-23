import { KakaoPosition, RouteCoordinate } from "@/types/types";

// RouteCoordinate를 KakaoPosition으로 변환하는 유틸리티 함수
const convertToKakaoPosition = (coord: RouteCoordinate): KakaoPosition => ({
  lat: parseFloat(coord.latitude),
  lng: parseFloat(coord.longitude),
});

// 기존 거리 계산 함수 (km 단위)
export const calculatePathDistance = (path: KakaoPosition[]): number => {
  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const point1 = path[i];
    const point2 = path[i + 1];

    const R = 6371; // 지구 반경 (km)
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    totalDistance += distance;
  }

  return Math.round(totalDistance * 10) / 10;
};

// RouteCoordinate 배열을 위한 오버로드 함수
export const calculateRouteDistance = (path: RouteCoordinate[]): number => {
  return calculatePathDistance(path.map(convertToKakaoPosition));
};

// 미터 단위로 변환하여 계산하는 함수
export const calculatePathDistanceInMeters = (
  path: KakaoPosition[]
): number => {
  return calculatePathDistance(path) * 1000; // km to m
};

// 경로 완료 여부 체크
export const isRouteCompleted = (
  currentPosition: KakaoPosition,
  destinationPosition: KakaoPosition
): boolean => {
  const COMPLETION_THRESHOLD = 0.02; // 20미터 (km 단위로 변환)
  const distance = calculatePathDistance([
    currentPosition,
    destinationPosition,
  ]);
  return distance <= COMPLETION_THRESHOLD;
};

// 경로 이탈 여부 체크
export const isRouteDeviated = (
  currentPosition: KakaoPosition,
  routePath: KakaoPosition[]
): boolean => {
  const DEVIATION_THRESHOLD = 0.05; // 50미터 (km 단위로 변환)

  // 현재 위치에서 가장 가까운 경로 상의 지점과의 거리 계산
  const distances = routePath.map((pathPoint) =>
    calculatePathDistance([currentPosition, pathPoint])
  );

  const minDistance = Math.min(...distances);
  return minDistance > DEVIATION_THRESHOLD;
};

// 진행률 계산 (미터 단위 사용)
export const calculateProgress = (
  followedPath: KakaoPosition[],
  totalDistance: number
): number => {
  const coveredDistance = calculatePathDistanceInMeters(followedPath);
  return Math.min((coveredDistance / totalDistance) * 100, 100);
};

// RouteCoordinate 배열을 사용하는 버전들
export const isRouteCompletedFromCoords = (
  current: RouteCoordinate,
  destination: RouteCoordinate
): boolean => {
  return isRouteCompleted(
    convertToKakaoPosition(current),
    convertToKakaoPosition(destination)
  );
};

export const isRouteDeviatedFromCoords = (
  current: RouteCoordinate,
  routePath: RouteCoordinate[]
): boolean => {
  return isRouteDeviated(
    convertToKakaoPosition(current),
    routePath.map(convertToKakaoPosition)
  );
};

export const calculateProgressFromCoords = (
  followedPath: RouteCoordinate[],
  totalDistance: number
): number => {
  return calculateProgress(
    followedPath.map(convertToKakaoPosition),
    totalDistance
  );
};
