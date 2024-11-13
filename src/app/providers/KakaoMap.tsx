
'use client'

import { Map, MapMarker, Polyline, CustomOverlayMap } from 'react-kakao-maps-sdk'
import { Button } from '@/components/ui/button'
import { MapPin, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import MarkerForm from '../../components/MarkerForm'
import { MarkerData } from '../../types/types'
import { useRecordStore } from '@/store/useRecordStore'


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
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
    const [showMarkerForm, setShowMarkerForm] = useState(false)
    const [center, setCenter] = useState<Position>({ lat: 37.5665, lng: 126.9780 })
    const [visibleOverlays, setVisibleOverlays] = useState<Set<string>>(new Set())
    const watchIdRef = useRef<number | null>(null)
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    // Zustand store에서 필요한 상태와 액션들을 가져옴
    const {
        pathPositions,
        markers,
        addPathPosition,
        addMarker,
        loadSavedPath
    } = useRecordStore()

    // 초기 위치 설정
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

    // 경로 기록 처리
    useEffect(() => {
        if (isRecording) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                    addPathPosition(newPosition)  // store의 액션 사용
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
            }
        }
    }, [isRecording, addPathPosition])

    // 편집 모드일 때 저장된 경로 불러오기
    useEffect(() => {
        if (isEditing) {
            loadSavedPath()  // store의 액션 사용
            if (pathPositions.length > 0) {
                setCenter(pathPositions[0])
            }
        }
    }, [isEditing, loadSavedPath])

    const handleMapClick = (_map: any, mouseEvent: any) => {
        if (isEditing) {
            setSelectedPosition({
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
            })
            setShowMarkerForm(true)
        }
    }

    const toggleOverlay = (markerId: string) => {
        setVisibleOverlays(prev => {
            const next = new Set(prev)
            if (next.has(markerId)) {
                next.delete(markerId)
            } else {
                next.add(markerId)
            }
            return next
        })
    }

    const handleAddCurrentLocationMarker = () => {
        if (navigator.geolocation) {
            setIsGettingLocation(true); // 위치 가져오기 시작
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSelectedPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setShowMarkerForm(true);
                    setIsGettingLocation(false); // 위치 가져오기 완료
                },
                (error) => {
                    console.error("Error getting current location:", error);
                    alert("현재 위치를 가져올 수 없습니다.");
                    setIsGettingLocation(false); // 에러 발생시에도 상태 리셋
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000, // 5초 제한
                    maximumAge: 0
                }
            );
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
            addMarker(newMarker)  // store의 액션 사용
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
                            visible={visibleOverlays.has(marker.id)}
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
                        className={`flex items-center gap-2 bg-white shadow-md ${isGettingLocation ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        onClick={handleAddCurrentLocationMarker}
                        disabled={isGettingLocation}
                    >
                        {isGettingLocation ? (
                            <>
                                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                위치 확인 중...
                            </>
                        ) : (
                            <>
                                <MapPin className="w-4 h-4" />
                                핀 찍기
                            </>
                        )}
                    </Button>
                </div>
            )}

            {showMarkerForm && selectedPosition && (isEditing || isRecording) && (
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
