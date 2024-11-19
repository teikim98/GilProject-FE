import axios from "axios";
import { Post } from "@/types/types";

const api = axios.create({
  baseURL: "/api",
});

// 경로 상세 정보 가져오기
export const getRouteById = async (id: number): Promise<Post> => {
  const response = await api.get(`/routes/${id}`);
  return response.data;
};
