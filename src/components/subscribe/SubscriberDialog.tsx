'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription,
    DialogFooter 
} from '@/components/ui/dialog';
import { UserSimpleResDTO, getMySubscribes, unsubscribeUser } from '@/api/subscribe';
import ProfileDialog from '@/components/user/ProfileDialog';

interface SubscriberDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SubscriberDialog({ isOpen, onOpenChange }: SubscriberDialogProps) {
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<UserSimpleResDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [unsubscribeDialog, setUnsubscribeDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSimpleResDTO | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchSubscribers = async () => {
                try {
                    const data = await getMySubscribes();
                    setSubscribers(data);
                } catch (err) {
                    console.error('구독자 목록 조회 실패:', err);
                    setError('구독자 목록을 불러오는데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };

            fetchSubscribers();
        }
    }, [isOpen]);

    const handleViewPosts = (nickName: string) => {
        router.push(`/main/mypage/subscriberPosts?nickName=${encodeURIComponent(nickName)}`);
    };

    const handleUnsubscribeClick = (user: UserSimpleResDTO) => {
        setSelectedUser(user);
        setUnsubscribeDialog(true);
    };

    const handleUnsubscribe = async () => {
        if (!selectedUser) return;

        try {
            await unsubscribeUser(selectedUser.id);
            setSubscribers(prev => prev.filter(sub => sub.id !== selectedUser.id));
            alert(`${selectedUser.nickName}님의 구독이 해지되었습니다.`);
        } catch (error) {
            alert('구독 해지에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setUnsubscribeDialog(false);
            setSelectedUser(null);
        }
    };

    return (
        <>
            {/* 메인 구독자 목록 다이얼로그 */}
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>구독 목록</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-4">
                        {loading ? (
                            <div className="text-center p-4">로딩중...</div>
                        ) : error ? (
                            <div className="text-red-500 text-center p-4">{error}</div>
                        ) : (
                            <div className="space-y-4">
                                {subscribers.map((subscriber) => (
                                    <Card key={subscriber.id} className="hover:bg-gray-50">
                                        <CardContent className="flex items-center p-4">
                                            <ProfileDialog 
                                                userId={subscriber.id} 
                                                className="h-12 w-12"
                                            />
                                            <div className="ml-4 flex-grow">
                                                <h3 className="font-semibold">{subscriber.nickName}</h3>
                                                <p className="text-sm text-gray-600">{subscriber.comment}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewPosts(subscriber.nickName)}
                                                >
                                                    게시글 보기
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleUnsubscribeClick(subscriber)}
                                                >
                                                    해지
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {subscribers.length === 0 && (
                                    <div className="text-center p-8 text-gray-500">
                                        구독중인 유저가 없습니다.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* 구독 해지 확인 다이얼로그 */}
            <Dialog open={unsubscribeDialog} onOpenChange={setUnsubscribeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>구독 해지 확인</DialogTitle>
                        <DialogDescription>
                            {selectedUser?.nickName}님의 구독을 해지하시겠습니까?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUnsubscribeDialog(false)}>
                            취소
                        </Button>
                        <Button variant="destructive" onClick={handleUnsubscribe}>
                            해지
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}