export interface MarkerData {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  content: string;
  image?: string;
}

export interface OverlayProps {
  content: string;
  image?: string;
  markerId: string;
  position: { lat: number; lng: number };
  visible: boolean;
  onClose: () => void;
}

export interface KakaoMapProps {
  isRecording?: boolean;
  isEditing?: boolean;
  width?: string;
  height?: string;
  initialPath?: Array<{ lat: number; lng: number }>;
  initialMarkers?: MarkerData[];
}

export interface Position {
  lat: number;
  lng: number;
}

export interface RouteData {
  title: string;
  description: string;
  pathData: {
    path: Array<{ lat: number; lng: number }>;
    markers: MarkerData[];
  };
  recordedTime: number;
  createdAt: string;
}

export interface RouteCardProps {
  route: RouteData;
}
