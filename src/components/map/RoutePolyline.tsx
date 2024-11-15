import { Position } from "@/types/types";
import { Polyline } from "react-kakao-maps-sdk";

interface RoutePolylineProps {
    path: Position[];
    isRecording?: boolean;
}

export function RoutePolyline({ path, isRecording }: RoutePolylineProps) {
    return (
        <Polyline
            path={path}
            strokeWeight={5}
            strokeColor={isRecording ? '#FF0000' : '#0000FF'}
            strokeOpacity={0.7}
            strokeStyle={'solid'}
        />
    );
}