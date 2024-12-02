"use client";
import { useState, useEffect } from 'react';
import { getPoint } from '@/api/point';
import PointProgress from '@/components/point/PointProgress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PointDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PointDialog({ isOpen, onOpenChange }: PointDialogProps) {
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const getPoints = async () => {
            try {
                const pointData = await getPoint();
                setPoints(pointData);
            } catch (error) {
                console.error('포인트 조회 실패:', error);
            }
        };
        
        if (isOpen) {
            getPoints();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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