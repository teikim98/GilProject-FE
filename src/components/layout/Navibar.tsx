'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Navigation, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
    isVisible?: boolean;
}

const BottomNav = ({ isVisible = true }: BottomNavProps) => {
    const router = useRouter();
    const pathname = usePathname();

    if (!isVisible) return null;

    return (
        <div className={`fixed max-w-screen-md bottom-0 left-0 right-0 border-t bg-background mx-auto ${!isVisible ? 'hidden' : ''}`}>
            <div className="flex justify-between items-center h-16 max-w-md mx-auto">
                <Button
                    variant={pathname === '/' ? 'default' : 'ghost'}
                    className="flex-1 flex flex-col items-center gap-1 h-full rounded-none"
                    onClick={() => router.push('/main')}
                >
                    <Home className="h-5 w-5" />
                    <span className="text-xs">홈🏠</span>
                </Button>

                <Button
                    variant={pathname === '/navigation' ? 'default' : 'ghost'}
                    className="flex-1 flex flex-col items-center gap-1 h-full rounded-none"
                    onClick={() => router.push('/main/record')}
                >
                    <Navigation className="h-5 w-5" />
                    <span className="text-xs">경로</span>
                </Button>

                <Button
                    variant={pathname === '/mypage' ? 'default' : 'ghost'}
                    className="flex-1 flex flex-col items-center gap-1 h-full rounded-none"
                    onClick={() => router.push('/main/mypage')}
                >
                    <User className="h-5 w-5" />
                    <span className="text-xs">마이페이지</span>
                </Button>
            </div>
        </div>
    );
};

export default BottomNav;