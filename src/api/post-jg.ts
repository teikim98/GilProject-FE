import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

const getAuthToken = (): string | null => {
    return localStorage.getItem("access");
};

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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
    isLiked: boolean;
    isWishListed: boolean;
}



export const getPostsByNickName = async (nickName: string, page: number = 0, size: number = 10) => {
    try {
        const response = await api.get('/posts/nickName', {
            params: {
                nickName,
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};

export const getPostDetail = async (id: number): Promise<PostResDTO> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
};

// nickname으로 게시글 목록 가져오는 함수 추가
export const getPostsByNickName2 = async (nickName: string, page: number = 0, size: number = 10) => {
    try {
      const response = await api.get('/posts/nickName', {
        params: {
          nickName,
          page,
          size
        }
      });
      return response.data;  // Page<PostResDTO> 형태로 반환됨
    } catch (error) {
      console.error("Error fetching posts by nickname:", error);
      throw error;
    }
  };