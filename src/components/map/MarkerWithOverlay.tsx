"use client"
import { MarkerData } from "@/types/types";
import { useState } from "react";
import { CustomMarker } from "./CustomMarkerProps";
import { MarkerOverlay } from "./MarkerOverlay";

interface MarkerWithOverlayProps {
    marker: MarkerData;
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
                image={marker.image}
                markerId={marker.id}
                position={marker.position}
                onClose={() => setIsOverlayVisible(false)}
                visible={isOverlayVisible}
            />
        </>
    );
}