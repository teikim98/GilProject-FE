
'use client'

import { Map, MapMarker, Polyline, CustomOverlayMap } from 'react-kakao-maps-sdk'
import { Button } from '@/components/ui/button'
import { MapPin, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import MarkerForm from '../../components/MarkerForm'
import { MarkerData } from '../../types/types'

declare global {
    interface Window {
        kakao: any;
    }
}

interface OverlayProps {
    content: string;
    image?: string;
    markerId: string;
    position: { lat: number; lng: number };
    visible: boolean;
    onClose: () => void;
}

const MarkerOverlay = ({ content, image, markerId, position, visible, onClose }: OverlayProps) => {
    if (!visible) return null;

    return (
        <CustomOverlayMap
            position={position}
            yAnchor={1.2}
            clickable={true}
        >
            <div
                className="relative bg-white rounded-lg shadow-lg min-w-[200px] max-w-[300px]"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
                <div className="relative p-4">
                    <button
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        <X size={16} />
                    </button>
                    <div
                        className="mb-2 pr-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {content}
                    </div>
                    {image && (
                        <img
                            src={image}
                            alt="Marker image"
                            className="w-[100px] h-[75px] overflow-hidden rounded"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
            </div>
        </CustomOverlayMap>
    )
}

interface KakaoMapProps {
    isRecording?: boolean;
    isEditing?: boolean;
    mapId: string;
    width?: string;
    height?: string;
}

interface Position {
    lat: number;
    lng: number;
}

export default function KakaoMap({
    isRecording = false,
    isEditing = false,
    width = "w-full",
    height = "h-72",
}: KakaoMapProps) {
    const [markers, setMarkers] = useState<MarkerData[]>([])
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
    const [showMarkerForm, setShowMarkerForm] = useState(false)
    const [pathPositions, setPathPositions] = useState<Position[]>([])
    const watchIdRef = useRef<number | null>(null)
    const [center, setCenter] = useState<Position>({ lat: 37.5665, lng: 126.9780 })
    const [visibleOverlays, setVisibleOverlays] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
                (error) => {
                    console.error("Geolocation error:", error)
                }
            )
        }
    }, [])

    useEffect(() => {
        if (isRecording) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                    setPathPositions(prev => [...prev, newPosition])
                    setCenter(newPosition)
                },
                (error) => console.error("위치 추적 오류:", error),
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: Infinity
                }
            )
        }

        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current)
                if (pathPositions.length > 0) {
                    const recordData = {
                        path: pathPositions,
                        markers: markers
                    }
                    localStorage.setItem('savedPath', JSON.stringify(recordData))
                }
            }
        }
    }, [isRecording])

    useEffect(() => {
        if (isEditing) {
            const savedData = localStorage.getItem('savedPath')
            if (savedData) {
                const { path, markers: savedMarkers } = JSON.parse(savedData)
                setPathPositions(path)
                setMarkers(savedMarkers)
                if (path.length > 0) {
                    setCenter(path[0])
                }
            }
        }
    }, [isEditing])

    const handleMapClick = (_map: any, mouseEvent: any) => {
        if (!isRecording) {
            setSelectedPosition({
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
            })
            setShowMarkerForm(true)
        }
    }

    // 오버레이 표시/숨김 토글
    const toggleOverlay = (markerId: string) => {
        setVisibleOverlays(prev => {
            const next = new Set(prev);
            if (next.has(markerId)) {
                next.delete(markerId);
            } else {
                next.add(markerId);
            }
            return next;
        });
    };

    const handleAddCurrentLocationMarker = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSelectedPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                    setShowMarkerForm(true)
                },
                (error) => {
                    console.error("Error getting current location:", error)
                    alert("현재 위치를 가져올 수 없습니다.")
                }
            )
        }
    }

    const handleMarkerSubmit = (content: string, image: string) => {
        if (selectedPosition) {
            const newMarker: MarkerData = {
                position: selectedPosition,
                content,
                image,
                id: `marker-${Date.now()}`
            }
            setMarkers(prev => [...prev, newMarker])
        }
        setShowMarkerForm(false)
        setSelectedPosition(null)
    }

    return (
        <div className={`relative ${width} ${height}`}>
            <Map
                center={center}
                style={{ width: '100%', height: '100%', minHeight: '100px', zIndex: '0' }}
                level={3}
                onClick={handleMapClick}
                className="rounded-lg"
            >
                {markers.map((marker) => (
                    <div key={marker.id}>
                        <MapMarker
                            position={marker.position}
                            onClick={() => toggleOverlay(marker.id)}
                        />
                        <MarkerOverlay
                            content={marker.content}
                            image={marker.image}
                            markerId={marker.id}
                            position={marker.position}
                            onClose={() => toggleOverlay(marker.id)}
                            visible={visibleOverlays.has(marker.id)} // 수정된 부분
                        />
                    </div>
                ))}

                {pathPositions.length > 0 && (
                    <Polyline
                        path={pathPositions}
                        strokeWeight={5}
                        strokeColor={isRecording ? '#FF0000' : '#0000FF'}
                        strokeOpacity={0.7}
                        strokeStyle={'solid'}
                    />
                )}
            </Map>

            {isRecording && (
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2 bg-white shadow-md"
                        onClick={handleAddCurrentLocationMarker}
                    >
                        <MapPin className="w-4 h-4" />
                        핀 찍기
                    </Button>
                </div>
            )}

            {showMarkerForm && selectedPosition && (
                <div className="absolute bottom-4 left-4 z-10">
                    <MarkerForm
                        onSubmit={handleMarkerSubmit}
                        onCancel={() => {
                            setShowMarkerForm(false)
                            setSelectedPosition(null)
                        }}
                    />
                </div>
            )}
        </div>
    )
}
