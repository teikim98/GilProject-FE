export interface MarkerData {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  content: string;
  image?: string;
}

export type NavigationState =
  | "isRecording"
  | "isEditing"
  | "isWriting"
  | "isSaving"
  | "none";

export interface OverlayProps {
  content: string;
  image?: string;
  markerId: string;
  position: { lat: number; lng: number };
  visible: boolean;
  onClose: () => void;
}

export interface BaseKakaoMapProps {
  center: Position;
  width?: string;
  height?: string;
  onClick?: (
    map: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent
  ) => void;
  children?: React.ReactNode;
}

export interface KakaoMapProps {
  isRecording?: boolean;
  isEditing?: boolean;
  width?: string;
  height?: string;
  initialPath?: Array<{ lat: number; lng: number }>;
  initialMarkers?: MarkerData[];
}

export interface SizeProps {
  width?: string;
  height?: string;
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
    recordedTime: number;
    distance: number;
  };
  createdAt: string;
}

export interface RouteCardProps {
  route: RouteData;
}

export interface PostImage {
  id: number;
  url: string;
  fileName?: string;
  order?: number; 
}

export interface Post {
  id: number;
  userNickName: string;
  pathId: number;
  startLat: number;
  startLong: number;
  state: number;
  title: string;
  content: string;
  tag: string;
  routeData: {
    path: Array<{
      lat: number;
      lng: number;
    }>;
    markers: Array<{
      id: string;
      position: {
        lat: number;
        lng: number;
      };
      content: string;
      image?: string;
    }>;
    recordedTime: number;
    distance: number;
  };
  images: {
    id: number;
    url: string;
  }[];
  createdAt?: string;
  updatedAt?: string;  // 필요한 경우
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tag: string;
  routeData: {
    path: Array<{
      lat: number;
      lng: number;
    }>;
    markers: Array<{
      id: string;
      position: {
        lat: number;
        lng: number;
      };
      content: string;
      image?: string;
    }>;
    recordedTime: number;
    distance: number;
  };
}
