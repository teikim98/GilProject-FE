import { useRecordStore } from "@/store/useRecordStore";
import { Pin, RouteCoordinate, KakaoPosition, SizeProps, MarkerForOverlay } from "@/types/types";
import { getCurrentPosition } from "@/util/getCurrentPosition";
import { LocationSmoother } from "@/util/locationSmoother";
import { useState, useEffect, useRef } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import MarkerForm from "./MarkerForm";
import { MarkerWithOverlay } from "./MarkerWithOverlay";
import { PinButton } from "./PinButtonProps";
import { RoutePolyline } from "./RoutePolyline";

export function RecordingMap({ width, height }: SizeProps) {
    const { pathPositions, pins, addPathPosition, addPin } = useRecordStore();
    const [userPosition, setUserPosition] = useState<KakaoPosition | null>(null);
    const [center, setCenter] = useState<KakaoPosition>({ lat: 37.5665, lng: 126.9780 });
    const [selectedPosition, setSelectedPosition] = useState<KakaoPosition | null>(null);
    const [showMarkerForm, setShowMarkerForm] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const locationSmootherRef = useRef(new LocationSmoother(20, 5, 3));

    const processNewPosition = (rawPosition: KakaoPosition, accuracy?: number) => {
        const smoothedPosition = locationSmootherRef.current.smooth(rawPosition, accuracy);
        if (smoothedPosition) {
            setUserPosition(smoothedPosition);
            setCenter(smoothedPosition);
            addPathPosition({
                latitude: smoothedPosition.lat.toString(),
                longitude: smoothedPosition.lng.toString()
            });
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                processNewPosition(newPosition, position.coords.accuracy);
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

    const handleMarkerSubmit = (content: string, imageUrl: string) => {
        if (selectedPosition) {
            const newPin: Pin = {
                id: Date.now(),
                latitude: selectedPosition.lat,
                longitude: selectedPosition.lng,
                content,
                imageUrl
            };
            addPin(newPin);
        }
        setShowMarkerForm(false);
        setSelectedPosition(null);
    };

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
            {userPosition && <CurrentLocationMarker position={userPosition} />}
            {pathPositions.length > 0 && (
                <RoutePolyline
                    path={pathPositions.map(coord => ({
                        lat: parseFloat(coord.latitude),
                        lng: parseFloat(coord.longitude)
                    }))}
                    isRecording
                />
            )}
            {pins.map(pin => (
                <MarkerWithOverlay
                    key={pin.id}
                    marker={convertPinToMarker(pin)}
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