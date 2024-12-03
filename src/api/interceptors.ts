import axios from "axios";

const getAuthToken = (): string | null => {
  return localStorage.getItem("access");
};


/**
 * req, res 모두 검출
 * @param api
 */
export const customInterceptors = (api : axios.AxiosInstance)=>{
  requestInterceptor(api);
  responseInterceptor(api);
}

/**
 * 프론트가 보내는 리퀘스트 인터셉터
 * @param api 
 */
const requestInterceptor = (api : axios.AxiosInstance) =>{
  api.interceptors.request.use(
    (config) => {

      //헤더에 토큰을 실어서 보내줌
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

/**
 * 프론트가 받는 리스폰스 인터셉터
 * @param api
 */
const responseInterceptor = (api : axios.AxiosInstance) =>{
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      //원래 요청
      const originalRequest = error.config;
      console.log(originalRequest);
  
      // 900에러 처리
      if (error.response && error.response.status === 900) {
        console.log("access 토큰이 만료되거나 정상이 아님");
        const errorMessage = error.response.data;
        console.log("백엔드에서 온 에러 메세지 : " + errorMessage);
        
        //새로운 액세스 토큰 발급 절차
        try {
          const reissueResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/reissue`,
            null,
            {
              withCredentials: true, // 쿠키 포함
            }
          );
  
          const newAccessToken =
            reissueResponse.headers["newaccess"].split("Bearer ")[1];
          if (newAccessToken) {
            localStorage.setItem("access", newAccessToken);
            console.log("새로운 access 토큰 스토리지에 저장됨!");
  
            // 원래 요청 재시도(헤더)
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (reissueError) {
          console.error("Token reissue failed:", reissueError);
          // console.log("refersh 토큰도 만료됨, 로그아웃...");
          localStorage.removeItem("access");
          localStorage.removeItem("address-popup");
          alert("refersh 토큰도 만료됨, 로그아웃...");
          //쿠키에 있는 refresh 토큰 삭제? -> 안해도됨 어차피 로그인하면 다시 저장됨
          window.location.href = "/auth/login";
        }
      }
  
      return Promise.reject(error);
    }
  );
  
}