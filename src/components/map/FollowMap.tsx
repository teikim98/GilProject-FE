'use client'

import { KakaoPosition, MarkerForOverlay, Path, Pin, Post, RouteCoordinate } from "@/types/types";
import { useEffect, useState } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { RoutePolyline } from "./RoutePolyline";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import { useFollowStore } from "@/store/useFollowStore";
import { calculatePathDistance } from "@/util/calculatePathDistance";
import { MarkerWithOverlay } from "./MarkerWithOverlay";
import { MapMarker } from "react-kakao-maps-sdk";
import { createEndMarker, createStartMarker } from "./CustomMarkerIcon";

interface FollowMapProps {
    route: Path;
    width?: string;
    height?: string;
}

// 두 점 사이의 거리 계산 (미터 단위)
const calculateDistance = (point1: KakaoPosition, point2: KakaoPosition): number => {
    const R = 6371e3; // 지구의 반지름 (미터)
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

// 경로 상의 가장 가까운 점 찾기
const findClosestPointOnPath = (position: KakaoPosition, path: KakaoPosition[]): KakaoPosition => {
    let closestPoint = path[0];
    let minDistance = calculateDistance(position, path[0]);

    for (let i = 0; i < path.length - 1; i++) {
        const start = path[i];
        const end = path[i + 1];

        // 두 점을 잇는 선분 위의 점들을 검사
        const numPoints = 10; // 선분을 10개의 점으로 나눔
        for (let j = 0; j <= numPoints; j++) {
            const ratio = j / numPoints;
            const point = {
                lat: start.lat + (end.lat - start.lat) * ratio,
                lng: start.lng + (end.lng - start.lng) * ratio
            };

            const distance = calculateDistance(position, point);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        }
    }

    return closestPoint;
};

export function FollowMap({ route, width, height }: FollowMapProps) {
    const {
        isFollowing,
        currentPosition,
        updatePosition,
        startTime,
        updateStatus,
        watchId,
        remainingDistance,
        progressPercent
    } = useFollowStore();

    const pathAsKakaoPositions = route.routeCoordinates.map(coord => ({
        lat: parseFloat(coord.latitude),
        lng: parseFloat(coord.longitude)
    }));


    const startPoint = pathAsKakaoPositions[0];
    const endPoint = pathAsKakaoPositions[pathAsKakaoPositions.length - 1];
    const totalDistance = route.distance;

    const [completedPath, setCompletedPath] = useState<KakaoPosition[]>([]);
    const [remainingPath, setRemainingPath] = useState<KakaoPosition[]>(pathAsKakaoPositions);
    const [snappedPosition, setSnappedPosition] = useState<KakaoPosition | null>(null);
    const [hasStarted, setHasStarted] = useState(false); // 실제 이동 시작 여부

    const checkCompletion = (
        currentPoint: KakaoPosition,
        endPoint: KakaoPosition,
        completedDistance: number,
        visitedPoints: number
    ): boolean => {
        const distanceToEnd = calculateDistance(currentPoint, endPoint);
        const totalDistance = route.distance * 1000; // km to m
        const completionThreshold = 3; // 3미터 이내

        const isNearEnd = distanceToEnd < completionThreshold;

        // 전체 거리에 따른 유동적인 완료 기준 설정
        let requiredCompletionRatio;
        if (totalDistance <= 100) {
            requiredCompletionRatio = 0.8;
        } else if (totalDistance <= 500) {
            requiredCompletionRatio = 0.85;
        } else if (totalDistance <= 1000) {
            requiredCompletionRatio = 0.9;
        } else {
            requiredCompletionRatio = 0.95;
        }

        const hasMinimumDistance = completedDistance > (totalDistance * requiredCompletionRatio);

        const requiredPoints = Math.max(2, Math.min(3, Math.floor(totalDistance / 200)));
        const hasMinimumPoints = visitedPoints > requiredPoints;

        const minimumTime = totalDistance <= 100 ? 5000 : 10000; // 100m 이하는 5초, 그 이상은 10초
        const hasMinimumTime = startTime ? (Date.now() - startTime) > minimumTime : false;

        return isNearEnd && hasMinimumDistance && hasMinimumPoints && hasMinimumTime;
    };



    useEffect(() => {
        if (isFollowing && !watchId) {
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // 실제 이동 시작 체크
                    if (!hasStarted && calculateDistance(newPosition, pathAsKakaoPositions[0]) < 0.02) {
                        setHasStarted(true);
                    }


                    // 경로 상의 가장 가까운 점 찾기
                    const snapped = findClosestPointOnPath(newPosition, pathAsKakaoPositions);
                    setSnappedPosition(snapped);

                    // 경로 분할 지점 찾기
                    const pathIndex = pathAsKakaoPositions.findIndex(point =>
                        calculateDistance(point, snapped) < 5
                    );


                    if (pathIndex !== -1) {
                        // 완료된 경로와 남은 경로 업데이트
                        const completed = pathAsKakaoPositions.slice(0, pathIndex + 1);
                        const remaining = pathAsKakaoPositions.slice(pathIndex);

                        setCompletedPath(completed);
                        setRemainingPath(remaining);

                        let completedDistance = 0;
                        for (let i = 0; i < completed.length - 1; i++) {
                            completedDistance += calculateDistance(completed[i], completed[i + 1]);
                        }

                        // 완주 조건 체크
                        const isCompleted = checkCompletion(
                            snapped,
                            pathAsKakaoPositions[pathAsKakaoPositions.length - 1],
                            completedDistance,
                            completed.length
                        );

                        // 상태 업데이트
                        updateStatus({
                            currentPosition: snapped,
                            currentDistance: completedDistance,
                            currentSpeed: position.coords.speed || 0,
                            isCompleted
                        });
                    }

                    updatePosition(newPosition);
                },
                (error) => console.error("Error getting location:", error),
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );

            updateStatus({ watchId: id });
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
                updateStatus({ watchId: null });
            }
        };
    }, [isFollowing, route.routeCoordinates, hasStarted]);

    const convertPinToMarker = (pin: Pin): MarkerForOverlay => ({
        id: pin.id.toString(),
        position: {
            lat: pin.latitude,
            lng: pin.longitude
        },
        content: pin.content,
        imageUrl: pin.imageUrl
    });

    return (
        <BaseKakaoMap
            width={width}
            height={height}
            center={snappedPosition || pathAsKakaoPositions[0]}
        >
            {startPoint && (
                <MapMarker
                    position={startPoint}
                    image={{
                        src: createStartMarker(),
                        size: { width: 32, height: 32 },
                        options: { offset: { x: 0, y: 0 } },
                    }}
                />
            )}
            {endPoint && pathAsKakaoPositions.length > 1 && (
                <MapMarker
                    position={endPoint}
                    image={{
                        src: createEndMarker(),
                        size: { width: 32, height: 32 },
                        options: { offset: { x: 0, y: 0 } },
                    }}
                />
            )}
            {/* 완료된 경로 (빨간색) */}
            {completedPath.length > 0 && (
                <RoutePolyline
                    path={completedPath}
                    isRecording={true}
                />
            )}

            {/* 남은 경로 (회색) */}
            {remainingPath.length > 0 && (
                <RoutePolyline
                    path={remainingPath}
                    strokeColor="#808080"
                    strokeOpacity={0.5}
                />
            )}

            {/* 경로 상의 현재 위치 마커 */}
            {snappedPosition && (
                <CurrentLocationMarker position={snappedPosition} />
            )}

            {/* 경로 마커들 */}
            {route.pins.map(pin => (
                <MarkerWithOverlay
                    key={pin.id}
                    marker={convertPinToMarker(pin)}
                />
            ))}
        </BaseKakaoMap>
    );
}