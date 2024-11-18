import axios from "axios";

//회원가입, 로그인 관련 API///////////////

const api = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

/**
 * 이메일 로그인
 * @returns
 */
export const emailLogin = async (email : string, password : string) => {
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
  } catch (error) {
    console.error("로그인 API 호출 실패:", error);
    throw error;
  }
};
