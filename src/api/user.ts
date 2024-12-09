import { User, UserSimple } from "@/types/types";
import axios from "axios";
import { cookies } from "next/headers";
import { GetUserPostsResponse } from "@/types/types";
import { customInterceptors } from "./interceptors";

//유저(마이페이지) 관련 API///////////////

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/user`,
});

customInterceptors(api);

export const getSimpleProfile = async (userId: number): Promise<UserSimple> => {
  try {
    const response = await api.get(`/simpleInfo/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 전체 프로필 정보 조회 (마이페이지용)
export const getDetailProfile = async (): Promise<User> => {
  try {
    const response = await api.get(`/mypage`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 프로필 정보 수정
export const updateProfile = async (userData: Partial<User>) => {
  try {
    const response = await api.put(`/mypage/update`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 프로필 업데이트 후 전체 정보를 다시 가져와서 store 업데이트
    const updatedUser = await getDetailProfile();

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// 주소 업데이트
export const updateAddress = async (
  address: string,
  latitude: number,
  longitude: number
) => {
  try {
    const response = await api.put(
      `/mypage/address`,
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
    // 주소 업데이트 후 전체 정보를 다시 가져와서  업데이트
    const updatedUser = await getDetailProfile();

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// 프로필 이미지 수정
export const updateProfileImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/mypage/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserPoints = async (pathId: number) => {
  try {
    console.log(pathId);
    await api.put(`/point/${pathId}`);
  } catch (error) {
    console.error("포인트 업데이트 실패:", error);
    throw error;
  }
};
//현재 로그인한 사용자가 작성한 산책길 가져오기
export const getUserPosts = async (
  page = 0,
  size = 10
): Promise<GetUserPostsResponse> => {
  try {
    const response = await api.get<GetUserPostsResponse>("/mypage/myPost", {
      params: { page, size },
    });
    return response.data;
  } catch (error: any) {
    console.error("getUserPosts 실패:", error);
    throw error;
  }
};

// 현재 로그인한 사용자가 찜한 산책길 가져오기
export const getUserPostWishlist = async (
  page = 0,
  size = 10
): Promise<GetUserPostsResponse> => {
  try {
    const response = await api.get<GetUserPostsResponse>(
      "/mypage/postWishlist",
      {
        params: { page, size },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("getUserPostWishlist 실패:", error);
    throw error;
  }
};

/**
 * 비밀번호 변경
 */
export const changePassword = async (password: string, newPassword: string) => {
  try {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("newPassword", newPassword);

    const response = await api.put("/mypage/update/pwd", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 닉네임 변경
 */
export const changeNickname = async (nickName: string | undefined) => {
  try {
    const formData = new FormData();
    if (nickName) formData.append("nickName", nickName);

    const response = await api.put("/mypage/update/nickname", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 자기소개글 변경
 */
export const changeComment = async (
  comment: string | null
): Promise<number> => {
  try {
    const response = await api.put(`/mypage/update/comment/${comment}`);
    // console.log("여기는 제대로 된거");
    console.log(response.data);
    return response.data;
  } catch (error) {
    // console.log("여기는 에러");
    throw error;
  }
};
