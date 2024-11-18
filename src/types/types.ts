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

export interface Post {
  id: number; // 글 ID
  userNickName: string; // 작성자 닉네임
  pathId: number; // 경로 ID
  startLat: number; // 시작 위치 위도
  startLong: number; // 시작 위치 경도
  state: number; // 게시글 상태
  title: string; // 글 제목
  content: string; // 글 내용
  tag: string; // 태그
  writeDate: string; // 작성일
  updateDate: string; // 수정일
  readNum: number; // 조회수
  postLikesUsers: number[]; // 좋아요한 유저 ID 배열
  postLikesNum: number; // 좋아요 수
  repliesUsers: number[]; // 댓글 작성한 유저 ID 배열
  repliesNum: number; // 댓글 수
  postWishListsUsers: number[]; // 찜한 유저 ID 배열
  postWishListsNum: number; // 찜 수

  routeData?: {
    // 선택적으로 경로 데이터 포함
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

export interface CreatePostRequest {
  userNickName: string;
  pathId: number;
  startLat: number;
  startLong: number;
  state: number;
  title: string;
  content: string;
  tag: string;
  routeData?: {
    path: Array<{ lat: number; lng: number }>;
    markers: Array<{
      id: string;
      position: { lat: number; lng: number };
      content: string;
      image?: string;
    }>;
    recordedTime: number;
    distance: number;
  };
}
