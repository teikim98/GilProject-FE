'use client'

import { useToast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useEffect } from "react";

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
                    title: newNotification.name === 'CommentNotify' ? '새로운 댓글' : '새로운 게시글',
                    description: newNotification.comment,
                });
            }
        });

        return () => unsubscribe();
    }, [toast]);

    return null;
}
