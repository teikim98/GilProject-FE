// 기본 위치 타입
export interface RouteCoordinate {
  latitude: string;
  longitude: string;
}

export interface KakaoPosition {
  lat: number;
  lng: number;
}

// 마커/핀 통합 타입
export interface Pin {
  id: number;
  imageUrl: string | null;
  content: string;
  latitude: number;
  longitude: number;
}

export interface PathUser {
  id: number;
}

// 경로 데이터 통합
export interface Path {
  id: number;
  user: PathUser;
  content: string;
  state: number;
  title: string;
  time: number;
  createdDate: string;
  distance: number;
  startLat: number;
  startLong: number;
  startAddr: string | null;
  routeCoordinates: RouteCoordinate[];
  pins: Pin[];
}

export type PathsResponse = Path[];

// 게시글 타입
export interface Post {
  postId: number;
  nickName: string;
  pathId: number;
  startLat: number;
  startLong: number;
  state: number;
  title: string;
  content: string;
  tag: string;
  writeDate: string;
  updateDate: string;
  readNum: number;
  likesCount: number;
  repliesCount: number;
  postWishListsNum: number;
  userImgUrl: string;
  pathResDTO: Path;
  imageUrls: string[];
  liked: boolean;
  wishListed: boolean;
}

// 카카오맵 관련 타입들
export interface BaseKakaoMapProps {
  center: {
    // RouteCoordinate를 카카오맵 Position으로 변환해서 사용
    lat: number;
    lng: number;
  };
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
  initialPath?: RouteCoordinate[];
  initialPins?: Pin[];
}

export interface OverlayProps {
  content: string;
  imageUrl?: string | null;
  pinId: number;
  position: RouteCoordinate;
  visible: boolean;
  onClose: () => void;
}

export interface MarkerForOverlay {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  content: string;
  imageUrl?: string | null; // null도 허용하도록 변경
}

export interface SizeProps {
  width?: string;
  height?: string;
}

export type NavigationState =
  | "isRecording"
  | "isEditing"
  | "isWriting"
  | "isSaving"
  | "none";

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
  posts: Post[] | null;
  paths: Path[] | null;
  postLikes: number[] | null;
  subscriptions: number[] | null;
  notifications: any[] | null;
  postWishLists: number[] | null;
  replyLikes: number[] | null;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tag: string;
  pathId: number;
}

export interface CreatePostFormData {
  postCreateRequest: string;
  images: File[];
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  tag: string;
  deleteUrls: string[]; // 삭제할 이미지 URL 배열
}

export interface UpdatePostFormData {
  postUpdateRequest: string; // JSON.stringify(UpdatePostRequest)
  images: File[]; // 새로 추가할 이미지 파일들
}

// 사용 예시를 위한 타입
export interface PostAPI {
  // 게시글 생성
  createPost: (data: CreatePostRequest, images?: File[]) => Promise<Post>;
  // 게시글 수정
  updatePost: (
    postId: number,
    data: UpdatePostRequest,
    images?: File[]
  ) => Promise<Post>;
}