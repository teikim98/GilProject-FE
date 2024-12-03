import { emailFormProperty } from "@/types/types_JHW";
import axios from "axios";

//회원가입, 로그인 관련 API///////////////
import { getDetailProfile } from "./user";
import { customInterceptors } from "./interceptors";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  withCredentials: true,
});

interface JWTPayload {
  id: number;
}

customInterceptors(api);

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
    const response = await api.post("/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // FormData의 경우 이 헤더를 설정합니다.
      },
    });
    // console.log(response.headers["authorization"]);
    // 응답 헤더에서 JWT 토큰 추출
    const token = response.headers["authorization"];
    if (token) {
      const accessToken = token.split(" ")[1];
      // console.log(accessToken);
      localStorage.setItem("access", accessToken);

      // 전체 유저 정보를 가져옴
      const userResponse = await getDetailProfile();

      return userResponse;
    } else {
      console.log("토큰이 응답에 포함되지 않았습니다");
      throw new Error("토큰이 응답에 포함되지 않았습니다.");
    }
  } catch (error) {
    console.error("로그인 API 호출 실패:", error);
    throw error;
  }
};

/**
 * 이메일 회원가입
 * @returns
 */
export const emailJoin = async ({ name, nickName, email, password }: emailFormProperty) => {
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

/**
 * 닉네임 DB 조회
 */
export const existNickname = async (nickName: string) => {
  const response = await api.get("/nickname/" + nickName);

  return response.data;
};

/**
 * 비밀번호 변경
 * @param id
 * @param nickName 
 */
export const changeNickName = async (nickName : string)=>{
  // const response = await 
  // return response.data;
  
  return 1;
}

/**
 * 이메일 DB 조회
 */
export const existEmail = async (email: string) => {
  const response = await api.get("/email/" + email);

  return response.data;
};

/**
 * refresh 토큰 검증
 * @returns 
 */
export const verifiRefreshToken = async () => {
  const response = await api.post("/verification");

  return response;
};

/**
 * 비밀번호 변경
 */
export const changePassword = async (password: string, newPassword: string) => {
  try {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("newPassword", newPassword);

    const response = await axios.put("/mypage/updatePwd", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};