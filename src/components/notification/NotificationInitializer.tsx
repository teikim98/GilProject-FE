'use client'
import { useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useToast } from "@/hooks/use-toast";

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
                    title: newNotification.type === "POST_NOTIFY" ? "새로운 글" : "새로운 댓글",
                    description: newNotification.content,
                });
            }
        });

        return () => unsubscribe();
    }, [toast]);

    return null;
}

