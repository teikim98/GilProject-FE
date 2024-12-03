import { User, UserSimple } from "@/types/types";
import axios from "axios";
import { cookies } from "next/headers";
import { GetUserPostsResponse } from "@/types/types";
import { customInterceptors } from "./interceptors";

//유저(마이페이지) 관련 API///////////////

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/user`,
});

const getAuthToken = (): string | null => {
  return localStorage.getItem("access");
};

customInterceptors(api);
//프론트가 보낸 요청 인터셉터
// requestInterceptor(api);
// api.interceptors.request.use(
//   (config) => {
//     console.log("api.interceptors call");

//     const token = getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

//프론트가 받은 응답 인터셉터
// responseInterceptor(api);
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     //원래 요청
//     const originalRequest = error.config;
//     console.log("원래 요청" + originalRequest);
//     console.log(originalRequest);

//     // 900에러 처리
//     if (error.response && error.response.status === 900) {
//       console.log("access 토큰이 만료되거나 정상이 아님");
//       const errorMessage = error.response.data;
//       console.log("백엔드에서 온 에러 메세지 : " + errorMessage);

//       try {
//         const reissueResponse = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/reissue`,
//           null,
//           {
//             withCredentials: true, // 쿠키 포함
//           }
//         );

//         //새로운 토큰을 헤더에서 찾음
//         const newAccessToken =
//           reissueResponse.headers["newaccess"].split("Bearer ")[1];

//         //새로운 토큰을 로컬스토리지에 저장
//         if (newAccessToken) {
//           localStorage.setItem("access", newAccessToken);
//           console.log("새로운 access 토큰 스토리지에 저장됨!");

//           // 원래 요청 재시도
//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

//           return api(originalRequest);
//         }
//       } catch (reissueError) {
//         console.error("Token reissue failed:", reissueError);

//         localStorage.removeItem("access");
//         localStorage.removeItem("address-popup");
//         //쿠키에 있는 refresh 토큰 삭제? -> 안해도됨 어차피 로그인하면 다시 저장됨
//         window.location.href = "/auth/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

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
    const updatedUser = await getDetailProfile();

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  // 2. 서버 측 로그아웃 요청 (Refresh 토큰 전송)
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      {}, // 요청 바디는 비워둠
      {
        withCredentials: true, // 쿠키 포함
      }
    );
    localStorage.removeItem("access");
    localStorage.removeItem("address-popup");
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }

  window.location.href = "/auth/login";
  console.log("로그아웃 성공");
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
