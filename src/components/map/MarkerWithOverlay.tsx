"use client"
import { useToast } from "@/hooks/use-toast";
import { Pin } from "@/types/types";
import { useState, useEffect, useRef } from "react";
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
    };
    currentPosition?: {
        lat: number;
        lng: number;
    } | null;
    onMarkerNearby?: () => void;
}

export function MarkerWithOverlay({ marker, currentPosition, onMarkerNearby }: MarkerWithOverlayProps) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const hasVibratedRef = useRef(false);
    const { toast } = useToast();


    const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }): number => {
        const R = 6371e3; // 지구의 반지름 (미터)
        const φ1 = pos1.lat * Math.PI / 180;
        const φ2 = pos2.lat * Math.PI / 180;
        const Δφ = (pos2.lat - pos1.lat) * Math.PI / 180;
        const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    // 현재 위치가 마커 근처인지 확인
    useEffect(() => {
        if (currentPosition) {
            const distance = calculateDistance(currentPosition, marker.position);
            if (distance <= 7) { // 7미터 이내
                setIsOverlayVisible(true);
                if (!hasVibratedRef.current) {
                    onMarkerNearby?.();
                    toast({
                        title: "새로운 마커 발견! 📍",
                        description: "주변에 새로운 마커가 있습니다. 마커를 클릭하여 내용을 확인해보세요.",
                        duration: 3000,
                    });
                    hasVibratedRef.current = true;
                }
            } else {
                hasVibratedRef.current = false;
            }
        }
    }, [currentPosition, marker.position, onMarkerNearby]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.marker-overlay') && isOverlayVisible) {
                setIsOverlayVisible(false);
            }
        };

        if (isOverlayVisible) {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOverlayVisible]);

    return (
        <>
            <CustomMarker
                position={marker.position}
                onClick={() => setIsOverlayVisible(!isOverlayVisible)}
            />
            <MarkerOverlay
                content={marker.content}
                imageUrl={marker.imageUrl}
                pinId={parseInt(marker.id)}
                position={{
                    latitude: marker.position.lat.toString(),
                    longitude: marker.position.lng.toString()
                }}
                onClose={() => setIsOverlayVisible(false)}
                visible={isOverlayVisible}
            />
        </>
    );
}