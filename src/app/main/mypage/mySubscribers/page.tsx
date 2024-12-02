'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
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

export default function SubscribePage() {
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<UserSimpleResDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [unsubscribeDialog, setUnsubscribeDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSimpleResDTO | null>(null);

    useEffect(() => {
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
    }, []);

    // 다이얼로그가 닫힐 때 이전 페이지로 이동
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.back();
        }
        setIsDialogOpen(open);
    };

    // 구독 해지 확인 다이얼로그 열기
    const handleUnsubscribeClick = (user: UserSimpleResDTO) => {
        setSelectedUser(user);
        setUnsubscribeDialog(true);
    };

    // 구독 해지 실행
    const handleUnsubscribe = async () => {
        if (!selectedUser) return;

        try {
            await unsubscribeUser(selectedUser.id);
            
            // 목록에서 해당 유저 제거
            setSubscribers(prev => prev.filter(sub => sub.id !== selectedUser.id));
            
            // 성공 메시지 표시
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
            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
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
                                            <Avatar className="h-12 w-12">
                                                <img
                                                    src={subscriber.imageUrl || '/api/placeholder/40/40'}
                                                    alt={subscriber.nickName}
                                                    className="rounded-full object-cover"
                                                />
                                            </Avatar>
                                            <div className="ml-4 flex-grow">
                                                <h3 className="font-semibold">{subscriber.nickName}</h3>
                                                <p className="text-sm text-gray-600">{subscriber.comment}</p>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                className="ml-4"
                                                onClick={() => handleUnsubscribeClick(subscriber)}
                                            >
                                                구독 해지
                                            </Button>
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