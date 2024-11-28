"use client"
import { KakaoPosition, MarkerForOverlay, Pin, RouteCoordinate } from "@/types/types";
import { useEffect, useState } from "react";
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
    const [center, setCenter] = useState<KakaoPosition>({ lat: 37.5665, lng: 126.9780 });

    useEffect(() => {
        if (route.routeCoordinates && Array.isArray(route.routeCoordinates) && route.routeCoordinates.length > 0) {
            const firstPosition = {
                lat: parseFloat(route.routeCoordinates[0].latitude),
                lng: parseFloat(route.routeCoordinates[0].longitude)
            };
            setCenter(firstPosition);
        }
    }, [route.routeCoordinates]);

    if (!route.routeCoordinates || !Array.isArray(route.routeCoordinates)) {
        console.error('Invalid route coordinates:', route);
        return null;
    }

    const convertToPosition = (coord: RouteCoordinate): KakaoPosition => ({
        lat: parseFloat(coord.latitude),
        lng: parseFloat(coord.longitude)
    });

    const convertPinToMarker = (pin: Pin): MarkerForOverlay => ({
        id: pin.id.toString(),
        position: {
            lat: pin.latitude,
            lng: pin.longitude
        },
        content: pin.content,
        imageUrl: pin.imageUrl
    });

    const positions = route.routeCoordinates.map(convertToPosition);
    const startPoint = positions[0];
    const endPoint = positions[positions.length - 1];

    const handleMapInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            onClick={handleMapInteraction}
            className={`${width} ${height}`}
        >
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
        </div>
    );
}