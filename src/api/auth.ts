import { emailFormProperty } from "@/types/types_JHW";
import axios from "axios";

//회원가입, 로그인 관련 API///////////////

const api = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

/**
 * 이메일 로그인
 * @returns
 */
export const emailLogin = async (email: string, password: string) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    // POST 요청 보내기
    const response = await api.post("/api/auth/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // FormData의 경우 이 헤더를 설정합니다.
      },
    });

    // 응답 헤더에서 JWT 토큰 추출
    const token = response.headers["authorization"];
    if (token) {
      const jwtToken = token.split(" ")[1]; // "Bearer " 접두어 제거
      // localStorage.setItem("jwtToken", jwtToken); // LocalStorage에 저장
      document.cookie = `jwtToken=${jwtToken}; path=/; max-age=${60 * 60 * 24 * 7};`;
      console.log("JWT 저장 완료:", jwtToken);
    } else {
      throw new Error("토큰이 응답에 포함되지 않았습니다.");
    }
  } catch (error) {
    // console.error("로그인 API 호출 실패:", error);
    throw error;
  }
};

/**
 * 이메일 회원가입
 * @returns 
 */
export const emailJoin = async ({
  name,
  nickName,
  email,
  password,
}: emailFormProperty) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("nickName", nickName);
    formData.append("email", email);
    formData.append("password", password);

    const response = await api.post("/join", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
