import { Position, Post } from "@/types/types";
import { useEffect, useState } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { RoutePolyline } from "./RoutePolyline";
import { CustomMarker } from "./CustomMarkerProps";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import { calculatePathDistanceInMeters, isRouteCompleted } from "../../util/calculatePathDistance";
import { useFollowStore } from "@/store/useFollowStore";

interface FollowMapProps {
    route: Post;
    width?: string;
    height?: string;
}

export function FollowMap({ route, width, height }: FollowMapProps) {
    const {
        isFollowing,
        currentPosition,
        followedPath,
        updatePosition,
        updateStatus,
        watchId
    } = useFollowStore();

    const [completedPath, setCompletedPath] = useState<Position[]>([]);
    const [remainingPath, setRemainingPath] = useState<Position[]>(route.routeData.path);



    // center 위치는 현재 위치가 있으면 현재 위치, 없으면 경로의 시작점을 사용
    const center = currentPosition || route.routeData.path[0];

    useEffect(() => {
        if (isFollowing && !watchId) {
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    updatePosition(newPosition);

                    // Calculate status updates
                    const followedDistance = calculatePathDistanceInMeters(followedPath);
                    const remainingDistance = route.routeData.distance - followedDistance;
                    const speed = position.coords.speed || 0;

                    // Check if route is completed
                    const isCompleted = isRouteCompleted(newPosition, route.routeData.path[route.routeData.path.length - 1]);

                    updateStatus({
                        currentDistance: followedDistance,
                        remainingDistance,
                        currentSpeed: speed,
                        isCompleted
                    });
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
    }, [isFollowing, route.routeData.path]);

    return (
        <BaseKakaoMap
            width={width}
            height={height}
            center={currentPosition || route.routeData.path[0]}
        >

            {completedPath.length > 0 && (
                <RoutePolyline
                    path={completedPath}
                    strokeColor="#19801b"
                    strokeOpacity={0.9}
                />
            )}


            {remainingPath.length > 0 && (
                <RoutePolyline
                    path={remainingPath}
                    strokeColor="#0011ff"
                    strokeOpacity={0.5}
                />
            )}

            {/* 현재 위치 마커 */}
            {currentPosition && (
                <CurrentLocationMarker position={currentPosition} />
            )}

            {/* 경로 마커들 */}
            {route.routeData.markers.map(marker => (
                <CustomMarker
                    key={marker.id}
                    position={marker.position}
                />
            ))}
        </BaseKakaoMap>
    );
}
