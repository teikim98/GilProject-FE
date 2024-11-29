'use client';

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { useRecordStore } from '@/store/useRecordStore';
import { RecordingMap } from '@/components/map/RecordingMap';
import { CurrentLocationMap } from '@/components/map/CurrentLocationMap';
import BackHeader from '@/components/layout/BackHeader';

export default function RecordPage() {
    const router = useRouter();
    const { isRecording, startRecording, stopRecording } = useRecordStore();

    const handleRecording = () => {
        if (isRecording) {
            stopRecording();  // 녹화 중지 및 데이터 저장
            router.push('/record/save');
        } else {
            startRecording();  // 녹화 시작
        }
    };
    return (
        <div className='animate-fade-in flex flex-col relative h-full'>
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
                    < CurrentLocationMap
                        width="w-full"
                        height="h-[90%]"
                    />
                )}
            </div>



            <div className="mt-auto px-4">
                <Button
                    className={`w-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={handleRecording}
                >
                    <h2>{isRecording ? '경로 기록 중지하기' : '경로 기록 시작하기'}</h2>
                </Button>
            </div>
        </div>
    )
}