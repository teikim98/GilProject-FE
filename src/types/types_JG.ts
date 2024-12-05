export interface UserResDTO {
    id: number;
    // 필요한 사용자 정보 필드들
}

export interface CoordinateResDTO {
    latitude: string;
    longitude: string;
}

export interface PinResDTO {
    id: number;
    imageUrl: string; // 핀의 이미지 URL
    content: string;  // 핀의 내용
    latitude: number; // 위도
    longitude: number; // 경도
}

export interface Pin {
    id: number;
    imageUrl: string;
    content: string;
    latitude: string;
    longitude: string;
}

export interface PathResDTO {
    id: number;
    user: UserResDTO;
    content: string;
    state: number;
    title: string;
    time: number;
    createDate: string;  // LocalDateTime은 문자열로 받습니다
    distance: number;
    startLat: number;
    startLong: number;
    startAddr: string;
    routeCoordinates: CoordinateResDTO[];
    pins: PinResDTO[];
}

export interface PostResDTO {
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
    pathResDTO: PathResDTO;
    imageUrls: string[];
    isWishListed: boolean;
    liked: boolean;
}

