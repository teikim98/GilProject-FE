import axios from "axios";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 API 주소
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// // 요청 인터셉터 설정
// api.interceptors.request.use((config) => {
//   console.log("백엔드로 가는 요청일때 이게 찍히니?");
//   // const token = localStorage.getItem("jwtToken"); // LocalStorage에서 JWT 가져오기
//   // console.log("localStorage에서 가져온 jwt " + token);

//   // 쿠키에서 JWT 토큰 가져오기
//   const token = getCookie("jwtToken"); // 쿠키에서 jwtToken 값을 가져옵니다
//   console.log("쿠키에서 가져온 jwt " + token);
  
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`; // Authorization 헤더에 추가
//   }
//   console.log("설정된 헤더:", config.headers);  // 설정된 헤더 출력
//   return config;
// });

export default api;
