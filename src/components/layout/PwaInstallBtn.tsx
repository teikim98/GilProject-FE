'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePWAStore } from '@/store/usePwaStore'; // 경로는 실제 구조에 맞게 수정해주세요

const PWAInstallButton = () => {
    const { deferredPrompt, isInstallable, resetPrompt } = usePWAStore();

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                resetPrompt();
            }
        } catch (error) {
            console.error('PWA 설치 중 오류 발생:', error);
        }
    };

    if (!isInstallable) return null;

    return (
        <Button
            onClick={handleInstallClick}
            className="shadow-lg mb-4"
            size="lg"
        >
            <Download className="mr-2 h-5 w-5" />
            앱 설치하기
        </Button>
    );
};

export default PWAInstallButton;