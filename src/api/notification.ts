import axios from "axios";
import { customInterceptors } from "./interceptors";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/notifications`, // API 기본 URL 설정
});

customInterceptors(api);

export const markNotificationAsRead = async (notificationId: number) => {
  const token = localStorage.getItem("access");

  try {
    await api.put(`/read/${notificationId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }
};

export const deleteNotification = async (notificationId: number) => {
  const token = localStorage.getItem("access");

  try {
    await api.delete(`/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw new Error("Failed to delete notification");
  }
};


// export const markNotificationAsRead = async (notificationId: number) => {
//   const token = localStorage.getItem("access");
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/notifications/read/${notificationId}`,
//     {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to mark notification as read");
//   }
// };

// export const deleteNotification = async (notificationId: number) => {
//   const token = localStorage.getItem("access");
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to delete notification");
//   }
// };
