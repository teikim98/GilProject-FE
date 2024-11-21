import axios from "axios";

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


