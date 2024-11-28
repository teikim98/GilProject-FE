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
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe/${decoded.id}`,
        { withCredentials: true }
      );

      // CommentNotify 이벤트 리스너
      eventSource.addEventListener("CommentNotify", (event) => {
        try {
          const notification = JSON.parse(event.data);
          set((state) => ({
            notifications: [notification, ...state.notifications],
          }));
        } catch (error) {
          console.error("CommentNotify 파싱 에러:", error);
        }
      });

      // PostNotify 이벤트 리스너
      eventSource.addEventListener("PostNotify", (event) => {
        try {
          const notification = JSON.parse(event.data);
          set((state) => ({
            notifications: [notification, ...state.notifications],
          }));
        } catch (error) {
          console.error("PostNotify 파싱 에러:", error);
        }
      });

      eventSource.onerror = (error) => {
        console.error("SSE 에러:", error);
        eventSource?.close();
      };
    };

    connectSSE();

    return () => {
      eventSource?.close();
    };
  },
}));
