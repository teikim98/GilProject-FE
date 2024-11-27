"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface NotificationEvent {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

interface NotificationStore {
  notifications: NotificationEvent[];
  addNotification: (notification: NotificationEvent) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  initializeSSE: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  clearNotifications: () => set({ notifications: [] }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),

  initializeSSE: () => {
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      eventSource = new EventSource(
        `http://localhost:8080/notifications/subscribe`,
        { withCredentials: true }
      );

      eventSource.onopen = () => {
        console.log("SSE 연결 성공");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          set((state) => ({
            notifications: [data, ...state.notifications],
          }));
        } catch (error) {
          console.error("알림 데이터 파싱 에러:", error);
        }
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

// SSE 초기화를 위한 컴포넌트
export function NotificationInitializer() {
  const initializeSSE = useNotificationStore((state) => state.initializeSSE);
  const { toast } = useToast();

  useEffect(() => {
    initializeSSE();
  }, [initializeSSE]);

  useEffect(() => {
    const unsubscribe = useNotificationStore.subscribe((state, prevState) => {
      const notifications = state.notifications;
      const prevNotifications = prevState.notifications;
      if (notifications.length > prevNotifications.length) {
        const newNotification = notifications[0];
        toast({
          title: newNotification.type,
          description: newNotification.message,
        });
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return null;
}
