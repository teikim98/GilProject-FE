import { Position, SizeProps } from "@/types/types";
import { useState, useEffect } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { CurrentLocationMarker } from "./CurrentLocationMarker";




export function CurrentLocationMap({ width, height }: SizeProps) {
    const [center, setCenter] = useState<Position>({ lat: 37.5665, lng: 126.9780 });
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

    return (
        <BaseKakaoMap width={width} height={height} center={center}>
            {userPosition && <CurrentLocationMarker position={userPosition} />}
        </BaseKakaoMap>
    );
}