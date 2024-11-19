'use client';

import BackButton from '@/components/layout/BackIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useRecordStore } from '@/store/useRecordStore';
import { RouteData } from '@/types/types';
import { EditingMap } from '@/components/map/EditingMapProps';
import BackHeader from '@/components/layout/BackHeader';
import calculatePathDistance from '@/util/calculateDistance';


export default function SaveRoutePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);  // 추가

    // store에서 경로와 마커 데이터 가져오기
    const { pathPositions, markers, recordStartTime, resetRecord } = useRecordStore();

    const isFormModified = title.trim() !== '' || description.trim() !== '';

    useEffect(() => {
        setIsSaving(isFormModified);
    }, [isFormModified]);

    const handleSave = () => {
        if (pathPositions.length === 0) {
            alert('저장할 경로가 없습니다.');
            return;
        }

        const recordedTime = recordStartTime
            ? Math.round((Date.now() - recordStartTime) / (1000 * 60))
            : 0;

        const distance = calculatePathDistance(pathPositions);


        const routeData: RouteData = {
            title,
            description,
            pathData: {
                path: pathPositions,
                markers: markers,
                recordedTime,
                distance
            },
            createdAt: new Date().toISOString()
        };

        // 기존 저장된 경로들 가져오기
        console.log(localStorage.getItem('savedRoutes'))
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
            <BackHeader
                content="경로 저장하기"
                navigationState={isSaving ? 'isSaving' : 'none'}
                onStateReset={() => {
                    setTitle('');
                    setDescription('');
                    setIsSaving(false);
                }}
            />

            <EditingMap
                initialPath={pathPositions}
                initialMarkers={markers}
                width="w-full"
                height="h-72"
            />

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