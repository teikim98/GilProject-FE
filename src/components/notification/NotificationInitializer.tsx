'use client'
import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useToast } from "@/hooks/use-toast";

export function NotificationInitializer() {
    console.log("NotificationInitializer 컴포넌트 렌더링"); // 컴포넌트 자체의 렌더링 확인

    const initializeSSE = useNotificationStore((state) => state.initializeSSE);
    const { toast } = useToast();
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        console.log("NotificationInitializer mounted, checking auth...");
        const connect = () => {
            const token = localStorage.getItem('access');
            if (token) {
                initializeSSE();
            }
        };

        // 초기 연결
        connect();

        // 연결 실패 시 재시도 로직
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                connect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [initializeSSE]);

    useEffect(() => {
        const unsubscribe = useNotificationStore.subscribe((state, prevState) => {
            const notifications = state.notifications;
            const prevNotifications = prevState.notifications;

            if (notifications.length > prevNotifications.length) {
                const newNotification = notifications[0];
                toast({
                    title: newNotification.type === "POST_NOTIFY" ? "새로운 글" : "새로운 댓글",
                    description: newNotification.content,
                });
            }
        });

        return () => unsubscribe();
    }, [toast]);

    return null;
}