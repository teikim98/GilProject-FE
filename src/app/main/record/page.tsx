'use client';

import Layout from '../layout'
import KakaoMap from '@/app/providers/KakaoMap'
import BackButton from '@/components/layout/BackIcon'
import { Button } from '@/components/ui/button'
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
import { useToast } from "@/hooks/use-toast"


export default function RecordPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [pendingRoute, setPendingRoute] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const router = useRouter();
    const { toast } = useToast()

    useEffect(() => {
        setIsBlocked(isRecording);
    }, [isRecording]);

    useEffect(() => {
        // 브라우저 뒤로가기/새로고침 시 경고
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isRecording) {  // isBlocked 대신 isRecording 체크
                e.preventDefault();
                e.returnValue = '현재 경로를 기록하고 있습니다. 페이지를 나가면 기록이 중단됩니다.';
                return e.returnValue;
            }
        };

        // 브라우저 뒤로가기 처리
        const handlePopState = (e: PopStateEvent) => {
            if (isBlocked) {
                e.preventDefault();
                setShowAlert(true);
                setPendingRoute('/main');
                // 현재 URL 유지
                window.history.pushState(null, '', window.location.pathname);
            }
        };

        // 페이지 로드 시 녹화 중이었다면 알림 표시
        const checkRecordingStatus = () => {
            const wasRecording = sessionStorage.getItem('isRecording');
            if (wasRecording === 'true') {
                toast({
                    variant: "destructive",
                    title: "녹화 중단",
                    description: "새로고침으로 인해 이전 녹화가 중단되었습니다."
                })
                sessionStorage.removeItem('isRecording');
            }
        };

        // popstate 이벤트 리스너 등록
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('beforeunload', handleBeforeUnload);
        checkRecordingStatus();

        // 페이지 진입 시 history 스택에 현재 상태 추가
        window.history.pushState(null, '', window.location.pathname);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isBlocked, isRecording]);

    const handleNavigation = (route: string) => {
        if (isBlocked) {
            setPendingRoute(route);
            setShowAlert(true);
        } else {
            router.push(route);
        }
    };

    const handleLeave = () => {
        setIsRecording(false);
        setIsBlocked(false);
        sessionStorage.removeItem('isRecording');  // 세션 스토리지에서 녹화 상태 제거
        router.push(pendingRoute);
    };

    const handleRecording = () => {
        if (isRecording) {
            // 녹화 중지할 때 저장 페이지로 이동
            setIsBlocked(false);
            sessionStorage.removeItem('isRecording');  // 세션 스토리지에서 녹화 상태 제거
            router.push('/main/record/save');
        } else {
            // 녹화 시작 시 세션 스토리지에 상태 저장
            sessionStorage.setItem('isRecording', 'true');
            setIsRecording(true);
        }
    };

    // 컴포넌트가 언마운트될 때 녹화 상태 정리
    useEffect(() => {
        return () => {
            if (isRecording) {
                sessionStorage.removeItem('isRecording');
            }
        };
    }, [isRecording]);

    const CustomBackButton = () => (
        <div onClick={() => handleNavigation('/main')}>
            <BackButton route='' />
        </div>
    );

    return (
        <div className='animate-fade-in flex flex-col relative min-h-screen'>
            <div className={`relative flex items-center justify-between mb-4 ${isRecording ? 'border-2 border-red-500 rounded-lg p-2' : ''}`}>
                <CustomBackButton />
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

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent className='w-2/3 h-[250px] rounded-lg' >
                    <AlertDialogHeader>
                        <AlertDialogTitle>경로 기록 중단</AlertDialogTitle>
                        <AlertDialogDescription>
                            현재 경로를 기록하고 있습니다. 페이지를 나가시면 기록이 중단됩니다.
                            정말 나가시겠습니까?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowAlert(false)}>
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => {
                                setIsRecording(false);
                                router.push(pendingRoute);
                            }}
                        >
                            나가기
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}