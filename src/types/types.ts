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
  postUserId: number;
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
  postCount: number;
  pathCount: number;
  subscribeByCount: number;
}

// 심플 유저 정보
export interface UserSimple {
  id: number;
  nickName: string;
  imageUrl: string;
  comment: string | null;
  address: string | null;
  postCount: number;
  pathCount: number;
  subscribeByCount: number;
}

export interface UserUpdateDTO {
  nickname?: string;
  email?: string;
  introduction?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tag: string;
  pathId: number;
}

export interface CreatePostPath {
  content: string; // 경로 설명
  title: string; // 경로 제목
  time: number; // 소요 시간 (분 단위)
  distance: number; // 거리 (km 단위)
  startLat: number; // 시작점 위도
  startLong: number; // 시작점 경도
  startAddr: string | null; // 시작 주소
  routeCoordinates: RouteCoordinate[]; // 경로 좌표 배열
  pins: {
    id?: number; // 핀 ID (선택)
    content: string; // 핀 설명
    latitude: number; // 핀 위도
    longitude: number; // 핀 경도
    imageUrl?: string | null; // Base64 이미지 또는 null
  }[]; //
}

export interface Comment {
  id: number;
  replyUserId: number;
  userNickName: string;
  profileImage: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
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

export interface NotificationData {
  id: number;
  type: "POST_NOTIFY" | "COMMENT_NOTIFY"; // 백엔드의 실제 타입 값으로 수정
  userId: number;
  postId: number;
  userImageUrl: string;
  content: string;
  date: string;
  state: number;
}

export interface Notification {
  name: string;
  comment: string;
  data: NotificationData;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// 게시글 리스트 응답 타입
export type GetUserPostsResponse = PaginatedResponse<Post>;