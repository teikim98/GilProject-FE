'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NavigationAlert } from './NavigationAlert';
import { useRecordStore } from '@/store/useRecordStore';
import { NavigationState } from '@/types/types';

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    navigationState?: NavigationState;
    onStateReset?: () => void;  // 추가: 커스텀 상태 리셋 함수
}

const getAlertConfig = (state: NavigationState) => {
    switch (state) {
        case 'isRecording':
            return {
                title: "녹화를 중단하시겠습니까?",
                description: "현재 경로 녹화가 진행 중입니다. 페이지를 벗어나면 녹화 중인 데이터가 모두 사라집니다.",
                resetAction: () => {
                    useRecordStore.getState().stopRecording()
                    useRecordStore.getState().resetRecord()
                }
            };
        case 'isEditing':
            return {
                title: "편집을 중단하시겠습니까?",
                description: "변경사항이 저장되지 않았습니다. 페이지를 벗어나면 수정사항이 모두 사라집니다.",
                resetAction: () => {/* 편집 상태 리셋 로직 */ },
            };
        case 'isWriting':
            return {
                title: "글 작성을 중단하시겠습니까?",
                description: "작성 중인 내용이 저장되지 않았습니다. 페이지를 벗어나면 작성한 내용이 모두 사라집니다.",
                resetAction: () => {/* 글쓰기 상태 리셋 로직 */ },
            };
        case 'isSaving':
            return {
                title: "저장을 중단하시겠습니까?",
                description: "현재 작업 중인 내용이 있습니다. 페이지를 벗어나면 작업 내용이 모두 사라집니다.",
                resetAction: () => {/* 저장 상태 리셋 로직 */ },
            };
        default:
            return null;
    }
};

const BackButton = ({
    className,
    navigationState = 'none',
    onStateReset,
    ...props
}: BackButtonProps) => {
    const router = useRouter();
    const [showAlert, setShowAlert] = useState(false);
    const alertConfig = getAlertConfig(navigationState);

    const handleBack = () => {
        if (navigationState !== 'none' && alertConfig) {
            setShowAlert(true);
        } else {
            router.back();
        }
    };

    const handleConfirm = () => {
        if (alertConfig) {
            alertConfig.resetAction();
        }
        if (onStateReset) {
            onStateReset();
        }
        setShowAlert(false);
        router.back();
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className={`w-fit p-2 group flex items-center gap-1 hover:gap-2 transition-all hover:bg-purple-100 dark:hover:bg-purple-900/40 ${className}`}
                {...props}
            >
                <ArrowLeft
                    size={32}
                    className="text-purple-900 dark:text-purple-100 transition-colors"
                />
                <span className="text-purple-900 dark:text-purple-100 transition-colors">
                    뒤로
                </span>
            </Button>

            {alertConfig && (
                <NavigationAlert
                    isOpen={showAlert}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowAlert(false)}
                    title={alertConfig.title}
                    description={alertConfig.description}
                />
            )}
        </>
    );
};

export default BackButton;