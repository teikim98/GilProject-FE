'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstallable(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        try {
            // 설치 프롬프트 표시
            await deferredPrompt.prompt();

            // 사용자의 응답을 기다림
            const { outcome } = await deferredPrompt.userChoice;

            // 프롬프트 사용 후 초기화
            setDeferredPrompt(null);

            if (outcome === 'accepted') {
                setIsInstallable(false);
            }
        } catch (error) {
            console.error('PWA 설치 중 오류 발생:', error);
        }
    };

    if (!isInstallable) return null;

    return (
        <Button
            onClick={handleInstallClick}
            className=" shadow-lg"
            size="lg"
        >
            <Download className="mr-2 h-5 w-5" />
            앱 설치하기
        </Button>
    );
};

export default PWAInstallButton;