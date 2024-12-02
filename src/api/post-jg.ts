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

export interface PostResDTO {
    postId: number;
    title: string;
    content: string;
    // 필요한 다른 필드들 추가
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