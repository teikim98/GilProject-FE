'use client'

import { useEffect } from 'react';
import useWakeLock from '@/hooks/useWakeLock';

interface WakeLockProviderProps {
    children: React.ReactNode;
}

const WakeLockProvider = ({ children }: WakeLockProviderProps) => {
    const { enable, disable, error } = useWakeLock();

    useEffect(() => {
        enable();
        return () => disable();
    }, []);

    if (error) {
        console.warn('Wake Lock 에러:', error);
    }

    return <>{children}</>;
};

export default WakeLockProvider;
