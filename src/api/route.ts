import { useUserStore } from "./../store/useUserStore";
import axios from "axios";
import { Post, Path, CreatePostPath } from "@/types/types";

// 단일 axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 토큰 가져오는 함수
const getAuthToken = (): string | null => {
  return localStorage.getItem("access");
};

// 인터셉터 설정
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

// 현재 로그인한 사용자의 경로 가져오기
export const getAllUserPaths = async (userId: number): Promise<Path[]> => {
  try {
    // 요청 전에 토큰 존재 여부 확인
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const { data } = await api.get(`user/mypage/mypath/${userId}`);
    console.log("API Response:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching user paths:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    }
    throw new Error(error.message || "Failed to fetch user paths");
  }
};

// 경로 삭제하기
export const deletePath = async (pathId: number): Promise<void> => {
  try {
    await api.patch(`/path/${pathId}`, { state: 1 });
  } catch (error) {
    console.error("Error deleting path:", error);
    throw new Error("Failed to delete path");
  }
};

// 모든 API 요청에서 api 인스턴스 사용
export const getRouteById = async (id: number): Promise<Post> => {
  try {
    const response = await api.get(`${id}`); // baseURL이 이미 포함되어 있으므로 path/ 제거
    return response.data;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw new Error("Failed to fetch route");
  }
};

export const createPath = async (
  requestBody: CreatePostPath
): Promise<CreatePostPath> => {
  try {
    const response = await api.post("/path/", requestBody);
    return response.data;
  } catch (error) {
    console.error("Error creating path:", error);
    throw new Error("Failed to create path");
  }
};

export const getPathById = async (id: number = 30): Promise<Path> => {
  try {
    const response = await api.get(`${id}`); // baseURL이 이미 포함되어 있으므로 /path/ 제거
    return response.data;
  } catch (error) {
    console.error("Error fetching path:", error);
    throw new Error("Failed to fetch path");
  }
};
