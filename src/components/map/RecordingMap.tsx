import { useRecordStore } from "@/store/useRecordStore";
import { MarkerData, Position, SizeProps } from "@/types/types";
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
    const { pathPositions, markers, addPathPosition, addMarker } = useRecordStore();
    const [userPosition, setUserPosition] = useState<Position | null>(null);
    const [center, setCenter] = useState<Position>({ lat: 37.5665, lng: 126.9780 });
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [showMarkerForm, setShowMarkerForm] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const locationSmootherRef = useRef(new LocationSmoother(20, 5, 3));

    // 위치 처리 함수 분리
    const processNewPosition = (rawPosition: Position, accuracy?: number) => {
        const smoothedPosition = locationSmootherRef.current.smooth(rawPosition, accuracy);
        if (smoothedPosition) {
            setUserPosition(smoothedPosition);
            setCenter(smoothedPosition);
            addPathPosition(smoothedPosition);

            // Service Worker에 스무딩된 위치 전송
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'LOCATION_UPDATE',
                    data: {
                        ...smoothedPosition,
                        accuracy,
                        timestamp: Date.now()
                    }
                });
            }
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) return;

        // Service Worker 등록
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/worker/location-worker.js')
                .then(registration => {
                    console.log('Location worker registered');
                    registration.active?.postMessage({
                        type: 'START_RECORDING'
                    });
                })
                .catch(error => {
                    console.error('Location worker registration failed:', error);
                });

            // 백그라운드 위치 업데이트 수신
            const messageHandler = (event: MessageEvent) => {
                if (event.data.type === 'BACKGROUND_UPDATE' &&
                    event.data.trackingType === 'RECORDING') {
                    const { position, accuracy } = event.data.location;
                    processNewPosition(position, accuracy);
                } else if (event.data.type === 'RECORDING_LOCATIONS') {
                    // 백그라운드에서 수집된 위치들 처리
                    event.data.locations.forEach((loc: any) => {
                        processNewPosition(loc.position, loc.accuracy);
                    });
                }
            };

            navigator.serviceWorker.addEventListener('message', messageHandler);

            // 위치 감시 설정
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
                navigator.serviceWorker.removeEventListener('message', messageHandler);
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'STOP_TRACKING'
                    });
                }
            };
        }
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