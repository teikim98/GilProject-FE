import { OverlayProps } from "@/types/types";
import { X } from "lucide-react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

export function MarkerOverlay({ content, imageUrl, pinId, position, visible, onClose }: OverlayProps) {
    if (!visible) return null;

    return (
        <CustomOverlayMap
            position={{  // position을 KakaoPosition 형식으로 사용
                lat: parseInt(position.latitude),  // RouteCoordinate -> KakaoPosition 변환
                lng: parseInt(position.longitude)
            }}
            yAnchor={1.2}
            clickable={true}
        >
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
                    <div
                        className="mb-2 pr-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {content}
                    </div>
                    {imageUrl && (
                        <img
                            src={imageUrl}
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