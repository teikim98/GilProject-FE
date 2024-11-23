import { KakaoPosition } from "@/types/types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

export function CurrentLocationMarker({ position }: { position: KakaoPosition }) {
    return (
        <CustomOverlayMap position={position} yAnchor={1}>
            <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
            </div>
        </CustomOverlayMap>
    );
}