'use client'

import { Card } from '@/components/ui/card'
import { useNotificationStore } from '@/store/useNotificationStore'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { MessageCircle, FileText, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { Notification } from '@/types/types'

export default function NotificationsPage() {
    const notifications = useNotificationStore((state) => state.notifications);
    const clearNotifications = useNotificationStore((state) => state.clearNotifications);
    const deleteNotification = useNotificationStore((state) => state.deleteNotification);
    const router = useRouter();

    console.log("NotificationsPage - 현재 notifications:", notifications);


    const handleNotificationClick = (notification: Notification) => {
        deleteNotification(notification.data.id);
        // // 알림 타입에 따라 다른 페이지로 라우팅
        // if (notification.name === 'CommentNotify') {
        //     router.push(`/main/board/${notification.data.content}`); // 댓글이 달린 게시글로 이동
        // } else if (notification.name === 'PostNotify') {
        //     router.push(`/posts/${notification.data.content}`); // 새로운 게시글로 이동
        // }
    };

    return (
        <div className='w-full animate-slide-up flex flex-col bg-background pb-20'>
            <BackHeader content='알림' />

            <div className='flex flex-row items-center justify-between mb-8'>
                <div className='flex items-center gap-2'>
                    {/* 필요한 경우 여기에 추가 버튼이나 필터 추가 가능 */}
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
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <Card
                            key={notification.data.id}
                            className='p-4 hover:bg-muted/50 transition-colors cursor-pointer'
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-2">
                                    {notification.name === 'CommentNotify' ? (
                                        <MessageCircle className="h-4 w-4 text-primary" />
                                    ) : (
                                        <FileText className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold text-sm">
                                        {notification.comment}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {notification.data.content}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(notification.data.date), {
                                            addSuffix: true,
                                            locale: ko
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className='text-center text-muted-foreground py-8'>
                        새로운 알림이 없습니다
                    </div>
                )}
            </div>
        </div>
    )
}