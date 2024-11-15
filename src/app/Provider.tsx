'use client';

import { useEffect } from 'react';
import { useDarkMode } from '@/store/useDarkMode';

export default function Provider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen h-screen animate-fade-in bg-gradient-to-b from-purple-400 to-purple-500 flex justify-center">
            {children}
        </div>
    );
}