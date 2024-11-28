import { create } from "zustand";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/types";
import { jwtDecode } from "jwt-decode";

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  deleteNotification: (id: number) => void;
  initializeSSE: () => void;
}

interface JWTPayload {
  id: number;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  clearNotifications: () => set({ notifications: [] }),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.data.id !== id
      ),
    })),

  initializeSSE: () => {
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      const token = localStorage.getItem("access");
      if (!token) {
        return;
      }

      const decoded = jwtDecode<JWTPayload>(token);

      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        }/notifications/subscribe/${decoded.id}`,
        { withCredentials: true }
      );

      eventSource.onopen = () => {
        console.log("SSE 연결 성공");
      };

      // 모든 메시지 확인용
      eventSource.onmessage = (event) => {
        console.log("일반 메시지 수신:", event);
        console.log("메시지 데이터:", event.data);
      };

      eventSource.onerror = (error) => {
        console.error("SSE 에러:", error);
        eventSource?.close();
        setTimeout(connectSSE, 3000);
      };
    };

    connectSSE();

    return () => {
      eventSource?.close();
    };
  },
}));
