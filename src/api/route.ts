import axios from "axios";
import { Post } from "@/types/types";

const api = axios.create({
  baseURL: "/api",
});

export const getRouteById = async (id: number): Promise<Post> => {
  try {
    const response = await axios.get(`/api/routes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw new Error("Failed to fetch route");
  }
};
