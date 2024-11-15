"use client"
import { useRecordStore } from "@/store/useRecordStore";
import { MarkerData, Position } from "@/types/types";
import { useState } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import MarkerForm from "./MarkerForm";
import { MarkerWithOverlay } from "./MarkerWithOverlay";
import { RoutePolyline } from "./RoutePolyline";

interface EditingMapProps {
    initialPath: Position[];
    initialMarkers: MarkerData[];
}

export function EditingMap({ initialPath, initialMarkers }: EditingMapProps) {
    const [center] = useState(initialPath[0] ?? { lat: 37.5665, lng: 126.9780 });
    const { markers, addMarker } = useRecordStore();
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [showMarkerForm, setShowMarkerForm] = useState(false);

    const handleMapClick = (map: kakao.maps.Map, e: kakao.maps.event.MouseEvent) => {
        setSelectedPosition({
            lat: e.latLng.getLat(),
            lng: e.latLng.getLng(),
        });
        setShowMarkerForm(true);
    };

    const handleMarkerSubmit = (content: string, image: string) => {
        if (selectedPosition) {
            const newMarker: MarkerData = {
                position: selectedPosition,
                content,
                image,
                id: `marker-${Date.now()}`
            };
            addMarker(newMarker);
        }
        setShowMarkerForm(false);
        setSelectedPosition(null);
    };

    return (
        <BaseKakaoMap center={center} onClick={handleMapClick}>
            <RoutePolyline path={initialPath} />
            {markers.map(marker => (
                <MarkerWithOverlay key={marker.id} marker={marker} />
            ))}
            {showMarkerForm && selectedPosition && (
                <div className="absolute bottom-4 left-4 z-10">
                    <MarkerForm
                        onSubmit={handleMarkerSubmit}
                        onCancel={() => {
                            setShowMarkerForm(false);
                            setSelectedPosition(null);
                        }}
                    />
                </div>
            )}
        </BaseKakaoMap>
    );
}