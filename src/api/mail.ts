import axios from "axios";
import { customInterceptors } from "./interceptors";

//이메일 관련 API///////////////

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/mail`,
});

customInterceptors(api);

/**
 * 이메일 전송
 * @param email
 */
export const emailSend = async (email: string) => {
  try {
    const response = await api.post(
      "/send",
      { receiver: email }, // JSON 데이터
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 요청
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    throw error;
  }
};

/**
 * 비밀번호 찾기 이메일 전송
 * @param email
 */
export const passWordEmail = async (name: string, email: string) => {
  try {
    const response = await api.post(
      "/pwsend",
      {
        name: name,
        receiver: email,
      }, // JSON 데이터
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 요청
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    throw error;
  }
};
