'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useRecordStore } from '@/store/useRecordStore';
import { CreatePostPath } from '@/types/types';
import { EditingMap } from '@/components/map/EditingMapProps';
import BackHeader from '@/components/layout/BackHeader';
import { calculatePathDistance } from '@/util/calculatePathDistance';
import { createPath } from '@/api/route';
import { convertCoordsToAddress } from '@/util/convertCoordsToAddress';


export default function SaveRoutePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);  // 추가

    // store에서 경로와 마커 데이터 가져오기
    const { pathPositions, pins, recordStartTime, resetRecord } = useRecordStore();

    // const isFormModified = title.trim() !== '' || description.trim() !== '';

    useEffect(() => {
        setIsSaving(true);
    }, []);

    // 저장 함수 
    const handleSave = async () => {
        if (pathPositions.length === 0) {
            alert('저장할 경로가 없습니다.');
            return;
        }

        try {
            const startLat = parseFloat(pathPositions[0].latitude);
            const startLng = parseFloat(pathPositions[0].longitude);

            const startAddress = await convertCoordsToAddress(startLat, startLng);

            const time = recordStartTime
                ? Math.round((Date.now() - recordStartTime) / (1000 * 60))
                : 0;

            const distance = calculatePathDistance(pathPositions.map(coord => ({
                lat: parseFloat(coord.latitude),
                lng: parseFloat(coord.longitude)
            })));

            const path: CreatePostPath = {
                content: description,
                title,
                time,
                distance,
                startLat: startLat,
                startLong: startLng,
                startAddr: startAddress,
                routeCoordinates: pathPositions,
                pins
            };

            await createPath(path);
            console.log(path)
            localStorage.removeItem("savedPath");
            document.cookie = 'has-temp-path=false;path=/;max-age=0';
            resetRecord();
            router.push('/main');
        } catch (error) {
            console.error('Error saving path:', error);
            alert('경로 저장에 실패했습니다.');
        }
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
                initialPins={pins}
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