import { NavigationState } from '@/types/types';
import React from 'react'
import BackButton from './BackIcon'
import Sidemenu from './Sidemenu';

interface BackHeaderProps {
    content: string;
    navigationState?: NavigationState;  // 'isRecording' | 'isEditing' | 'isWriting' | 'isSaving' | 'none'
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
        <div className={`relative flex items-center justify-between mb-4 ${className}`}>
            <BackButton
                navigationState={navigationState}
                onStateReset={onStateReset}
            />
            <h2 className='absolute left-1/2 transform -translate-x-1/2 top-1/2 translate-y-[-50%] text-lg font-semibold dark:text-white'>
                {content}
            </h2>
            <Sidemenu />
        </div>
    )
}

