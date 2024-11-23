"use client"
import { useRecordStore } from "@/store/useRecordStore";
import { Pin, RouteCoordinate, KakaoPosition, MarkerForOverlay } from "@/types/types";
import { useState } from "react";
import { BaseKakaoMap } from "./BaseKakaoMap";
import MarkerForm from "./MarkerForm";
import { MarkerWithOverlay } from "./MarkerWithOverlay";
import { RoutePolyline } from "./RoutePolyline";

interface EditingMapProps {
    initialPath: RouteCoordinate[];
    initialPins: Pin[];
    width?: string;
    height?: string;
}


export function EditingMap({ initialPath, initialPins, width, height }: EditingMapProps) {
    // RouteCoordinate를 KakaoPosition으로 변환
    const initialCenter = initialPath[0] ? {
        lat: parseFloat(initialPath[0].latitude),
        lng: parseFloat(initialPath[0].longitude)
    } : { lat: 37.5665, lng: 126.9780 };

    const convertPinToMarker = (pin: Pin): MarkerForOverlay => ({
        id: pin.id.toString(),
        position: {
            lat: pin.latitude,
            lng: pin.longitude
        },
        content: pin.content,
        imageUrl: pin.imageUrl
    });


    const [center] = useState<KakaoPosition>(initialCenter);
    const { pins, addPin } = useRecordStore();
    const [selectedPosition, setSelectedPosition] = useState<KakaoPosition | null>(null);
    const [showMarkerForm, setShowMarkerForm] = useState(false);


    const handleMapClick = (_map: kakao.maps.Map, e: kakao.maps.event.MouseEvent) => {
        setSelectedPosition({
            lat: e.latLng.getLat(),
            lng: e.latLng.getLng(),
        });
        setShowMarkerForm(true);
    };


    const handleMarkerSubmit = (content: string, imageUrl: string) => {
        if (selectedPosition) {
            const newPin: Pin = {
                id: Date.now(),  // 임시 ID 생성
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

    return (
        <BaseKakaoMap width={width} height={height} center={center} onClick={handleMapClick}>
            <RoutePolyline
                path={initialPath.map(coord => ({
                    lat: parseFloat(coord.latitude),
                    lng: parseFloat(coord.longitude)
                }))}
            />
            {[...pins, ...initialPins].map(pin => (
                <MarkerWithOverlay
                    key={pin.id}
                    marker={convertPinToMarker(pin)}  // 직접 객체 리터럴 대신 변환 함수 사용
                />
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