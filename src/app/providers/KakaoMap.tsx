"use client";

import {
  Map,
  MapMarker,
  Polyline,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  MarkerData,
  OverlayProps,
  KakaoMapProps,
  Position,
} from "../../types/types";
import { useRecordStore } from "@/store/useRecordStore";
import { LocationSmoother } from "@/util/locationSmoother";
import { createPinMarker } from "@/components/map/CustomMarkerIcon";
import MarkerForm from "@/components/map/MarkerForm";

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

const MarkerOverlay = ({
  content,
  image,
  position,
  visible,
  onClose,
}: OverlayProps) => {
  if (!visible) return null;

  return (
    <CustomOverlayMap position={position} yAnchor={1.2} clickable={true}>
      <div
        className="relative bottom-12 -left-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg min-w-[200px] max-w-[300px]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800" />
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
          <div className="mb-2 pr-6" onClick={(e) => e.stopPropagation()}>
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
  );
};

export default function KakaoMap({
  isRecording = false,
  isEditing = false,
  width = "w-full",
  height = "h-72",
  initialPath = [],
  initialMarkers = [],
}: KakaoMapProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [showMarkerForm, setShowMarkerForm] = useState(false);
  const [center, setCenter] = useState<Position>({
    lat: 37.5665,
    lng: 126.978,
  });
  const [visibleOverlays, setVisibleOverlays] = useState<Set<string>>(
    new Set()
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  // const [locationSmoother] = useState(() => new LocationSmoother());

  // Zustand
  const { pathPositions, markers, addPathPosition, addMarker, loadSavedPath } =
    useRecordStore();

  // 초기 위치 설정
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  //현재위치 추적 및 경로 기록
  useEffect(() => {
    if (!navigator.geolocation) return;

    const locationSmoother = new LocationSmoother(20, 5, 3);

    // 초기 위치 한 번 가져오기
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

    // 위치 추적 통합
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // 현재 위치 업데이트
        setUserPosition(newPosition);

        // 기록 중일 때만 경로에 추가
        if (isRecording) {
          const smoothedPosition = locationSmoother.smooth(
            newPosition,
            position.coords.accuracy
          );
          if (smoothedPosition) {
            addPathPosition(smoothedPosition);
            setCenter(smoothedPosition);
          }
        }
      },
      (error) => console.error("Error watching location:", error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isRecording, addPathPosition]);

  // 편집 모드일 때 저장된 경로 불러오기
  useEffect(() => {
    if (isEditing) {
      loadSavedPath(); // store의 액션 사용
      if (pathPositions.length > 0) {
        setCenter(pathPositions[0]);
      }
    }
  }, [isEditing, loadSavedPath]);

  // 초기 경로가 있을 경우 중앙 위치 설정
  useEffect(() => {
    if (initialPath.length > 0) {
      setCenter(initialPath[0]);
    }
  }, [initialPath]);

  //맵 클릭 허용 설정
  const handleMapClick = (
    _map: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent
  ) => {
    if (isEditing) {
      setSelectedPosition({
        lat: mouseEvent.latLng.getLat(),
        lng: mouseEvent.latLng.getLng(),
      });
      setShowMarkerForm(true);
    }
  };

  //저장된 마커 팝업 토글
  const toggleOverlay = (markerId: string) => {
    setVisibleOverlays((prev) => {
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
          maximumAge: 0,
        }
      );
    }
  };

  const handleMarkerSubmit = (content: string, image: string) => {
    if (selectedPosition) {
      const newMarker: MarkerData = {
        position: selectedPosition,
        content,
        image,
        id: `marker-${Date.now()}`,
      };
      addMarker(newMarker); // store의 액션 사용
    }
    setShowMarkerForm(false);
    setSelectedPosition(null);
  };

  const markerIcon = createPinMarker();

  return (
    <div className={`relative ${width} ${height}`}>
      <Map
        center={center}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "100px",
          zIndex: "0",
        }}
        level={3}
        onClick={handleMapClick}
        className="rounded-lg"
      >
        {markers.map((marker) => (
          <div key={marker.id}>
            <MapMarker
              position={marker.position}
              onClick={() => {
                toggleOverlay(marker.id);
              }}
              image={{
                src: markerIcon,
                size: {
                  width: 24,
                  height: 28,
                },
                options: {
                  offset: {
                    x: 20,
                    y: 48,
                  },
                },
              }}
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

        {/* 초기 경로 표시 */}
        {initialPath.length > 0 && (
          <Polyline
            path={initialPath}
            strokeWeight={5}
            strokeColor="#0000FF"
            strokeOpacity={0.7}
            strokeStyle={"solid"}
          />
        )}

        {/* 초기 마커 표시 */}
        {initialMarkers.map((marker) => (
          <div key={marker.id}>
            <MapMarker
              draggable={true}
              position={marker.position}
              onClick={() => {
                toggleOverlay(marker.id);
              }}
              image={{
                src: markerIcon,
                size: {
                  width: 24,
                  height: 28,
                },
                options: {
                  offset: {
                    x: 20,
                    y: 48,
                  },
                },
              }}
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
            strokeColor={isRecording ? "#FF0000" : "#0000FF"}
            strokeOpacity={0.7}
            strokeStyle={"solid"}
          />
        )}
        {userPosition && (
          <>
            <CustomOverlayMap position={userPosition} yAnchor={1}>
              <div className="relative">
                {/* 파란 점 */}
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                {/* 펄스 효과 */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
              </div>
            </CustomOverlayMap>
          </>
        )}
      </Map>

      {isRecording && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            className={`flex items-center gap-2 bg-white shadow-md ${
              isGettingLocation ? "opacity-75 cursor-not-allowed" : ""
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
                <MapPin className="w-4 h-4" />핀 찍기
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
              setShowMarkerForm(false);
              setSelectedPosition(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
