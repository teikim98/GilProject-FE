import axios from "axios";
<<<<<<< HEAD

//유저(마이페이지) 관련 API///////////////

const api = axios.create({
  baseURL: "http://localhost:8080/user",
});

export const updateAddress = async (address: string, latitude : string, longitude:string) => {
  try {
    const response = await api.put(
      "/mypage/address",
      { address: address,
        latitude : latitude,
        longitude : longitude
       }, // JSON 데이터
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 요청
        },
      }
    );
    return response.data;

  } catch (error) {
    throw error;
  }
};


=======
import { User } from "@/types/types";
const api = axios.create({
  baseURL: "http://192.168.0.18:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUser = async (id: number = 14): Promise<User> => {
  try {
    console.log("유저 정보 요청 시작");
    const response = await api.get(`/user/mypage/${id}`);
    console.log("API 응답:", response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API 에러:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
    }
    throw error;
  }
};
>>>>>>> THUI
