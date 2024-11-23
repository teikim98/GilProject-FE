import { KakaoPosition, RouteCoordinate } from "@/types/types";
import { Polyline } from "react-kakao-maps-sdk";

interface RoutePolylineProps {
    path: KakaoPosition[] | RouteCoordinate[];
    isRecording?: boolean;
    isCompleted?: boolean;
    strokeColor?: string;
    strokeOpacity?: number;
}

export function RoutePolyline({
    path,
    isRecording,
    isCompleted,
    strokeColor,
    strokeOpacity = 0.7
}: RoutePolylineProps) {
    // RouteCoordinate를 KakaoPosition으로 변환하는 함수
    const convertToKakaoPath = (path: KakaoPosition[] | RouteCoordinate[]): KakaoPosition[] => {
        // 첫 번째 아이템을 확인하여 타입 체크
        if (path.length === 0) return [];

        if ('latitude' in path[0]) {
            // RouteCoordinate 배열인 경우
            return (path as RouteCoordinate[]).map(coord => ({
                lat: parseFloat(coord.latitude),
                lng: parseFloat(coord.longitude)
            }));
        }
        // 이미 KakaoPosition 배열인 경우
        return path as KakaoPosition[];
    };

    const getStrokeColor = () => {
        if (isRecording) return '#FF0000';
        if (strokeColor) return strokeColor;
        if (isCompleted) return '#00FF00';
        return '#0000FF';
    };

    return (
        <Polyline
            path={convertToKakaoPath(path)}
            strokeWeight={5}
            strokeColor={getStrokeColor()}
            strokeOpacity={strokeOpacity}
            strokeStyle={'solid'}
        />
    );
}