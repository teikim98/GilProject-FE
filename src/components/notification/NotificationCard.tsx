import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Notification } from '@/types/types';

interface NotificationCardProps {
    notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
    const router = useRouter();
    const deleteNotification = useNotificationStore((state) => state.deleteNotification);

    const handleClick = () => {
        deleteNotification(notification.data.id);
        router.push(`/posts/${notification.data.postId}`);
    };

    return (
        <Card
            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                    {notification.data.type === 'CommentNotify' ? (
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
                            locale: ko,
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
}
