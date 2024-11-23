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

export const updatePost = async (id: number, formData: FormData) => {
  try {
    const response = await axios.put(`/api/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Updated post data:", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
