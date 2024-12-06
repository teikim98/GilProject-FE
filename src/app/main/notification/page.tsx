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
import { useToast } from '@/hooks/use-toast';
import { deleteAllNotifications } from '@/api/notification';

export default function NotificationsPage() {
    const notifications = useNotificationStore((state) => state.notifications);
    const clearNotifications = useNotificationStore((state) => state.clearNotifications);
    const { toast } = useToast();

    const handleDeleteAll = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            // 애니메이션이 완료된 후 실제 삭제 수행
            await new Promise(resolve => setTimeout(resolve, 500));
            await deleteAllNotifications();
            clearNotifications();

        } catch (error) {
            toast({
                title: "오류",
                description: "알림 삭제에 실패했습니다.",
                variant: "destructive",
            });
        }
    };


    console.log("NotificationsPage - 현재 notifications:", notifications);

    return (
        <div className='w-full animate-fade-in flex flex-col bg-background pb-20'>
            <BackHeader content='알림' />

            <div className='flex flex-row items-center justify-between'>
                <div className='flex items-center'>
                </div>
                {notifications.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" className='mr-6' size="icon">
                                전체삭제 <Trash2 className="h-5 w-5" />
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
                                <AlertDialogAction onClick={handleDeleteAll}>
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