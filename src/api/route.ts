import axios from "axios";
import { Post, Path, CreatePostPath } from "@/types/types";
import { request } from "https";

const api = axios.create({
  baseURL: "http://localhost:8080/path/",
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

export const getRouteById = async (id: number): Promise<Post> => {
  try {
    const response = await axios.get(`path/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw new Error("Failed to fetch route");
  }
};

export const createPath = async(requestBody: CreatePostPath): Promise<CreatePostPath> => {
  try {
    const response = await api.post('', requestBody);
    return response.data;
  } catch (error) {
    console.error("Error creating path:", error);
    throw new Error("Failed to create path");
  }
}


export const getPathById = async (id: number = 30): Promise<Path> => {
  try {
    const response = await axios.get(`/path/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching path:", error);
    throw new Error("Failed to fetch path");
  }
};
