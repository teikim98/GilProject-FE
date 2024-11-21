"use client"
import { MarkerData, Position } from "@/types/types";
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
        path: Position[];
        markers: MarkerData[];
    };
}

export function ViewingMap({ route, width, height }: ViewingMapProps) {
    const [center] = useState(route.path[0] ?? { lat: 37.5665, lng: 126.9780 });
    const startPoint = route.path[0];
    const endPoint = route.path[route.path.length - 1];

    return (
        <BaseKakaoMap width={width} height={height} center={center}>
            <RoutePolyline path={route.path} />
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
            {endPoint && route.path.length > 1 && (
                <MapMarker
                    position={endPoint}
                    image={{
                        src: createEndMarker(),
                        size: { width: 32, height: 32 },
                        options: { offset: { x: 0, y: 0 } },
                    }}
                />
            )}
            {route.markers.map(marker => (
                <MarkerWithOverlay key={marker.id} marker={marker} />
            ))}
        </BaseKakaoMap>
    );
}