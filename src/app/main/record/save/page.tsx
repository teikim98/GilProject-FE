'use client';

import KakaoMap from '@/app/providers/KakaoMap'
import BackButton from '@/components/layout/BackIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function SaveRoutePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        // 여기에 저장 로직 추가
        const savedPath = localStorage.getItem('savedPath');
        if (savedPath) {
            const pathData = JSON.parse(savedPath);
            const routeData = {
                title,
                description,
                pathData,
                createdAt: new Date().toISOString()
            };

            // 기존 저장된 경로들 가져오기
            const savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
            savedRoutes.push(routeData);
            localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));

            // 임시 저장된 경로 삭제
            localStorage.removeItem('savedPath');

            // 저장 후 메인 페이지로 이동
            router.push('/main');
        }
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

            <KakaoMap mapId='1' isEditing={true} />

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
                >
                    <h2>경로 저장하기</h2>
                </Button>
            </div>
        </div>
    )
}