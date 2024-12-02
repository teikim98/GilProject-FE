import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

const getAuthToken = (): string | null => {
    const token = localStorage.getItem("access");
    console.log('Current Token:', token); // 토큰 확인용
    return token;
};

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request Headers:', config.headers); // 요청 헤더 확인용
        } else {
            console.log('No token found!'); // 토큰이 없는 경우
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface UserSimpleResDTO {
    id: number;
    nickName: string;
    imageUrl: string;
    comment: string;
}

//내 구독자 리스트 보기
export const getMySubscribes = async (): Promise<UserSimpleResDTO[]> => {
    try {
        const response = await api.get<UserSimpleResDTO[]>('/user/mypage/subscribe');
        if (response.status === 200 && Array.isArray(response.data)) {
            return response.data;
        }
        console.log('Unexpected response:', response.data);
        return [];
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        throw error;
    }
};

//내가 구독한 리스트에서 구독 해지하기
export const unsubscribeUser = async (subscribeUserId: number): Promise<void> => {
    try {
        await api.delete(`/subscribe/${subscribeUserId}`);
    } catch (error) {
        console.error("Error unsubscribing user:", error);
        throw error;
    }
};