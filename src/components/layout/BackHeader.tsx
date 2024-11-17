import React from 'react'
import BackButton from './BackIcon'

interface BackHeaderProps {
    content: string
}

export default function BackHeader({ content }: BackHeaderProps) {

    return (
        <div className={`relative flex items-center justify-between mb-4 `}>
            <BackButton />
            <h2 className='absolute left-1/2 transform -translate-x-1/2 top-1/2 translate-y-[-50%] text-lg font-semibold'>
                {content}
            </h2>
            <div className="w-10"></div>
        </div>
    )
}
