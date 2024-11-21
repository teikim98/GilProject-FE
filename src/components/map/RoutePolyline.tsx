import { Position } from "@/types/types";
import { Polyline } from "react-kakao-maps-sdk";

interface RoutePolylineProps {
    path: Position[];
    isRecording?: boolean;
    isCompleted?: boolean;  // 완료된 경로 여부 추가
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
    const getStrokeColor = () => {
        if (isRecording) return '#FF0000';  // 녹화 중일 때는 빨간색
        if (strokeColor) return strokeColor; // 명시적으로 색상이 지정된 경우
        if (isCompleted) return '#00FF00';  // 완료된 경로는 초록색
        return '#0000FF';                   // 기본 색상 파란색
    };

    return (
        <Polyline
            path={path}
            strokeWeight={5}
            strokeColor={getStrokeColor()}
            strokeOpacity={strokeOpacity}
            strokeStyle={'solid'}
        />
    );
}