"use client";
import { useState, useEffect } from 'react';
import { getPoint } from '@/api/point';
import PointProgress from '@/components/point/PointProgress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PointPageProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function PointPage({ isOpen = true, onClose }: PointPageProps) {
    const [points, setPoints] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

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

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open && onClose) {
            onClose();
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
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
    );
}