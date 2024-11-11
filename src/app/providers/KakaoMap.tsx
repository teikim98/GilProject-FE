"use client"

import { Card, CardContent } from '@/components/ui/card';
import MarkerForm from '../../components/MarkerForm';
import { MarkerData } from '../../types/types';
import React, { useEffect, useState, useRef } from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

declare global {
    interface Window {
        kakao: any;
    }
}

interface KakaoMapProps {
    isRecording?: boolean;
    isEditing?: boolean;
    mapId: string;
    width?: string  // Tailwind 클래스나 CSS 값
    height?: string // Tailwind 클래스나 CSS 값
}

const KakaoMap = ({ isRecording = false, isEditing = false, width = "w-full",
    height = "h-72", mapId }: KakaoMapProps) => {
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [showMarkerForm, setShowMarkerForm] = useState(false);
    const [polyline, setPolyline] = useState<any>(null);
    const [path, setPath] = useState<any[]>([]);
    const watchIdRef = useRef<number | null>(null);
    const overlaysRef = useRef<{ [key: string]: any }>({});
    const mapRef = useRef<any>(null);

    useEffect(() => {
        const loadKakaoMap = () => {
            const script = document.createElement('script');
            script.async = true;
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=17537963b86939d63c1e63916583d345&autoload=false`;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(function () {
                    const container = document.getElementById("map");
                    const options = {
                        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                        level: 3
                    };

                    const mapInstance = new window.kakao.maps.Map(container, options);
                    mapRef.current = mapInstance;
                    setMap(mapInstance);

                    // 현재 위치 가져오기
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                const locPosition = new window.kakao.maps.LatLng(lat, lon);
                                mapInstance.setCenter(locPosition);
                            },
                            (error) => {
                                console.error("Geolocation error:", error);
                            }
                        );
                    }

                    // 지도 클릭 이벤트
                    window.kakao.maps.event.addListener(mapInstance, 'click', (mouseEvent: any) => {
                        if (!isRecording) {
                            const latlng = mouseEvent.latLng;
                            setSelectedPosition({
                                lat: latlng.getLat(),
                                lng: latlng.getLng()
                            });
                            setShowMarkerForm(true);
                        }
                    });
                });
            };
        };

        loadKakaoMap();

        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (polyline) {
                polyline.setMap(null);
            }
        };
    }, []);

    useEffect(() => {
        if (isRecording && map) {
            console.log("녹화 시작");
            const newPolyline = new window.kakao.maps.Polyline({
                map: map,
                path: [],
                strokeWeight: 5,
                strokeColor: '#FF0000',
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });
            setPolyline(newPolyline);

            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    console.log("위치 업데이트:", position.coords); // 위치 데이터 확인
                    const { latitude, longitude } = position.coords;
                    const newPosition = new window.kakao.maps.LatLng(latitude, longitude);

                    setPath(prevPath => {
                        console.log("이전 경로:", prevPath); // 이전 경로 확인
                        const newPath = [...prevPath, newPosition];
                        console.log("새로운 경로:", newPath); // 새로운 경로 확인
                        newPolyline.setPath(newPath);
                        map.setCenter(newPosition);
                        return newPath;
                    });
                },
                (error) => {
                    console.error("위치 추적 오류:", error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: Infinity
                }
            );

            // cleanup 함수도 확인
            return () => {
                console.log("cleanup 실행");
                if (watchIdRef.current) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                    watchIdRef.current = null;
                }
            };
        } else if (!isRecording) {
            console.log("녹화 중지, 현재 path:", path);



            if (path.length > 0) {
                console.log("경로 데이터 존재, 저장 시작");
                const pathData = path.map(position => ({
                    latitude: position.getLat(),
                    longitude: position.getLng(),
                    timestamp: new Date().toISOString()
                }));

                const recordData = {
                    path: pathData,
                    markers: markers
                };

                console.log("저장할 데이터:", recordData);
                localStorage.setItem('savedPath', JSON.stringify(recordData));

                if (polyline) {
                    polyline.setMap(null);
                    setPolyline(null);
                }
                setPath([]);
            }
        }
    }, [isRecording, map]);

    // path 상태가 변경될 때마다 확인
    useEffect(() => {
        console.log("path 상태 변경:", path);
    }, [path]);

    useEffect(() => {
        if (isEditing && map) {
            loadSavedPath();
        }
    }, [isEditing, map]);

    const loadSavedPath = () => {
        const savedData = localStorage.getItem('savedPath');
        if (savedData && map) {
            const recordData = JSON.parse(savedData);
            const positions = recordData.path.map((coord: any) =>
                new window.kakao.maps.LatLng(coord.latitude, coord.longitude)
            );

            // 저장된 경로 그리기
            if (polyline) {
                polyline.setMap(null);
            }

            const newPolyline = new window.kakao.maps.Polyline({
                map: map,
                path: positions,
                strokeWeight: 5,
                strokeColor: '#0000FF',
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });

            setPolyline(newPolyline);

            // 저장된 마커들 다시 그리기
            if (recordData.markers && recordData.markers.length > 0) {
                recordData.markers.forEach((markerData: MarkerData) => {
                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: new window.kakao.maps.LatLng(
                            markerData.position.lat,
                            markerData.position.lng
                        )
                    });

                    const overlayContent = document.createElement('div');
                    overlayContent.id = `overlay-${markerData.id}`;
                    overlayContent.innerHTML = createSpeechBubbleContent(
                        markerData.content,
                        markerData.image,
                        markerData.id
                    );
                    overlayContent.style.display = 'block';

                    const customOverlay = new window.kakao.maps.CustomOverlay({
                        content: overlayContent,
                        map: map,
                        position: marker.getPosition(),
                        yAnchor: 1.2
                    });

                    overlaysRef.current[markerData.id] = customOverlay;

                    window.kakao.maps.event.addListener(marker, 'click', function () {
                        const overlay = document.getElementById(`overlay-${markerData.id}`);
                        if (overlay) {
                            overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
                        }
                    });
                });

                setMarkers(recordData.markers);
            }

            if (positions.length > 0) {
                map.setCenter(positions[0]);
            }
        }
    };

    const handleAddCurrentLocationMarker = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setSelectedPosition({ lat, lng });
                    setShowMarkerForm(true);
                },
                (error) => {
                    console.error("Error getting current location:", error);
                    alert("현재 위치를 가져올 수 없습니다.");
                }
            );
        }
    };

    const createSpeechBubbleContent = (content: string, image: string | undefined, markerId: string) => `
    <div class="relative bg-white rounded-lg shadow-lg" style="min-width: 200px; max-width: 300px;">
        <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
            style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white;">
        </div>
        <div class="relative p-4">
            <button class="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                onclick="document.getElementById('overlay-${markerId}').style.display='none';">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="mb-2 pr-6">${content}</div>
            ${image ? `<img src="${image}" alt="Marker image" class="w-[100px] h-[75px] overflow-hidden rounded"/>` : ''}
        </div>
    </div>
`;

    const handleMarkerSubmit = (content: string, image: string) => {
        if (selectedPosition && map) {
            const markerId = `marker-${Date.now()}`;
            const newMarker = {
                position: selectedPosition,
                content,
                image,
                id: markerId
            };

            setMarkers([...markers, newMarker]);

            const marker = new window.kakao.maps.Marker({
                map: map,
                position: new window.kakao.maps.LatLng(selectedPosition.lat, selectedPosition.lng)
            });

            const overlayContent = document.createElement('div');
            overlayContent.id = `overlay-${markerId}`;
            overlayContent.innerHTML = createSpeechBubbleContent(content, image, markerId);
            overlayContent.style.display = 'block';

            const customOverlay = new window.kakao.maps.CustomOverlay({
                content: overlayContent,
                map: map,
                position: marker.getPosition(),
                yAnchor: 1.2
            });

            overlaysRef.current[markerId] = customOverlay;

            window.kakao.maps.event.addListener(marker, 'click', function () {
                const overlay = document.getElementById(`overlay-${markerId}`);
                if (overlay) {
                    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
                }
            });
        }

        setShowMarkerForm(false);
        setSelectedPosition(null);
    };

    return (
        <div className="relative w-full h-[calc(100vh-16rem)]"> {/* 높이 수정 */}
            <div
                id="map"
                className="w-full h-full rounded-lg"
                style={{ minHeight: '100px' }} // 최소 높이 추가
            />
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
                            setShowMarkerForm(false);
                            setSelectedPosition(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default KakaoMap;