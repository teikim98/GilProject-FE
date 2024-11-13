'use client';

import KakaoMap from '@/app/providers/KakaoMap'
import BackButton from '@/components/layout/BackIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useRecordStore } from '@/store/useRecordStore';

interface RouteData {
    title: string;
    description: string;
    pathData: {
        path: Array<{ lat: number; lng: number }>;
        markers: any[];
    };
    recordedTime: number;
    createdAt: string;
}

export default function SaveRoutePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // store에서 경로와 마커 데이터 가져오기
    const { pathPositions, markers, recordStartTime, resetRecord } = useRecordStore();

    const handleSave = () => {
        if (pathPositions.length === 0) {
            alert('저장할 경로가 없습니다.');
            return;
        }

        const recordedTime = recordStartTime
            ? Math.round((Date.now() - recordStartTime) / (1000 * 60))
            : 0;

        const routeData: RouteData = {
            title,
            description,
            pathData: {
                path: pathPositions,
                markers: markers
            },
            recordedTime,
            createdAt: new Date().toISOString()
        };

        // 기존 저장된 경로들 가져오기
        const savedRoutes: RouteData[] = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
        savedRoutes.push(routeData);
        localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));

        // store 상태 초기화
        resetRecord();

        // 저장 후 메인 페이지로 이동
        router.push('/main');
    };

    return (
        <div className='animate-fade-in flex flex-col relative min-h-screen'>
            <div className="relative flex items-center justify-between mb-4">
                <BackButton route='/main/record' />
                <h2 className='absolute left-1/2 transform -translate-x-1/2 top-1/2 translate-y-[-50%] text-lg font-semibold'>
                    경로 저장하기
                </h2>
                <div className="w-10"></div>
            </div>

            <KakaoMap isEditing={true} />

            <div className="mt-4 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        제목
                    </label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="경로의 제목을 입력하세요"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        설명
                    </label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="경로에 대한 설명을 입력하세요"
                        rows={4}
                    />
                </div>
            </div>

            <div className="mt-auto mb-16 px-4">
                <Button
                    className="w-full"
                    onClick={handleSave}
                    disabled={!title || pathPositions.length === 0}
                >
                    <h2>경로 저장하기</h2>
                </Button>
            </div>
        </div>
    )
}