import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageCircle, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NotificationData } from '@/types/types';
import { Button } from '@/components/ui/button';
import { markNotificationAsRead, deleteNotification } from '@/api/notification';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
    notification: NotificationData;
}

export function NotificationCard({ notification }: NotificationCardProps) {
    const router = useRouter();
    const deleteNotificationFromStore = useNotificationStore((state) => state.deleteNotification);
    const updateNotificationState = useNotificationStore((state) => state.updateNotificationState);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const isRead = notification.state === 1;

    const handleClick = async () => {
        try {
            setIsLoading(true);
            if (!isRead) {
                await markNotificationAsRead(notification.id);
                updateNotificationState(notification.id, 1);
            }
            router.push(`/main/board/${notification.postId}`);
        } catch (error) {
            toast({
                title: "오류",
                description: "알림 읽음 처리에 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsLoading(true);
            await deleteNotification(notification.id);
            deleteNotificationFromStore(notification.id);
            toast({
                title: "알림 삭제",
                description: "알림이 삭제되었습니다.",
            });
        } catch (error) {
            toast({
                title: "오류",
                description: "알림 삭제에 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card
            className={cn(
                'p-4 transition-colors cursor-pointer relative group',
                isRead
                    ? 'bg-muted/30 hover:bg-muted/50'
                    : 'hover:bg-muted/50'
            )}
            onClick={handleClick}
            aria-disabled={isLoading}
        >
            <div className="flex items-start gap-3">
                <div className={cn(
                    "rounded-full p-2",
                    isRead
                        ? 'bg-primary/5'
                        : 'bg-primary/10'
                )}>
                    {notification.type === 'COMMENT_NOTIFY' ? (
                        <MessageCircle className={cn(
                            "h-4 w-4",
                            isRead
                                ? 'text-primary/70'
                                : 'text-primary'
                        )} />
                    ) : (
                        <FileText className={cn(
                            "h-4 w-4",
                            isRead
                                ? 'text-primary/70'
                                : 'text-primary'
                        )} />
                    )}
                </div>
                <div className="flex flex-col gap-1 flex-grow">
                    <div className={cn(
                        "font-semibold text-sm",
                        isRead && "text-muted-foreground"
                    )}>
                        {notification.type === 'COMMENT_NOTIFY'
                            ? '새로운 댓글이 달렸습니다'
                            : '새로운 게시글이 등록되었습니다'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {notification.content}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.date), {
                            addSuffix: true,
                            locale: ko,
                        })}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleDelete}
                    disabled={isLoading}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
}