import axios from "axios";
import { Post } from "@/types/types";

const api = axios.create({
  baseURL: "http://localhost:8080/posts",
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

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get("/nearAddr");
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await api.get(`/${id}`);

  return response.data;
};

export const getPostNear = async (): Promise<Post[]> => {
  const response = await api.get("/37/126?page=0&size=10");

  return response.data.content;
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
