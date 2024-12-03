import { NavigationState } from '@/types/types';
import React from 'react';
import BackButton from './BackIcon';
import Sidemenu from './Sidemenu';

interface BackHeaderProps {
    content: string;
    navigationState?: NavigationState;
    onStateReset?: () => void;
    className?: string;
}

export default function BackHeader({
    content,
    navigationState = 'none',
    onStateReset,
    className = ''
}: BackHeaderProps) {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50">
                <div className="absolute inset-0 bg-purple-50/80 dark:bg-purple-900/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-700" />

                <div className={`relative flex items-center justify-between px-4 h-16 ${className}`}>
                    <BackButton
                        navigationState={navigationState}
                        onStateReset={onStateReset}
                    />
                    <h2 className='absolute left-1/2 transform -translate-x-1/2 top-1/2 translate-y-[-50%] text-lg font-semibold text-purple-900 dark:text-purple-50'>
                        {content}
                    </h2>
                    <Sidemenu />
                </div>
            </div>
            <div className="h-16" />
        </>
    );
}