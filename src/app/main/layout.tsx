import BottomNav from '@/components/layout/Navibar';
import { NotificationInitializer } from '@/components/notification/NotificationInitializer';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className='w-full max-w-screen-md p-5 bg-white overflow-auto no-scrollbar dark:bg-gray-900'>
            <div className='w-full h-full'>
                <NotificationInitializer />
                {children}
            </div>
            <BottomNav />
        </div>
    );
}
