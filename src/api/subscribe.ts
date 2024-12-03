import axios from "axios";
import { customInterceptors } from "./interceptors";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

// const getAuthToken = (): string | null => {
//     const token = localStorage.getItem("access");
//     console.log('Current Token:', token); // 토큰 확인용
//     return token;
// };

customInterceptors(api);
// api.interceptors.request.use(
//     (config) => {
//         const token = getAuthToken();
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//             console.log('Request Headers:', config.headers); // 요청 헤더 확인용
//         } else {
//             console.log('No token found!'); // 토큰이 없는 경우
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

interface UserSimpleResDTO {
  id: number;
  nickName: string;
  imageUrl: string;
  comment: string;
}

//내 구독자 리스트 보기
export const getMySubscribes = async (): Promise<UserSimpleResDTO[]> => {
  try {
    const response = await axios.get<UserSimpleResDTO[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/user/mypage/subscribe`
    );
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data;
    }
    console.log("Unexpected response:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    throw error;
  }
};

export const subscribeUser = async (userId: number): Promise<number> => {
  try {
    const response = await api.post(`/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unsubscribeUser = async (
  subscribeUserId: number
): Promise<void> => {
  try {
    await api.delete(`/${subscribeUserId}`);
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    throw error;
  }
};
