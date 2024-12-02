import axios from "axios";

//포인트 가져오기관련

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

const getAuthToken = (): string | null => {
  return localStorage.getItem("access");
};

api.interceptors.request.use(
  (config) => {
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

//point 가져오기
export const getPoint = async () => {
  try {
    const response = await api.get("/user/point");
    return response.data;
  } catch (error) {
    console.error("Error fetching points:", error);
    throw error;
  }
};
