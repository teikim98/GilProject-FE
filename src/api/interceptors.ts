import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
};

export const handleLogout = async () => {
  if (typeof window === "undefined") return;

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("access");
    localStorage.removeItem("address-popup");
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};

export const customInterceptors = (api: AxiosInstance) => {
  if (typeof window === "undefined") return;

  requestInterceptor(api);
  responseInterceptor(api);
};

const requestInterceptor = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

interface CustomAxiosError extends AxiosError {
  config: InternalAxiosRequestConfig;
}

const responseInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    async (error: CustomAxiosError) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 900) {
        try {
          const reissueResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/reissue`,
            null,
            {
              withCredentials: true,
            }
          );

          const newAccessToken =
            reissueResponse.headers["newaccess"]?.split("Bearer ")[1];
          if (newAccessToken) {
            localStorage.setItem("access", newAccessToken);
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (reissueError) {
          console.error("Token reissue failed:", reissueError);
          alert("로그인 정보가 만료되었습니다. 다시 로그인 해주세요");
          handleLogout();
        }
      }

      return Promise.reject(error);
    }
  );
};
