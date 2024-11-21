import axios from "axios";
import { Post } from "@/types/types";

const api = axios.create({
  baseURL: "/api",
});

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get("/posts");
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const getPostNear = async (): Promise<Post[]> => {
  const response = await axios.get(
    `http://192.168.0.28:8080/posts/37/126?page=0&size=10`
  );
  return response.data.content;
};

export const createPost = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(formData);
    return response.data;
  } catch (error) {
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
