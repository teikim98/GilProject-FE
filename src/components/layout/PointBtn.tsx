import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

interface PointProps {
    link: string
    content: string
    onClick?: () => void  // onClick 핸들러 추가
    className?: string
}

export default function PointBtn({ link, content, onClick }: PointProps) {
    // onClick이 있으면 Button만 반환
    if (onClick) {
        return (
            <Button 
                className="w-18 h-5 flex justify-between items-center"
                onClick={onClick}
            >
                <span className="text-sm">{content}</span>
            </Button>
        );
    }

    // 기존 동작 유지
    return (
        <Link href={`/main/mypage/${link}`}>
            <Button className="w-25 h-10 flex justify-between items-center">
                <span className="text-lg">{content}</span>
                <ArrowRight className="h-3 w-3" />
            </Button>
        </Link>
    )
}