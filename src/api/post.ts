import axios from "axios";
import { Post } from "@/types/types";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/posts`,
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

//집 주변 산책길 리트 가져오기
export const getPosts = async (
  page = 0,
  size = 10
): Promise<{ content: Post[]; totalElements: number }> => {
  const response = await api.get("/nearAddr", {
    params: { page, size },
  });
  return response.data;
};

//게시글 상세보기
export const getPost = async (id: number): Promise<Post> => {
  const response = await api.get(`/${id}`);

  return response.data;
};

//현재 위치 주변 산책길 가져오기
export const getPostNear = async (
  lat: number,
  lng: number,
  page = 0,
  size = 10
): Promise<{ content: Post[]; totalElements: number }> => {
  const response = await api.get(`/${lat}/${lng}`, {
    params: { page, size },
  });
  console.log(response.data);
  return response.data;
};

//검색하고 필터링된 산책길 리스트 가져오기
export const getPostsByKeyword = async (
  keyword: string,
  page = 0,
  size = 10
): Promise<{ content: Post[]; totalElements: number }> => {
  const response = await api.get("/keyword", {
    params: { keyword, page, size },
  });
  return response.data;
};

export const createPost = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.post("http://localhost:8080/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // 이 옵션 추가
    });
    return response.data;
  } catch (error) {
    console.error("Create post error:", error);
    throw error;
  }
};

// 게시글 좋아요 토글
export const togglePostLike = async (postId: number) => {
  try {
    await api.post(`/${postId}/likes`);
  } catch (error) {
    console.error("Error toggling post like:", error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (postId: number) => {
  try {
    await api.delete(`/${postId}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (postId: number, formData: FormData) => {
  try {
    await api.patch(`/${postId}`, formData);
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
