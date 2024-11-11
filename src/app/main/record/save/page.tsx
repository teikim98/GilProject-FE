'use client';

import KakaoMap from '@/app/providers/KakaoMap'
import BackButton from '@/components/layout/BackIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SaveRoutePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [pendingRoute, setPendingRoute] = useState('');
    const [isBlocked, setIsBlocked] = useState(true);

    useEffect(() => {
        // 브라우저 뒤로가기/새로고침 시 경고
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isBlocked) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        // 브라우저 뒤로가기 처리
        const handlePopState = (e: PopStateEvent) => {
            if (isBlocked) {
                e.preventDefault();
                setShowAlert(true);
                setPendingRoute('/main/record');
                // 현재 URL 유지
                window.history.pushState(null, '', window.location.pathname);
            }
        };

        // popstate 이벤트 리스너 등록
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('beforeunload', handleBeforeUnload);

        // 페이지 진입 시 history 스택에 현재 상태 추가
        window.history.pushState(null, '', window.location.pathname);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isBlocked]);

    const handleNavigation = (route: string) => {
        if (isBlocked) {
            setPendingRoute(route);
            setShowAlert(true);
        } else {
            router.push(route);
        }
    };

    const handleSave = () => {
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

            // 네비게이션 블록 해제
            setIsBlocked(false);

            // 저장 후 메인 페이지로 이동
            router.push('/main');
        }
    };

    const handleLeave = () => {
        setIsBlocked(false);
        localStorage.removeItem('savedPath');
        router.push(pendingRoute);
    };

    const CustomBackButton = () => (
        <div onClick={() => handleNavigation('/main/record')}>
            <BackButton route='' />
        </div>
    );


    return (
        <div className='animate-fade-in flex flex-col relative min-h-screen'>
            <div className="relative flex items-center justify-between mb-4">
                <CustomBackButton />
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

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent className='w-2/3 h-[250px] rounded-lg' >
                    <AlertDialogHeader>
                        <AlertDialogTitle>경로 저장 취소</AlertDialogTitle>
                        <AlertDialogDescription>
                            경로가 아직 저장되지 않았습니다.
                            페이지를 나가시면 기록된 경로가 삭제됩니다.
                            정말 나가시겠습니까?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowAlert(false)}>
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleLeave}
                        >
                            나가기
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}