import { KakaoPosition } from '@/types/types';

export class LocationSmoother {
    private readonly minAccuracy: number;
    private readonly minDistance: number;
    private readonly bufferSize: number;
    private positionBuffer: KakaoPosition[];

    constructor(minAccuracy = 20, minDistance = 5, bufferSize = 3) {
        this.minAccuracy = minAccuracy;
        this.minDistance = minDistance;
        this.bufferSize = bufferSize;
        this.positionBuffer = [];
    }

    // 두 지점 간의 거리 계산 (Haversine 공식)
    private calculateDistance(pos1: KakaoPosition, pos2: KakaoPosition): number {
        const R = 6371e3; // 지구 반경 (미터)
        const φ1 = (pos1.lat * Math.PI) / 180;
        const φ2 = (pos2.lat * Math.PI) / 180;
        const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
        const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // 이동 평균 계산
    private calculateMovingAverage(position: KakaoPosition): KakaoPosition {
        this.positionBuffer.push(position);

        if (this.positionBuffer.length > this.bufferSize) {
            this.positionBuffer.shift();
        }

        const avg = this.positionBuffer.reduce(
            (acc, pos) => ({
                lat: acc.lat + pos.lat / this.positionBuffer.length,
                lng: acc.lng + pos.lng / this.positionBuffer.length
            }),
            { lat: 0, lng: 0 }
        );

        return avg;
    }

    // 위치 데이터 스무딩
    public smooth(position: KakaoPosition, accuracy?: number): KakaoPosition | null {
        // 정확도가 너무 낮으면 스킵
        if (accuracy && accuracy > this.minAccuracy) {
            return null;
        }

        // 이전 위치가 있을 경우 거리 체크
        if (this.positionBuffer.length > 0) {
            const lastPosition = this.positionBuffer[this.positionBuffer.length - 1];
            const distance = this.calculateDistance(lastPosition, position);

            // 최소 거리보다 작으면 스킵
            if (distance < this.minDistance) {
                return null;
            }
        }

        // 이동 평균 계산
        return this.calculateMovingAverage(position);
    }
}