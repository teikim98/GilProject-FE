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
        <div className='fixed z-50 max-w-screen-md bottom-0 left-0 right-0 border-t border-purple-100 dark:border-purple-700 bg-purple-50/80 dark:bg-purple-900/80 backdrop-blur-md mx-auto' >
            <div className="flex justify-between items-center h-16 max-w-md mx-auto">
                <Button
                    variant={pathname === '/main' ? 'secondary' : 'ghost'}
                    className={`flex-1 flex flex-col items-center gap-1 h-full rounded-none
                ${pathname === '/main'
                            ? 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-50'
                            : 'hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-200'
                        } transition-colors`}
                    onClick={() => router.push('/main')}
                >
                    <Home className="h-5 w-5" />
                    <span className="text-xs">홈</span>
                </Button>

                <Button
                    variant={pathname === '/navigation' ? 'default' : 'ghost'}
                    className={`flex-1 flex flex-col items-center gap-1 h-full rounded-none
                ${pathname === '/navigation'
                            ? 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-50'
                            : 'hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-200'
                        } transition-colors`}
                    onClick={() => router.push('/record')}
                >
                    <Navigation className="h-5 w-5" />
                    <span className="text-xs">경로</span>
                </Button>

                <Button
                    variant={pathname === '/mypage' ? 'default' : 'ghost'}
                    className={`flex-1 flex flex-col items-center gap-1 h-full rounded-none
                ${pathname === '/main/mypage'
                            ? 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-50'
                            : 'hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-200'
                        } transition-colors`}
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