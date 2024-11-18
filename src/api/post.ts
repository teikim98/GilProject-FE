import { CreatePostRequest } from "./../types/types";
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

export const createPost = async (formData: FormData) => {
    try {
        const response = await axios.post('/api/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(formData)
        return response.data;
    } catch (error) {
        throw error;
    }
};
