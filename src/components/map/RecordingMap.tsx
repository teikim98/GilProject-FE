"use client"
import { useRecordStore } from "@/store/useRecordStore";
import { MarkerData, Position, SizeProps } from "@/types/types";
import { getCurrentPosition } from "@/util/getCurrentPosition";
import { LocationSmoother } from "@/util/locationSmoother";
import { useState, useEffect } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import MarkerForm from "./MarkerForm";
import { MarkerWithOverlay } from "./MarkerWithOverlay";
import { PinButton } from "./PinButtonProps";
import { RoutePolyline } from "./RoutePolyline";

export function RecordingMap({ width, height }: SizeProps) {
    const { pathPositions, markers, addPathPosition, addMarker } = useRecordStore();
    const [userPosition, setUserPosition] = useState<Position | null>(null);
    const [center, setCenter] = useState<Position>({ lat: 37.5665, lng: 126.9780 });
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [showMarkerForm, setShowMarkerForm] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) return;

        const locationSmoother = new LocationSmoother(20, 5, 3);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserPosition(newPosition);
                setCenter(newPosition);
            },
            (error) => console.error("Error getting initial location:", error)
        );

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setUserPosition(newPosition);

                const smoothedPosition = locationSmoother.smooth(
                    newPosition,
                    position.coords.accuracy
                );
                if (smoothedPosition) {
                    addPathPosition(smoothedPosition);
                    setCenter(smoothedPosition);
                }
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
    }, [addPathPosition]);

    const handleAddMarker = async () => {
        setIsGettingLocation(true);
        try {
            const position = await getCurrentPosition();
            setSelectedPosition(position);
            setShowMarkerForm(true);
        } catch (error) {
            alert("현재 위치를 가져올 수 없습니다.");
        } finally {
            setIsGettingLocation(false);
        }
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
        <BaseKakaoMap width={width} height={height} center={center}>
            {userPosition && <CurrentLocationMarker position={userPosition} />}
            {pathPositions.length > 0 && <RoutePolyline path={pathPositions} isRecording />}
            {markers.map(marker => (
                <MarkerWithOverlay
                    key={marker.id}
                    marker={marker}
                />
            ))}
            <PinButton onPinClick={handleAddMarker} isLoading={isGettingLocation} />
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
