import axios from "axios";
import { Post, RouteData, RouteTest } from "@/types/types";

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

export const getRouteByIdTest = async (id: number = 30): Promise<RouteTest> => {
  try {
    const response = await axios.get(`/path/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw new Error("Failed to fetch route");
  }
};
