export default function calculatePathDistance(
  path: Array<{ lat: number; lng: number }>
): number {
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
}
