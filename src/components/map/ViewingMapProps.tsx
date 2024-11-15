"use client"
import { MarkerData, Position } from "@/types/types";
import { useState } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { MarkerWithOverlay } from "./MarkerWithOverlay";
import { RoutePolyline } from "./RoutePolyline";

interface ViewingMapProps {
    route: {
        path: Position[];
        markers: MarkerData[];
    };
}

export function ViewingMap({ route }: ViewingMapProps) {
    const [center] = useState(route.path[0] ?? { lat: 37.5665, lng: 126.9780 });

    return (
        <BaseKakaoMap center={center}>
            <RoutePolyline path={route.path} />
            {route.markers.map(marker => (
                <MarkerWithOverlay key={marker.id} marker={marker} />
            ))}
        </BaseKakaoMap>
    );
}