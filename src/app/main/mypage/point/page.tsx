"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPoint } from '@/api/point';
import PointProgress from '@/components/point/PointProgress';
import BackHeader from '@/components/layout/BackHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PointPage() {
    const router = useRouter();
    const [points, setPoints] = useState(0);
    const [isRouteListOpen, setIsRouteListOpen] = useState(true);

    useEffect(() => {
        const getPoints = async () => {
            try {
                const pointData = await getPoint();
                setPoints(pointData);
            } catch (error) {
                console.error('포인트 조회 실패:', error);
            }
        };
        
        getPoints();
    }, []);

    // 다이얼로그가 닫힐 때 이전 페이지로 이동
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.back(); // 이전 페이지로 이동
        }
        setIsRouteListOpen(open);
    };

    return (
        <>
            <Dialog open={isRouteListOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>내 포인트</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <PointProgress currentPoints={points} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}