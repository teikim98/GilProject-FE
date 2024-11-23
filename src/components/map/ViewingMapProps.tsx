"use client"
import { KakaoPosition, MarkerForOverlay, Pin, RouteCoordinate } from "@/types/types";
import { useState } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { MarkerWithOverlay } from "./MarkerWithOverlay";
import { RoutePolyline } from "./RoutePolyline";

import { createStartMarker, createEndMarker } from "./CustomMarkerIcon";
import { MapMarker } from "react-kakao-maps-sdk";

interface ViewingMapProps {
    width?: string;
    height?: string;
    route: {
        routeCoordinates: RouteCoordinate[];
        pins: Pin[];
    };
}


export function ViewingMap({ route, width, height }: ViewingMapProps) {

    if (!route.routeCoordinates || !Array.isArray(route.routeCoordinates)) {
        console.error('Invalid route coordinates:', route);
        return null;  // 또는 적절한 에러 UI를 표시
    }

    // RouteCoordinate를 카카오맵에서 사용하는 Position 형식으로 변환
    const convertToPosition = (coord: RouteCoordinate): KakaoPosition => ({
        lat: parseFloat(coord.latitude),
        lng: parseFloat(coord.longitude)
    });

    const positions = route.routeCoordinates.map(convertToPosition);
    const [center] = useState(positions[0] ?? { lat: 37.5665, lng: 126.9780 });

    const startPoint = positions[0];
    const endPoint = positions[positions.length - 1];


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
        <BaseKakaoMap width={width} height={height} center={center}>
            <RoutePolyline path={positions} />
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
            {endPoint && positions.length > 1 && (
                <MapMarker
                    position={endPoint}
                    image={{
                        src: createEndMarker(),
                        size: { width: 32, height: 32 },
                        options: { offset: { x: 0, y: 0 } },
                    }}
                />
            )}
            {route.pins.map(pin => (
                <MarkerWithOverlay
                    key={pin.id}
                    marker={convertPinToMarker(pin)}
                />
            ))}
        </BaseKakaoMap>

    );
}