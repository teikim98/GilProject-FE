'use client'
import { AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import BackHeader from '@/components/layout/BackHeader'
import { NotificationCard } from '@/components/notification/NotificationCard'

export default function NotificationsPage() {
    const notifications = useNotificationStore((state) => state.notifications);
    const clearNotifications = useNotificationStore((state) => state.clearNotifications);

    console.log("NotificationsPage - 현재 notifications:", notifications);

    return (
        <div className='w-full animate-fade-in flex flex-col bg-background pb-20'>
            <BackHeader content='알림' />

            <div className='flex flex-row items-center justify-between mb-8'>
                <div className='flex items-center gap-2'>
                </div>
                {notifications.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>모든 알림 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                    모든 알림을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={clearNotifications}>
                                    삭제
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <div className='flex flex-col gap-3'>
                <AnimatePresence mode="popLayout">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                            />
                        ))
                    ) : (
                        <div className='text-center text-muted-foreground py-8'>
                            새로운 알림이 없습니다
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}