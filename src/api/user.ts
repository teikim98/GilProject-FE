import { useUserStore } from "@/store/useUserStore";
import { User, UserSimple } from "@/types/types";
import axios from "axios";

//유저(마이페이지) 관련 API///////////////

const api = axios.create({
  baseURL: "http://localhost:8080/user",
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

// 심플 프로필 정보 조회
export const getSimpleProfile = async (userId: number): Promise<UserSimple> => {
  try {
    const response = await api.get(`/simpleInfo/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 전체 프로필 정보 조회 (마이페이지용)
export const getDetailProfile = async (userId: number): Promise<User> => {
  try {
    const response = await api.get(`/mypage/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 프로필 정보 수정
export const updateProfile = async (
  userId: number,
  userData: Partial<User>
) => {
  try {
    const response = await api.put(`/mypage/update/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 프로필 업데이트 후 전체 정보를 다시 가져와서 store 업데이트
    const updatedUser = await getDetailProfile(userId);
    useUserStore.getState().setUser(updatedUser);

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// 주소 업데이트
export const updateAddress = async (
  userId: number,
  address: string,
  latitude: number,
  longitude: number
) => {
  try {
    const response = await api.put(
      `/mypage/address/${userId}`,
      {
        address,
        latitude,
        longitude,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 주소 업데이트 후 전체 정보를 다시 가져와서 store 업데이트
    const updatedUser = await getDetailProfile(userId);
    useUserStore.getState().setUser(updatedUser);

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// 프로필 이미지 업로드
export const updateProfileImage = async (userId: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/mypage/profile/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 이미지 업로드 후 전체 정보를 다시 가져와서 store 업데이트
    const updatedUser = await getDetailProfile(userId);
    useUserStore.getState().setUser(updatedUser);

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  useUserStore.getState().clearUser();
};
