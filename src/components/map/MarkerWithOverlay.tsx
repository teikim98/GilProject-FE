"use client"
import { Pin } from "@/types/types";
import { useState } from "react";
import { CustomMarker } from "./CustomMarkerProps";
import { MarkerOverlay } from "./MarkerOverlay";

interface MarkerWithOverlayProps {
    marker: {
        id: string;
        position: {
            lat: number;
            lng: number;
        };
        content: string;
        imageUrl?: string | null;
    };  // 카카오맵과 호환되는 형식으로 정의
    onMarkerClick?: () => void;
}


export function MarkerWithOverlay({ marker, onMarkerClick }: MarkerWithOverlayProps) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    return (
        <>
            <CustomMarker
                position={marker.position}
                onClick={() => setIsOverlayVisible(!isOverlayVisible)}
            />
            <MarkerOverlay
                content={marker.content}
                imageUrl={marker.imageUrl}  // image -> imageUrl
                pinId={parseInt(marker.id)}  // markerId -> pinId, string -> number 변환
                position={{  // KakaoPosition을 RouteCoordinate로 변환
                    latitude: marker.position.lat.toString(),
                    longitude: marker.position.lng.toString()
                }}
                onClose={() => setIsOverlayVisible(false)}
                visible={isOverlayVisible}
            />

        </>
    );
}