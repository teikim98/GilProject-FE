import { Notice } from "@/types/types_JHW";
import axios from "axios";

//공지 관련 API///////////////

const api = axios.create({
  baseURL: "http://localhost:8080/notice",
});


/**
 * 모든 공지 가져오기
 * @returns 
 */
export const getNoticeAll = async () : Promise<Notice[]>=> {
  try {
    const response = await api.get(`/`);

    return response.data;
  } catch (error) {
    console.error("Error fetching notices", error);
    throw error;
  }
};
