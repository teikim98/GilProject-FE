'use client';



import Layout from '../layout'
import KakaoMap from '@/app/providers/KakaoMap'
import BackButton from '@/components/layout/BackIcon'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function page() {
    const [isRecording, setIsRecording] = useState(false);
    const router = useRouter();

    const handleRecording = () => {
        if (isRecording) {
            // 녹화 중지할 때 저장 페이지로 이동
            router.push('/main/record/save');
        }
        setIsRecording(!isRecording);
    };

    return (
        <div className='animate-fade-in flex flex-col relative min-h-screen'>
            <div className={`relative flex items-center justify-between mb-4 ${isRecording ? 'border-2 border-red-500 rounded-lg p-2' : ''}`}>
                <BackButton route='/main' />
                <h2 className='absolute left-1/2 transform -translate-x-1/2 top-1/2 translate-y-[-50%] text-lg font-semibold'>
                    {isRecording ? '경로 기록중...' : '경로 기록하기'}
                </h2>
                <div className="w-10"></div>
            </div>
            <KakaoMap mapId='1' isRecording={isRecording} />
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