import { Position, SizeProps } from "@/types/types";
import { useState, useEffect } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";




export function CurrentLocationMap({ width, height }: SizeProps) {
    const [center, setCenter] = useState<Position | null>(null);
    const [userPosition, setUserPosition] = useState<Position | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) return;

        // 초기 위치 설정
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserPosition(newPosition);
                setCenter(newPosition);
            },
            (error) => console.error("Error getting location:", error)
        );

        // 위치 추적
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserPosition(newPosition);
                setCenter(newPosition);  // 사용자 위치로 맵 중심 이동
            },
            (error) => console.error("Error watching location:", error),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    if (!center) {
        return (
            <Card className="flex items-center justify-center p-4" style={{ width, height }}>
                <div className="space-y-4 w-full">
                    <Skeleton className="h-4 w-[60%] mx-auto" />
                    <Skeleton className="h-[200px] w-full" />
                    <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-[200px]" />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <BaseKakaoMap width={width} height={height} center={center}>
            {userPosition && <CurrentLocationMarker position={userPosition} />}
        </BaseKakaoMap>
    );
}