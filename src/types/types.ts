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
  onSelect?: (route: RouteData) => void;
  isWriteMode?: boolean;
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
  writeDate: string; // 작성일
  updateDate: string; // 수정일
  readNum: number; // 조회수
  postLikesUsers: number[]; // 좋아요한 유저 ID 배열
  postLikesNum: number; // 좋아요 수
  repliesUsers: number[]; // 댓글 작성한 유저 ID 배열
  repliesNum: number; // 댓글 수
  postWishListsUsers: number[]; // 찜한 유저 ID 배열
  postWishListsNum: number; // 찜 수
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
  images?: string[];
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

export interface User {
  id: number;
  platform: number;
  name: string;
  nickName: string;
  imageUrl: string;
  password: string;
  email: string | null;
  comment: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  joinDate: string;
  updateDate: string;
  point: number;
  state: number;
  posts: any[] | null;
  paths: any[] | null;
  postLikes: any[] | null;
  subscriptions: any[] | null;
  notifications: any[] | null;
  postWishLists: any[] | null;
  replyLikes: any[] | null;
}

interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

interface Pin {
  id: number;
  imageUrl: string;
  content: string;
  latitude: number;
  longitude: number;
}

interface RouteUser {
  id: number;
}

export interface RouteTest {
  id: number;
  user: RouteUser;
  content: string;
  state: number;
  title: string;
  time: number;
  distance: number;
  startLat: number;
  startLong: number;
  startAddr: string;
  routeCoordinates: RouteCoordinate[];
  pins: Pin[];
}
