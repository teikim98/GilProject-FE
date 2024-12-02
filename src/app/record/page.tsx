'use client';

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { useRecordStore } from '@/store/useRecordStore';
import { RecordingMap } from '@/components/map/RecordingMap';
import { CurrentLocationMap } from '@/components/map/CurrentLocationMap';
import BackHeader from '@/components/layout/BackHeader';
import { useState } from 'react';
import { PreventRefreshAndBack } from '@/util/preventRefreshAndBack';

export default function RecordPage() {
    const router = useRouter();
    const { isRecording, startRecording, stopRecording } = useRecordStore();
    const [isTransitioning, setIsTransitioning] = useState(false);
    PreventRefreshAndBack(); //새로고침, 뒤로가기 방지

    const handleRecording = async () => {
        if (isRecording) {
            setIsTransitioning(true);
            stopRecording();
            await new Promise(resolve => setTimeout(resolve, 300));
            router.push('/record/save');
        } else {
            startRecording();
        }
    };

    return (
        <div className={`flex flex-col relative h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            <BackHeader
                content={isRecording ? '경로 기록중...' : '경로 기록하기'}
                navigationState={isRecording ? 'isRecording' : 'none'}
                className={isRecording ? 'border-2 border-red-500 rounded-lg p-2' : ''}
            />
            <div className='px-4 h-full'>
                {isRecording ? (
                    <RecordingMap
                        width="w-full"
                        height="h-[90%]"
                    />
                ) : (
                    <CurrentLocationMap
                        width="w-full"
                        height="h-[90%]"
                    />
                )}
            </div>

            <div className="mt-auto px-4">
                <Button
                    className={`w-full transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''} ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleRecording}
                    disabled={isTransitioning}
                >
                    <h2>{isRecording ? '경로 기록 중지하기' : '경로 기록 시작하기'}</h2>
                </Button>
            </div>
        </div>
    )
}