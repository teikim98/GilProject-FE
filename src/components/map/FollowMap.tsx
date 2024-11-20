'use client'

import { Position, Post } from "@/types/types";
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
    route: Post;
    width?: string;
    height?: string;
}

// 두 점 사이의 거리 계산 (미터 단위)
const calculateDistance = (point1: Position, point2: Position): number => {
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
const findClosestPointOnPath = (position: Position, path: Position[]): Position => {
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

    const startPoint = route.routeData.path[0];
    const endPoint = route.routeData.path[route.routeData.path.length - 1];
    const totalDistance = route.routeData.distance; // 전체 경로 거리 (km)

    const [completedPath, setCompletedPath] = useState<Position[]>([]);
    const [remainingPath, setRemainingPath] = useState<Position[]>(route.routeData.path);
    const [snappedPosition, setSnappedPosition] = useState<Position | null>(null);
    const [hasStarted, setHasStarted] = useState(false); // 실제 이동 시작 여부

    //완주조건 체크
    const checkCompletion = (
        currentPoint: Position,
        endPoint: Position,
        completedDistance: number,
        visitedPoints: number
    ): boolean => {
        const isNearEnd = calculateDistance(currentPoint, endPoint) < 0.005; // 5m 이내
        const hasMinimumDistance = completedDistance > 0.01; // 최소 10m 이상 이동
        const hasMinimumPoints = visitedPoints > 3; // 최소 3개 이상의 경로 포인트 방문
        const hasMinimumTime = startTime ? (Date.now() - startTime) > 10000 : false;

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
                    if (!hasStarted && calculateDistance(newPosition, route.routeData.path[0]) < 0.02) {
                        setHasStarted(true);
                    }


                    // 경로 상의 가장 가까운 점 찾기
                    const snapped = findClosestPointOnPath(newPosition, route.routeData.path);
                    setSnappedPosition(snapped);

                    // 경로 분할 지점 찾기
                    const pathIndex = route.routeData.path.findIndex(point =>
                        calculateDistance(point, snapped) < 5 // 5미터 이내
                    );

                    if (pathIndex !== -1) {
                        // 완료된 경로와 남은 경로 업데이트
                        const completed = route.routeData.path.slice(0, pathIndex + 1);
                        const remaining = route.routeData.path.slice(pathIndex);

                        setCompletedPath(completed);
                        setRemainingPath(remaining);

                        let completedDistance = 0;
                        for (let i = 0; i < completed.length - 1; i++) {
                            completedDistance += calculateDistance(completed[i], completed[i + 1]);
                        }

                        // 완주 조건 체크
                        const isCompleted = checkCompletion(
                            snapped,
                            route.routeData.path[route.routeData.path.length - 1],
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
    }, [isFollowing, route.routeData.path, hasStarted]);

    return (
        <BaseKakaoMap
            width={width}
            height={height}
            center={snappedPosition || route.routeData.path[0]}
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
            {endPoint && route.routeData.path.length > 1 && (
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
            {route.routeData.markers.map(marker => (
                <MarkerWithOverlay
                    key={marker.id}
                    marker={marker}
                />
            ))}
        </BaseKakaoMap>
    );
}