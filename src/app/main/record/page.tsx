'use client';

import KakaoMap from '@/app/providers/KakaoMap'
import BackButton from '@/components/layout/BackIcon'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { useRecordStore } from '@/store/useRecordStore';

export default function RecordPage() {
    const router = useRouter();
    const { isRecording, startRecording, stopRecording } = useRecordStore();

    const handleRecording = () => {
        if (isRecording) {
            stopRecording();  // 녹화 중지 및 데이터 저장
            router.push('/main/record/save');
        } else {
            startRecording();  // 녹화 시작
        }
    };

    return (
        <div className='animate-fade-in flex flex-col relative h-full'>
            <div className={`relative flex items-center justify-between mb-4 ${isRecording ? 'border-2 border-red-500 rounded-lg p-2' : ''
                }`}>
                <BackButton route='/main' />
                <h2 className='absolute left-1/2 transform -translate-x-1/2 top-1/2 translate-y-[-50%] text-lg font-semibold'>
                    {isRecording ? '경로 기록중...' : '경로 기록하기'}
                </h2>
                <div className="w-10"></div>
            </div>

            <KakaoMap
                isRecording={isRecording}
                height='h-96'
            />

            <div className="mt-auto mb-16 px-4">
                <Button
                    className={`w-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={handleRecording}
                >
                    <h2>{isRecording ? '경로 녹화 중지하기' : '경로 녹화 시작하기'}</h2>
                </Button>
            </div>
        </div>
    )
}