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
  };
  recordedTime: number;
  createdAt: string;
}

export interface RouteCardProps {
  route: RouteData;
}

export interface Post {
  id: number; // 글 ID
  title: string; // 글 제목
  routeData: {
    path: Array<{
      // 경로 좌표들
      lat: number;
      lng: number;
    }>;
    markers: Array<{
      // 경로 상의 마커들
      id: string;
      position: {
        lat: number;
        lng: number;
      };
      content: string; // 마커 설명
      image?: string; // 마커에 첨부된 이미지
    }>;
    recordedTime: number; // 소요 시간(분)
    distance: number; // 총 거리(km)
    startAddress: string; // 출발지 주소
    startLocation: {
      // 출발지 좌표
      lat: number;
      lng: number;
    };
  };
  author: {
    id: number; // 작성자 ID
    name: string; // 작성자 이름
    profileImage: string; // 프로필 이미지 URL
  };
  stats: {
    commentCount: number; // 댓글 수
    likeCount: number; // 추천 수
    distanceFromUser?: number; // 사용자와의 거리 (km) - 클라이언트에서 계산
  };
  createdAt: string; // 작성 시간 ISO 문자열
}
