import BottomNav from '@/components/layout/Navibar';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    hideBottomNav?: boolean;
}

export default function Layout({ children, hideBottomNav = false }: LayoutProps) {
    return (
        <div className='w-full h-screen max-w-screen-md p-5 space-y-4 bg-white overflow-auto no-scrollbar'>
            <div>
                {children}
            </div>
            <Toaster />
            <BottomNav isVisible={!hideBottomNav} />
        </div>
    );
}
