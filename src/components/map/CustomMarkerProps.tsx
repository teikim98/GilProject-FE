import { KakaoPosition } from "@/types/types";
import { MapMarker } from "react-kakao-maps-sdk";
import { createPinMarker } from "./CustomMarkerIcon";

interface CustomMarkerProps {
    position: KakaoPosition;
    onClick?: () => void;
}

export function CustomMarker({ position, onClick }: CustomMarkerProps) {
    const markerIcon = createPinMarker();

    return (
        <MapMarker
            position={position}
            onClick={onClick}
            image={{
                src: markerIcon,
                size: { width: 24, height: 28 },
                options: { offset: { x: 20, y: 48 } },
            }}
        />
    );
}
