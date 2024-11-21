import { Position } from "@/types/types";

// 기존 거리 계산 함수 (km 단위)
export const calculatePathDistance = (path: Position[]): number => {
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

  return Math.round(totalDistance * 10) / 10; // 소수점 첫째자리까지
};

// 미터 단위로 변환하여 계산하는 함수
export const calculatePathDistanceInMeters = (path: Position[]): number => {
  return calculatePathDistance(path) * 1000; // km to m
};

// 경로 완료 여부 체크 (목적지 근처 20미터 이내인지 확인)
export const isRouteCompleted = (
  currentPosition: Position,
  destinationPosition: Position
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
  currentPosition: Position,
  routePath: Position[]
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
  followedPath: Position[],
  totalDistance: number
): number => {
  const coveredDistance = calculatePathDistanceInMeters(followedPath);
  return Math.min((coveredDistance / totalDistance) * 100, 100);
};
