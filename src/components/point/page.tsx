"use client";
import { useState, useEffect } from 'react';
import { getPoint } from '@/api/point';
import PointProgress from '@/components/point/PointProgress';

export default function PointPage() {
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
        getPoints();
    }, []);

    return (
        <div className="p-4">
            <PointProgress currentPoints={points} />
        </div>
    );
}