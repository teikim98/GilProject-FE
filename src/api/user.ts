import axios from "axios";
import { User } from "@/types/types";
const api = axios.create({
  baseURL: "http://192.168.0.18:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUser = async (id: number = 14): Promise<User> => {
  try {
    console.log("유저 정보 요청 시작");
    const response = await api.get(`/user/mypage/${id}`);
    console.log("API 응답:", response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API 에러:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
    }
    throw error;
  }
};
